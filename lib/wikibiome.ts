import content from "@/data/content.generated.json";
import articleAliasRegistry from "@/data/article-id-aliases.json";
import sourceAliasRegistry from "@/data/source-id-aliases.json";

export type WikiSection = {
  heading: string;
  level: number;
  body: string;
};

export type WikiPage = {
  id: string;
  title: string;
  type: string;
  category: string;
  tags?: string[];
  sources?: string[];
  overview?: string;
  sections?: WikiSection[];
  frontmatter?: Record<string, unknown>;
  sourceCount?: number;
  threshold?: number;
  belowThreshold?: boolean;
  isStub?: boolean;
  created?: string;
  updated?: string;
  wikilinks?: string[];
  backlinks?: string[];
  related?: Array<{ id: string; score: number }>;
  sourceDir?: string;
  editorialStatus?: {
    group: string;
    disposition: "evidence_insufficient" | "source_structure_deferred" | "structural_exemption";
    approved: true;
    resolves: string[];
    rationale: string;
    publicLabel: string;
  };
};

export type SignatureTaxon = {
  taxon: string;
  role?: string;
};

export type DiseaseSignature = {
  id: string;
  name: string;
  paperCount: number;
  metallomicSignature: {
    elevated: string[];
    depleted: string[];
  };
  taxonomicSignature: {
    enriched: SignatureTaxon[];
    depleted: SignatureTaxon[];
  };
  nutritionalImmunity: {
    elevated: string[];
    depleted: string[];
  };
  ecologicalFeatures: string[];
  virulenceEnzymes: string[];
  curevaStatus: string;
  validatedInterventions: unknown[];
  stops: string[];
};

export type SourceRecord = {
  title: string;
  authors?: string[];
  year?: number;
  journal?: string;
  doi?: string;
  keystone?: boolean;
  keystone_criteria_met?: number[];
  why_keystone?: string;
};

export type WikiReference = SourceRecord & {
  id: string;
  number: number;
  title: string;
  missingMetadata: boolean;
};

export type EvidenceClaim = {
  id: string;
  pageId: string;
  section: string;
  text: string;
  citationIds: string[];
  citationNumbers: number[];
};

export type ArticleEvidence = {
  references: WikiReference[];
  citationNumbers: Record<string, number>;
  inlineCitationIds: string[];
  declaredSourceIds: string[];
  recoveredCitationIds: string[];
  declaredOnlyIds: string[];
  missingMetadataIds: string[];
  claims: EvidenceClaim[];
};

export type DiseaseRecord = {
  canonicalId: string;
  page: WikiPage;
  signaturePages: WikiPage[];
  signature: DiseaseSignature;
  evidence: ArticleEvidence;
  confidence: Record<string, string>;
  updated?: string;
  contentRecordCount: number;
};

export type ParadoxLink = {
  id: string;
  title: string;
  summary: string;
  canonical: boolean;
};

type WikiContent = {
  _generated: string;
  _stats: {
    sources: number;
    entities: number;
    concepts: number;
    signatures: number;
    interventions: number;
    stops: number;
    analyses: number;
    totalPages: number;
  };
  pages: WikiPage[];
  sourceLookup: Record<string, SourceRecord>;
  signatures: Record<string, DiseaseSignature>;
};

const wiki = content as WikiContent;
const canonicalSourceMap = Object.fromEntries(
  Object.entries(wiki.sourceLookup).map(([id, source]) => [normalizeWikiId(id), source]),
) as Record<string, SourceRecord>;
const sourceAliases = Object.fromEntries(
  Object.entries(sourceAliasRegistry.aliases).map(([alias, target]) => [normalizeWikiId(alias), normalizeWikiId(target)]),
) as Record<string, string>;
const articleAliases = Object.fromEntries(
  Object.entries(articleAliasRegistry.aliases).map(([alias, target]) => [normalizeWikiId(alias), normalizeWikiId(target)]),
) as Record<string, string>;
const sourceMap = { ...canonicalSourceMap };
for (const [alias, target] of Object.entries(sourceAliases)) {
  if (canonicalSourceMap[target]) sourceMap[alias] = canonicalSourceMap[target];
}
const paradoxLinksByPage = new Map<string, ParadoxLink[]>();
const canonicalParadoxByNumber = new Map<number, ParadoxLink>();
const virtualParadoxPages = buildVirtualParadoxPages();
const pageCollection = [...wiki.pages, ...virtualParadoxPages];
// Match the upstream renderer's `pages.find(...)` behavior: the first vault
// record wins when a duplicate slug exists, while the audit manifest exposes
// the collision for correction at the source.
const pageMap = new Map<string, WikiPage>();
const pagesById = new Map<string, WikiPage[]>();
for (const page of pageCollection) {
  if (!pageMap.has(page.id)) pageMap.set(page.id, page);
  pagesById.set(page.id, [...(pagesById.get(page.id) ?? []), page]);
}

export const wikiStats = wiki._stats;
export const generatedAt = wiki._generated;
export const allWikiPages = pageCollection;
export const upstreamWikiPages = wiki.pages;
export const allSources = canonicalSourceMap;

export const categories = [
  { id: "mechanism", label: "Mechanisms" },
  { id: "microbe", label: "Microorganisms" },
  { id: "disease", label: "Diseases" },
  { id: "signature", label: "Disease signatures" },
  { id: "metal", label: "Metals" },
  { id: "intervention", label: "Interventions" },
  { id: "defense", label: "Host defenses" },
  { id: "analysis", label: "Analyses" },
  { id: "stop", label: "Clinical cautions" },
  { id: "entity", label: "Entity indexes" },
] as const;

export function getWikiPage(id: string) {
  return pageMap.get(canonicalArticleAliasId(id));
}

export function getSource(id: string) {
  return sourceMap[canonicalSourceId(id)];
}

export function canonicalSourceId(id: string) {
  const normalized = normalizeWikiId(id);
  return sourceAliases[normalized] ?? normalized;
}

export function canonicalArticleId(id: string) {
  const normalized = canonicalArticleAliasId(id);
  const page = pageMap.get(normalized);
  if (page?.category === "signature") return getDiseaseRecord(normalized)?.canonicalId ?? normalized;
  return normalized;
}

export function canonicalArticleAliasId(id: string) {
  const normalized = normalizeWikiId(id);
  return articleAliases[normalized] ?? normalized;
}

export function getCategoryPages(category: string) {
  if (category === "signature") {
    const records = new Map<string, WikiPage>();
    for (const page of pageCollection.filter((item) => item.category === "signature")) {
      const canonicalId = canonicalDiseaseId(page.id);
      if (records.has(canonicalId)) continue;
      const disease = getDiseaseRecord(canonicalId);
      records.set(canonicalId, disease
        ? {
            ...disease.page,
            id: canonicalId,
            category: "signature",
            type: "signature",
            title: disease.page.title,
            sourceCount: disease.evidence.references.length,
            tags: unique([
              ...(disease.page.tags ?? []),
              ...disease.signaturePages.flatMap((item) => item.tags ?? []),
            ]),
          }
        : page);
    }
    return [...records.values()].sort((a, b) => a.title.localeCompare(b.title));
  }
  return pageCollection
    .filter((page) => page.category === category)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getCategoryCount(category: string) {
  return getCategoryPages(category).length;
}

export function resolveRelated(page: WikiPage, limit = 7) {
  const seen = new Set<string>();
  return (page.related ?? [])
    .map((item) => pageMap.get(canonicalArticleId(item.id)))
    .filter((item): item is WikiPage => {
      if (!item || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, limit);
}

export function searchWiki(query: string, limit = 80, category?: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const records = new Map<string, { page: WikiPage; searchPages: WikiPage[] }>();
  for (const page of pageCollection) {
    const disease = (page.category === "disease" || page.category === "signature")
      ? getDiseaseRecord(page.id)
      : undefined;
    const key = disease ? `disease:${disease.canonicalId}` : `page:${page.id}`;
    if (!records.has(key)) {
      records.set(key, disease
        ? { page: disease.page, searchPages: [disease.page, ...disease.signaturePages] }
        : { page, searchPages: [page] });
    }
  }

  return [...records.values()]
    .filter(({ page, searchPages }) => !category || category === "all" || page.category === category || searchPages.some((item) => item.category === category))
    .map(({ page, searchPages }) => {
      const title = page.title.toLowerCase();
      const haystack = searchPages.flatMap((item) => [
        item.title,
        item.category,
        ...(item.tags ?? []),
        item.overview ?? "",
        ...(item.sections ?? []).map((section) => section.heading),
      ])
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((total, term) => {
        if (title === term) return total + 20;
        if (title.startsWith(term)) return total + 12;
        if (title.includes(term)) return total + 7;
        return haystack.includes(term) ? total + 2 : total;
      }, 0);
      return { page, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title))
    .slice(0, limit)
    .map((result) => result.page);
}

export function findPagesUsingSource(sourceId: string, limit = 24) {
  const cleanSourceId = canonicalSourceId(sourceId);
  const matches = pageCollection
    .filter((page) => {
      const sources = [
        ...(page.sources ?? []),
        ...asStringArray(page.frontmatter?.sources),
      ].map(canonicalSourceId);
      const inlineSources = inlineWikiLinks([
        page.overview ?? "",
        ...(page.sections ?? []).map((section) => section.body),
      ].join("\n")).map(canonicalSourceId);
      return sources.includes(cleanSourceId) || inlineSources.includes(cleanSourceId);
    });
  const canonical = new Map<string, WikiPage>();
  for (const page of matches) {
    const disease = (page.category === "disease" || page.category === "signature")
      ? getDiseaseRecord(page.id)
      : undefined;
    const result = disease?.page ?? page;
    if (!canonical.has(result.id)) canonical.set(result.id, result);
  }
  return [...canonical.values()].slice(0, limit);
}

export function getParadoxLinksForPage(pageId: string) {
  return paradoxLinksByPage.get(normalizeWikiId(pageId)) ?? [];
}

export function getCanonicalParadox(number: number) {
  return canonicalParadoxByNumber.get(number);
}

function isDietaryParadoxSection(heading: string) {
  return /(?:dietary.*paradox|paradox.*dietary)/i.test(heading);
}

function stripDivider(body: string) {
  return body.replace(/(?:^|\n)---\s*$/g, "").trim();
}

function childSections(sections: WikiSection[], index: number) {
  const root = sections[index];
  const end = sections.findIndex((section, sectionIndex) => sectionIndex > index && section.level <= root.level);
  return sections.slice(index + 1, end >= 0 ? end : sections.length);
}

function splitParadoxItem(source: string) {
  const content = source.replace(/^-\s*/, "").trim();
  const topicSentence = content.match(/^((?:The|A|An)\s+[^.]{2,100}?(?:paradox|question|dilemma|trap|switch|fork|problem|confound|reversal|loop))\.\s*(.*)$/i);
  if (topicSentence) return { title: topicSentence[1], body: topicSentence[2] || topicSentence[1] };
  const divider = content.indexOf(":");
  if (divider > 0 && divider <= 100) return { title: content.slice(0, divider).trim(), body: content.slice(divider + 1).trim() };
  return { title: "", body: content };
}

function extractedParadoxItems(root: WikiSection, subsections: WikiSection[]) {
  if (subsections.length) return subsections.map((section) => ({ title: section.heading, body: stripDivider(section.body) }));
  const blocks = root.body.split(/\n\s*\n/).map(stripDivider).filter(Boolean);
  const bulletBlocks = blocks.filter((block) => block.split("\n").filter(Boolean).every((line) => line.trim().startsWith("- ")));
  if (bulletBlocks.length) {
    return bulletBlocks.flatMap((block) => block.split("\n").map((line) => splitParadoxItem(line)).filter((item) => item.body));
  }
  const proseItems = blocks.map(splitParadoxItem);
  return proseItems.length > 1 && proseItems.every((item) => item.title)
    ? proseItems
    : [{ title: root.heading, body: stripDivider(root.body) }];
}

function inlineWikiLinks(text: string) {
  return unique([...text.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)].map((match) => normalizeWikiId(match[1])).filter(Boolean));
}

function paradoxSummary(body: string) {
  const withoutCitations = body.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, id: string, label: string) => {
    const normalized = normalizeWikiId(id);
    if (normalized in sourceMap) return "";
    return label || id.replace(/-/g, " ");
  });
  return plainText(withoutCitations).replace(/\s+([,.;:])/g, "$1").replace(/\s*---\s*$/, "").slice(0, 210);
}

function canonicalParadoxNumber(title: string, body: string) {
  const text = plainText(`${title} ${body}`).toLowerCase();
  const hasNickel = /\bnickel\b|\bni(?:2\+)?\b/.test(text);
  const hasZinc = /\bzinc\b|\bzn(?:2\+)?\b/.test(text);
  const hasIron = /\biron\b|\bfe(?:2\+|3\+)?\b/.test(text);
  const hasChromium = /\bchromium\b|\bcr(?:\(iii\)|\(vi\)|3\+|6\+)?\b/.test(text);
  const hasCopper = /\bcopper\b|\bcu(?:2\+)?\b/.test(text);
  const hasMercury = /\bmercury\b|\bmethylmercury\b|\bmehg\b|\bhg\b/.test(text);

  if (/(plant-based|plant-forward|plant-heavy|mediterranean|healthy\W+foods|fiber|anti-inflammatory)/.test(text) && (hasNickel || /metal exposure|metal content|metals? from soil/.test(text))) return 1;
  if (/(gluten-free|\bgfd\b|celiac)/.test(text) && hasNickel) return 2;
  if (hasZinc && /(endometriosis|\bmmp|metalloproteinase|tissue invasion)/.test(text)) return 3;
  if (hasIron && /(supplement|anemia|hepcidin|ferroptosis|fenton)/.test(text)) return 4;
  if (/(ascorbate|vitamin c)/.test(text) && hasChromium) return 5;
  if (hasCopper && /(brain|peripheral|serum|trafficking|everywhere)/.test(text)) return 6;
  if (/fish/.test(text) && (hasMercury || /omega-3|\bdha\b/.test(text))) return 7;
  if (/probiotic/.test(text) && /(bind|sequester|sponge|trace element)/.test(text)) return 8;
  if (hasNickel && /(commensal|restriction|low-nickel|collateral|dysbiosis)/.test(text)) return 9;
  return 0;
}

function isParadoxicalItem(title: string, body: string) {
  return /paradox|dilemma|conflict|however|\byet\b|\bbut\b|opposite|trade[- ]off|counter|backfire|dual|worsen|\bloop\b/i.test(`${title} ${body}`);
}

function buildVirtualParadoxPages() {
  const generated: WikiPage[] = [];
  const master = wiki.pages.find((page) => page.id === "dietary-metal-paradoxes");
  if (!master) return generated;

  const masterSections = master.sections ?? [];
  const canonicalPages = new Map<number, WikiPage>();
  masterSections.forEach((root, index) => {
    const match = root.heading.match(/^Paradox\s+(\d+)\s*:\s*(.*)$/i);
    if (!match) return;
    const number = Number(match[1]);
    const title = match[2].trim();
    const subsections = childSections(masterSections, index);
    const contradiction = subsections.find((section) => /^the contradiction$/i.test(section.heading));
    const overview = stripDivider(contradiction?.body || root.body || `A dietary metal paradox documented by WikiBiome.`);
    const detailSections = subsections.filter((section) => section !== contradiction).map((section) => ({ ...section, body: stripDivider(section.body) }));
    const allText = [overview, ...detailSections.map((section) => section.body)].join("\n");
    const id = `paradox-${normalizeWikiId(title.replace(/^the\s+/i, "")).replace(/-+/g, "-")}`;
    const page: WikiPage = {
      id,
      title,
      type: "paradox",
      category: "analysis",
      overview,
      sections: detailSections,
      tags: unique([...(master.tags ?? []), "dietary-paradox", `paradox-${number}`]),
      created: master.created,
      updated: master.updated,
      wikilinks: unique(["dietary-metal-paradoxes", ...inlineWikiLinks(allText)]),
      backlinks: ["dietary-metal-paradoxes"],
      related: [{ id: "dietary-metal-paradoxes", score: 1 }],
      frontmatter: { generated_from: master.id, paradox_number: number },
    };
    generated.push(page);
    canonicalPages.set(number, page);
    const link = { id, title, summary: paradoxSummary(overview), canonical: true };
    canonicalParadoxByNumber.set(number, link);
  });

  paradoxLinksByPage.set(master.id, [...canonicalParadoxByNumber.values()]);

  for (const sourcePage of wiki.pages) {
    if (sourcePage.id === master.id) continue;
    const sections = sourcePage.sections ?? [];
    const links: ParadoxLink[] = [];
    sections.forEach((root, index) => {
      if (!isDietaryParadoxSection(root.heading)) return;
      const items = extractedParadoxItems(root, childSections(sections, index));
      for (const item of items) {
        const canonicalNumber = canonicalParadoxNumber(item.title, item.body);
        const canonicalLink = canonicalParadoxByNumber.get(canonicalNumber);
        if (canonicalLink) {
          links.push(canonicalLink);
          continue;
        }
        if (!isParadoxicalItem(item.title, item.body)) continue;

        const contextTitle = plainText(item.title || root.heading).replace(/^Paradox\s+\d+\s*:\s*/i, "");
        const id = `paradox-${sourcePage.id}-${normalizeWikiId(contextTitle).replace(/-+/g, "-")}`;
        if (!generated.some((page) => page.id === id)) {
          const overview = stripDivider(item.body);
          const page: WikiPage = {
            id,
            title: `${contextTitle} — ${sourcePage.title}`,
            type: "paradox",
            category: "analysis",
            overview,
            sections: [{ heading: "Source context", level: 2, body: `This paradox is indexed from the dietary metal analysis in [[${sourcePage.id}|${sourcePage.title}]].` }],
            tags: unique([...(sourcePage.tags ?? []), "dietary-paradox", "contextual-paradox"]),
            created: sourcePage.created,
            updated: sourcePage.updated,
            wikilinks: unique([sourcePage.id, "dietary-metal-paradoxes", ...inlineWikiLinks(overview)]),
            backlinks: [sourcePage.id],
            related: [{ id: sourcePage.id, score: 1 }, { id: "dietary-metal-paradoxes", score: 0.8 }],
            frontmatter: { generated_from: sourcePage.id, contextual_paradox: true },
          };
          generated.push(page);
        }
        links.push({ id, title: contextTitle, summary: paradoxSummary(item.body), canonical: false });
      }
    });

    const uniqueLinks = [...new Map(links.map((link) => [link.id, link])).values()];
    if (uniqueLinks.length) paradoxLinksByPage.set(sourcePage.id, uniqueLinks);
  }

  for (const [sourceId, links] of paradoxLinksByPage) {
    for (const link of links) {
      const page = generated.find((candidate) => candidate.id === link.id);
      if (page && !page.backlinks?.includes(sourceId)) page.backlinks = [...(page.backlinks ?? []), sourceId];
    }
  }
  return generated;
}

/**
 * Build an article's evidence model from the same inputs as the upstream
 * WikiBiome renderer: inline wikilinks first, then declared frontmatter
 * sources. Numbering is deterministic and follows first appearance.
 */
export function generateArticleEvidence(page: WikiPage): ArticleEvidence {
  return generateCompositeEvidence([page]);
}

/**
 * Reconcile references across several vault records into one stable evidence
 * sequence. Disease pages use this to preserve both the disease narrative and
 * every paired signature record without duplicating citations.
 */
export function generateCompositeEvidence(pages: WikiPage[]): ArticleEvidence {
  const citationNumbers: Record<string, number> = {};
  const inlineCitationIds: string[] = [];
  const sourceRegex = /\[?\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]\]?/g;
  for (const page of pages) {
    const allText = [
      page.overview ?? "",
      ...(page.sections ?? []).map((section) => section.body),
    ].join("\n");
    let match: RegExpExecArray | null;

    while ((match = sourceRegex.exec(allText)) !== null) {
      const rawId = normalizeWikiId(match[1]);
      if (!rawId || pageMap.has(rawId) || !isSourceReference(rawId)) continue;
      const id = canonicalSourceId(rawId);
      if (!(id in citationNumbers)) {
        citationNumbers[id] = Object.keys(citationNumbers).length + 1;
        inlineCitationIds.push(id);
      }
    }
  }

  const declaredSourceIds = unique([
    ...pages.flatMap((page) => page.sources ?? []),
    ...pages.flatMap((page) => asStringArray(page.frontmatter?.sources)),
  ].map(canonicalSourceId).filter(Boolean));

  for (const id of declaredSourceIds) {
    if (!(id in citationNumbers)) {
      citationNumbers[id] = Object.keys(citationNumbers).length + 1;
    }
  }

  const references = Object.entries(citationNumbers)
    .sort((a, b) => a[1] - b[1])
    .map(([id, number]) => {
      const source = sourceMap[id];
      return {
        id,
        number,
        title: source?.title ?? id.replace(/-/g, " "),
        authors: source?.authors ?? [],
        year: source?.year,
        journal: source?.journal,
        doi: source?.doi,
        keystone: source?.keystone,
        keystone_criteria_met: source?.keystone_criteria_met,
        why_keystone: source?.why_keystone,
        missingMetadata: !source,
      };
    });

  const declaredSet = new Set(declaredSourceIds);
  const inlineSet = new Set(inlineCitationIds);
  const claims = extractEvidenceClaims(pages, citationNumbers);
  return {
    references,
    citationNumbers,
    inlineCitationIds,
    declaredSourceIds,
    recoveredCitationIds: inlineCitationIds.filter((id) => !declaredSet.has(id)),
    declaredOnlyIds: declaredSourceIds.filter((id) => !inlineSet.has(id)),
    missingMetadataIds: references.filter((reference) => reference.missingMetadata).map((reference) => reference.id),
    claims,
  };
}

function extractEvidenceClaims(pages: WikiPage[], citationNumbers: Record<string, number>) {
  const claims: EvidenceClaim[] = [];
  for (const page of pages) {
    const passages = [
      { section: "Introduction", body: page.overview ?? "" },
      ...(page.sections ?? []).map((section) => ({ section: section.heading, body: section.body ?? "" })),
    ];
    let pageClaimIndex = 0;
    for (const passage of passages) {
      const blocks = passage.body
        .split(/\n\s*\n|\n(?=(?:[-*]\s+|\d+[.)]\s+))/)
        .map((block) => block.trim())
        .filter(Boolean);
      for (const block of blocks) {
        const citationIds = unique([...block.matchAll(/\[?\[([^\]|]+?)(?:\|[^\]]+)?\]\]?/g)]
          .map((match) => normalizeWikiId(match[1]))
          .filter((id) => !pageMap.has(id) && isSourceReference(id))
          .map(canonicalSourceId)
          .filter((id) => Boolean(citationNumbers[id])));
        if (!citationIds.length) continue;
        const visible = plainText(block
          .replace(/\[?\[([^\]|]+?)(?:\|[^\]]+)?\]\]?/g, (match, rawId: string) => {
            const id = canonicalSourceId(rawId);
            return citationNumbers[id] ? "" : match;
          })
          .replace(/^(?:[-*]\s+|\d+[.)]\s*)/, ""))
          .replace(/\s+([,.;:])/g, "$1")
          .trim();
        if (!visible) continue;
        pageClaimIndex += 1;
        claims.push({
          id: `${page.id}-claim-${pageClaimIndex}`,
          pageId: page.id,
          section: passage.section,
          text: visible.slice(0, 360),
          citationIds,
          citationNumbers: citationIds.map((id) => citationNumbers[id]).filter(Boolean),
        });
      }
    }
  }
  return claims;
}

export function canonicalDiseaseId(id: string) {
  return normalizeWikiId(id).replace(/-signature$/, "");
}

export function getDiseaseRecord(id: string): DiseaseRecord | undefined {
  const canonicalId = canonicalDiseaseId(id);
  const diseasePage = (pagesById.get(canonicalId) ?? []).find((page) => page.category === "disease");
  if (!diseasePage) return undefined;

  const signaturePages = wiki.pages.filter((page) =>
    page.category === "signature" && canonicalDiseaseId(page.id) === canonicalId,
  );
  const structured = Object.entries(wiki.signatures ?? {})
    .filter(([signatureId]) => canonicalDiseaseId(signatureId) === canonicalId)
    .map(([, signature]) => signature);
  const evidence = generateCompositeEvidence([diseasePage, ...signaturePages]);
  const confidence = Object.assign(
    {},
    ...signaturePages.map((page) => asStringRecord(page.frontmatter?.confidence)),
  );
  const updated = [diseasePage, ...signaturePages]
    .map((page) => page.updated)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  return {
    canonicalId,
    page: diseasePage,
    signaturePages,
    signature: mergeDiseaseSignatures(canonicalId, diseasePage.title, structured),
    evidence,
    confidence,
    updated,
    contentRecordCount: 1 + signaturePages.length,
  };
}

export const diseaseReconciliationStats = (() => {
  const signatureIds = unique(
    wiki.pages.filter((page) => page.category === "signature").map((page) => canonicalDiseaseId(page.id)),
  );
  return {
    diseasePages: wiki.pages.filter((page) => page.category === "disease").length,
    signatureFamilies: signatureIds.length,
    pairedRecords: signatureIds.filter((id) => Boolean(getDiseaseRecord(id))).length,
  };
})();

export function getMentionedPages(page: WikiPage, limit = 24) {
  const ids = unique((page.wikilinks ?? []).map(normalizeWikiId));
  const seen = new Set<string>();
  return ids
    .map((id) => pageMap.get(canonicalArticleId(id)))
    .filter((item): item is WikiPage => {
      if (!item || item.id === page.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, limit);
}

export function getBacklinkPages(page: WikiPage, limit = 24) {
  const seen = new Set<string>();
  return unique((page.backlinks ?? []).map(normalizeWikiId))
    .map((id) => pageMap.get(canonicalArticleId(id)))
    .filter((item): item is WikiPage => {
      if (!item || item.id === page.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, limit);
}

export function relationshipExplanation(from: WikiPage, to: WikiPage) {
  const fromTags = new Set((from.tags ?? []).map((tag) => tag.toLowerCase()));
  const sharedTags = (to.tags ?? []).filter((tag) => fromTags.has(tag.toLowerCase())).slice(0, 2);
  const fromMentionsTo = (from.wikilinks ?? []).map(normalizeWikiId).includes(to.id);
  const toMentionsFrom = (to.wikilinks ?? []).map(normalizeWikiId).includes(from.id);
  if (fromMentionsTo && toMentionsFrom) return "Mutually connected records";
  if (fromMentionsTo) return `Referenced in this ${categoryLabel(from.category).toLowerCase()} record`;
  if (toMentionsFrom) return `Links back from its ${categoryLabel(to.category).toLowerCase()} record`;
  if (sharedTags.length) return `Shared topics: ${sharedTags.join(" · ")}`;
  return `${categoryLabel(to.category)} relationship`;
}

export function normalizeDoi(value?: string) {
  const raw = value?.trim() ?? "";
  if (!raw || /^not yet verified$/i.test(raw)) {
    return { raw, bare: "", href: "", status: "unverified" as const };
  }
  const bare = raw
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .replace(/[.,;:\s]+$/g, "")
    .trim();
  const valid = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9<>+]+$/.test(bare);
  return {
    raw,
    bare,
    href: valid ? `https://doi.org/${bare}` : "",
    status: valid ? "valid" as const : "malformed" as const,
  };
}

export function normalizeWikiId(id: string) {
  return cleanId(id)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function cleanId(id: string) {
  return id.replace(/\.md$/i, "");
}

export function formatDate(value?: string) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function categoryLabel(category: string) {
  return categories.find((item) => item.id === category)?.label ??
    category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function plainText(value = "") {
  return value
    .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_match, id: string, label: string) => label || id.replace(/-/g, " "))
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asStringRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}

function mergeDiseaseSignatures(canonicalId: string, name: string, signatures: DiseaseSignature[]): DiseaseSignature {
  const mergeTaxa = (key: "enriched" | "depleted") => {
    const taxa = new Map<string, SignatureTaxon>();
    for (const signature of signatures) {
      for (const declaredKey of ["enriched", "depleted"] as const) {
        for (const item of signature.taxonomicSignature?.[declaredKey] ?? []) {
          const taxon = typeof item === "string" ? item : item.taxon;
          const role = typeof item === "string" ? "" : item.role;
          const explicitlyDepleted = /^\s*depleted\b|\bdepleted\s+in\b/i.test(role ?? "");
          const explicitlyEnriched = /^\s*enriched\b|\benriched\s+in\b/i.test(role ?? "");
          const resolvedKey = explicitlyDepleted ? "depleted" : explicitlyEnriched ? "enriched" : declaredKey;
          if (resolvedKey !== key) continue;
          const id = normalizeWikiId(taxon.replace(/^\[\[|\]\]$/g, "").split("|")[0]);
          const previous = taxa.get(id);
          if (!previous || (role?.length ?? 0) > (previous.role?.length ?? 0)) {
            taxa.set(id, { taxon, role });
          }
        }
      }
    }
    return [...taxa.values()];
  };
  const strings = (pick: (signature: DiseaseSignature) => string[]) => unique(signatures.flatMap(pick));

  return {
    id: canonicalId,
    name,
    paperCount: Math.max(0, ...signatures.map((signature) => signature.paperCount ?? 0)),
    metallomicSignature: {
      elevated: strings((signature) => signature.metallomicSignature?.elevated ?? []),
      depleted: strings((signature) => signature.metallomicSignature?.depleted ?? []),
    },
    taxonomicSignature: {
      enriched: mergeTaxa("enriched"),
      depleted: mergeTaxa("depleted"),
    },
    nutritionalImmunity: {
      elevated: strings((signature) => signature.nutritionalImmunity?.elevated ?? []),
      depleted: strings((signature) => signature.nutritionalImmunity?.depleted ?? []),
    },
    ecologicalFeatures: strings((signature) => signature.ecologicalFeatures ?? []),
    virulenceEnzymes: strings((signature) => signature.virulenceEnzymes ?? []),
    curevaStatus: signatures.map((signature) => signature.curevaStatus).find((status) => status && status !== "unknown") ?? "unknown",
    validatedInterventions: signatures.flatMap((signature) => signature.validatedInterventions ?? []),
    stops: strings((signature) => signature.stops ?? []),
  };
}

function isSourceReference(id: string) {
  return canonicalSourceId(id) in sourceMap || /^[a-z]+-(?:[a-z]+-)*\d{4}-/.test(id);
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}
