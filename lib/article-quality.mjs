// WIKIBIOME-BUILDOUT-1. This policy reads the existing vault-derived corpus;
// it never generates prose, citations, or a second publication path.
export const MIN_BODY_WORDS = 400;
export const MIN_REAL_REFERENCES = 3;

export const PLACEHOLDER_PATTERN = /\b(?:to be populated|needs to be populated|no triangles populated yet|sources discussing this intervention need to be reviewed|to be added|to be written|to be completed|coming soon|placeholder|being expanded from the evidence base|TODO|TBD|lorem ipsum)\b/i;

export function removePlaceholderText(value = "") {
  if (!PLACEHOLDER_PATTERN.test(value)) return value;
  return String(value).split(/\n\s*\n/).flatMap((block) => {
    if (!PLACEHOLDER_PATTERN.test(block)) return [block];
    return block.split(/(?<=[.!?])\s+/).filter((sentence) => !PLACEHOLDER_PATTERN.test(sentence));
  }).join("\n\n").trim();
}

export function visibleBodyText(page, citationIds = []) {
  const citations = new Set(citationIds);
  const sections = (page.sections ?? []).filter(({ heading }) => !/^(?:key sources?|sources used|references|connections?|cross.references|see also|related pages?|external links)$/i.test(heading));
  return [page.overview ?? "", ...sections.map(({ body }) => body ?? "")].join("\n")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\[?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]\]?/g, (_, id, label) => citations.has(id.toLowerCase()) ? " " : label ?? id.replaceAll("-", " "))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>|https?:\/\/\S+/g, " ")
    .replace(/^[ \t]*[#>|*`~=-]+[ \t]*/gm, " ")
    .replace(/\s+/g, " ").trim();
}

export function bodyWordCount(text) {
  return (text.match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu) ?? []).length;
}

export function realReferenceKeys(references) {
  return [...new Set(references.flatMap((reference) => {
    if (reference.missingMetadata || !reference.title?.trim() || PLACEHOLDER_PATTERN.test(reference.title)) return [];
    // Karen's own work cannot qualify a page for indexing.
    if (/pendergrass|karenpendergrass/i.test([reference.id, ...(reference.authors ?? [])].join(" "))) return [];
    const doi = String(reference.doi ?? "").replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").trim();
    if (/^10\.\d{4,9}\/\S+$/i.test(doi)) return [`doi:${doi.toLowerCase()}`];
    if (reference.authors?.length && Number.isInteger(reference.year) && reference.journal?.trim()) return [`title:${reference.title.toLowerCase().trim()}`];
    return [];
  }))];
}

export function articleQuality(page, references, statuses = [page.editorialStatus]) {
  const text = visibleBodyText(page, references.map(({ id }) => id));
  const bodyWords = bodyWordCount(text);
  const realReferences = realReferenceKeys(references).length;
  const raw = [page.title, page.overview, ...(page.sections ?? []).flatMap(({ heading, body }) => [heading, body])].join("\n").replace(/<!--[\s\S]*?-->/g, "");
  const reasons = [];
  if (["intervention", "stop"].includes(page.category)) reasons.push("excluded-section");
  if (bodyWords < MIN_BODY_WORDS) reasons.push("under-400-body-words");
  if (realReferences < MIN_REAL_REFERENCES) reasons.push("under-3-real-references");
  if (PLACEHOLDER_PATTERN.test(raw)) reasons.push("placeholder-text");
  if (statuses.some((status) => status?.disposition === "evidence_insufficient" || /evidence[\s-]limited/i.test(status?.publicLabel ?? ""))) reasons.push("evidence-limited");
  const realReferenceNumbers = references.filter((reference) => realReferenceKeys([reference]).length).map(({ number }) => number);
  return { bodyWords, realReferences, realReferenceNumbers, reasons, eligible: reasons.length === 0 };
}
