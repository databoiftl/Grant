const CATEGORY_KEYS = ["wq", "canal", "habitat", "boating", "resilience"];

const state = {
  priorities: { wq: 3, canal: 3, habitat: 3, boating: 3, resilience: 2 },
  activeCategory: "all",
  activeLevel: "all",
  search: "",
  sort: "fit",
};

function fitScore(grant, priorities) {
  let num = 0;
  let den = 0;
  for (const key of CATEGORY_KEYS) {
    const p = priorities[key];
    num += (grant.tags[key] || 0) * p;
    den += 3 * p;
  }
  if (den === 0) return 0;
  return Math.round((num / den) * 100);
}

function daysUntil(isoDate) {
  if (!isoDate) return null;
  const target = new Date(isoDate + "T00:00:00");
  const now = new Date();
  const diffMs = target.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatDeadline(grant) {
  if (!grant.nextDeadlineDate) return null;
  const d = new Date(grant.nextDeadlineDate + "T00:00:00");
  const formatted = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  return grant.isEstimate ? `${formatted} (estimated)` : formatted;
}

function computeLiveStatus(grant) {
  if (grant.status === "rolling" || grant.status === "contact_agency") return grant.status;
  const days = daysUntil(grant.nextDeadlineDate);
  if (days === null) return grant.status;
  if (days < 0) return "closed_next_cycle";
  if (days <= 30) return "opening_soon";
  return grant.status;
}

function renderPriorityControls() {
  const wrap = document.getElementById("priority-controls");
  wrap.innerHTML = "";
  for (const key of CATEGORY_KEYS) {
    const meta = CATEGORY_META[key];
    const row = document.createElement("div");
    row.className = "priority-row";
    row.innerHTML = `
      <label for="pri-${key}">
        <span class="swatch" style="background:${meta.color}"></span>
        ${meta.label}
        <span class="priority-value" id="pri-${key}-val">${state.priorities[key]}</span>
      </label>
      <input type="range" id="pri-${key}" min="0" max="3" step="1" value="${state.priorities[key]}" />
    `;
    wrap.appendChild(row);
    row.querySelector("input").addEventListener("input", (e) => {
      state.priorities[key] = Number(e.target.value);
      document.getElementById(`pri-${key}-val`).textContent = e.target.value;
      render();
    });
  }
}

function renderCategoryChips() {
  const wrap = document.getElementById("category-chips");
  wrap.innerHTML = "";
  const allChip = document.createElement("button");
  allChip.className = "chip" + (state.activeCategory === "all" ? " active" : "");
  allChip.textContent = "All categories";
  allChip.addEventListener("click", () => {
    state.activeCategory = "all";
    render();
  });
  wrap.appendChild(allChip);

  for (const key of CATEGORY_KEYS) {
    const meta = CATEGORY_META[key];
    const chip = document.createElement("button");
    chip.className = "chip" + (state.activeCategory === key ? " active" : "");
    chip.style.setProperty("--chip-color", meta.color);
    chip.textContent = meta.label;
    chip.addEventListener("click", () => {
      state.activeCategory = key;
      render();
    });
    wrap.appendChild(chip);
  }
}

function renderLevelChips() {
  const wrap = document.getElementById("level-chips");
  wrap.innerHTML = "";
  const allChip = document.createElement("button");
  allChip.className = "chip" + (state.activeLevel === "all" ? " active" : "");
  allChip.textContent = "All funder types";
  allChip.addEventListener("click", () => {
    state.activeLevel = "all";
    render();
  });
  wrap.appendChild(allChip);

  for (const key of Object.keys(LEVEL_META)) {
    const meta = LEVEL_META[key];
    const chip = document.createElement("button");
    chip.className = "chip" + (state.activeLevel === key ? " active" : "");
    chip.style.setProperty("--chip-color", meta.color);
    chip.textContent = meta.label;
    chip.addEventListener("click", () => {
      state.activeLevel = key;
      render();
    });
    wrap.appendChild(chip);
  }
}

function filteredSortedGrants() {
  let list = GRANTS.slice();

  if (state.activeCategory !== "all") {
    list = list.filter((g) => (g.tags[state.activeCategory] || 0) >= 1);
  }

  if (state.activeLevel !== "all") {
    list = list.filter((g) => g.levelGroup === state.activeLevel);
  }

  const q = state.search.trim().toLowerCase();
  if (q) {
    list = list.filter((g) =>
      [g.name, g.agency, g.summary, g.whyFit].join(" ").toLowerCase().includes(q)
    );
  }

  list = list.map((g) => ({ grant: g, score: fitScore(g, state.priorities) }));

  if (state.sort === "fit") {
    list.sort((a, b) => b.score - a.score);
  } else if (state.sort === "deadline") {
    list.sort((a, b) => {
      const da = daysUntil(a.grant.nextDeadlineDate);
      const db = daysUntil(b.grant.nextDeadlineDate);
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return da - db;
    });
  } else if (state.sort === "name") {
    list.sort((a, b) => a.grant.name.localeCompare(b.grant.name));
  }

  return list;
}

function renderCard({ grant }) {
  const liveStatus = computeLiveStatus(grant);
  const statusMeta = STATUS_META[liveStatus];
  const deadlineText = formatDeadline(grant);
  const days = daysUntil(grant.nextDeadlineDate);

  const tagsHtml = CATEGORY_KEYS.filter((k) => grant.tags[k] >= 1)
    .map((k) => {
      const meta = CATEGORY_META[k];
      const weight = grant.tags[k];
      return `<span class="tag" style="border-color:${meta.color};color:${meta.color}">${meta.label}${"●".repeat(weight)}</span>`;
    })
    .join("");

  let deadlineLine = "";
  if (grant.status === "rolling") {
    deadlineLine = `<div class="deadline rolling">Rolling — apply anytime</div>`;
  } else if (grant.status === "contact_agency" && !deadlineText) {
    deadlineLine = `<div class="deadline contact">Contact agency for current cycle date</div>`;
  } else if (deadlineText) {
    let dayNote = "";
    if (days !== null) {
      if (days < 0) dayNote = " (passed — next cycle)";
      else if (days === 0) dayNote = " (today!)";
      else dayNote = ` (~${days}d)`;
    }
    deadlineLine = `<div class="deadline">Next deadline: <strong>${deadlineText}</strong>${dayNote}</div>`;
  }

  const levelMeta = LEVEL_META[grant.levelGroup] || { label: grant.levelGroup, color: "#6b7280" };

  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card-top">
      <div class="card-headline">
        <h3>${grant.name}</h3>
        <div class="agency">${grant.agency} · <span class="level">${grant.level}</span></div>
      </div>
      <span class="status-pill" style="background:${statusMeta.color}">${statusMeta.label}</span>
      <span class="level-pill" style="border-color:${levelMeta.color};color:${levelMeta.color}">${levelMeta.label}</span>
    </div>
    <a class="source-link" href="${grant.url}" target="_blank" rel="noopener noreferrer">Visit official program page ↗</a>
    <p class="summary">${grant.summary}</p>
    <div class="why-fit"><strong>Why it fits Fort Lauderdale:</strong> ${grant.whyFit}</div>
    <div class="meta-grid">
      <div><span class="meta-label">Eligibility</span>${grant.eligibility}</div>
      <div><span class="meta-label">Funding</span>${grant.fundingRange}</div>
      <div><span class="meta-label">Match</span>${grant.match}</div>
      <div><span class="meta-label">Cycle</span>${grant.cycle}</div>
    </div>
    ${deadlineLine}
    <div class="deadline-note">${grant.deadlineNote}</div>
    <div class="tags">${tagsHtml}</div>
  `;
  return card;
}

function render() {
  renderCategoryChips();
  renderLevelChips();
  const results = filteredSortedGrants();
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  document.getElementById("result-count").textContent = `${results.length} program${results.length === 1 ? "" : "s"}`;
  if (results.length === 0) {
    grid.innerHTML = `<div class="empty">No programs match these filters. Try clearing the search or category filter.</div>`;
    return;
  }
  for (const item of results) {
    grid.appendChild(renderCard(item));
  }
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_START_DOY = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

function dayOfYear(month, day) {
  return MONTH_START_DOY[month - 1] + (day - 1);
}

function escapeXml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

function openPeriodSortValue(op) {
  if (op.type === "window" && op.startMonth != null) return dayOfYear(op.startMonth, op.startDay);
  if (op.type === "onetime") return dayOfYear(op.endMonth, op.endDay);
  if (op.type === "point") return dayOfYear(op.month, op.day);
  if (op.type === "rolling") return 400;
  return 500; // varies
}

function renderGantt() {
  const container = document.getElementById("gantt-wrap");
  const rows = GRANTS.slice().sort(
    (a, b) => openPeriodSortValue(a.openPeriod) - openPeriodSortValue(b.openPeriod) || a.name.localeCompare(b.name)
  );

  const rowH = 26;
  const headerH = 36;
  const labelW = 270;
  const rightPad = 16;
  const totalW = 1040;
  const chartW = totalW - labelW - rightPad;
  const totalH = headerH + rows.length * rowH + 6;

  let svg = `<svg class="gantt-svg" viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg">`;

  MONTH_START_DOY.forEach((doy, i) => {
    const x = labelW + (doy / 365) * chartW;
    svg += `<line class="gantt-gridline" x1="${x.toFixed(1)}" y1="${headerH - 6}" x2="${x.toFixed(1)}" y2="${totalH}" />`;
    svg += `<text class="gantt-month-label" x="${(x + 3).toFixed(1)}" y="${headerH - 14}">${MONTH_NAMES[i]}</text>`;
  });
  svg += `<line class="gantt-gridline" x1="${totalW - rightPad}" y1="${headerH - 6}" x2="${totalW - rightPad}" y2="${totalH}" />`;

  const today = new Date();
  const todayDoy = dayOfYear(today.getMonth() + 1, today.getDate());
  const todayX = labelW + (todayDoy / 365) * chartW;
  svg += `<text class="gantt-today-label" x="${(todayX + 3).toFixed(1)}" y="${headerH - 22}">Today</text>`;
  svg += `<line class="gantt-today-line" x1="${todayX.toFixed(1)}" y1="${headerH - 6}" x2="${todayX.toFixed(1)}" y2="${totalH}" />`;

  rows.forEach((grant, i) => {
    const y = headerH + i * rowH;
    const midY = y + rowH / 2;
    svg += `<text class="gantt-row-label" x="4" y="${(midY + 4).toFixed(1)}">${escapeXml(truncate(grant.name, 38))}</text>`;
    svg += `<line class="gantt-gridline" x1="0" y1="${y + rowH}" x2="${totalW - rightPad}" y2="${y + rowH}" />`;

    const op = grant.openPeriod;
    const meta = OPEN_TYPE_META[op.type];

    if ((op.type === "window" || op.type === "onetime") && op.startMonth != null) {
      const sd = dayOfYear(op.startMonth, op.startDay);
      const ed = dayOfYear(op.endMonth, op.endDay);
      const x1 = labelW + (sd / 365) * chartW;
      const x2 = labelW + (ed / 365) * chartW;
      const w = Math.max(x2 - x1, 5);
      const dashAttr = op.approx ? ` stroke-dasharray="3 2"` : "";
      svg += `<rect class="gantt-bar" x="${x1.toFixed(1)}" y="${y + 5}" width="${w.toFixed(1)}" height="${rowH - 10}" fill="${meta.color}" fill-opacity="${op.approx ? 0.5 : 0.85}" stroke="${meta.color}"${dashAttr} />`;
    } else if (op.type === "onetime") {
      const d = dayOfYear(op.endMonth, op.endDay);
      const x = labelW + (d / 365) * chartW;
      const s = 7;
      svg += `<polygon points="${x.toFixed(1)},${(midY - s).toFixed(1)} ${(x + s).toFixed(1)},${midY.toFixed(1)} ${x.toFixed(1)},${(midY + s).toFixed(1)} ${(x - s).toFixed(1)},${midY.toFixed(1)}" fill="${meta.color}" stroke="#fff" stroke-width="1" />`;
    } else if (op.type === "point") {
      const d = dayOfYear(op.month, op.day);
      const x = labelW + (d / 365) * chartW;
      const s = 6;
      svg += `<polygon points="${x.toFixed(1)},${(midY - s).toFixed(1)} ${(x + s).toFixed(1)},${midY.toFixed(1)} ${x.toFixed(1)},${(midY + s).toFixed(1)} ${(x - s).toFixed(1)},${midY.toFixed(1)}" fill="${meta.color}" />`;
    } else if (op.type === "rolling") {
      svg += `<rect x="${labelW}" y="${y + 7}" width="${chartW}" height="${rowH - 14}" fill="${meta.color}" fill-opacity="0.18" />`;
    } else {
      svg += `<text class="gantt-varies-label" x="${labelW + 8}" y="${(midY + 4).toFixed(1)}">Varies — no fixed window</text>`;
    }
  });

  svg += `</svg>`;
  container.innerHTML = svg;

  const legendItems = Object.entries(OPEN_TYPE_META)
    .map(([, meta]) => `<span class="gantt-legend-item"><span class="gantt-legend-swatch" style="background:${meta.color}"></span>${meta.label}</span>`)
    .join("");
  container.innerHTML += `<div class="gantt-legend">${legendItems}<span class="gantt-legend-item"><span class="gantt-legend-swatch" style="background:#d1394a"></span>Today</span></div>`;
}

function renderPeriodList() {
  const container = document.getElementById("period-list");
  container.innerHTML = "";
  const rows = GRANTS.slice().sort(
    (a, b) => openPeriodSortValue(a.openPeriod) - openPeriodSortValue(b.openPeriod) || a.name.localeCompare(b.name)
  );
  for (const grant of rows) {
    const op = grant.openPeriod;
    const meta = OPEN_TYPE_META[op.type];
    const row = document.createElement("div");
    row.className = "period-row";
    row.innerHTML = `
      <div>
        <span class="period-name">${grant.name}</span>
        <span class="period-type-badge" style="background:${meta.color}22;color:${meta.color}">${meta.label}</span>
        <div class="period-agency">${grant.agency}</div>
      </div>
      <div class="period-value${op.approx ? " approx" : ""}">${op.label}</div>
    `;
    container.appendChild(row);
  }
}

function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      document.getElementById("tab-panel-grants").hidden = tab !== "grants";
      document.getElementById("tab-panel-timeline").hidden = tab !== "timeline";
      if (tab === "timeline") {
        renderGantt();
        renderPeriodList();
      }
    });
  });
}

function init() {
  renderPriorityControls();
  initTabs();

  document.getElementById("search").addEventListener("input", (e) => {
    state.search = e.target.value;
    render();
  });

  document.getElementById("sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  render();
}

document.addEventListener("DOMContentLoaded", init);
