import { findPagesUsingSource, getSource } from "@/lib/wikibiome";

export type ResearcherExpertiseCluster = {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
};

export const researcherExpertiseClusters: ResearcherExpertiseCluster[] = [
  {
    slug: "heavy-metals-microbial-metallomics",
    name: "Heavy metals & microbial metallomics",
    description: "Metal exposure, microbial metal handling, metalloproteins, resistance, and host–microbiome effects.",
    keywords: ["heavy metal", "metal–microbiome", "metal-microbiome", "metallom", "nickel", "cadmium", "lead", "arsenic", "mercury", "copper", "zinc", "iron homeostasis", "contaminant"],
  },
  {
    slug: "gut-brain-neurodegeneration",
    name: "Gut–brain axis & neurodegeneration",
    description: "Microbial pathways connected to Parkinson’s disease, cognition, neuroinflammation, and brain health.",
    keywords: ["gut–brain", "gut-brain", "parkinson", "neurodegener", "neuromelanin", "dopamine", "brain", "ferroptosis"],
  },
  {
    slug: "early-life-infant-health",
    name: "Early-life & infant health",
    description: "Infant nutrition, developmental exposure, neonatal microbiomes, and critical windows of susceptibility.",
    keywords: ["infant", "neonatal", "preterm", "necrotizing enterocolitis", "early-life", "early life", "developmental", "baby food", "child food"],
  },
  {
    slug: "metabolic-health",
    name: "Metabolic health",
    description: "Obesity, diabetes, insulin resistance, microbial metabolites, and cardiometabolic pathways.",
    keywords: ["obesity", "diabetes", "insulin", "metabolic", "cardiovascular", "glucose", "lipid"],
  },
  {
    slug: "immune-inflammatory-disease",
    name: "Immunity & inflammatory disease",
    description: "Inflammatory signaling, barrier function, autoimmune disease, and host–microbe immune interactions.",
    keywords: ["immune", "inflamm", "barrier", "crohn", "colitis", "ibd", "autoimmune", "cytokine"],
  },
  {
    slug: "microbial-ecology",
    name: "Microbial ecology",
    description: "Community structure, dysbiosis, taxa, metabolites, ecological pressures, and resilience.",
    keywords: ["microbial ecology", "microbiome", "microbiota", "dysbiosis", "bacter", "archaea", "fung", "metabolite"],
  },
  {
    slug: "food-safety-regulatory-science",
    name: "Food safety & regulatory science",
    description: "Contaminant standards, exposure thresholds, certification, food systems, and regulatory evidence.",
    keywords: ["food safety", "regulatory", "certification", "standard", "food", "dietary exposure", "risk assessment"],
  },
  {
    slug: "evidence-synthesis-methods",
    name: "Evidence synthesis & methods",
    description: "Systematic review, evidence architecture, computational methods, standards, and reproducible synthesis.",
    keywords: ["evidence synthesis", "systematic review", "meta-analysis", "method", "computational", "framework", "ontology", "knowledge graph"],
  },
];

export type ResearchImpact = {
  verifiedWorks: number;
  keystoneWorks: number;
  linkedArticles: number;
  inferredExpertise: string[];
  clusterSlugs: string[];
};

export function buildResearchImpact(sourceIds: string[]): ResearchImpact {
  const uniqueSourceIds = [...new Set(sourceIds.filter(Boolean))];
  const pages = new Map<string, ReturnType<typeof findPagesUsingSource>[number]>();
  const text: string[] = [];
  let keystoneWorks = 0;

  for (const sourceId of uniqueSourceIds) {
    const source = getSource(sourceId);
    if (source?.keystone) keystoneWorks += 1;
    text.push(source?.title ?? "", source?.journal ?? "");
    for (const page of findPagesUsingSource(sourceId, 500)) {
      pages.set(page.id, page);
      text.push(page.title, page.category, ...(page.tags ?? []));
    }
  }

  const haystack = normalize(text.join(" "));
  const scored = researcherExpertiseClusters
    .map((cluster) => ({ cluster, score: cluster.keywords.reduce((total, keyword) => total + (haystack.includes(normalize(keyword)) ? 1 : 0), 0) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.cluster.name.localeCompare(b.cluster.name));

  return {
    verifiedWorks: uniqueSourceIds.length,
    keystoneWorks,
    linkedArticles: pages.size,
    inferredExpertise: scored.slice(0, 8).map((item) => item.cluster.name),
    clusterSlugs: scored.map((item) => item.cluster.slug),
  };
}

export function matchResearcherDirectoryEntry(input: {
  query?: string;
  cluster?: string;
  name: string;
  orcid: string;
  biography: string;
  affiliations: string[];
  expertise: string[];
  clusterSlugs: string[];
}) {
  const query = normalize(input.query ?? "");
  if (input.cluster && !input.clusterSlugs.includes(input.cluster)) return false;
  if (!query) return true;
  return normalize([input.name, input.orcid, input.biography, ...input.affiliations, ...input.expertise].join(" ")).includes(query);
}

export function normalizeOrganizationSlug(value: unknown) {
  const slug = String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug || "research-organization";
}

function normalize(value: string) {
  return value.normalize("NFKD").toLowerCase().replace(/[–—]/g, "-").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
