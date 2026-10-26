import type { WikiPage, WikiSection } from "@/lib/wikibiome";

function substantiveSectionBody(value: string) {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\s*---\s*$/gm, "")
    .trim();
}

export type ContentKind =
  | "analysis"
  | "concept"
  | "defense"
  | "disease"
  | "entity"
  | "intervention"
  | "mechanism"
  | "metal"
  | "microbe"
  | "reference"
  | "stop"
  | "internal";

export type SectionKind =
  | "connections"
  | "ecology"
  | "evidence"
  | "intervention_table"
  | "narrative"
  | "open_questions"
  | "paradox_index"
  | "source_index"
  | "structured_table";

export type ContentSchema = {
  kind: ContentKind;
  label: string;
  template: "article" | "disease-atlas" | "intervention" | "analysis" | "stop" | "reference" | "internal";
  description: string;
};

export type PreparedSection = WikiSection & {
  kind: SectionKind;
  renderAsProse: boolean;
};

export const contentSchemas: Record<ContentKind, ContentSchema> = {
  microbe: { kind: "microbe", label: "Microorganism", template: "article", description: "Taxonomy, ecology, host relationships, metal dependencies, and evidence." },
  disease: { kind: "disease", label: "Disease", template: "disease-atlas", description: "Canonical disease narrative reconciled with structured signature records." },
  metal: { kind: "metal", label: "Metal", template: "article", description: "Element chemistry, biological handling, microbial interactions, exposure, and disease links." },
  intervention: { kind: "intervention", label: "Intervention", template: "intervention", description: "Mechanism, evidence, applicability, cautions, and related interventions." },
  stop: { kind: "stop", label: "Clinical caution", template: "stop", description: "Evidence-linked caution records preserved as contextual guidance, not medical directives." },
  mechanism: { kind: "mechanism", label: "Mechanism", template: "article", description: "Molecular or ecological mechanism with linked evidence and entities." },
  defense: { kind: "defense", label: "Host defense", template: "article", description: "Host protective system and its microbial, immune, and metallomic relationships." },
  analysis: { kind: "analysis", label: "Analysis", template: "analysis", description: "Cross-record synthesis, comparison, or explanatory analysis." },
  concept: { kind: "concept", label: "Concept", template: "article", description: "General scientific concept connected across the encyclopedia." },
  entity: { kind: "entity", label: "Entity", template: "article", description: "Indexed biological, chemical, or taxonomic entity." },
  reference: { kind: "reference", label: "Reference", template: "reference", description: "Source-oriented record or reference index." },
  internal: { kind: "internal", label: "WikiBiome guide", template: "internal", description: "Project-level overview, methodology, or internal explanatory record." },
};

export function contentKindFor(page: WikiPage): ContentKind {
  if (page.category === "signature" || page.category === "disease") return "disease";
  if (page.category === "microbe") return "microbe";
  if (page.category === "metal") return "metal";
  if (page.category === "intervention") return "intervention";
  if (page.category === "stop") return "stop";
  if (page.category === "mechanism") return "mechanism";
  if (page.category === "defense") return "defense";
  if (page.category === "analysis" || page.type === "analysis" || page.type === "analyses") return "analysis";
  if (page.category === "reference" || page.type === "reference") return "reference";
  if (page.category === "entity" || page.type === "entities") return "entity";
  if (page.type === "concept") return "concept";
  return "internal";
}

export function contentSchemaFor(page: WikiPage) {
  return contentSchemas[contentKindFor(page)];
}

function headingId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function hasMarkdownTable(body: string) {
  const lines = body.split("\n").map((line) => line.trim()).filter(Boolean);
  return lines.length >= 2 && lines.every((line) => line.startsWith("|"));
}

export function sectionKindFor(section: WikiSection): SectionKind {
  const id = headingId(section.heading);
  if (/^(key-sources?|sources-used)$/.test(id)) return "source_index";
  if (/^(connections?|see-also|related-pages?|external-links)$/.test(id)) return "connections";
  if (/open-(questions?|research)|research-gaps?|unresolved-questions?/.test(id)) return "open_questions";
  if (/(dietary.*paradox|paradox.*dietary)/.test(id) || /^paradox-\d+/.test(id)) return "paradox_index";
  if (/(ecological-state|ecological-layer|system-state|dysbiosis-state)/.test(id)) return "ecology";
  if (hasMarkdownTable(section.body)) return /intervention|treatment|therapy/.test(id) ? "intervention_table" : "structured_table";
  if (/signature|evidence|findings|exposure-links?|vulnerability|pathway|mechanism/.test(id)) return "evidence";
  return "narrative";
}

export function sentenceLikeList(body: string) {
  const bullets = body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").trim());
  if (bullets.length < 2) return false;
  const sentenceLike = bullets.filter((line) => {
    const visible = line.replace(/\[\[[^\]]+\]\]/g, "").trim();
    return /[.!?]["')]*$/.test(visible) || visible.split(/\s+/).length >= 10;
  }).length;
  return sentenceLike / bullets.length >= 0.6;
}

export function shouldRenderAsProse(section: WikiSection) {
  const kind = sectionKindFor(section);
  if (["connections", "intervention_table", "open_questions", "paradox_index", "source_index", "structured_table"].includes(kind)) return false;
  return kind === "evidence" || kind === "ecology" || sentenceLikeList(section.body);
}

export function prepareArticleSections(page: WikiPage): PreparedSection[] {
  const prepared = (page.sections ?? [])
    .map((section) => ({ ...section, kind: sectionKindFor(section), renderAsProse: shouldRenderAsProse(section) }));
  return prepared.filter((section, index) => {
    if (section.kind === "source_index") return false;
    if (substantiveSectionBody(section.body ?? "")) return true;
    // Preserve an empty semantic parent when populated child sections follow;
    // suppress only empty leaves that would create blank article chrome.
    return Boolean(prepared[index + 1] && prepared[index + 1].level > section.level);
  });
}
