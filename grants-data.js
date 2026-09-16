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
 *
 * wq tagging rule: only tag wq >= 1 when the program's own summary names a
 * pollutant/nutrient/stormwater-treatment activity, or removes a pollution
 * source directly (marine debris, derelict/leaking vessels). A program that
 * merely funds navigation, access, or habitat restoration near water does
 * NOT get a wq tag on that basis alone — habitat co-benefits belong under
 * `habitat`, not `wq`. This keeps the Water Quality filter trustworthy.
 */
const GRANTS = [
  {
    id: "find-wap",
    name: "Waterway Assistance Program (WAP)",
    agency: "Florida Inland Navigation District (FIND)",
    level: "Regional Special District",
    levelGroup: "Regional",
    summary:
      "FIND's flagship cost-share program. Confirmed eligible project categories: navigation channel dredging, navigation aids/markers, inlet management, shoreline stabilization, spoil-site acquisition/development, boat ramps, docking/mooring facilities, derelict vessel removal, environmental education, fishing piers, waterfront parks/boardwalks, maritime management planning, boating safety, beach renourishment, and environmental restoration. Broward County is one of FIND's member counties (District runs Nassau to Miami-Dade).",
    eligibility: "Local governments, counties, and port authorities within FIND's district (includes Broward County / Fort Lauderdale).",
    fundingRange:
      "Up to 75% District funding for public navigation projects; up to 50% for other eligible categories (ramps, docks, parks, etc.). District has funded $193M+ in local projects over 27 years.",
    match: "Local match required — 25% (navigation projects) to 50% (most other categories)",
    cycle: "Annual",
    nextDeadlineDate: "2027-03-30",
    isEstimate: true,
    deadlineNote: "2026 cycle closed Mar 30, 2026. Applications typically posted in January; next cycle due date is an estimate — confirm exact date when FIND opens the 2027 portal.",
    status: "closed_next_cycle",
    tags: { wq: 0, canal: 3, habitat: 1, boating: 3, resilience: 1 },
    openPeriod: { type: "window", startMonth: 1, startDay: 1, endMonth: 3, endDay: 30, approx: true, label: "~Jan 1 – Mar 30 (opens January, due Mar 30)" },
    whyFit:
      "The single best-matched funder for Fort Lauderdale: FIND exists specifically to fund ICW access, canal navigation, docks/ramps, and mooring management in exactly this district. Not tagged Water Quality — WAP funds access/navigation infrastructure, not pollutant or stormwater treatment.",
    url: "https://www.aicw.org/grant_and_assistance_programs/waterway_assistance_programs_wap/index.php",
    urlLabel: "FIND Waterway Assistance Program overview",
  },
  {
    id: "fdep-wqig",
    name: "Water Quality Improvement Grant Program",
    agency: "Florida Dept. of Environmental Protection (FDEP)",
    level: "State",
    levelGroup: "State",
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
    openPeriod: { type: "window", startMonth: 7, startDay: 1, endMonth: 9, endDay: 1, approx: false, label: "Jul 1 – Sep 1" },
    whyFit:
      "Direct fit for canal and ICW nutrient/stormwater pollution reduction projects — DEP's core water-quality infrastructure funding vehicle.",
    url: "https://floridadep.gov/wra/wra/content/water-quality-improvement-grant-program",
    urlLabel: "FDEP Water Quality Improvement Grant Program",
  },
  {
    id: "fdep-innovative-tech-hab",
    name: "Innovative Technology Grants for Harmful Algal Blooms",
    agency: "Florida Dept. of Environmental Protection (FDEP)",
    level: "State",
    levelGroup: "State",
    summary:
      "Funds evaluation and deployment of innovative technologies and short-term solutions to prevent, monitor, clean up, or mitigate harmful algal blooms (HABs) and blue-green algae, with emphasis on projects that reduce the nutrient loading that drives blooms. Since 2019 the state has invested $65M+ testing 65+ technologies statewide; a recent statewide round distributed $10-13.6M across 14-16 projects.",
    eligibility:
      "Local governmental entities (counties, municipalities, school districts, special districts, public universities/colleges) and nonprofit organizations.",
    fundingRange:
      "Individual awards have varied widely by project scope — recent examples include $600K to a university research partner and $3.2M to a multi-partner team; no single confirmed per-project cap found.",
    match: "No match required",
    cycle: "Annual, grouped with DEP's other Water Quality & Supply Grants",
    nextDeadlineDate: "2027-09-01",
    isEstimate: false,
    deadlineNote:
      "Confirmed: grouped with DEP's broader Water Quality & Supply Grants window (Jul 1 – Sep 1). The FY2026-27 window closed Sep 1, 2026; next window expected to open ~Jul 1, 2027 and close Sep 1, 2027.",
    status: "closed_next_cycle",
    tags: { wq: 3, canal: 2, habitat: 0, boating: 0, resilience: 0 },
    openPeriod: { type: "window", startMonth: 7, startDay: 1, endMonth: 9, endDay: 1, approx: false, label: "Jul 1 – Sep 1 (confirmed)" },
    whyFit:
      "Directly relevant if Fort Lauderdale's canals experience blue-green algae or nutrient-driven algal blooms, which are a known risk in nutrient-rich urban canal systems — this is DEP's dedicated vehicle for piloting new treatment/monitoring technology rather than conventional infrastructure, and a good complement to the broader Water Quality Improvement Grant above.",
    url: "https://protectingfloridatogether.gov/innovative-technologies-for-HABs",
    urlLabel: "FDEP Innovative Technologies for Harmful Algal Blooms",
  },
  {
    id: "noaa-pcmhab",
    name: "Prevention, Control, and Mitigation of Harmful Algal Blooms (PCMHAB) Program",
    agency: "NOAA, National Centers for Coastal Ocean Science (NCCOS)",
    level: "Federal",
    levelGroup: "Federal",
    summary:
      "NOAA's dedicated federal funding line for developing and field-transitioning technologies and strategies to prevent, control, or mitigate harmful algal blooms (HABs) — the direct federal counterpart to FDEP's state HAB technology grant, with emphasis on getting promising technologies into real-world use by end users like local governments.",
    eligibility:
      "U.S. institutions of higher education, nonprofits, state and local governments, tribal government entities, U.S. Territories/Affiliated Pacific Islands institutions, and for-profit/commercial organizations.",
    fundingRange:
      "Part of a national HAB/hypoxia research and monitoring pool that has exceeded $20M in recent combined award rounds; individual project size varies by scope.",
    match: "No match required (cash/in-kind match earns bonus points in review, but isn't mandatory)",
    cycle: "Annual NOFO via NCCOS / grants.gov",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote:
      "FY2026 cycle: letters of intent were due Apr 14, 2026, full applications due Jul 9, 2026 (both closed). Next cycle expected ~spring/summer 2027 — watch coastalscience.noaa.gov/about/funding-opportunities, or contact NOAA's ECOHAB Coordinator Felix Martinez (Felix.Martinez@noaa.gov, 301-237-5414).",
    status: "closed_next_cycle",
    tags: { wq: 3, canal: 2, habitat: 0, boating: 0, resilience: 0 },
    openPeriod: { type: "window", startMonth: 4, startDay: 14, endMonth: 7, endDay: 9, approx: false, label: "Apr 14 (LOI) – Jul 9 (full application)" },
    whyFit:
      "The federal-level twin to FDEP's Innovative Technology Grants for HABs — worth pursuing alongside or instead of the state program if Fort Lauderdale is piloting a specific HAB detection, prevention, or control technology in its canals; this program explicitly prioritizes field deployment with real end users like municipalities.",
    url: "https://coastalscience.noaa.gov/science-areas/habs/pcmhab/",
    urlLabel: "NOAA NCCOS — Prevention, Control, and Mitigation of Harmful Algal Blooms",
  },
  {
    id: "epa-south-florida-program",
    name: "South Florida Program (SFP)",
    agency: "U.S. EPA, Region 4",
    level: "Federal",
    levelGroup: "Federal",
    summary:
      "EPA grant specifically carved out for South Florida (Broward County is within scope), funding innovative stormwater pollution-reduction demonstration projects — innovative approaches, methods, or techniques to prevent, treat, and manage pollution before it reaches local waterbodies.",
    eligibility:
      "States, local governments, U.S. territories, tribes, public/private universities and colleges, hospitals, laboratories, and public/private nonprofit institutions.",
    fundingRange: "$400,000 – $1,000,000 per project in the most recent announcement ($8.5M total pool); projects can run up to 7 years.",
    match: "Not confirmed as mandatory in search results — check the current NOFO",
    cycle: "Periodic NOFOs via grants.gov",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote: "Most recent NOFO closed Mar 16, 2026. Next opportunity not yet announced — monitor epa.gov/southflorida and grants.gov.",
    status: "closed_next_cycle",
    tags: { wq: 3, canal: 2, habitat: 1, boating: 0, resilience: 1 },
    openPeriod: { type: "point", month: 3, day: 16, approx: false, label: "Deadline only: Mar 16 — opening/NOFO-post date not confirmed" },
    whyFit:
      "One of the most specifically-targeted programs on this whole list — it exists because of South Florida's particular water-quality challenges and explicitly funds piloting innovative/novel stormwater treatment approaches rather than conventional infrastructure, a strong match for testing new canal-adjacent stormwater technology.",
    url: "https://www.epa.gov/southflorida/south-florida-program-funding-sfp-overview",
    urlLabel: "EPA South Florida Program (SFP) Funding",
  },
  {
    id: "fdep-319-swag",
    name: "Nonpoint Source Management Grants (Section 319 / SWAG)",
    agency: "Florida DEP, Nonpoint Source Management Program (EPA Clean Water Act §319 + state SWAG match)",
    level: "Federal pass-through via State",
    levelGroup: "State",
    summary:
      "Funds best-management-practice demonstration and nonpoint-source pollution reduction, with priority for projects implementing an EPA-approved Watershed-Based Plan (e.g., a Basin Management Action Plan/BMAP). ~$6-8M available annually statewide.",
    eligibility:
      "State agencies, local governments, special districts, water management districts, national estuary programs, and (for the broader 319 program) nonprofits and academic institutions implementing an approved watershed plan.",
    fundingRange: "~$8M/year statewide pool; individual awards vary by project.",
    match: "Local sponsor must provide a minimum 40% match",
    cycle: "Rolling / semi-annual review",
    nextDeadlineDate: null,
    isEstimate: false,
    deadlineNote: "No fixed annual deadline — DEP reviews proposals semi-annually or as needed. Best fit if a project is tied to an adopted BMAP covering Broward canals.",
    status: "rolling",
    tags: { wq: 3, canal: 2, habitat: 1, boating: 0, resilience: 0 },
    openPeriod: { type: "rolling", label: "Rolling — reviewed semi-annually, no fixed calendar window" },
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
    levelGroup: "State",
    summary:
      "Funds vulnerability assessments and implementation of adaptation/mitigation projects (flood control, shoreline stabilization, stormwater upgrades) for counties, municipalities, and regional resilience entities.",
    eligibility: "Counties, municipalities, special districts with relevant authority, and regional resilience entities. Project must tie to a documented vulnerability assessment.",
    fundingRange: "Ranges from planning-level grants to multimillion-dollar infrastructure awards.",
    match: "Cost-share considered in scoring",
    cycle: "Annual",
    nextDeadlineDate: "2027-07-01",
    isEstimate: true,
    deadlineNote:
      "2026 window was open Jul 1 – Sep 1, 2026 and has closed. Next window expected ~July 2027 — DEP hosts spring office hours before each cycle. Funding confirmed stable: the SFY2026-27 state budget appropriated $160M to this program (up from prior year), and DEP's current grant cycle spans $230M+ combined across water restoration, resilience, and coastal protection — implementation dollars specifically grew even as standalone vulnerability-assessment planning grants shrank now that all 67 counties have completed assessments.",
    status: "closed_next_cycle",
    tags: { wq: 1, canal: 1, habitat: 0, boating: 0, resilience: 3 },
    openPeriod: { type: "window", startMonth: 7, startDay: 1, endMonth: 9, endDay: 1, approx: false, label: "Jul 1 – Sep 1" },
    whyFit:
      "Relevant for canal seawall resilience, tidal flooding, and stormwater/king-tide backflow projects tied to Fort Lauderdale's vulnerability assessment — pairs well with a formal Chief Waterways Officer resilience agenda.",
    url: "https://floridadep.gov/rcp/resilient-florida-program",
    urlLabel: "FDEP Resilient Florida Program",
  },
  {
    id: "fwc-fbip",
    name: "Florida Boating Improvement Program (FBIP)",
    agency: "Florida Fish & Wildlife Conservation Commission (FWC)",
    level: "State",
    levelGroup: "State",
    summary:
      "Competitive grants for boating-access projects benefitting motorized vessels: boat ramps, parking, docks, channel markers, and other boating-related infrastructure and services.",
    eligibility: "County governments, municipalities, and other Florida governmental entities.",
    fundingRange:
      "Varies by project; funded by motor-fuel tax revenues deposited into FWC's Marine Resources Conservation Trust Fund (not vessel registration fees, which fund other boating programs).",
    match: "Not always required — check current solicitation",
    cycle: "Annual",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote:
      "As of the most recent public guidance, FBIP's application period was closed with the next cycle to be announced for 2027 — contact FBIP@MyFWC.com to confirm current status before assuming this is open.",
    status: "contact_agency",
    tags: { wq: 0, canal: 2, habitat: 0, boating: 3, resilience: 0 },
    openPeriod: { type: "varies", label: "Currently closed; next cycle dates not yet announced (historically annual)" },
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
    levelGroup: "State",
    summary:
      "Reimburses local governments for removing derelict vessels from public waters — removing a real pollution source, since abandoned/sunken vessels commonly leak fuel, oil, and sewage into surrounding waters. FWC pays 100% of eligible removal costs. Accepted continuously, funded first-come-first-served while money is available.",
    eligibility: "Local governments (cities, counties).",
    fundingRange: "100% reimbursement of eligible removal costs, no local match.",
    match: "None — full reimbursement",
    cycle: "Rolling / continuous",
    nextDeadlineDate: null,
    isEstimate: false,
    deadlineNote: "No deadline — apply anytime; funding awarded first-come-first-served subject to legislative appropriation.",
    status: "rolling",
    tags: { wq: 1, canal: 2, habitat: 1, boating: 2, resilience: 0 },
    openPeriod: { type: "rolling", label: "Rolling — no deadline, funded first-come-first-served" },
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
    levelGroup: "Federal",
    summary:
      "Federal cost-share funding to build, renovate, and maintain facilities and amenities for transient recreational vessels 26+ feet, staying no more than 15 days — think transient docks, pump-outs, and dockside amenities.",
    eligibility:
      "Local governments, tribes, port districts, nonprofit and private organizations, state agencies, and some special-purpose districts; routed through FWC in Florida.",
    fundingRange:
      "Tier 1: Florida's total state allocation is $300,000, no single project exceeding that. Tier 2: $9M-$14M available nationally per cycle, competitive.",
    match: "Up to 25% non-federal match required",
    cycle: "Annual",
    nextDeadlineDate: "2027-07-01",
    isEstimate: false,
    deadlineNote: "Confirmed active: FWC's own published deadline is 5:00 PM on 07/01/2027 for the next Florida cycle. Florida applicants submit to FWC by July 1 annually; the 2026 deadline has passed.",
    status: "closed_next_cycle",
    tags: { wq: 0, canal: 1, habitat: 0, boating: 3, resilience: 0 },
    openPeriod: { type: "point", month: 7, day: 1, approx: false, label: "Deadline only: Jul 1 — opening date not separately published" },
    whyFit:
      "Strong fit given Fort Lauderdale's status as a major transient-yacht and cruising destination on the ICW — funds public transient dockage/pump-out infrastructure.",
    url: "https://myfwc.com/boating/grants-programs/bigp/",
    urlLabel: "FWC Boating Infrastructure Grant Program (BIGP)",
  },
  {
    id: "nfwf-ncrf",
    name: "National Coastal Resilience Fund (NCRF)",
    agency: "National Fish & Wildlife Foundation (NFWF), funded by NOAA, DoD, Inflation Reduction Act, and private partners (Shell, Occidental)",
    level: "Federal (nonprofit-administered)",
    levelGroup: "Federal",
    summary:
      "Funds nature-based solutions — living shorelines, mangrove/marsh restoration, floodplain reconnection — that reduce coastal flood/storm risk while restoring fish and wildlife habitat. Four tracks from planning ($100K-$1.5M) up to implementation ($1M-$7M). Has run as an annual program since 2018, unlike NOAA's now-closed one-time Transformational Habitat Restoration & Coastal Resilience program.",
    eligibility:
      "Broad: nonprofit 501(c) organizations, state/territorial and local/municipal governments, tribal governments and organizations, educational institutions, and commercial (for-profit) organizations.",
    fundingRange: "$100,000 – $7,000,000 depending on project phase.",
    match: "Not required — NFWF does not mandate a non-federal match, though one is encouraged and strengthens competitiveness",
    cycle: "Annual (pre-proposal then invited full proposal)",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote:
      "2026 pre-proposals already closed; invited full proposals were due Jun 24, 2026. Next RFP typically releases in winter (roughly Nov-Jan) — watch nfwf.org for the 2027 announcement. Caveat: a large share of recent NCRF rounds (~$92.5M of $139M in 2024) came from the Bipartisan Infrastructure Law, whose 5-year appropriations window runs out at the end of FY2026 — the multi-funder structure (IRA, DoD, private) makes total cancellation unlikely, but expect the 2027 round's size/shape to be uncertain until NFWF announces it.",
    status: "closed_next_cycle",
    tags: { wq: 0, canal: 1, habitat: 3, boating: 0, resilience: 3 },
    openPeriod: { type: "window", startMonth: 1, startDay: 1, endMonth: 6, endDay: 24, approx: true, label: "~Jan – Jun 24 (pre-proposals may open as early as the prior Nov)" },
    whyFit:
      "Excellent fit for larger habitat-creation and living-shoreline projects along the ICW and canal seawalls that double as flood-resilience infrastructure — this is the biggest dollar-per-project program on this list, and unlike the program removed from this list, it's a genuinely recurring annual cycle.",
    url: "https://www.nfwf.org/programs/national-coastal-resilience-fund/national-coastal-resilience-fund-2026-request-proposals",
    urlLabel: "NFWF National Coastal Resilience Fund",
  },
  {
    id: "fwff-conservation",
    name: "Conservation Grants (incl. Manatee/Seagrass Restoration awards)",
    agency: "Fish & Wildlife Foundation of Florida",
    level: "Nonprofit (state-affiliated)",
    levelGroup: "Private",
    summary:
      "The Foundation distributes roughly $6-9M/year statewide across many conservation sub-programs (not all waterway-relevant — e.g., its Conserve Wildlife grants fund black bear and general wildlife-diversity work). The Manatee Conservation sub-program is the relevant one here, specifically funding seagrass restoration — directly relevant to manatee zones in Fort Lauderdale's canals and ICW.",
    eligibility: "Local governments, nonprofits, and research/restoration partners.",
    fundingRange: "Individual grants typically $1,000 – $25,000; requests up to $75,000 will be considered.",
    match: "Not a prerequisite, but ability to secure matching funds strengthens an application",
    cycle: "Multiple sub-programs, typically 1-2 cycles/year",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote: "No single deadline — check wildlifeflorida.org for the current sub-program RFP calendar (seagrass/manatee-focused rounds are the best fit here).",
    status: "contact_agency",
    tags: { wq: 0, canal: 1, habitat: 3, boating: 0, resilience: 0 },
    openPeriod: { type: "varies", label: "Multiple sub-programs, 1-2 cycles/year — no single calendar window" },
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
    levelGroup: "State",
    summary:
      "Reimbursement grant for acquiring or developing public outdoor recreation land and facilities — covers waterfront parks, boat ramps, fishing/viewing piers, and recreational trails along the water.",
    eligibility: "All Florida county governments, municipalities, and other legally constituted local governmental recreation entities.",
    fundingRange: "Up to $200,000 per application; up to 2 applications per cycle.",
    match: "Not required but scored favorably",
    cycle: "Annual",
    nextDeadlineDate: "2026-09-30",
    isEstimate: true,
    deadlineNote:
      "Historically opens ~Sep 16 and closes ~Sep 30 each year via DEP's Grantee Portal, which is the basis for the date above — but DEP's site already lists both 'FY2026-2027 FRDAP Application Instructions' and 'FY2027-2028 FRDAP Application Instructions,' so don't assume Sept 30, 2026 is still the live deadline. Confirm the current cycle directly on the DEP portal before treating this as time-sensitive.",
    status: "contact_agency",
    tags: { wq: 0, canal: 1, habitat: 0, boating: 2, resilience: 2 },
    openPeriod: { type: "window", startMonth: 9, startDay: 16, endMonth: 9, endDay: 30, approx: true, label: "~Sep 16 – Sep 30 (historical pattern — confirm current cycle)" },
    whyFit:
      "Good fit for waterfront-park, fishing-pier, or public boat-ramp components of a larger waterways project — smaller dollar cap but fast-moving annual window.",
    url: "https://floridadep.gov/lands/land-and-recreation-grants/content/florida-recreation-development-assistance-program",
    urlLabel: "FDEP Florida Recreation Development Assistance Program (FRDAP)",
  },
  {
    id: "nfwf-marine-debris-hurricane",
    name: "Hurricane Response Marine Debris Removal Fund",
    agency: "National Fish & Wildlife Foundation (NFWF), in partnership with NOAA",
    level: "Federal (NOAA-funded, NFWF-administered)",
    levelGroup: "Federal",
    summary:
      "Up to $11M nationally to assess and remove marine debris — trash, derelict gear, and other pollution sources sitting in the water column — in coastal counties of FL, GA, NC, SC, and Guam affected by Hurricanes Idalia, Helene, and Milton, and Typhoon Mawar, including a $7.725M Gulf of America Alliance regional track spanning AL/FL/LA/MS/TX.",
    eligibility:
      "Broad: nonprofit 501(c) organizations, state/territorial and local/municipal governments, commercial (for-profit) organizations, tribal governments and organizations, and educational institutions.",
    fundingRange: "Up to $11M nationally; $7.725M in the 5-state Gulf regional competitive track.",
    match: "Not required, but cost-share is scored favorably",
    cycle: "One-time (disaster-recovery supplemental)",
    nextDeadlineDate: "2026-10-21",
    isEstimate: false,
    deadlineNote:
      "Full proposals due Oct 21, 2026, 11:59 PM EDT. IMPORTANT: this track targets counties impacted by Hurricanes Idalia/Helene/Milton — confirm Broward County/Fort Lauderdale is on the current eligible-county list before investing staff time; if not, the general NOAA Marine Debris Program entry below is the better ongoing channel.",
    status: "open",
    tags: { wq: 1, canal: 2, habitat: 1, boating: 0, resilience: 1 },
    openPeriod: { type: "onetime", year: 2026, endMonth: 10, endDay: 21, approx: false, label: "One-time FY2026 disaster-recovery supplemental — due Oct 21, 2026" },
    whyFit:
      "Rare direct federal dollars for physically removing debris from local waterways after a major storm — a strong, time-sensitive fit if any recent named storm affected Fort Lauderdale's canals or ICW frontage. Deadline is about five weeks out.",
    url: "https://www.nfwf.org/programs/hurricane-response-marine-debris-removal-fund",
    urlLabel: "NFWF Hurricane Response Marine Debris Removal Fund",
  },
  {
    id: "noaa-marine-debris-general",
    name: "Marine Debris Removal & Prevention Grants (recurring)",
    agency: "NOAA Marine Debris Program",
    level: "Federal",
    levelGroup: "Federal",
    summary:
      "NOAA's baseline, recurring marine-debris funding line — separate from the hurricane-specific track above — covering removal of trash/derelict gear (a direct pollution source), prevention, and assessment projects, typically posted as annual Federal Funding Opportunities (FFOs) directly through NOAA or partner administrators like NFWF.",
    eligibility: "State/local governments, tribes, and NGOs — exact eligibility varies by the specific FFO.",
    fundingRange: "Varies by year; recent national removal/prevention rounds have totaled multiple millions of dollars.",
    match: "Varies by FFO",
    cycle: "Annual / periodic FFOs",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote:
      "No single fixed date — NOAA posts specific Federal Funding Opportunities on this page throughout the year (also mirrored on grants.gov). Worth monitoring year-round for the next general removal/prevention cycle.",
    status: "contact_agency",
    tags: { wq: 1, canal: 2, habitat: 1, boating: 1, resilience: 0 },
    openPeriod: { type: "varies", label: "NOAA posts FFOs throughout the year — no single fixed window" },
    whyFit:
      "NOAA's standing marine-debris channel — the one to watch for canal and ICW debris/derelict-gear removal funding outside of the current disaster-specific opportunity.",
    url: "https://marinedebris.noaa.gov/resources/funding-opportunities",
    urlLabel: "NOAA Marine Debris Program — Funding Opportunities",
  },
  {
    id: "nfwf-five-star-urban-waters",
    name: "Five Star and Urban Waters Restoration Grant Program",
    agency: "National Fish & Wildlife Foundation (NFWF), with EPA and USFWS support",
    level: "Nonprofit (federally-chartered, public-private)",
    levelGroup: "Private",
    summary:
      "Community-scale restoration grants for streambank/shoreline stabilization, stormwater-runoff reduction, and wetland/riparian restoration, paired with hands-on community engagement and education.",
    eligibility: "Local governments, nonprofits, and community groups.",
    fundingRange: "$30,000 – $60,000 typical (avg. ~$45,000); ~$2.5M total pool, 30-40 awards/year nationally.",
    match: "Minimum 50% match required (cash or in-kind); a larger, more diverse match is more competitive",
    cycle: "Annual",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote:
      "2026 cycle closed in May 2026; awards announced ~Nov 2026. Next application window expected to open winter/spring 2027 — watch nfwf.org.",
    status: "closed_next_cycle",
    tags: { wq: 2, canal: 1, habitat: 2, boating: 0, resilience: 1 },
    openPeriod: { type: "window", startMonth: 1, startDay: 1, endMonth: 5, endDay: 31, approx: true, label: "~Jan – May (2026 cycle closed in May; exact open date within season not separately confirmed)" },
    whyFit:
      "Right-sized for a smaller canal-bank stabilization, urban stormwater retrofit, or community-restoration pilot — far more accessible than the multimillion-dollar NOAA/NFWF programs above, but requires a 50% match.",
    url: "https://www.nfwf.org/media-center/press-releases/five-star-and-urban-waters-restoration-program-announces-more-1-million-grants",
    urlLabel: "NFWF Five Star and Urban Waters Restoration Grant Program",
  },
  {
    id: "cf-broward-eco",
    name: "ECO Broward Grants",
    agency: "Community Foundation of Broward",
    level: "Community Foundation",
    levelGroup: "Private",
    summary:
      "Locally based (Fort Lauderdale) community foundation funding environmental protection and climate-resilience projects across Broward's 31 municipalities, aligned with the Broward County Climate Change Action Plan — a recent round included a focus on reducing single-use plastics that pollute local waterways.",
    eligibility:
      "Confirmed eligible: 501(c)(3) nonprofits serving Broward County, AND city or county government agencies with a project demonstrating charitable intent in Broward County.",
    fundingRange: "Grants up to $100,000 each.",
    match: "Not specified",
    cycle: "Periodic",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote:
      "Check cfbroward.org/grant-opportunities/eco-broward directly for the current ECO Broward cycle dates — this is the most locally-rooted funder on this list and one of the few here confirmed to accept a city department as a direct applicant.",
    status: "contact_agency",
    tags: { wq: 1, canal: 1, habitat: 1, boating: 0, resilience: 2 },
    openPeriod: { type: "varies", label: "Periodic — check cfbroward.org for current cycle" },
    whyFit:
      "Home-turf funder already prioritizing waterway-adjacent pollution (single-use plastics) and climate resilience, and one of the only private-sector options here confirmed to accept the City of Fort Lauderdale itself as an applicant, not just a nonprofit partner.",
    url: "https://www.cfbroward.org/grant-opportunities/eco-broward",
    urlLabel: "Community Foundation of Broward — ECO Broward Grants",
  },
  {
    id: "usace-cap",
    name: "Continuing Authorities Program (Sections 204, 206 & 1135)",
    agency: "U.S. Army Corps of Engineers, Jacksonville District",
    level: "Federal",
    levelGroup: "Federal",
    summary:
      "USACE's small civil-works authorities for local partners: Section 204 (regional sediment management / beneficial use of dredged material to build or restore habitat), Section 206 (aquatic ecosystem restoration, no existing federal project required), and Section 1135 (restoring environmental quality at sites degraded by an existing Corps project). The Corps designs and builds; the local government is the required non-federal sponsor.",
    eligibility: "Legally constituted public entities (local governments) acting as the non-federal sponsor.",
    fundingRange:
      "Sec. 204: 65% federal / 35% non-federal of incremental cost above least-cost disposal. Sec. 206: 65% federal / 35% non-federal, historically capped near $5M federal share for design+construction (confirm current statutory cap). Sec. 1135: 75% federal / 25% non-federal for design and construction.",
    match: "Required non-federal cost-share (see funding column) — can include in-kind services",
    cycle: "Rolling initiation, but new-project funding is currently uncertain (see note)",
    nextDeadlineDate: null,
    isEstimate: false,
    deadlineNote:
      "FUNDING RISK: the Administration's budget request excluded CAP funding in both FY2025 and FY2026; Congress partially backfilled FY2025 with $100M via the American Relief Act (mostly flood/storm-damage projects), and USACE is currently operating under a continuing resolution through Jan 30, 2026. The authorities remain law and a City can still submit a letter of interest to get in the queue, but treat new-project funding as genuinely uncertain right now — call the Jacksonville District first to ask whether they're accepting new CAP study starts before investing staff time.",
    status: "contact_agency",
    tags: { wq: 0, canal: 3, habitat: 2, boating: 0, resilience: 1 },
    openPeriod: { type: "rolling", label: "Rolling — submit a letter of interest anytime (new-project funding currently uncertain)" },
    whyFit:
      "Purpose-built for exactly this kind of work — using dredged canal material to build habitat, restoring aquatic ecosystems degraded by navigation dredging, or fixing environmental side-effects of an existing Corps project on the ICW, with the Corps designing/building it as cost-share partner — but currently the highest funding-risk program on this list; confirm active appropriations before relying on it.",
    url: "https://www.saj.usace.army.mil/Missions/Civil-Works/",
    urlLabel: "USACE Jacksonville District — Civil Works / Continuing Authorities Program",
  },
  {
    id: "usgs-cooperative-water",
    name: "Cooperative Water Program / Cooperative Matching Funds",
    agency: "U.S. Geological Survey",
    level: "Federal",
    levelGroup: "Federal",
    summary:
      "USGS cost-shares water-science projects directly with state, local, and tribal governments — most commonly streamgages and water-quality monitoring stations — matching local funding up to 50% through Cooperative Matching Funds.",
    eligibility: "State, local, and tribal government partners.",
    fundingRange: "USGS typically matches up to 50% of the local government's contribution toward an agreed monitoring project.",
    match: "Local government funds the non-USGS share",
    cycle: "Ongoing cooperative agreements, not a competitive annual cycle",
    nextDeadlineDate: null,
    isEstimate: false,
    deadlineNote:
      "No application deadline — this is a standing cooperative-agreement mechanism. Contact the USGS Caribbean-Florida Water Science Center, which has an office right in Davie, Broward County (3321 College Avenue, Davie, FL 33314), to scope a canal water-quality monitoring partnership.",
    status: "rolling",
    tags: { wq: 3, canal: 1, habitat: 0, boating: 0, resilience: 0 },
    openPeriod: { type: "rolling", label: "Rolling — standing cooperative-agreement mechanism, no deadline" },
    whyFit:
      "A direct, no-competition path to federal cost-share for canal water-quality and flow monitoring instrumentation — useful groundwork data for justifying the bigger water-quality grants elsewhere on this list.",
    url: "https://www.usgs.gov/mission-areas/water-resources/science/usgs-cooperative-matching-funds",
    urlLabel: "USGS Cooperative Matching Funds",
  },
  {
    id: "usfs-urban-forestry",
    name: "Urban and Community Forestry Grants",
    agency: "USDA Forest Service, administered in Florida by the Florida Forest Service (FDACS)",
    level: "Federal (state-administered)",
    levelGroup: "State",
    summary:
      "The core Urban & Community Forestry Program is a long-standing, annually-appropriated USDA Forest Service program (predates the Bipartisan Infrastructure Law) funding public tree canopy, urban forest management planning, and tree inventory/assessment work — typically 50/50 matching grants. A separate, BIL/IRA-funded add-on track (UCF-PPIC) has additionally targeted invasive species control, reforestation, and stormwater retention with the match waived in several states.",
    eligibility: "Local governments, educational institutions, tribal governments, and legally organized nonprofit volunteer organizations.",
    fundingRange: "Varies by category; the base program is typically a 50/50 match, some grants up to $50,000.",
    match: "Typically 50/50 on the base program",
    cycle: "Annual, via grants.fdacs.gov",
    nextDeadlineDate: "2027-03-07",
    isEstimate: true,
    deadlineNote:
      "The FY2026 cycle had pre-proposals due Mar 7, 2026 and full proposals due Mar 11, 2026 (both already closed) — the estimated date above projects that same early-March pattern forward one year. Caveat: FDACS runs multiple, separately-scheduled forestry grant programs (e.g., the unrelated Florida's Future Forests carbon-sequestration program has its own March deadline) — confirm on grants.fdacs.gov that you're tracking the Urban & Community Forestry solicitation specifically, not a similarly-timed but different program.",
    status: "contact_agency",
    tags: { wq: 2, canal: 1, habitat: 1, boating: 0, resilience: 2 },
    openPeriod: { type: "window", startMonth: 3, startDay: 7, endMonth: 3, endDay: 11, approx: true, label: "~Mar 7 (pre-proposal) – Mar 11 (full proposal), projected from FY2026 pattern" },
    whyFit:
      "An indirect but real lever for canal water quality: waterfront and floodplain tree canopy reduces stormwater runoff and nutrient loading into canals, and one of the more funding-stable programs on this list since it predates the current BIL/IRA-era volatility affecting several other federal entries here.",
    url: "https://www.fdacs.gov/Forest-Wildfire/For-Communities/Urban-Forestry/Florida-Urban-and-Community-Forestry-Grants",
    urlLabel: "Florida Urban and Community Forestry Grants (FDACS/Florida Forest Service)",
  },
  {
    id: "fema-bric",
    name: "Building Resilient Infrastructure and Communities (BRIC)",
    agency: "FEMA, via the Florida Division of Emergency Management (state pass-through)",
    level: "Federal (state-administered)",
    levelGroup: "Federal",
    summary:
      "FEMA's hazard-mitigation grant program for flood and disaster-risk-reduction infrastructure — relevant to canal seawall resilience, tidal-flooding/stormwater backflow prevention, and other flood-mitigation capital projects. Local governments apply as subapplicants through the state.",
    eligibility: "Local governments, as subapplicants through Florida's State Hazard Mitigation Officer.",
    fundingRange: "FY2024-25 national cycle made $1 billion available; individual project awards vary widely.",
    match: "Federal share typically 75% (up to 90% for some small/impoverished communities); 25% non-federal match otherwise",
    cycle: "Annual, but historically volatile",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote:
      "FEMA moved to end BRIC entirely in April 2025, then resumed it; the FY2024-25 NOFO (published Mar 25, 2026) closed to subapplications Jul 23, 2026 and is now in FEMA review. Given the program's on-again/off-again history, confirm directly with FL Division of Emergency Management whether/when a next cycle will open before committing planning time.",
    status: "contact_agency",
    tags: { wq: 0, canal: 1, habitat: 0, boating: 0, resilience: 3 },
    openPeriod: { type: "window", startMonth: 3, startDay: 25, endMonth: 7, endDay: 23, approx: false, label: "Mar 25 – Jul 23 (FY2024-25 cycle; program historically volatile)" },
    whyFit:
      "The standard federal vehicle for hardening canal seawalls, upgrading tidal backflow/stormwater infrastructure, and other flood-mitigation capital work — highest resilience-category fit on this list, but the program's funding stability has been genuinely uncertain since 2025. Not tagged Water Quality — BRIC funds flood-risk reduction, not pollutant/nutrient treatment.",
    url: "https://www.fema.gov/grants/mitigation/learn/building-resilient-infrastructure-communities",
    urlLabel: "FEMA — Building Resilient Infrastructure and Communities (BRIC)",
  },
  {
    id: "usfws-coastal-program",
    name: "Coastal Program",
    agency: "U.S. Fish & Wildlife Service",
    level: "Federal",
    levelGroup: "Federal",
    summary:
      "Technical and financial assistance for habitat protection/restoration projects (living shorelines, salt marsh, oyster reef, coastal wetlands) developed through direct partnership with a local USFWS Coastal Program biologist, rather than an open competitive RFP.",
    eligibility:
      "State/tribal agencies, local governments, and conservation partners — coordination with the local Coastal Program office is required before an application can be submitted. For Fort Lauderdale, that's the South Florida Ecological Services Field Office in Vero Beach, FL (which covers Broward County), not a generic national contact point.",
    fundingRange: "Individual project support varies; the program's FY26 national round funded 28 projects with $25.7M combined.",
    match: "Varies by project — partner contributions are commonly leveraged alongside FWS funds",
    cycle: "Invitation-based — must contact the local Coastal Program office before applying",
    nextDeadlineDate: "2026-09-30",
    isEstimate: false,
    deadlineNote:
      "Electronically submitted applications from invited applicants are due 09/30/2026, 11:59 PM ET — that's only ~2 weeks out, and since an invitation is required first, this specific window may already be effectively closed to a first-time applicant; treat FY2026 as a relationship-building contact and target the FY2027 cycle for an actual application. Outlook note: the Administration's FY2027 budget request cuts FWS discretionary funding ~20% below the FY2026 enacted level, so confirm the Coastal Program's funding specifically with your local office rather than assuming continuity.",
    status: "contact_agency",
    tags: { wq: 0, canal: 1, habitat: 3, boating: 0, resilience: 1 },
    openPeriod: { type: "point", month: 9, day: 30, approx: false, label: "Deadline only: Sep 30 — invitation required before applying" },
    whyFit:
      "Direct USFWS partnership channel for living-shoreline and coastal-wetland restoration along the ICW — smaller and more relationship-driven than NFWF's big-dollar programs, which can make it a faster path for a well-scoped habitat project, funding outlook permitting.",
    url: "https://www.fws.gov/program/coastal",
    urlLabel: "U.S. Fish & Wildlife Service — Coastal Program",
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

const LEVEL_META = {
  Federal: { label: "Federal", color: "#1d4e89" },
  State: { label: "State", color: "#0e7490" },
  Regional: { label: "Regional", color: "#2f8f5b" },
  Private: { label: "Private / Nonprofit", color: "#8a3ea1" },
};

/**
 * openPeriod.type meanings, used by the Open-Period Timeline tab:
 *   window  = confirmed or historically-typical annual open/close dates
 *   point   = only a deadline is known; opening date isn't published
 *   rolling = no application window at all — accepted continuously
 *   onetime = a single non-recurring opportunity tied to a specific year
 *   varies  = multiple/irregular cycles per year, no single window to show
 * openPeriod.approx: true when a boundary is inferred from a past cycle's
 * pattern rather than an independently confirmed recurring date.
 */
const OPEN_TYPE_META = {
  window: { label: "Annual window", color: "#0e7490" },
  point: { label: "Single deadline", color: "#1d4e89" },
  rolling: { label: "Rolling / always open", color: "#1a7f37" },
  onetime: { label: "One-time opportunity", color: "#b5642b" },
  varies: { label: "Varies", color: "#6b7280" },
};
