/* Fort Lauderdale Water Quality Monitor — front end. Data: WQ_DATA from wq-data.js */

const LABELS = { good: "Good", fair: "Fair", poor: "Poor", none: "No reading" };
const ICONS = { good: "✓", fair: "!", poor: "✕", none: "–" };

const LAYERS = [
  {
    key: "true", label: "True color", bands: "B4 · B3 · B2",
    desc: "What your eye would see. Sediment plumes show as tan/milky water; algae as green-brown tints.",
  },
  {
    key: "cir", label: "Color infrared", bands: "B8 · B4 · B3",
    desc: "Classic false color. Healthy vegetation (mangroves, lawns) glows red; water is near-black. Red or pink on the water surface means floating vegetation or algae mats.",
  },
  {
    key: "swir", label: "Shortwave infrared", bands: "B12 · B8A · B4",
    desc: "Water absorbs shortwave infrared almost completely, so every waterbody turns crisp black against land. Best view of the canal network and shoreline edges.",
  },
  {
    key: "wqfc", label: "Water-enhanced false color", bands: "B5 · B4 · B2 (water only)",
    desc: "Red-edge / red / blue with a tight stretch applied to water pixels only. Reddish-magenta water = red-edge excess (chlorophyll); pale or yellowish = suspended sediment; deep blue = clear.",
  },
  {
    key: "ndci", label: "Chlorophyll (NDCI)", bands: "(B5 − B4) / (B5 + B4)",
    desc: "Normalized Difference Chlorophyll Index. Rises as phytoplankton pigments push red-edge reflectance above red. Above ~0.2 suggests bloom conditions.",
    legend: { key: "ndci", min: -0.25, max: 0.45, ticks: [-0.2, 0, 0.2, 0.4], lo: "Low chlorophyll", hi: "Bloom-like" },
  },
  {
    key: "turb", label: "Turbidity (FNU)", bands: "Dogliotti 2015, B4",
    desc: "Suspended sediment and particles, from red reflectance. Watch for plumes after storms, at outfalls, dredge sites and the port.",
    legend: { key: "turb", min: 0, max: 40, ticks: [0, 10, 20, 30, 40], lo: "Clear", hi: "Very turbid" },
  },
  {
    key: "fai", label: "Floating algae (FAI)", bands: "B8 vs B4–B11 baseline",
    desc: "Floating Algae Index. Positive values flag material floating at the surface — sargassum rafts, algae scum, or floating debris.",
    legend: { key: "fai", min: -0.02, max: 0.06, ticks: [-0.02, 0, 0.02, 0.04, 0.06], lo: "None", hi: "Dense mats" },
  },
];

// Keep in sync with RAMPS in scripts/wq_pipeline.py
const RAMPS = {
  ndci: [[-0.25, "#08306b"], [-0.1, "#2171b5"], [0.0, "#41b6c4"], [0.1, "#a1d99b"], [0.2, "#fee08b"], [0.3, "#f46d43"], [0.45, "#a50026"]],
  turb: [[0, "#08306b"], [3, "#2171b5"], [6, "#41b6c4"], [10, "#c7e9b4"], [15, "#fee08b"], [25, "#d88c3c"], [40, "#8c4614"]],
  fai: [[-0.02, "#08306b"], [0.0, "#41b6c4"], [0.01, "#fee08b"], [0.03, "#78b428"], [0.06, "#006400"]],
};

const METRICS = {
  score: { label: "Health score", fmt: (v) => v.toFixed(0), higherIsBetter: true, bands: true },
  ndci: { label: "Chlorophyll index (NDCI)", fmt: (v) => v.toFixed(3), higherIsBetter: false },
  turb: { label: "Turbidity (FNU)", fmt: (v) => v.toFixed(1), higherIsBetter: false },
  fai_pct: { label: "Floating algae (% of water)", fmt: (v) => v.toFixed(1) + "%", higherIsBetter: false },
};

const D = WQ_DATA;
const SCENES = D.scenes.slice().sort((a, b) => a.date.localeCompare(b.date));
const FEATURED = SCENES.filter((s) => s.layers);
const ZONES = D.zones;

// Open the viewer on the most recent mostly-clear pass.
const DEFAULT_SCENE = FEATURED.slice().reverse().find((s) => s.clear_pct >= 85) || FEATURED[FEATURED.length - 1];

const state = {
  date: DEFAULT_SCENE ? DEFAULT_SCENE.date : null,
  layer: "wqfc",
  showZones: true,
  activeZone: null,
  metric: "score",
  focusZone: ZONES[0].id,
  view: { k: 1, x: 0, y: 0 },
};

// ---------- helpers ----------

function fmtDate(iso, opts = { year: "numeric", month: "short", day: "numeric" }) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", opts);
}

function median(arr) {
  if (!arr.length) return null;
  const s = arr.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function zoneSeries(zid) {
  return SCENES.filter((s) => s.zones[zid]).map((s) => ({ date: s.date, ...s.zones[zid] }));
}

function el(tag, attrs = {}, html) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else e.setAttribute(k, v);
  }
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function svgEl(tag, attrs = {}) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

function statusBadge(label) {
  const key = label || "none";
  return `<span class="status-badge ${key}"><span aria-hidden="true">${ICONS[key]}</span>${LABELS[key]}</span>`;
}

function confBadge(conf) {
  if (!conf) return "";
  return `<span class="conf-badge ${conf}">${conf[0].toUpperCase() + conf.slice(1)} confidence</span>`;
}

function deltaHtml(value, base, metricKey) {
  if (value == null || base == null) return "";
  const m = METRICS[metricKey];
  const d = value - base;
  const tiny = metricKey === "ndci" ? 0.01 : metricKey === "score" ? 2 : 0.3;
  if (Math.abs(d) < tiny) return `<span class="delta">≈ typical</span>`;
  const worse = m.higherIsBetter ? d < 0 : d > 0;
  const sign = d > 0 ? "+" : "−";
  const mag = metricKey === "ndci" ? Math.abs(d).toFixed(3) : Math.abs(d).toFixed(1);
  return `<span class="delta ${worse ? "worse" : "better"}">${sign}${mag} vs typical</span>`;
}

function rampCss(key) {
  const stops = RAMPS[key];
  const lo = stops[0][0], hi = stops[stops.length - 1][0];
  return `linear-gradient(to right, ${stops.map(([v, c]) => `${c} ${(((v - lo) / (hi - lo)) * 100).toFixed(1)}%`).join(", ")})`;
}

// ---------- tabs ----------

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
      document.querySelectorAll(".tab-panel").forEach((p) => {
        p.hidden = p.id !== `tab-panel-${btn.dataset.tab}`;
      });
      if (btn.dataset.tab === "trends") renderTrend();
    });
  });
}

function switchTab(name) {
  document.querySelector(`.tab-btn[data-tab="${name}"]`).click();
}

// ---------- overview ----------

function latestFor(zid) {
  const series = zoneSeries(zid);
  return series.length ? series[series.length - 1] : null;
}

function renderStats() {
  const wrap = document.getElementById("stat-row");
  const latest = SCENES[SCENES.length - 1];
  const counts = { good: 0, fair: 0, poor: 0, none: 0 };
  ZONES.forEach((z) => {
    const l = latestFor(z.id);
    counts[l ? l.label : "none"]++;
  });
  const first = SCENES[0];
  const stats = [
    {
      label: "Latest clear pass",
      value: fmtDate(latest.date, { month: "short", day: "numeric" }),
      sub: `${fmtDate(latest.date, { year: "numeric" })} · ${latest.clear_pct.toFixed(0)}% of area cloud-free`,
    },
    {
      label: "Usable passes",
      value: SCENES.length,
      sub: `${fmtDate(first.date, { month: "short", year: "numeric" })} – ${fmtDate(latest.date, { month: "short", year: "numeric" })}`,
    },
    {
      label: "Zones rated good",
      value: `${counts.good} / ${ZONES.length}`,
      sub: `${counts.fair} fair · ${counts.poor} poor${counts.none ? ` · ${counts.none} no reading` : ""}`,
    },
    {
      label: "Pixels analyzed per pass",
      value: `${(ZONES.reduce((a, z) => a + z.water_px, 0) / 1000).toFixed(0)}k`,
      sub: "10 m water pixels across 7 zones",
    },
  ];
  wrap.innerHTML = stats
    .map((s) => `<div class="stat"><span class="meta-label">${s.label}</span><div class="stat-value">${s.value}</div><div class="stat-sub">${s.sub}</div></div>`)
    .join("");
}

function sparkline(series, w = 120, h = 30) {
  if (series.length < 2) return "";
  const t0 = new Date(SCENES[0].date).getTime();
  const t1 = new Date(SCENES[SCENES.length - 1].date).getTime();
  const x = (d) => 2 + ((new Date(d).getTime() - t0) / Math.max(t1 - t0, 1)) * (w - 4);
  const y = (v) => h - 3 - (v / 100) * (h - 6);
  const pts = series.map((p) => `${x(p.date).toFixed(1)},${y(p.score).toFixed(1)}`).join(" ");
  const last = series[series.length - 1];
  return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <line x1="0" x2="${w}" y1="${y(70)}" y2="${y(70)}" stroke="#e1e0d9" stroke-dasharray="2 2"/>
    <polyline points="${pts}" fill="none" stroke="#2a78d6" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="${x(last.date)}" cy="${y(last.score)}" r="3" fill="#2a78d6"/>
  </svg>`;
}

function renderZoneCards() {
  const grid = document.getElementById("zone-grid");
  grid.innerHTML = "";
  for (const z of ZONES) {
    const series = zoneSeries(z.id);
    const l = series.length ? series[series.length - 1] : null;
    const base = {
      score: median(series.map((s) => s.score)),
      ndci: median(series.map((s) => s.ndci)),
      turb: median(series.map((s) => s.turb)),
    };
    const card = el("button", { class: "card zone-card", type: "button" });
    card.innerHTML = `
      <div class="zone-head">
        <div>
          <h3>${z.name}</h3>
          <div class="agency">${l ? "Reading from " + fmtDate(l.date) : "No usable reading in the last 12 months"}</div>
        </div>
        <div class="zone-score">${l ? l.score : "–"}<small>score</small></div>
      </div>
      <div class="pill-row">${statusBadge(l && l.label)}${confBadge(l && l.conf)}</div>
      <p class="summary">${z.desc}</p>
      ${
        l
          ? `<div class="metric-grid">
        <div class="metric"><span class="meta-label">Chlorophyll (NDCI)</span><div class="metric-val">${l.ndci.toFixed(3)}</div>${deltaHtml(l.ndci, base.ndci, "ndci")}</div>
        <div class="metric"><span class="meta-label">Turbidity</span><div class="metric-val">${l.turb.toFixed(1)} FNU</div>${deltaHtml(l.turb, base.turb, "turb")}</div>
        <div class="metric"><span class="meta-label">Floating algae</span><div class="metric-val">${l.fai_pct.toFixed(1)}%</div><span class="delta">of water</span></div>
      </div>`
          : ""
      }
      <div class="zone-foot">
        <span>${series.length} readings · ${z.open_water_pct.toFixed(0)}% open water</span>
        ${sparkline(series)}
      </div>`;
    card.addEventListener("click", () => openZoneModal(z.id));
    grid.appendChild(card);
  }
}

function openZoneModal(zid) {
  const z = ZONES.find((q) => q.id === zid);
  const series = zoneSeries(zid);
  const l = series[series.length - 1];
  const rows = series
    .slice()
    .reverse()
    .map(
      (s) => `<tr><td>${fmtDate(s.date)}</td><td>${s.score}</td><td>${statusBadge(s.label)}</td><td>${s.ndci.toFixed(3)}</td><td>${s.turb.toFixed(1)}</td><td>${s.fai_pct.toFixed(1)}%</td><td>${s.conf}</td></tr>`
    )
    .join("");
  const featuredDates = new Set(FEATURED.map((s) => s.date));
  const viewDate = series.slice().reverse().find((s) => featuredDates.has(s.date));
  document.getElementById("modal-body").innerHTML = `
    <h3>${z.name}</h3>
    <div class="pill-row">${statusBadge(l && l.label)}${confBadge(l && l.conf)}</div>
    <p class="zone-desc">${z.desc}</p>
    <div class="meta-grid">
      <div><span class="meta-label">Water pixels (10 m)</span>${z.water_px.toLocaleString()}</div>
      <div><span class="meta-label">Open water (≥20 m from bank)</span>${z.open_water_pct.toFixed(0)}%</div>
    </div>
    ${viewDate ? `<p><button class="source-link" id="modal-view">View on satellite image (${fmtDate(viewDate.date)})</button></p>` : ""}
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>Date</th><th>Score</th><th>Status</th><th>NDCI</th><th>Turb. FNU</th><th>Float. algae</th><th>Conf.</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="7">No usable readings.</td></tr>`}</tbody>
    </table></div>`;
  const btn = document.getElementById("modal-view");
  if (btn) {
    btn.addEventListener("click", () => {
      closeModal();
      state.date = viewDate.date;
      state.activeZone = zid;
      document.getElementById("date-select").value = state.date;
      switchTab("viewer");
      renderViewer();
      zoomToZone(zid);
    });
  }
  document.getElementById("zone-modal").hidden = false;
}

function closeModal() {
  document.getElementById("zone-modal").hidden = true;
}

// ---------- viewer ----------

function initViewer() {
  const sel = document.getElementById("date-select");
  sel.innerHTML = FEATURED.slice()
    .reverse()
    .map((s) => `<option value="${s.date}">${fmtDate(s.date)} · ${s.clear_pct.toFixed(0)}% clear</option>`)
    .join("");
  sel.value = state.date;
  sel.addEventListener("change", () => {
    state.date = sel.value;
    renderViewer();
  });

  document.getElementById("zones-toggle").addEventListener("change", (e) => {
    state.showZones = e.target.checked;
    renderZonesOverlay();
  });

  const chips = document.getElementById("layer-chips");
  for (const L of LAYERS) {
    const b = el("button", { class: "chip", type: "button", "data-layer": L.key }, L.label);
    b.addEventListener("click", () => {
      state.layer = L.key;
      renderViewer();
    });
    chips.appendChild(b);
  }

  const frame = document.getElementById("map-frame");
  frame.style.aspectRatio = `${D.image.width} / ${D.image.height}`;
  initPanZoom(frame);
}

function renderViewer() {
  const L = LAYERS.find((q) => q.key === state.layer);
  document.querySelectorAll("#layer-chips .chip").forEach((c) => c.classList.toggle("active", c.dataset.layer === state.layer));
  document.getElementById("layer-desc").innerHTML = `<strong>${L.label}</strong> <span class="cite">(${L.bands})</span> — ${L.desc}`;
  document.getElementById("map-img").src = `wq/img/${state.date}_${state.layer}.webp`;
  renderLegend(L);
  renderSceneZones();
  renderZonesOverlay();
}

function renderLegend(L) {
  const wrap = document.getElementById("legend");
  if (!L.legend) {
    wrap.innerHTML = `<h3>${L.label}</h3><p class="legend-note">Band combination ${L.bands}. Switch to an index layer for a quantitative color scale.</p>`;
    return;
  }
  const g = L.legend;
  const pos = (v) => ((v - g.min) / (g.max - g.min)) * 100;
  wrap.innerHTML = `
    <h3>${L.label}</h3>
    <div class="legend-bar" style="background:${rampCss(g.key)}"></div>
    <div class="legend-ticks" style="position:relative;height:1em">
      ${g.ticks.map((t) => `<span style="position:absolute;left:${pos(t)}%;transform:translateX(-50%)">${t}</span>`).join("")}
    </div>
    <div class="legend-ticks"><span>${g.lo}</span><span>${g.hi}</span></div>
    <p class="legend-note">Land is shown in gray. Gray water pixels were cloud-masked, clipped by atmospheric correction, or flagged as boats/glint.</p>`;
}

function renderSceneZones() {
  const scene = SCENES.find((s) => s.date === state.date);
  const wrap = document.getElementById("scene-zones");
  wrap.innerHTML = `<h3>Zones on ${fmtDate(state.date)}</h3>`;
  for (const z of ZONES) {
    const s = scene.zones[z.id];
    const row = el("div", { class: "scene-zone-row" + (state.activeZone === z.id ? " active" : ""), tabindex: "0" });
    row.innerHTML = `<span>${z.name}</span><span>${s ? `<strong>${s.score}</strong> ` : ""}${statusBadge(s && s.label)}</span>`;
    row.addEventListener("click", () => {
      state.activeZone = z.id;
      renderSceneZones();
      renderZonesOverlay();
      zoomToZone(z.id);
    });
    wrap.appendChild(row);
  }
}

function renderZonesOverlay() {
  const svg = document.getElementById("map-zones");
  svg.setAttribute("viewBox", `0 0 ${D.image.width} ${D.image.height}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.innerHTML = "";
  if (!state.showZones) return;
  const scene = SCENES.find((s) => s.date === state.date);
  const tip = document.getElementById("map-tip");
  const k = state.view.k;
  for (const z of ZONES) {
    const poly = svgEl("polygon", {
      points: z.poly_px.map((p) => p.join(",")).join(" "),
      class: state.activeZone === z.id ? "active" : "",
    });
    const s = scene.zones[z.id];
    poly.addEventListener("mousemove", (e) => {
      const r = document.getElementById("map-frame").getBoundingClientRect();
      tip.hidden = false;
      tip.innerHTML = `<strong>${z.name}</strong><br>${
        s
          ? `Score ${s.score} · ${LABELS[s.label]}<br>NDCI ${s.ndci.toFixed(3)} · ${s.turb.toFixed(1)} FNU<br>Floating algae ${s.fai_pct.toFixed(1)}% · ${s.conf} confidence`
          : "No usable reading (cloud or too few clean pixels)"
      }`;
      const x = e.clientX - r.left + 14;
      tip.style.left = Math.min(x, r.width - 250) + "px";
      tip.style.top = e.clientY - r.top + 14 + "px";
    });
    poly.addEventListener("mouseleave", () => (tip.hidden = true));
    poly.addEventListener("click", () => {
      if (dragMoved) return;
      openZoneModal(z.id);
    });
    svg.appendChild(poly);
    const [x0, y0] = z.px_box;
    const label = svgEl("text", { x: x0 + 6 / k, y: y0 + 24 / k });
    label.textContent = z.name.replace("Intracoastal Waterway", "ICW");
    svg.appendChild(label);
  }
}

let dragMoved = false;

function applyView() {
  const v = state.view;
  document.getElementById("map-inner").style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.k})`;
  // keep outline labels a constant on-screen size while zoomed
  const svg = document.getElementById("map-zones");
  svg.style.setProperty("--label-size", `${22 / v.k}px`);
  svg.style.setProperty("--label-stroke", `${4 / v.k}px`);
  svg.style.setProperty("--dash", `${6 / v.k} ${4 / v.k}`);
}

function clampView() {
  const frame = document.getElementById("map-frame");
  const w = frame.clientWidth, h = frame.clientHeight, v = state.view;
  v.k = Math.min(Math.max(v.k, 1), 8);
  v.x = Math.min(0, Math.max(w - w * v.k, v.x));
  v.y = Math.min(0, Math.max(h - h * v.k, v.y));
}

let relabelTimer = null;

function zoomAt(factor, cx, cy) {
  clearTimeout(relabelTimer);
  relabelTimer = setTimeout(renderZonesOverlay, 120);
  const v = state.view;
  const k2 = Math.min(Math.max(v.k * factor, 1), 8);
  v.x = cx - ((cx - v.x) * k2) / v.k;
  v.y = cy - ((cy - v.y) * k2) / v.k;
  v.k = k2;
  clampView();
  applyView();
}

function zoomToZone(zid) {
  const z = ZONES.find((q) => q.id === zid);
  const frame = document.getElementById("map-frame");
  const w = frame.clientWidth, h = frame.clientHeight;
  const sx = w / D.image.width, sy = h / D.image.height;
  const [x0, y0, x1, y1] = z.px_box;
  const k = Math.min(8, 0.9 * Math.min(w / ((x1 - x0) * sx), h / ((y1 - y0) * sy)));
  const cx = ((x0 + x1) / 2) * sx, cy = ((y0 + y1) / 2) * sy;
  state.view = { k, x: w / 2 - cx * k, y: h / 2 - cy * k };
  clampView();
  applyView();
  renderZonesOverlay();
}

function initPanZoom(frame) {
  let start = null;
  frame.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const r = frame.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX - r.left, e.clientY - r.top);
    },
    { passive: false }
  );
  frame.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".zoom-ctl")) return;
    start = { x: e.clientX, y: e.clientY, vx: state.view.x, vy: state.view.y };
    dragMoved = false;
  });
  window.addEventListener("pointermove", (e) => {
    if (!start) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      dragMoved = true;
      frame.classList.add("dragging");
    }
    state.view.x = start.vx + dx;
    state.view.y = start.vy + dy;
    clampView();
    applyView();
  });
  window.addEventListener("pointerup", () => {
    start = null;
    frame.classList.remove("dragging");
    setTimeout(() => (dragMoved = false), 0);
  });
  const center = () => [frame.clientWidth / 2, frame.clientHeight / 2];
  document.getElementById("zoom-in").addEventListener("click", () => zoomAt(1.5, ...center()));
  document.getElementById("zoom-out").addEventListener("click", () => zoomAt(1 / 1.5, ...center()));
  document.getElementById("zoom-reset").addEventListener("click", () => {
    state.view = { k: 1, x: 0, y: 0 };
    applyView();
    renderZonesOverlay();
  });
  window.addEventListener("resize", () => {
    clampView();
    applyView();
  });
}

// ---------- trends ----------

function initTrends() {
  const zs = document.getElementById("zone-select");
  zs.innerHTML = ZONES.map((z) => `<option value="${z.id}">${z.name}</option>`).join("");
  zs.value = state.focusZone;
  zs.addEventListener("change", () => {
    state.focusZone = zs.value;
    renderTrend();
  });
  const ms = document.getElementById("metric-select");
  ms.addEventListener("change", () => {
    state.metric = ms.value;
    renderTrend();
  });
}

function niceTicks(lo, hi, n = 5) {
  const span = hi - lo || 1;
  const step0 = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= n) || 10 * mag;
  const ticks = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) ticks.push(+t.toFixed(6));
  return ticks;
}

function renderTrend() {
  const wrap = document.getElementById("trend-chart");
  const metric = METRICS[state.metric];
  const W = 1000, H = 380, m = { l: 56, r: 150, t: 16, b: 34 };
  const t0 = new Date(SCENES[0].date).getTime();
  const t1 = new Date(SCENES[SCENES.length - 1].date).getTime();
  const x = (d) => m.l + ((new Date(d).getTime() - t0) / Math.max(t1 - t0, 1)) * (W - m.l - m.r);

  const all = ZONES.map((z) => ({ z, pts: zoneSeries(z.id).map((p) => ({ date: p.date, v: p[state.metric] })) }));
  const vals = all.flatMap((s) => s.pts.map((p) => p.v));
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (state.metric === "score") { lo = 0; hi = 100; }
  else if (state.metric !== "ndci") lo = 0;
  const pad = (hi - lo) * 0.08 || 1;
  if (state.metric === "ndci") lo -= pad;
  if (state.metric !== "score") hi += pad;
  const ticks = niceTicks(lo, hi);
  lo = Math.min(lo, ticks[0]);
  hi = Math.max(hi, ticks[ticks.length - 1]);
  const y = (v) => m.t + (1 - (v - lo) / (hi - lo)) * (H - m.t - m.b);

  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${metric.label} over time by zone` });

  if (metric.bands) {
    [[70, 100, "var(--good)", "Good"], [45, 70, "var(--fair)", "Fair"], [0, 45, "var(--poor)", "Poor"]].forEach(([a, b, c, name]) => {
      svg.appendChild(svgEl("rect", { x: m.l, width: W - m.l - m.r, y: y(b), height: y(a) - y(b), fill: c, class: "band" }));
      const t = svgEl("text", { x: m.l + 6, y: y(b) + 14, class: "axis-label" });
      t.textContent = name;
      svg.appendChild(t);
    });
  }

  for (const t of ticks) {
    svg.appendChild(svgEl("line", { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), class: "gridline" }));
    const lab = svgEl("text", { x: m.l - 8, y: y(t) + 4, "text-anchor": "end", class: "axis-label" });
    lab.textContent = state.metric === "ndci" ? t.toFixed(2) : t;
    svg.appendChild(lab);
  }
  svg.appendChild(svgEl("line", { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, class: "baseline" }));

  // month ticks
  const d0 = new Date(SCENES[0].date + "T12:00:00");
  const cur = new Date(d0.getFullYear(), d0.getMonth() + 1, 1);
  while (cur.getTime() <= t1) {
    const iso = cur.toISOString().slice(0, 10);
    const lab = svgEl("text", { x: x(iso), y: H - m.b + 18, "text-anchor": "middle", class: "axis-label" });
    lab.textContent = cur.toLocaleDateString("en-US", { month: "short" }) + (cur.getMonth() === 0 ? " " + cur.getFullYear() : "");
    svg.appendChild(lab);
    cur.setMonth(cur.getMonth() + 1);
  }

  const path = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${x(p.date).toFixed(1)},${y(p.v).toFixed(1)}`).join("");
  for (const s of all) if (s.z.id !== state.focusZone && s.pts.length) svg.appendChild(svgEl("path", { d: path(s.pts), class: "ctx-line" }));
  const focus = all.find((s) => s.z.id === state.focusZone);
  if (focus.pts.length) {
    svg.appendChild(svgEl("path", { d: path(focus.pts), class: "focus-line" }));
    for (const p of focus.pts) svg.appendChild(svgEl("circle", { cx: x(p.date), cy: y(p.v), r: 4, class: "focus-dot" }));
    const last = focus.pts[focus.pts.length - 1];
    const lab = svgEl("text", { x: x(last.date) + 10, y: y(last.v) + 4, class: "direct-label" });
    lab.textContent = focus.z.name.replace("Intracoastal Waterway", "ICW").replace(" & Rio Vista Canals", "");
    svg.appendChild(lab);
  }

  const cross = svgEl("line", { y1: m.t, y2: H - m.b, class: "crosshair", visibility: "hidden" });
  svg.appendChild(cross);
  const hit = svgEl("rect", { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: "transparent" });
  svg.appendChild(hit);

  wrap.innerHTML = `<div class="chart-legend"><span><i style="background:var(--series-1)"></i>${focus.z.name}</span><span><i style="background:var(--context)"></i>Other zones</span></div>`;
  wrap.appendChild(svg);
  const tip = el("div", { class: "chart-tip" });
  tip.hidden = true;
  wrap.appendChild(tip);

  hit.addEventListener("mousemove", (e) => {
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let best = SCENES[0], bd = Infinity;
    for (const s of SCENES) {
      const d = Math.abs(x(s.date) - px);
      if (d < bd) { bd = d; best = s; }
    }
    cross.setAttribute("x1", x(best.date));
    cross.setAttribute("x2", x(best.date));
    cross.setAttribute("visibility", "visible");
    const rows = ZONES.map((z) => {
      const v = best.zones[z.id];
      return `<div class="tip-row${z.id === state.focusZone ? " focus" : ""}"><span>${z.name.replace("Intracoastal Waterway", "ICW")}</span><span>${v ? metric.fmt(v[state.metric]) : "–"}</span></div>`;
    }).join("");
    tip.innerHTML = `<div class="tip-date">${fmtDate(best.date)} <span class="cite">${best.clear_pct.toFixed(0)}% clear</span></div>${rows}`;
    tip.hidden = false;
    const wr = wrap.getBoundingClientRect();
    const left = e.clientX - wr.left + 16;
    tip.style.left = (left + 220 > wr.width ? left - 240 : left) + "px";
    tip.style.top = e.clientY - wr.top - 20 + "px";
  });
  hit.addEventListener("mouseleave", () => {
    tip.hidden = true;
    cross.setAttribute("visibility", "hidden");
  });

  document.getElementById("trend-note").textContent =
    `${metric.label} for every usable Sentinel-2 pass. Gaps mean the zone was clouded over or had too few clean water pixels. ` +
    (metric.higherIsBetter ? "Higher is healthier." : "Lower is generally healthier.");

  const table = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Date</th>${ZONES.map((z) => `<th>${z.name.replace("Intracoastal Waterway", "ICW")}</th>`).join("")}</tr></thead><tbody>${SCENES.slice()
    .reverse()
    .map((s) => `<tr><td>${fmtDate(s.date)}</td>${ZONES.map((z) => `<td>${s.zones[z.id] ? metric.fmt(s.zones[z.id][state.metric]) : "–"}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
  document.getElementById("trend-table").innerHTML = table;
}

// ---------- methodology ----------

function renderMethodLayers() {
  document.getElementById("method-layers").innerHTML = LAYERS.map(
    (L) => `<div class="card"><h3>${L.label}</h3><div class="bands">${L.bands}</div><p>${L.desc}</p></div>`
  ).join("");
}

// ---------- boot ----------

function init() {
  initTabs();
  renderStats();
  renderZoneCards();
  renderMethodLayers();
  if (FEATURED.length) {
    initViewer();
    renderViewer();
  }
  initTrends();
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("zone-modal").addEventListener("click", (e) => {
    if (e.target.id === "zone-modal") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  document.getElementById("data-footer").textContent =
    `Data generated ${new Date(D.generated).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} from ${SCENES.length} Sentinel-2 passes over tile ${D.tile}.`;
}

init();
