/** Curated public context, separate from reviewed institutional memberships. */
export const organizationProfiles = [
  {
    slug: "microbiome-medicine",
    name: "Microbiome Medicine",
    kind: "Research & education platform",
    website: "https://microbiomemedicine.com/",
    description: "A research and education platform connecting condition-specific microbiome signatures, biological mechanisms, and candidate interventions.",
    connection: "WikiBiome is a project of Microbiome Medicine. This encyclopedia provides an open reference for the organisms, metals, host responses, and evidence relationships explored across that work.",
    connectionSource: "/about",
    connectionSourceLabel: "About WikiBiome",
    overview: "Microbiome Medicine organizes research around conditions, microbial and metallomic patterns, and possible intervention targets. Its stated approach considers mechanistic and clinical evidence separately, with methods for deriving signatures and expressing confidence.",
    source: "https://microbiomemedicine.com/",
    sourceLabel: "Microbiome Medicine: research scope and methods",
    founder: { orcid: "0000-0002-2348-7259", source: "https://microbiomemedicine.com/about-us/", label: "Founder · identified on the official About page" },
    paths: [
      { title: "Microbiome signatures", description: "Explore condition-specific patterns and their supporting literature.", articles: ["endometriosis", "parkinsons-disease"] },
      { title: "Metals & microbial function", description: "Follow the biochemical dependencies connecting metals, microbes, and host responses.", articles: ["microbial-metallomics", "nutritional-immunity"] },
      { title: "Mechanisms & interventions", description: "Read the evidence and limitations behind mechanisms and candidate interventions.", articles: ["ferroptosis", "low-nickel-diet"] },
    ],
    works: [
      { id: "pendergrass-2025-dysbiosis-dyshomeostasis-parkinsons-metallomic", reason: "A metallomic–microbiome perspective on Parkinson’s disease." },
      { id: "pendergrass-2026-heavy-metals-obesity-epidemic", reason: "Connects microbial metallomics with metabolic disease mechanisms." },
      { id: "pendergrass-2026-nickel-nec-preterm-gut", reason: "Examines metal-dependent microbial function in the preterm gut." },
    ],
    related: [],
  },
  {
    slug: "heavy-metal-index",
    name: "Heavy Metal Index",
    kind: "Public evidence index",
    website: "https://heavymetalindex.com/",
    description: "A public reference library for heavy metals in foods, consumer products, and human health, operated by the Institute of Contaminant Standards.",
    connection: "The Index’s coverage of exposure routes and source literature overlaps with WikiBiome’s articles on dietary metals and microbial ecology. The reading paths below connect those shared subjects.",
    connectionSource: "https://heavymetalindex.com/",
    connectionSourceLabel: "Index scope and operator",
    overview: "The Index organizes literature by metal, ingredient, product category, and regulatory instrument. Its public description emphasizes source records, methods, coverage, and corrections; it does not test products or rank brands.",
    source: "https://heavymetalindex.com/",
    sourceLabel: "Heavy Metal Index: scope, evidence, and methods",
    founder: null,
    paths: [
      { title: "Dietary exposure", description: "Start with how metals enter the diet.", articles: ["dietary-lead-exposure", "dietary-nickel-exposure"] },
      { title: "Early-life exposure", description: "Explore infant-food evidence and developmental vulnerability.", articles: ["heavy-metals-infant-foods", "developmental-metal-vulnerability"] },
      { title: "From exposure to biology", description: "Follow metals into microbial function and host regulation.", articles: ["microbial-metallomics", "metal-homeostasis"] },
    ],
    works: [
      { id: "pendergrass-2026-fertilizers-heavy-metals-historical", reason: "Historical fertilizer contamination and upstream exposure pathways." },
      { id: "pendergrass-2026-age-window-vulnerability-vegetable-baby-foods", reason: "Developmental context for metal exposure from infant foods." },
    ],
    related: [{ slug: "contaminant-standards", label: "Operated by the Institute of Contaminant Standards" }],
  },
  {
    slug: "tecrid",
    name: "TECRID",
    kind: "Laboratory evidence registry",
    website: "https://tecrid.com/",
    description: "An Institute of Contaminant Standards initiative for persistent identifiers and verification records for laboratory reports.",
    connection: "TECRID concerns the provenance of laboratory evidence. WikiBiome’s contaminant and exposure articles provide context for the scientific questions such records may help investigate.",
    connectionSource: "https://tecrid.com/",
    connectionSourceLabel: "TECRID purpose and trust boundaries",
    overview: "TECRID stands for Test Evidence Credential Record Identifier. Its documented workflow connects a report to its issuing laboratory, record status, and version history, with controlled disclosure. Authentication of a record does not establish product safety or replace interpretation of its results.",
    source: "https://tecrid.com/",
    sourceLabel: "TECRID: identifier, workflow, and scope",
    founder: null,
    paths: [
      { title: "Contaminants in context", description: "Explore the subjects that laboratory reports may measure.", articles: ["lead", "nickel"] },
      { title: "Exposure questions", description: "Read the scientific context around contaminant measurements.", articles: ["environmental-metal-exposure", "heavy-metals-infant-foods"] },
    ],
    works: [{ id: "pendergrass-2026-certification-infant-food-metals", reason: "Discusses evidence and certification frameworks for infant-food metals; included as contextual reading, not a TECRID validation study." }],
    related: [{ slug: "contaminant-standards", label: "An initiative of the Institute of Contaminant Standards" }],
  },
  {
    slug: "contaminant-standards",
    name: "Institute of Contaminant Standards",
    kind: "Standards & evidence governance",
    website: "https://contaminantstandards.com/",
    description: "An institute working on traceable contaminant standards, evidence governance, and verifiable laboratory records.",
    connection: "Its standards and evidence work intersects with WikiBiome’s coverage of contaminant exposure and food safety. It operates Heavy Metal Index and identifies TECRID as a shared infrastructure initiative.",
    connectionSource: "https://contaminantstandards.com/",
    connectionSourceLabel: "Institute mandate and network",
    overview: "The Institute describes distinct roles for public literature, certification programs, and institutional governance. Its mandate includes creating and versioning standards and defining verification and enforcement responsibilities. The website identifies the Institute as a trade name of Paleo Certified, Inc.",
    source: "https://contaminantstandards.com/",
    sourceLabel: "Institute of Contaminant Standards: mandate and governance",
    founder: { orcid: "0000-0002-2348-7259", source: "https://contaminantstandards.com/", label: "Founder · identified on the official website" },
    paths: [
      { title: "Food & contaminant evidence", description: "Explore exposure evidence that informs standards discussions.", articles: ["heavy-metals-infant-foods", "environmental-metal-exposure"] },
      { title: "Developmental context", description: "Follow age-specific exposure questions into the biology.", articles: ["developmental-metal-vulnerability", "dietary-lead-exposure"] },
    ],
    works: [
      { id: "pendergrass-2026-certification-infant-food-metals", reason: "A framework connecting scientific evidence and certification for infant and child foods." },
      { id: "pendergrass-2026-age-window-vulnerability-vegetable-baby-foods", reason: "Context on developmental vulnerability relevant to exposure assessment." },
    ],
    related: [{ slug: "heavy-metal-index", label: "Public evidence index" }, { slug: "tecrid", label: "Laboratory evidence infrastructure" }],
  },
];

/** @param {string} slug */
export function getOrganizationProfile(slug) {
  return organizationProfiles.find((profile) => profile.slug === slug);
}

/** Match only the official host, never lookalike domains or URL path text.
 * @param {string} value
 */
export function organizationForWebsite(value) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return undefined;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    return organizationProfiles.find((profile) => new URL(profile.website).hostname === host);
  } catch { return undefined; }
}

/**
 * @param {string} query
 * @param {Array<{name: string, orcid: string, associations: Array<{url: string}>}>} researchers
 */
export function searchOrganizationProfiles(query, researchers = []) {
  if (!query.trim()) return [];
  return organizationProfiles.filter((profile) => {
    const text = `${profile.name} ${profile.website} ${profile.kind} ${profile.description} ${profile.overview} ${profile.paths.map((path) => `${path.title} ${path.description}`).join(" ")}`;
    return matchesOrganizationQuery(query, text) || researchers.some((person) =>
      person.associations.some((association) => organizationForWebsite(association.url)?.slug === profile.slug)
      && matchesOrganizationQuery(query, `${person.name} ${person.orcid} ${text}`));
  }).sort((a, b) => Number(matchesOrganizationQuery(query, `${b.name} ${b.website}`)) - Number(matchesOrganizationQuery(query, `${a.name} ${a.website}`)));
}

/** @param {string} query @param {string} text */
export function matchesOrganizationQuery(query, text) {
  const normalize = (/** @type {string} */ value) => value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const haystack = normalize(text);
  return words.length ? words.every((word) => haystack.includes(word)) : !query.trim();
}

/** @param {string} slug */
export function organizationMonogram(slug) {
  return ({ "microbiome-medicine": "MM", "heavy-metal-index": "HMI", "tecrid": "TEC", "contaminant-standards": "ICS" })[slug] || "";
}
