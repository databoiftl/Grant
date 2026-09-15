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

function fitBand(score) {
  if (score >= 75) return { label: "Strong fit", color: "#1a7f37" };
  if (score >= 45) return { label: "Moderate fit", color: "#b5642b" };
  return { label: "Weak fit", color: "#8b8f98" };
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

function renderCard({ grant, score }) {
  const band = fitBand(score);
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
      <div class="fit-badge" style="--fit-color:${band.color}">
        <div class="fit-score">${score}</div>
        <div class="fit-label">${band.label}</div>
      </div>
      <div class="card-headline">
        <h3>${grant.name}</h3>
        <div class="agency">${grant.agency} · <span class="level">${grant.level}</span></div>
      </div>
      <span class="status-pill" style="background:${statusMeta.color}">${statusMeta.label}</span>
      <span class="level-pill" style="border-color:${levelMeta.color};color:${levelMeta.color}">${levelMeta.label}</span>
    </div>
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
    <a class="source-link" href="${grant.url}" target="_blank" rel="noopener noreferrer">${grant.urlLabel} ↗</a>
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

function init() {
  renderPriorityControls();

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
