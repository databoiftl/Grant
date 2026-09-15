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
      "FIND's flagship cost-share program for public navigation, boater access, mooring field management, waterfront parks, inlet management, environmental education, and boating safety. Broward County is one of FIND's member counties (District runs Nassau to Miami-Dade).",
    eligibility: "Local governments, counties, and port authorities within FIND's district (includes Broward County / Fort Lauderdale).",
    fundingRange: "Typically 50% cost-share; project sizes vary widely. District has funded $193M+ in local projects over 27 years.",
    match: "Local match required (historically up to 50%)",
    cycle: "Annual",
    nextDeadlineDate: "2027-03-30",
    isEstimate: true,
    deadlineNote: "2026 cycle closed Mar 30, 2026. Applications typically posted in January; next cycle due date is an estimate — confirm exact date when FIND opens the 2027 portal.",
    status: "closed_next_cycle",
    tags: { wq: 0, canal: 3, habitat: 1, boating: 3, resilience: 1 },
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
    levelGroup: "State",
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
    levelGroup: "Regional",
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
    levelGroup: "State",
    summary:
      "Competitive grants for boating-access projects benefitting motorized vessels: boat ramps, parking, docks, channel markers, and other boating-related infrastructure and services.",
    eligibility: "County governments, municipalities, and other Florida governmental entities.",
    fundingRange: "Varies by project; funded from vessel registration fees.",
    match: "Not always required — check current solicitation",
    cycle: "Annual",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote: "Confirmed active and funded for 2026. FWC held FBIP technical-assistance sessions in 2026; exact FY2026-27 application deadline not confirmed in public search results — contact FBIP@MyFWC.com for the current cycle date.",
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
    eligibility: "Public entities and, for some facilities, private marinas providing public transient access; routed through FWC in Florida.",
    fundingRange: "Federal cost-share awards; typical range varies by tier (Tier 1 smaller local projects, Tier 2 larger/multi-state).",
    match: "Non-federal cost-share required",
    cycle: "Annual",
    nextDeadlineDate: "2027-07-01",
    isEstimate: false,
    deadlineNote: "Confirmed active: FWC's own published deadline is 5:00 PM on 07/01/2027 for the next Florida cycle. Florida applicants submit to FWC by July 1 annually; the 2026 deadline has passed.",
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
    agency: "National Fish & Wildlife Foundation (NFWF), funded by NOAA, DoD, Inflation Reduction Act, and private partners (Shell, Occidental)",
    level: "Federal (nonprofit-administered)",
    levelGroup: "Federal",
    summary:
      "Funds nature-based solutions — living shorelines, mangrove/marsh restoration, floodplain reconnection — that reduce coastal flood/storm risk while restoring fish and wildlife habitat. Four tracks from planning ($100K-$1.5M) up to implementation ($1M-$7M). Has run as an annual program since 2018, unlike NOAA's now-closed one-time Transformational Habitat Restoration & Coastal Resilience program.",
    eligibility: "Local governments, nonprofits, and other organizations; often via letters of support from municipalities.",
    fundingRange: "$100,000 – $7,000,000 depending on project phase.",
    match: "Match strongly preferred, not always mandatory",
    cycle: "Annual (pre-proposal then invited full proposal)",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote:
      "2026 pre-proposals already closed; invited full proposals were due Jun 24, 2026. Next RFP typically releases in winter (roughly Nov-Jan) — watch nfwf.org for the 2027 announcement. Caveat: a large share of recent NCRF rounds (~$92.5M of $139M in 2024) came from the Bipartisan Infrastructure Law, whose 5-year appropriations window runs out at the end of FY2026 — the multi-funder structure (IRA, DoD, private) makes total cancellation unlikely, but expect the 2027 round's size/shape to be uncertain until NFWF announces it.",
    status: "closed_next_cycle",
    tags: { wq: 0, canal: 1, habitat: 3, boating: 0, resilience: 3 },
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
      "Distributes roughly $6-9M/year statewide across conservation sub-programs, including Manatee Conservation awards that specifically fund seagrass restoration — directly relevant to manatee zones in Fort Lauderdale's canals and ICW.",
    eligibility: "Local governments, nonprofits, and research/restoration partners.",
    fundingRange: "Varies by sub-program; smaller, more accessible awards than federal mega-grants.",
    match: "Varies by sub-program",
    cycle: "Multiple sub-programs, typically 1-2 cycles/year",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote: "No single deadline — check wildlifeflorida.org for the current sub-program RFP calendar (seagrass/manatee-focused rounds are the best fit here).",
    status: "contact_agency",
    tags: { wq: 0, canal: 1, habitat: 3, boating: 0, resilience: 0 },
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
    deadlineNote: "Historically opens ~Sep 16 and closes ~Sep 30 each year via DEP's Grantee Portal — this window may be opening imminently. Confirm exact FY2026-27 dates on the DEP portal right away, this is time-sensitive.",
    status: "opening_soon",
    tags: { wq: 0, canal: 1, habitat: 0, boating: 2, resilience: 2 },
    whyFit:
      "Good fit for waterfront-park, fishing-pier, or public boat-ramp components of a larger waterways project — smaller dollar cap but fast-moving annual window.",
    url: "https://floridadep.gov/lands/land-and-recreation-grants/content/florida-recreation-development-assistance-program",
    urlLabel: "FDEP Florida Recreation Development Assistance Program (FRDAP)",
  },
  {
    id: "nfwf-marine-debris-hurricane",
    name: "Marine Debris Removal — Hurricane-Impacted Communities",
    agency: "National Fish & Wildlife Foundation (NFWF), in partnership with NOAA",
    level: "Federal (NOAA-funded, NFWF-administered)",
    levelGroup: "Federal",
    summary:
      "Up to $11M nationally to assess and remove marine debris — trash, derelict gear, and other pollution sources sitting in the water column — in communities affected by Hurricanes Idalia, Helene, Milton, and Typhoon Mawar, including a $7.725M Gulf of America Alliance regional track spanning AL/FL/LA/MS/TX.",
    eligibility: "Local governments in eligible hurricane-impacted states/counties; Florida track appears limited to local governments (not private citizens or corporations).",
    fundingRange: "Up to $11M nationally; $7.725M in the 5-state Gulf regional competitive track.",
    match: "Not required, but cost-share is scored favorably",
    cycle: "One-time (disaster-recovery supplemental)",
    nextDeadlineDate: "2026-10-21",
    isEstimate: false,
    deadlineNote:
      "Full proposals due Oct 21, 2026, 11:59 PM EDT. IMPORTANT: this track targets counties impacted by Hurricanes Idalia/Helene/Milton — confirm Broward County/Fort Lauderdale is on the current eligible-county list before investing staff time; if not, the general NOAA Marine Debris Program entry below is the better ongoing channel.",
    status: "open",
    tags: { wq: 1, canal: 2, habitat: 1, boating: 0, resilience: 1 },
    whyFit:
      "Rare direct federal dollars for physically removing debris from local waterways after a major storm — a strong, time-sensitive fit if any recent named storm affected Fort Lauderdale's canals or ICW frontage. Deadline is about five weeks out.",
    url: "https://marinedebris.noaa.gov/resources/funding-opportunities",
    urlLabel: "NOAA Marine Debris Program — Funding Opportunities",
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
    deadlineNote: "No application deadline — this is a standing cooperative-agreement mechanism. Contact the USGS Caribbean-Florida Water Science Center to scope a canal water-quality monitoring partnership.",
    status: "rolling",
    tags: { wq: 3, canal: 1, habitat: 0, boating: 0, resilience: 0 },
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
    cycle: "Periodic solicitations via grants.fdacs.gov",
    nextDeadlineDate: null,
    isEstimate: true,
    deadlineNote:
      "Check grants.fdacs.gov for the current Urban & Community Forestry solicitation window. The base program is a durable annual line item, so it's a safer long-term bet than most other BIL-touched programs on this list — but confirm directly whether the match-waived UCF-PPIC track is still open in Florida specifically, since its supplemental BIL/IRA funding is time-limited.",
    status: "contact_agency",
    tags: { wq: 2, canal: 1, habitat: 1, boating: 0, resilience: 2 },
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
    eligibility: "State/tribal agencies, local governments, and conservation partners — coordination with the local Coastal Program office is required before an application can be submitted.",
    fundingRange: "Individual project support varies; the program's FY26 national round funded 28 projects with $25.7M combined.",
    match: "Varies by project — partner contributions are commonly leveraged alongside FWS funds",
    cycle: "Invitation-based — must contact the local Coastal Program office before applying",
    nextDeadlineDate: "2026-09-30",
    isEstimate: false,
    deadlineNote:
      "Electronically submitted applications from invited applicants are due 09/30/2026, 11:59 PM ET — that's only ~2 weeks out, and since an invitation is required first, this specific window may already be effectively closed to a first-time applicant; treat FY2026 as a relationship-building contact and target the FY2027 cycle for an actual application. Outlook note: the Administration's FY2027 budget request cuts FWS discretionary funding ~20% below the FY2026 enacted level, so confirm the Coastal Program's funding specifically with your local office rather than assuming continuity.",
    status: "contact_agency",
    tags: { wq: 0, canal: 1, habitat: 3, boating: 0, resilience: 1 },
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
