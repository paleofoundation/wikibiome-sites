import content from "@/data/content.generated.json";
import {
  allSources,
  canonicalArticleId,
  findPagesUsingSource,
  getDiseaseRecord,
  getWikiPage,
  normalizeDoi,
  normalizeWikiId,
  relationshipExplanation,
  type DiseaseSignature,
  type WikiPage,
} from "@/lib/wikibiome";

export const KEYSTONE_CRITERIA = [
  { id: 1, title: "Cross-domain bridge", description: "Connects scientific domains whose literatures would otherwise remain separate." },
  { id: 2, title: "Structural dependency", description: "Supports a page or evidence layer that would become materially weaker if the study were removed." },
  { id: 3, title: "Cross-condition reach", description: "Provides connective evidence used across more than one disease or biological context." },
  { id: 4, title: "Mechanistic explanation", description: "Explains why an association exists rather than reporting correlation alone." },
  { id: 5, title: "Interpretive change", description: "Changes how WikiBiome organizes or explains an organism, exposure, disease, or ecological process." },
] as const;

export type KeystoneStudy = {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  journal?: string;
  doi?: string;
  criteria: number[];
  rationale: string;
  usedBy: WikiPage[];
  metadataStatus: "verified DOI" | "DOI review needed" | "metadata review needed";
};

export function getKeystoneStudies(criterion?: number) {
  return Object.entries(allSources)
    .filter(([, source]) => source.keystone)
    .map(([id, source]): KeystoneStudy => {
      const normalizedDoi = normalizeDoi(source.doi);
      const doiPending = normalizedDoi.status !== "valid";
      return {
        id,
        title: source.title,
        authors: source.authors ?? [],
        year: source.year,
        journal: source.journal,
        doi: normalizedDoi.status === "valid" ? normalizedDoi.bare : undefined,
        criteria: source.keystone_criteria_met ?? [],
        rationale: source.why_keystone ?? "Editorial rationale is awaiting completion.",
        usedBy: findPagesUsingSource(id, 200),
        metadataStatus: !source.title || !(source.authors?.length)
          ? "metadata review needed"
          : doiPending
            ? "DOI review needed"
            : "verified DOI",
      };
    })
    .filter((study) => !criterion || study.criteria.includes(criterion))
    .sort((a, b) => b.usedBy.length - a.usedBy.length || b.criteria.length - a.criteria.length || a.title.localeCompare(b.title));
}

type RawGraph = {
  graph: {
    nodes: Array<{ id: string; label: string; category: string; sourceCount?: number }>;
    links: Array<{ source: string; target: string }>;
  };
};

export type GraphNode = {
  id: string;
  label: string;
  category: string;
  sourceCount: number;
  degree: number;
  depth: number;
};

export type GraphLink = { source: string; target: string };

const rawGraph = (content as unknown as RawGraph).graph;
const graphNodeMap = new Map<string, Omit<GraphNode, "degree" | "depth">>();

for (const node of rawGraph.nodes) {
  const canonicalId = canonicalArticleId(node.id);
  const page = getWikiPage(canonicalId) ?? getWikiPage(node.id);
  if (!page) continue;
  const existing = graphNodeMap.get(canonicalId);
  graphNodeMap.set(canonicalId, {
    id: canonicalId,
    label: page.title || node.label,
    category: page.category === "signature" ? "disease" : page.category,
    sourceCount: Math.max(existing?.sourceCount ?? 0, page.sourceCount ?? node.sourceCount ?? 0),
  });
}

const graphEdgeMap = new Map<string, GraphLink>();
for (const link of rawGraph.links) {
  const source = canonicalArticleId(link.source);
  const target = canonicalArticleId(link.target);
  if (source === target || !graphNodeMap.has(source) || !graphNodeMap.has(target)) continue;
  const [a, b] = [source, target].sort();
  graphEdgeMap.set(`${a}|${b}`, { source: a, target: b });
}

const graphLinks = [...graphEdgeMap.values()];
const graphAdjacency = new Map<string, Set<string>>();
for (const link of graphLinks) {
  graphAdjacency.set(link.source, new Set([...(graphAdjacency.get(link.source) ?? []), link.target]));
  graphAdjacency.set(link.target, new Set([...(graphAdjacency.get(link.target) ?? []), link.source]));
}

export const knowledgeGraphStats = {
  nodes: graphNodeMap.size,
  connections: graphLinks.length,
};

export const graphArticleOptions = [...graphNodeMap.values()]
  .sort((a, b) => a.label.localeCompare(b.label));

function graphNodeScore(id: string) {
  const node = graphNodeMap.get(id);
  return (node?.sourceCount ?? 0) * 3 + (graphAdjacency.get(id)?.size ?? 0);
}

export function resolveGraphFocus(value?: string) {
  const normalized = normalizeWikiId(value ?? "");
  if (graphNodeMap.has(normalized)) return normalized;
  const exactTitle = graphArticleOptions.find((node) => normalizeWikiId(node.label) === normalized);
  return exactTitle?.id ?? (graphNodeMap.has("nickel") ? "nickel" : graphArticleOptions[0]?.id);
}

export function getKnowledgeNeighborhood(value?: string, limit = 36) {
  const focusId = resolveGraphFocus(value);
  if (!focusId) return { focus: undefined, nodes: [] as GraphNode[], links: [] as GraphLink[], directConnections: [] as Array<{ node: GraphNode; explanation: string }> };

  const selected = new Set([focusId]);
  const depths = new Map([[focusId, 0]]);
  const direct = [...(graphAdjacency.get(focusId) ?? [])].sort((a, b) => graphNodeScore(b) - graphNodeScore(a));
  for (const id of direct.slice(0, Math.min(18, limit - 1))) {
    selected.add(id);
    depths.set(id, 1);
  }

  for (const parent of direct) {
    if (selected.size >= limit) break;
    const secondDegree = [...(graphAdjacency.get(parent) ?? [])]
      .filter((id) => id !== focusId && !selected.has(id))
      .sort((a, b) => graphNodeScore(b) - graphNodeScore(a));
    for (const id of secondDegree.slice(0, 2)) {
      if (selected.size >= limit) break;
      selected.add(id);
      depths.set(id, 2);
    }
  }

  const links = graphLinks.filter((link) => selected.has(link.source) && selected.has(link.target));
  const nodes = [...selected].map((id): GraphNode => {
    const node = graphNodeMap.get(id)!;
    return { ...node, degree: graphAdjacency.get(id)?.size ?? 0, depth: depths.get(id) ?? 2 };
  });
  const focus = nodes.find((node) => node.id === focusId);
  const directConnections = nodes
    .filter((node) => node.depth === 1)
    .sort((a, b) => b.sourceCount - a.sourceCount || a.label.localeCompare(b.label))
    .map((node) => ({
      node,
      explanation: focus
        ? relationshipExplanation(getWikiPage(focus.id)!, getWikiPage(node.id)!)
        : "Indexed relationship",
    }));
  return { focus, nodes, links, directConnections };
}

export type ConditionSummary = {
  id: string;
  name: string;
  signalCount: number;
  referenceCount: number;
  signature: DiseaseSignature;
  sourceIds: string[];
};

type Signal = { id: string; label: string; pageId?: string };
type LayerDefinition = { id: string; title: string; weight: number; select: (signature: DiseaseSignature) => string[] };

const comparisonLayers: LayerDefinition[] = [
  { id: "metals-elevated", title: "Metals elevated or accumulated", weight: 1.25, select: (s) => s.metallomicSignature.elevated },
  { id: "metals-depleted", title: "Metals depleted or redistributed", weight: 1.25, select: (s) => s.metallomicSignature.depleted },
  { id: "taxa-enriched", title: "Taxa enriched", weight: 1.5, select: (s) => s.taxonomicSignature.enriched.map((item) => item.taxon) },
  { id: "taxa-depleted", title: "Taxa depleted", weight: 1.5, select: (s) => s.taxonomicSignature.depleted.map((item) => item.taxon) },
  { id: "immunity-elevated", title: "Host response elevated", weight: 0.75, select: (s) => s.nutritionalImmunity.elevated },
  { id: "immunity-depleted", title: "Host response depleted", weight: 0.75, select: (s) => s.nutritionalImmunity.depleted },
  { id: "ecology", title: "Ecological state", weight: 1, select: (s) => s.ecologicalFeatures },
  { id: "virulence", title: "Virulence and functional enzymes", weight: 1, select: (s) => s.virulenceEnzymes },
];

function cleanSignal(value: string) {
  return value.replace(/\[\[|\]\]/g, "").split("|")[0].trim();
}

function signal(value: string): Signal {
  const raw = cleanSignal(value);
  const id = normalizeWikiId(raw);
  const page = getWikiPage(id);
  const label = page?.title ?? raw.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return { id, label, pageId: page ? canonicalArticleId(page.id) : undefined };
}

function signatureSignalCount(signature: DiseaseSignature) {
  return comparisonLayers.reduce((total, layer) => total + new Set(layer.select(signature).map((item) => signal(item).id)).size, 0);
}

const conditionMap = new Map<string, ConditionSummary>();
for (const id of Object.keys((content as unknown as { signatures: Record<string, DiseaseSignature> }).signatures ?? {})) {
  const canonicalId = normalizeWikiId(id).replace(/-signature$/, "");
  if (conditionMap.has(canonicalId)) continue;
  const record = getDiseaseRecord(canonicalId);
  if (!record) continue;
  const signalCount = signatureSignalCount(record.signature);
  if (!signalCount) continue;
  conditionMap.set(canonicalId, {
    id: canonicalId,
    name: record.page.title,
    signalCount,
    referenceCount: record.evidence.references.length,
    signature: record.signature,
    sourceIds: record.evidence.references.map((reference) => reference.id),
  });
}

export const conditionOptions = [...conditionMap.values()]
  .sort((a, b) => a.name.localeCompare(b.name));

export function resolveCondition(value?: string, fallback = "alzheimers-disease") {
  const normalized = normalizeWikiId(value ?? "").replace(/-signature$/, "");
  if (conditionMap.has(normalized)) return conditionMap.get(normalized)!;
  return conditionMap.get(fallback) ?? conditionOptions[0];
}

export type LayerComparison = {
  id: string;
  title: string;
  shared: Signal[];
  onlyA: Signal[];
  onlyB: Signal[];
};

export type ConditionComparison = {
  a: ConditionSummary;
  b: ConditionSummary;
  score: number;
  sharedCount: number;
  sharedSourceCount: number;
  layers: LayerComparison[];
};

export function compareConditions(aValue?: string, bValue?: string): ConditionComparison | undefined {
  const a = resolveCondition(aValue);
  const b = resolveCondition(bValue, "parkinsons-disease");
  if (!a || !b) return undefined;
  let sharedWeight = 0;
  let unionWeight = 0;
  let sharedCount = 0;

  const layers = comparisonLayers.map((layer): LayerComparison => {
    const aSignals = new Map(layer.select(a.signature).map((item) => { const value = signal(item); return [value.id, value]; }));
    const bSignals = new Map(layer.select(b.signature).map((item) => { const value = signal(item); return [value.id, value]; }));
    const shared = [...aSignals.entries()].filter(([id]) => bSignals.has(id)).map(([, item]) => item);
    const onlyA = [...aSignals.entries()].filter(([id]) => !bSignals.has(id)).map(([, item]) => item);
    const onlyB = [...bSignals.entries()].filter(([id]) => !aSignals.has(id)).map(([, item]) => item);
    const union = new Set([...aSignals.keys(), ...bSignals.keys()]);
    sharedWeight += shared.length * layer.weight;
    unionWeight += union.size * layer.weight;
    sharedCount += shared.length;
    return { id: layer.id, title: layer.title, shared, onlyA, onlyB };
  });

  const bSources = new Set(b.sourceIds);
  return {
    a,
    b,
    score: unionWeight ? Math.round((sharedWeight / unionWeight) * 100) : 0,
    sharedCount,
    sharedSourceCount: a.sourceIds.filter((id) => bSources.has(id)).length,
    layers,
  };
}

export const conditionPairs = (() => {
  const pairs: ConditionComparison[] = [];
  conditionOptions.forEach((a, index) => {
    conditionOptions.slice(index + 1).forEach((b) => {
      const comparison = compareConditions(a.id, b.id);
      if (comparison?.sharedCount) pairs.push(comparison);
    });
  });
  return pairs.sort((a, b) => b.score - a.score || b.sharedCount - a.sharedCount || a.a.name.localeCompare(b.a.name));
})();

export function getConditionNeighborhood(value?: string, limit = 10) {
  const condition = resolveCondition(value);
  if (!condition) return [];
  return conditionPairs
    .filter((pair) => pair.a.id === condition.id || pair.b.id === condition.id)
    .sort((a, b) => b.score - a.score || b.sharedCount - a.sharedCount)
    .slice(0, limit);
}

export function getClusterMatrix(value?: string, limit = 12) {
  const seed = resolveCondition(value);
  if (!seed) return { conditions: [] as ConditionSummary[], cells: new Map<string, ConditionComparison>() };
  const neighborhood = getConditionNeighborhood(seed.id, limit - 1);
  const conditions = [seed, ...neighborhood.map((pair) => pair.a.id === seed.id ? pair.b : pair.a)];
  const uniqueConditions = [...new Map(conditions.map((condition) => [condition.id, condition])).values()].slice(0, limit);
  const ids = new Set(uniqueConditions.map((condition) => condition.id));
  const cells = new Map<string, ConditionComparison>();
  for (const pair of conditionPairs) {
    if (!ids.has(pair.a.id) || !ids.has(pair.b.id)) continue;
    cells.set([pair.a.id, pair.b.id].sort().join("|"), pair);
  }
  return { conditions: uniqueConditions, cells };
}
