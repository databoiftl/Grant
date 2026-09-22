#!/usr/bin/env python3
"""
Fort Lauderdale Water Quality Monitor — satellite processing pipeline.

Pulls Sentinel-2 Level-2A surface reflectance scenes (MGRS tile 17RNJ) straight
from the public AWS Open Data bucket (s3://sentinel-cogs, no account needed),
clips them to the City of Fort Lauderdale waterways, builds false-color
composites and water-quality index maps, and writes per-zone statistics for
the static site in ../water-quality.html.

Outputs (relative to the repo root):
  wq/img/<date>_<layer>.webp   rendered layers for featured scenes
  wq-data.js                   WQ_DATA = {...} consumed by wq.js

Usage:
  pip install rasterio numpy pillow pyproj
  python scripts/wq_pipeline.py              # last 365 days
  python scripts/wq_pipeline.py --days 120

Indices (Sentinel-2 band numbers):
  NDWI  (B03-B08)/(B03+B08)          McFeeters 1996 — open-water detection
  MNDWI (B03-B11)/(B03+B11)          Xu 2006 — water in built-up areas
  NDCI  (B05-B04)/(B05+B04)          Mishra & Mishra 2012 — chlorophyll-a proxy
  Turbidity (FNU) = A*r/(1-r/C) on B04, A=228.1, C=0.1641
                                     Dogliotti et al. 2015 — single red band
  FAI   B08 - [B04 + (B11-B04)*(833-665)/(1610-665)]
                                     Hu 2009 — floating algae / sargassum / scum
"""
import argparse
import datetime as dt
import json
import os
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

import numpy as np
import rasterio
from PIL import Image
from pyproj import Transformer
from rasterio.enums import Resampling
from rasterio.windows import from_bounds

os.environ.setdefault("GDAL_DISABLE_READDIR_ON_OPEN", "EMPTY_DIR")
os.environ.setdefault("CPL_VSIL_CURL_ALLOWED_EXTENSIONS", ".tif")
os.environ.setdefault("GDAL_HTTP_MULTIRANGE", "YES")
os.environ.setdefault("GDAL_HTTP_MERGE_CONSECUTIVE_RANGES", "YES")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUCKET = "https://sentinel-cogs.s3.us-west-2.amazonaws.com"
TILE = ("17", "R", "NJ")
BBOX = (-80.215, 26.060, -80.075, 26.210)  # lon/lat, Fort Lauderdale waterways
EPSG = 32617

# Waterway zones. Polygons only need to separate water bodies from one another —
# land inside them is removed by the per-scene water mask.
ZONES = [
    {
        "id": "atlantic",
        "name": "Atlantic Nearshore",
        "desc": "Open-ocean strip off Fort Lauderdale Beach, from Galt Ocean Mile south past Port Everglades Inlet — reef tract and bathing-beach waters.",
        "poly": [(-80.091, 26.205), (-80.079, 26.205), (-80.079, 26.062), (-80.100, 26.062),
                 (-80.100, 26.098), (-80.097, 26.130), (-80.094, 26.170)],
    },
    {
        "id": "icw-north",
        "name": "Intracoastal Waterway — North",
        "desc": "ICW main channel from the city's north limit south to Sunrise Blvd, plus the barrier-island finger canals that drain to it.",
        "poly": [(-80.114, 26.207), (-80.100, 26.207), (-80.100, 26.140), (-80.114, 26.140)],
    },
    {
        "id": "icw-south",
        "name": "Intracoastal Waterway — South",
        "desc": "ICW from Sunrise Blvd past Las Olas and Harbor Beach to the Port Everglades approach.",
        "poly": [(-80.112, 26.140), (-80.100, 26.140), (-80.100, 26.100), (-80.112, 26.100)],
    },
    {
        "id": "middle-river",
        "name": "Middle River",
        "desc": "Middle River and its North/South Forks through Wilton Manors, Coral Ridge and Lake Ridge — long residence times, stormwater-fed.",
        "poly": [(-80.162, 26.172), (-80.114, 26.172), (-80.114, 26.136), (-80.162, 26.136)],
    },
    {
        "id": "new-river",
        "name": "New River",
        "desc": "The New River through downtown and Riverwalk, from the forks east to the Stranahan House bend.",
        "poly": [(-80.172, 26.128), (-80.128, 26.128), (-80.128, 26.107), (-80.172, 26.107)],
    },
    {
        "id": "las-olas-isles",
        "name": "Las Olas Isles & Rio Vista Canals",
        "desc": "Dead-end residential finger canals between the lower New River and the ICW — the city's classic poor-flushing zone.",
        "poly": [(-80.128, 26.136), (-80.112, 26.136), (-80.112, 26.100), (-80.128, 26.100)],
    },
    {
        "id": "port",
        "name": "Port Everglades & Lake Mabel",
        "desc": "Port Everglades turning basins, Lake Mabel and the Stranahan River mouth — dredged, deep, heavy vessel traffic.",
        "poly": [(-80.126, 26.100), (-80.100, 26.100), (-80.100, 26.062), (-80.126, 26.062)],
    },
]

SCL_BAD = {0, 1, 3, 8, 9, 10}  # nodata, saturated, cloud shadow, cloud med/high, cirrus


def log(*a):
    print(*a, file=sys.stderr, flush=True)


def list_scenes(start, end):
    """Enumerate L2A scene prefixes for the tile by listing the public bucket."""
    out = []
    y, m = start.year, start.month
    while (y, m) <= (end.year, end.month):
        prefix = f"sentinel-s2-l2a-cogs/{'/'.join(TILE)}/{y}/{m}/"
        url = f"{BUCKET}/?list-type=2&delimiter=/&prefix={prefix}"
        body = urllib.request.urlopen(url, timeout=60).read().decode()
        for p in re.findall(r"<Prefix>([^<]+_L2A/)</Prefix>", body):
            name = p.rstrip("/").split("/")[-1]
            d = dt.datetime.strptime(name.split("_")[2], "%Y%m%d").date()
            if start <= d <= end:
                out.append({"prefix": p, "name": name, "date": d.isoformat()})
        m += 1
        if m == 13:
            y, m = y + 1, 1
    return sorted(out, key=lambda s: s["name"])


def utm_bounds():
    t = Transformer.from_crs(4326, EPSG, always_xy=True)
    xs, ys = zip(*[t.transform(x, y) for x in BBOX[::2] for y in BBOX[1::2]])
    # snap to the 20 m grid so 10 m and 20 m windows line up exactly
    return (np.floor(min(xs) / 20) * 20, np.floor(min(ys) / 20) * 20,
            np.ceil(max(xs) / 20) * 20, np.ceil(max(ys) / 20) * 20)


BOUNDS = utm_bounds()
W10 = int((BOUNDS[2] - BOUNDS[0]) / 10)
H10 = int((BOUNDS[3] - BOUNDS[1]) / 10)


def read_band(prefix, band, resampling=Resampling.bilinear):
    url = f"{BUCKET}/{prefix}{band}.tif"
    with rasterio.open(url) as src:
        win = from_bounds(*BOUNDS, src.transform)
        return src.read(1, window=win, out_shape=(H10, W10), resampling=resampling,
                        boundless=True, fill_value=0)


def to_reflectance(dn, valid):
    r = dn.astype(np.float32) * 1e-4
    # Processing baseline 04.00+ adds a +1000 DN offset, but the harmonised COGs in
    # this bucket have it removed for most (not all) scenes, whatever the STAC
    # metadata says — so detect it from the data: a valid scene with the offset
    # never has DNs much below 1000.
    if np.percentile(dn[valid], 0.5) >= 1000:
        r -= 0.1
    return r


def dilate(mask, radius):
    """Binary dilation by a (2r+1) square, numpy only."""
    out = mask.copy()
    for _ in range(radius):
        m = out.copy()
        m[1:, :] |= out[:-1, :]
        m[:-1, :] |= out[1:, :]
        m[:, 1:] |= out[:, :-1]
        m[:, :-1] |= out[:, 1:]
        out = m
    return out


def erode(mask, radius):
    return ~dilate(~mask, radius)


def scene_baseline(scene):
    url = f"{BUCKET}/{scene['prefix']}{scene['name']}.json"
    try:
        item = json.load(urllib.request.urlopen(url, timeout=60))
        pb = float(item["properties"].get("s2:processing_baseline", "0") or 0)
        return pb, item["properties"].get("eo:cloud_cover")
    except Exception:
        return 0.0, None


def zone_masks():
    """Rasterise zone polygons onto the 10 m grid (simple even-odd test)."""
    t = Transformer.from_crs(4326, EPSG, always_xy=True)
    cols = BOUNDS[0] + (np.arange(W10) + 0.5) * 10
    rows = BOUNDS[3] - (np.arange(H10) + 0.5) * 10
    X, Y = np.meshgrid(cols, rows)
    masks = {}
    for z in ZONES:
        pts = [t.transform(lon, lat) for lon, lat in z["poly"]]
        inside = np.zeros(X.shape, bool)
        j = len(pts) - 1
        for i in range(len(pts)):
            xi, yi = pts[i]
            xj, yj = pts[j]
            cond = ((yi > Y) != (yj > Y)) & (X < (xj - xi) * (Y - yi) / (yj - yi + 1e-12) + xi)
            inside ^= cond
            j = i
        masks[z["id"]] = inside
    return masks


WORLDCOVER = ("https://esa-worldcover.s3.eu-central-1.amazonaws.com/v200/2021/map/"
              "ESA_WorldCover_10m_2021_v200_N24W081_Map.tif")


def worldcover_water():
    """ESA WorldCover 2021 'permanent water bodies' (class 80), warped to our grid.
    Spectral indices alone lose Fort Lauderdale's narrow, dark, tannic canals to
    bank/dock/tree adjacency, so this static map defines *where* water is and each
    scene only has to confirm the pixel is clear and still reads as water."""
    from rasterio.vrt import WarpedVRT
    from rasterio.transform import from_origin
    with rasterio.open(WORLDCOVER) as src:
        with WarpedVRT(src, crs=f"EPSG:{EPSG}", resampling=Resampling.nearest,
                       transform=from_origin(BOUNDS[0], BOUNDS[3], 10, 10),
                       width=W10, height=H10) as vrt:
            return vrt.read(1) == 80


def pixel_to_lonlat():
    inv = Transformer.from_crs(EPSG, 4326, always_xy=True)
    corners = {
        "nw": inv.transform(BOUNDS[0], BOUNDS[3]),
        "se": inv.transform(BOUNDS[2], BOUNDS[1]),
    }
    return corners


def process_scene(scene):
    prefix = scene["prefix"]
    scl = read_band(prefix, "SCL", Resampling.nearest)
    valid = scl > 0
    coverage = float(valid.mean())
    if coverage < 0.97:
        return None
    # Buffer clouds/shadows by ~100 m: haze at cloud edges reads as turbid water.
    clear = valid & ~dilate(np.isin(scl, list(SCL_BAD)), 10)
    clear_frac = float(clear.mean())
    if clear_frac < 0.5:
        return {"scene": scene, "skip": f"clear {clear_frac:.0%}"}
    _, cc = scene_baseline(scene)
    bands = {}
    for b in ["B02", "B03", "B04", "B05", "B08", "B11", "B12", "B8A"]:
        bands[b] = to_reflectance(read_band(prefix, b), valid)
    return {"scene": scene, "scl": scl, "clear": clear, "bands": bands,
            "clear_frac": clear_frac, "tile_cloud": cc}


def dark_object_correct(bands, clear):
    """Sen2Cor is tuned for land and leaves a roughly additive aerosol/glint residual
    over open water (clear-ocean SWIR should be ~0 but reads ~0.02-0.03). Estimate
    it per band as the 1st percentile over deep offshore water (east of -80.086),
    where red/red-edge/NIR/SWIR water-leaving reflectance is effectively zero, and
    subtract it (dark-object subtraction). Blue/green are left alone: clear ocean
    is not dark there."""
    ref = clear & BASE_WATER & OFFSHORE
    offsets = {}
    if ref.sum() < 2000:  # offshore clouded out: leave uncorrected, flag it
        return bands, None
    out = dict(bands)
    for k in ["B04", "B05", "B08", "B8A", "B11", "B12"]:
        off = float(np.percentile(bands[k][ref], 1))
        out[k] = np.maximum(bands[k] - off, 0)
        offsets[k] = round(off, 4)
    return out, offsets


def offshore_mask():
    t = Transformer.from_crs(4326, EPSG, always_xy=True)
    x_ref, _ = t.transform(-80.086, 26.13)
    cols = BOUNDS[0] + (np.arange(W10) + 0.5) * 10
    return np.broadcast_to(cols > x_ref, (H10, W10))


def compute_indices(b):
    eps = 1e-6
    g, r, re5, nir, sw1 = b["B03"], b["B04"], b["B05"], b["B08"], b["B11"]
    ndwi = (g - nir) / (g + nir + eps)
    mndwi = (g - sw1) / (g + sw1 + eps)
    # NDCI is unstable when both bands are near zero (clear water): floor the
    # denominator so noise can't swing it to +/-1.
    ndci = (re5 - r) / np.maximum(re5 + r, 0.02)
    rc = np.clip(r, 0, 0.16)
    turb = 228.1 * rc / (1 - rc / 0.1641)
    fai = nir - (r + (sw1 - r) * (833 - 665) / (1610 - 665))
    return {"ndwi": ndwi, "mndwi": mndwi, "ndci": ndci, "turb": turb, "fai": fai}


def water_mask(res, idx):
    b = res["bands"]
    # Reject boats, bridges, construction barges, sun glint and other bright
    # surfaces. No NDWI test here on purpose: in canals narrower than ~40 m, bank
    # vegetation bleeds into NIR and would fail every pixel; floating algae also
    # raises NIR, which is exactly what FAI is meant to catch.
    clean = (b["B11"] < 0.06) & (b["B03"] < 0.15)
    # Sen2Cor over-corrects very dark (tannic, shaded) canal water and clips red /
    # red-edge to zero; those pixels carry no chlorophyll or turbidity signal.
    signal = (res["raw_r"] > 0.002) & (res["raw_re"] > 0.002)
    return BASE_WATER & clean & signal & res["clear"]


# ---------- rendering ----------

def stretch(a, lo, hi):
    return np.clip((a - lo) / (hi - lo), 0, 1)


def gamma_rgb(r, g, bl, lo=0.0, hi=0.3, gamma=1 / 1.6):
    rgb = np.dstack([stretch(r, lo, hi), stretch(g, lo, hi), stretch(bl, lo, hi)])
    return (rgb ** gamma * 255).astype(np.uint8)


def ramp(values, stops):
    """Piecewise-linear colour ramp: stops = [(v, (r,g,b)), ...]."""
    vs = np.array([s[0] for s in stops], np.float32)
    out = np.zeros(values.shape + (3,), np.float32)
    for c in range(3):
        out[..., c] = np.interp(values, vs, [s[1][c] for s in stops])
    return out.astype(np.uint8)


RAMPS = {
    "ndci": [(-0.25, (8, 48, 107)), (-0.1, (33, 113, 181)), (0.0, (65, 182, 196)),
             (0.1, (161, 217, 155)), (0.2, (254, 224, 139)), (0.3, (244, 109, 67)),
             (0.45, (165, 0, 38))],
    "turb": [(0, (8, 48, 107)), (3, (33, 113, 181)), (6, (65, 182, 196)),
             (10, (199, 233, 180)), (15, (254, 224, 139)), (25, (216, 140, 60)),
             (40, (140, 70, 20))],
    "fai": [(-0.02, (8, 48, 107)), (0.0, (65, 182, 196)), (0.01, (254, 224, 139)),
            (0.03, (120, 180, 40)), (0.06, (0, 100, 0))],
}


def dim_land(base_rgb):
    gray = base_rgb.mean(axis=2, keepdims=True)
    return (gray * 0.45 + 12).astype(np.uint8).repeat(3, axis=2)


def index_image(base_rgb, values, water, key):
    col = ramp(values, RAMPS[key])
    return np.where(water[..., None], col, dim_land(base_rgb))


def save_webp(arr, path):
    Image.fromarray(arr).save(path, "WEBP", quality=78, method=6)


def render_layers(res, idx, water, date):
    b = res["bands"]
    outdir = os.path.join(ROOT, "wq", "img")
    os.makedirs(outdir, exist_ok=True)
    true = gamma_rgb(b["B04"], b["B03"], b["B02"], hi=0.25)
    layers = {
        "true": true,
        "cir": gamma_rgb(b["B08"], b["B04"], b["B03"], hi=0.4),
        "swir": gamma_rgb(b["B12"], b["B8A"], b["B04"], hi=0.4),
        # water-enhanced false colour: red-edge / red / blue with a tight stretch
        # for dark water; land is dimmed so it doesn't blow out
        "wqfc": np.where(BASE_WATER[..., None] & res["clear"][..., None],
                         gamma_rgb(b["B05"], b["B04"], b["B02"], lo=0.0, hi=0.06, gamma=1 / 1.3),
                         dim_land(true)),
        "ndci": index_image(true, idx["ndci"], water, "ndci"),
        "turb": index_image(true, idx["turb"], water, "turb"),
        "fai": index_image(true, idx["fai"], water, "fai"),
    }
    for k, arr in layers.items():
        save_webp(arr, os.path.join(outdir, f"{date}_{k}.webp"))
    return list(layers)


# ---------- scoring ----------

def classify(ndci_med, turb_med, fai_pct):
    """Return (score 0-100, label). Thresholds documented on the Methodology tab."""
    def band_score(v, good, poor):
        return float(np.clip(100 * (poor - v) / (poor - good), 0, 100))
    # NDCI -0.1 / +0.1 ~ 7 / 25 ug/L chl-a on Mishra & Mishra's (2012) curve,
    # bracketing NOAA's estuarine eutrophication low (<=5) / high (>20) classes.
    s_chl = band_score(ndci_med, -0.1, 0.1)
    s_turb = band_score(turb_med, 3.0, 20.0)
    s_fai = band_score(fai_pct, 1.0, 15.0)
    score = round(0.45 * s_chl + 0.40 * s_turb + 0.15 * s_fai)
    label = "good" if score >= 70 else "fair" if score >= 45 else "poor"
    return score, label


def zone_stats(idx, water, clear, masks, persist):
    out = {}
    for zid, zmask in masks.items():
        m = water & zmask
        n = int(m.sum())
        zone_water = persist & zmask
        coverage = float((zone_water & clear).sum() / max(zone_water.sum(), 1))
        signal = n / max(int((zone_water & clear).sum()), 1)
        if n < 100 or coverage < 0.5:  # clouded over or no usable signal — don't report
            out[zid] = None
            continue
        nd, tb, fa = idx["ndci"][m], idx["turb"][m], idx["fai"][m]
        ndci_med = float(np.median(nd))
        turb_med = float(np.median(tb))
        fai_pct = float((fa > 0.01).mean() * 100)
        score, label = classify(ndci_med, turb_med, fai_pct)
        conf = ("high" if n >= 2000 and signal >= 0.75 and coverage >= 0.75
                else "medium" if n >= 400 and signal >= 0.5 else "low")
        out[zid] = {
            "n": n,
            "coverage": round(coverage * 100, 1),
            "signal": round(signal * 100, 1),
            "ndci": round(ndci_med, 4),
            "ndci_p90": round(float(np.percentile(nd, 90)), 4),
            "turb": round(turb_med, 2),
            "turb_p90": round(float(np.percentile(tb, 90)), 2),
            "bloom_pct": round(float((nd > 0.2).mean() * 100), 2),
            "fai_pct": round(fai_pct, 2),
            "score": score,
            "label": label,
            "conf": conf,
        }
    return out


def pick_featured(clear_by_date, n=8, min_gap=21):
    """Walk back from the most recent pass keeping ~3+ weeks between picks,
    preferring mostly cloud-free passes (>=80%) and topping up with the rest."""
    picks = []
    good = [d for d, c in clear_by_date.items() if c >= 0.8]
    rest = [d for d in clear_by_date if d not in good]
    for d in sorted(good, reverse=True) + sorted(rest, reverse=True):
        dd = dt.date.fromisoformat(d)
        if all(abs((dd - dt.date.fromisoformat(p)).days) >= min_gap for p in picks):
            picks.append(d)
        if len(picks) >= n:
            break
    return sorted(picks)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=365)
    ap.add_argument("--featured", type=int, default=8)
    args = ap.parse_args()

    end = dt.date.today()
    start = end - dt.timedelta(days=args.days)
    scenes = list_scenes(start, end)
    log(f"{len(scenes)} scenes listed {start}..{end}")

    masks = zone_masks()
    global BASE_WATER, OFFSHORE
    OFFSHORE = offshore_mask()
    # drop the 10 m fringe along banks/docks: mixed land-water pixels
    BASE_WATER = erode(worldcover_water(), 1)
    log(f"base water pixels {int(BASE_WATER.sum())}")
    results = {}

    def work(s):
        try:
            return process_scene(s)
        except Exception as e:  # network hiccup or corrupt COG — skip the scene
            log("error", s["name"], e)
            return None

    # Keep one granule per date (re-processed duplicates share a date).
    with ThreadPoolExecutor(max_workers=4) as ex:
        for res in ex.map(work, scenes):
            if not res:
                continue
            if "skip" in res:
                log("skip", res["scene"]["name"], res["skip"])
                continue
            d = res["scene"]["date"]
            if d in results and results[d]["clear_frac"] >= res["clear_frac"]:
                continue
            res["raw_r"], res["raw_re"] = res["bands"]["B04"], res["bands"]["B05"]
            res["bands"], res["dos"] = dark_object_correct(res["bands"], res["clear"])
            idx = compute_indices(res["bands"])
            water = water_mask(res, idx)
            res["idx"], res["water"] = idx, water
            results[d] = res
            log("ok", res["scene"]["name"], f"clear {res['clear_frac']:.0%}", f"water px {int(water.sum())}")

    if not results:
        log("no usable scenes")
        return 1

    persist = BASE_WATER

    featured = set(pick_featured({d: r["clear_frac"] for d, r in results.items()}, args.featured))
    scenes_out = []
    for d in sorted(results):
        r = results[d]
        water = r["water"] & persist
        entry = {
            "date": d,
            "scene": r["scene"]["name"],
            "clear_pct": round(r["clear_frac"] * 100, 1),
            "tile_cloud_pct": r["tile_cloud"],
            "dos": r["dos"],
            "zones": zone_stats(r["idx"], water, r["clear"], masks, persist),
        }
        if d in featured:
            entry["layers"] = render_layers(r, r["idx"], water, d)
            log("rendered", d)
        scenes_out.append(entry)

    # Drop images for dates no longer featured.
    imgdir = os.path.join(ROOT, "wq", "img")
    for f in os.listdir(imgdir):
        if f.split("_")[0] not in featured:
            os.remove(os.path.join(imgdir, f))

    corners = pixel_to_lonlat()
    to_utm = Transformer.from_crs(4326, EPSG, always_xy=True)

    def lonlat_to_px(lon, lat):
        x, y = to_utm.transform(lon, lat)
        return [round((x - BOUNDS[0]) / 10, 1), round((BOUNDS[3] - y) / 10, 1)]

    zone_px, purity, water_px = {}, {}, {}
    core = erode(persist, 1)
    for z in ZONES:
        m = masks[z["id"]]
        pw = persist & m
        water_px[z["id"]] = int(pw.sum())
        # share of the zone's water that is >=20 m from any bank: low = narrow canals,
        # more mixed pixels, lower confidence
        purity[z["id"]] = round(float((core & m).sum() / max(pw.sum(), 1)) * 100, 1)
        ys, xs = np.nonzero(m)
        zone_px[z["id"]] = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]

    data = {
        "generated": dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
        "tile": "".join(TILE),
        "bbox": BBOX,
        "image": {"width": W10, "height": H10, "nw": corners["nw"], "se": corners["se"], "res_m": 10},
        "zones": [{"id": z["id"], "name": z["name"], "desc": z["desc"], "poly": z["poly"],
                   "poly_px": [lonlat_to_px(*pt) for pt in z["poly"]],
                   "px_box": zone_px[z["id"]], "water_px": water_px[z["id"]],
                   "open_water_pct": purity[z["id"]]} for z in ZONES],
        "scenes": scenes_out,
    }
    with open(os.path.join(ROOT, "wq-data.js"), "w") as f:
        f.write("/* Generated by scripts/wq_pipeline.py — do not edit by hand. */\n")
        f.write("const WQ_DATA = ")
        json.dump(data, f, separators=(",", ":"))
        f.write(";\n")
    log(f"wrote {len(scenes_out)} scenes, featured {sorted(featured)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
