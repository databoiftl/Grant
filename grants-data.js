/**
 * Curated grant program dataset for the Fort Lauderdale Waterways Grant Finder.
 * Compiled from public agency sources in September 2026. Programs, deadlines,
 * and funding levels change — always confirm current-cycle details on the
 * official source link before drafting an application.
 *
 * tags: relevance weight 0-3 in each category for Fort Lauderdale's mission
 *   wq        = Water quality improvement (canals, ICW, stormwater, nutrients)
 *   canal     = Canal system / Intracoastal Waterway navigation & access
 *   habitat   = Habitat creation / restoration (seagrass, mangrove, living shoreline)
 *   boating   = Boating infrastructure (ramps, docks, derelict vessels, moorings)
 *   resilience= Waterfront parks, flood resilience, shoreline hardening/adaptation
 */
const GRANTS = [
  {
    id: "find-wap",
    name: "Waterway Assistance Program (WAP)",
    agency: "Florida Inland Navigation District (FIND)",
    level: "Regional Special District",
    summary:
      "FIND's flagship cost-share program for public navigation, boater access, mooring field management, waterfront parks, inlet management, environmental education, and boating safety. Broward County is one of FIND's member counties (District runs Nassau to Miami-Dade).",
    eligibility: "Local governments, counties, and port authorities within FIND's district (includes Broward County / Fort Lauderdale).",
    fundingRange: "Typically 50% cost-share; project sizes vary widely. District has funded $193M+ in local projects over 27 years.",
    match: "Local match required (historically up to 50%)",
    cycle: "Annual",
    nextDeadlineDate: "2027-03-30",
    isEstimate: true,
    deadlineNote: "2026 cycle closed Mar 30, 2026. Applications typically posted in January; next cycle due date is an estimate — confirm exact date when FIND opens the 2027 portal.",
    status: "closed_next_cycle",
    tags: { wq: 1, canal: 3, habitat: 1, boating: 3, resilience: 1 },
    whyFit:
      "The single best-matched funder for Fort Lauderdale: FIND exists specifically to fund ICW access, canal navigation, docks/ramps, and mooring management in exactly this district.",
    url: "https://www.aicw.org/grant_and_assistance_programs/waterway_assistance_programs_wap/index.php",
    urlLabel: "FIND Waterway Assistance Program overview",
  },
  {
    id: "fdep-wqig",
    name: "Water Quality Improvement Grant Program",
    agency: "Florida Dept. of Environmental Protection (FDEP)",
    level: "State",
    summary:
      "Statewide DEP grant helping communities fund wastewater (incl. septic-to-sewer conversion), stormwater, and nutrient-reduction projects in impaired waterbodies — the category also includes named programs for Indian River Lagoon, Biscayne Bay, and Caloosahatchee.",
    eligibility: "Local governments, counties, special districts, water/wastewater utilities.",
    fundingRange: "Varies by project scope; cost-share/reimbursement structure set per solicitation.",
    match: "Local match typically required or scored favorably",
    cycle: "Annual",
    nextDeadlineDate: "2027-07-01",
    isEstimate: true,
    deadlineNote: "FY2026-27 portal window was open Jul 1 – Sep 1, 2026 and has closed. Next window expected ~July 2027 — confirm on the DEP portal.",
    status: "closed_next_cycle",
    tags: { wq: 3, canal: 2, habitat: 1, boating: 0, resilience: 1 },
    whyFit:
      "Direct fit for canal and ICW nutrient/stormwater pollution reduction projects — DEP's core water-quality infrastructure funding vehicle.",
    url: "https://floridadep.gov/wra/wra/content/water-quality-improvement-grant-program",
    urlLabel: "FDEP Water Quality Improvement Grant Program",
  },
  {
    id: "fdep-319-swag",
    name: "Nonpoint Source Management Grants (Section 319 / SWAG)",
    agency: "Florida DEP, Nonpoint Source Management Program (EPA Clean Water Act §319 + state SWAG match)",
    level: "Federal pass-through via State",
    summary:
      "Funds best-management-practice demonstration and nonpoint-source pollution reduction, with priority for projects implementing an EPA-approved Watershed-Based Plan (e.g., a Basin Management Action Plan/BMAP). ~$6-8M available annually statewide.",
    eligibility: "Local governments, water management entities, and other organizations implementing an approved watershed plan.",
    fundingRange: "~$8M/year statewide pool; individual awards vary by project.",
    match: "Not always required, but strengthens competitiveness",
    cycle: "Rolling / semi-annual review",
    nextDeadlineDate: null,
    isEstimate: false,
    deadlineNote: "No fixed annual deadline — DEP reviews proposals semi-annually or as needed. Best fit if a project is tied to an adopted BMAP covering Broward canals.",
    status: "rolling",
    tags: { wq: 3, canal: 2, habitat: 1, boating: 0, resilience: 0 },
    whyFit:
      "Strong fit if any Fort Lauderdale canal segments fall under an adopted Basin Management Action Plan — this is the standard federal-state vehicle for nonpoint pollution reduction (fertilizer/stormwater runoff into canals).",
    url: "https://floridadep.gov/wra/319-tmdl-fund",
    urlLabel: "FDEP Nonpoint Source Management Program",
  },
  {
    id: "fdep-resilient-fl",
    name: "Resilient Florida Grant Program",
    agency: "Florida DEP, Office of Resilience & Coastal Protection",
    level: "State",
    summary:
      "Funds vulnerability assessments and implementation of adaptation/mitigation projects (flood control, shoreline stabilization, stormwater upgrades) for counties, municipalities, and regional resilience entities.",
    eligibility: "Counties, municipalities, special districts with relevant authority, and regional resilience entities. Project must tie to a documented vulnerability assessment.",
    fundingRange: "Ranges from planning-level grants to multimillion-dollar infrastructure awards.",
    match: "Cost-share considered in scoring",
    cycle: "Annual",
    nextDeadlineDate: "2027-07-01",
    isEstimate: true,
    deadlineNote: "2026 window was open Jul 1 – Sep 1, 2026 and has closed. Next window expected ~July 2027 — DEP hosts spring office hours before each cycle.",
    status: "closed_next_cycle",
    tags: { wq: 1, canal: 1, habitat: 0, boating: 0, resilience: 3 },
    whyFit:
      "Relevant for canal seawall resilience, tidal flooding, and stormwater/king-tide backflow projects tied to Fort Lauderdale's vulnerability assessment — pairs well with a formal Chief Waterways Officer resilience agenda.",
    url: "https://floridadep.gov/rcp/resilient-florida-program",
    urlLabel: "FDEP Resilient Florida Program",
  },
  {
    id: "sfwmd-cfi",
    name: "Cooperative Funding Initiative",
    agency: "South Florida Water Management District (SFWMD)",
    level: "Regional Special District",
    summary:
      "SFWMD cost-shares local water-resource projects (water quality treatment, stormwater retrofits, alternative water supply) with municipalities and counties in its district, which includes Broward County.",
    eligibility: "Local governments, water providers, and other entities within SFWMD boundaries.",
    fundingRange: "Varies by project and annual district budget allocation.",
    match: "Cost-share required",
    cycle: "Annual (varies by district region)",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote: "Deadline not independently confirmed for the SFWMD (Broward-serving) district this cycle — contact SFWMD's Broward-area Government Affairs liaison directly for current dates before assuming a date from other water management districts.",
    status: "contact_agency",
    tags: { wq: 2, canal: 2, habitat: 1, boating: 0, resilience: 1 },
    whyFit:
      "SFWMD is Fort Lauderdale's water management district — a natural cost-share partner for canal water-quality treatment and stormwater retrofit projects feeding the New River / ICW system.",
    url: "https://www.sfwmd.gov/doing-business-with-us/coop-funding",
    urlLabel: "SFWMD Cooperative Funding page",
  },
  {
    id: "fwc-fbip",
    name: "Florida Boating Improvement Program (FBIP)",
    agency: "Florida Fish & Wildlife Conservation Commission (FWC)",
    level: "State",
    summary:
      "Competitive grants for boating-access projects benefitting motorized vessels: boat ramps, parking, docks, channel markers, and other boating-related infrastructure and services.",
    eligibility: "County governments, municipalities, and other Florida governmental entities.",
    fundingRange: "Varies by project; funded from vessel registration fees.",
    match: "Not always required — check current solicitation",
    cycle: "Annual",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote: "FWC held FBIP technical-assistance sessions in 2026; exact FY2026-27 application deadline not confirmed in public search results — contact FBIP@MyFWC.com for the current cycle date.",
    status: "contact_agency",
    tags: { wq: 0, canal: 2, habitat: 0, boating: 3, resilience: 0 },
    whyFit:
      "Core boating-infrastructure funder — directly fits new/renovated boat ramps, docks, and channel markers on Fort Lauderdale's canals and ICW frontage.",
    url: "https://myfwc.com/boating/grants-programs/fbip/",
    urlLabel: "FWC Florida Boating Improvement Program",
  },
  {
    id: "fwc-derelict-vessel",
    name: "Derelict Vessel Removal Grant Program",
    agency: "Florida Fish & Wildlife Conservation Commission (FWC)",
    level: "State",
    summary:
      "Reimburses local governments for removing derelict vessels from public waters. FWC pays 100% of eligible removal costs. Accepted continuously, funded first-come-first-served while money is available.",
    eligibility: "Local governments (cities, counties).",
    fundingRange: "100% reimbursement of eligible removal costs, no local match.",
    match: "None — full reimbursement",
    cycle: "Rolling / continuous",
    nextDeadlineDate: null,
    isEstimate: false,
    deadlineNote: "No deadline — apply anytime; funding awarded first-come-first-served subject to legislative appropriation.",
    status: "rolling",
    tags: { wq: 1, canal: 2, habitat: 1, boating: 2, resilience: 0 },
    whyFit:
      "High-value, low-effort fit: 100%-funded, always-open program directly addressing derelict/abandoned vessels that are a known navigation and water-quality problem in dense canal cities like Fort Lauderdale.",
    url: "https://myfwc.com/boating/grants-programs/derelict-vessel/",
    urlLabel: "FWC Derelict Vessel Removal Grant Program",
  },
  {
    id: "fwc-big-federal",
    name: "Boating Infrastructure Grant (BIG) — Tier 1 & 2",
    agency: "U.S. Fish & Wildlife Service, administered in Florida by FWC",
    level: "Federal (state-administered)",
    summary:
      "Federal cost-share funding to build, renovate, and maintain facilities and amenities for transient recreational vessels 26+ feet, staying no more than 15 days — think transient docks, pump-outs, and dockside amenities.",
    eligibility: "Public entities and, for some facilities, private marinas providing public transient access; routed through FWC in Florida.",
    fundingRange: "Federal cost-share awards; typical range varies by tier (Tier 1 smaller local projects, Tier 2 larger/multi-state).",
    match: "Non-federal cost-share required",
    cycle: "Annual",
    nextDeadlineDate: "2027-07-01",
    isEstimate: true,
    deadlineNote: "Florida applicants submit to FWC by July 1 annually; 2026 deadline has passed. Next deadline is the standard July 1 date, expected July 1, 2027 — confirm with FWC.",
    status: "closed_next_cycle",
    tags: { wq: 0, canal: 1, habitat: 0, boating: 3, resilience: 0 },
    whyFit:
      "Strong fit given Fort Lauderdale's status as a major transient-yacht and cruising destination on the ICW — funds public transient dockage/pump-out infrastructure.",
    url: "https://myfwc.com/boating/grants-programs/bigp/",
    urlLabel: "FWC Boating Infrastructure Grant Program (BIGP)",
  },
  {
    id: "nfwf-ncrf",
    name: "National Coastal Resilience Fund (NCRF)",
    agency: "National Fish & Wildlife Foundation (NFWF), primarily NOAA-funded",
    level: "Federal (nonprofit-administered)",
    summary:
      "Funds nature-based solutions — living shorelines, mangrove/marsh restoration, floodplain reconnection — that reduce coastal flood/storm risk while restoring fish and wildlife habitat. Four tracks from planning ($100K-$1.5M) up to implementation ($1M-$7M).",
    eligibility: "Local governments, nonprofits, and other organizations; often via letters of support from municipalities.",
    fundingRange: "$100,000 – $7,000,000 depending on project phase.",
    match: "Match strongly preferred, not always mandatory",
    cycle: "Annual (pre-proposal then invited full proposal)",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote: "2026 pre-proposals already closed; invited full proposals were due Jun 24, 2026. Next RFP typically releases in winter (roughly Nov-Jan) — watch nfwf.org for the 2027 announcement.",
    status: "closed_next_cycle",
    tags: { wq: 1, canal: 1, habitat: 3, boating: 0, resilience: 3 },
    whyFit:
      "Excellent fit for larger habitat-creation and living-shoreline projects along the ICW and canal seawalls that double as flood-resilience infrastructure — this is the biggest dollar-per-project program on this list.",
    url: "https://www.nfwf.org/programs/national-coastal-resilience-fund/national-coastal-resilience-fund-2026-request-proposals",
    urlLabel: "NFWF National Coastal Resilience Fund",
  },
  {
    id: "fwff-conservation",
    name: "Conservation Grants (incl. Manatee/Seagrass Restoration awards)",
    agency: "Fish & Wildlife Foundation of Florida",
    level: "Nonprofit (state-affiliated)",
    summary:
      "Distributes roughly $6-9M/year statewide across conservation sub-programs, including Manatee Conservation awards that specifically fund seagrass restoration — directly relevant to manatee zones in Fort Lauderdale's canals and ICW.",
    eligibility: "Local governments, nonprofits, and research/restoration partners.",
    fundingRange: "Varies by sub-program; smaller, more accessible awards than federal mega-grants.",
    match: "Varies by sub-program",
    cycle: "Multiple sub-programs, typically 1-2 cycles/year",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote: "No single deadline — check wildlifeflorida.org for the current sub-program RFP calendar (seagrass/manatee-focused rounds are the best fit here).",
    status: "contact_agency",
    tags: { wq: 1, canal: 1, habitat: 3, boating: 0, resilience: 0 },
    whyFit:
      "A more accessible entry point than NFWF's mega-grants for seagrass restoration and manatee-habitat work in Fort Lauderdale's canal system.",
    url: "https://wildlifeflorida.org/conservation-grants/",
    urlLabel: "Fish & Wildlife Foundation of Florida — Conservation Grants",
  },
  {
    id: "fdep-frdap",
    name: "Florida Recreation Development Assistance Program (FRDAP)",
    agency: "Florida Dept. of Environmental Protection (FDEP)",
    level: "State",
    summary:
      "Reimbursement grant for acquiring or developing public outdoor recreation land and facilities — covers waterfront parks, boat ramps, fishing/viewing piers, and recreational trails along the water.",
    eligibility: "All Florida county governments, municipalities, and other legally constituted local governmental recreation entities.",
    fundingRange: "Up to $200,000 per application; up to 2 applications per cycle.",
    match: "Not required but scored favorably",
    cycle: "Annual",
    nextDeadlineDate: "2026-09-30",
    isEstimate: true,
    deadlineNote: "Historically opens ~Sep 16 and closes ~Sep 30 each year via DEP's Grantee Portal — this window may be opening imminently. Confirm exact FY2026-27 dates on the DEP portal right away, this is time-sensitive.",
    status: "opening_soon",
    tags: { wq: 0, canal: 1, habitat: 0, boating: 2, resilience: 2 },
    whyFit:
      "Good fit for waterfront-park, fishing-pier, or public boat-ramp components of a larger waterways project — smaller dollar cap but fast-moving annual window.",
    url: "https://floridadep.gov/lands/land-and-recreation-grants/content/florida-recreation-development-assistance-program",
    urlLabel: "FDEP Florida Recreation Development Assistance Program (FRDAP)",
  },
];

const CATEGORY_META = {
  wq: { label: "Water Quality", color: "#0e7490" },
  canal: { label: "Canals & ICW", color: "#1d4e89" },
  habitat: { label: "Habitat Restoration", color: "#2f8f5b" },
  boating: { label: "Boating Infrastructure", color: "#b5642b" },
  resilience: { label: "Waterfront & Resilience", color: "#6b4fa0" },
};

const STATUS_META = {
  open: { label: "Open now", color: "#1a7f37" },
  opening_soon: { label: "Opening imminently", color: "#b5642b" },
  rolling: { label: "Rolling / always open", color: "#1a7f37" },
  closed_next_cycle: { label: "Closed — next cycle", color: "#6b7280" },
  contact_agency: { label: "Contact agency for date", color: "#a15c00" },
};
