import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const MEDIA_PROGRAM_TOTAL = 715;

export const mediaCoverageGroups = Object.freeze([
  Object.freeze({ id: "metals", label: "Metals", total: 29, categoryOrder: 1 }),
  Object.freeze({ id: "diseases", label: "Diseases", total: 66, categoryOrder: 2 }),
  Object.freeze({ id: "microorganisms", label: "Microorganisms", total: 229, categoryOrder: 3 }),
  Object.freeze({ id: "mechanisms", label: "Mechanisms", total: 238, categoryOrder: 4 }),
  Object.freeze({ id: "host-defenses", label: "Host defenses", total: 29, categoryOrder: 5 }),
  Object.freeze({ id: "interventions", label: "Interventions", total: 69, categoryOrder: 6 }),
  Object.freeze({ id: "clinical-cautions", label: "Clinical cautions", total: 39, categoryOrder: 7 }),
  Object.freeze({ id: "entity-analysis-reference", label: "Entity, analysis, and reference routes", total: 16, categoryOrder: 8 }),
]);

export const initialMediaBaseline = Object.freeze({
  asOf: "2026-09-01",
  total: 716,
  covered: 8,
  uncovered: 704,
  uncoveredByGroup: Object.freeze({
    microorganisms: 226,
    metals: 28,
    diseases: 64,
    mechanisms: 233,
    "host-defenses": 29,
    interventions: 69,
    "clinical-cautions": 39,
    "entity-analysis-reference": 16,
  }),
});

const groupById = new Map(mediaCoverageGroups.map((group) => [group.id, group]));

const compatibleMediaTypes = Object.freeze({
  microorganisms: new Set(["morphology", "microbial-community"]),
  metals: new Set(["technical-specimen"]),
  diseases: new Set(["pathology", "microbial-community"]),
  mechanisms: new Set(["mechanism"]),
  "host-defenses": new Set(["host-defense"]),
  interventions: new Set(["intervention"]),
  "clinical-cautions": new Set(["clinical-caution"]),
  "entity-analysis-reference": new Set(["evidence-index"]),
});

export function isArticleMediaTypeCompatible(route, media) {
  if (compatibleMediaTypes[route?.coverageGroup]?.has(media?.assetType)) return true;

  // A named live-biotherapeutic strain may be filed as an intervention article while
  // its primary image truthfully depicts only the verified taxon, not a protocol or
  // clinical effect. Keep this exception narrower than the page category itself.
  return Boolean(route?.coverageGroup === "interventions"
    && media?.assetType === "morphology"
    && media?.subjectKind === "taxon"
    && media.scientificIdentifiers?.some(
      (identifier) => identifier.authority === "NCBI Taxonomy" && identifier.propertyID === "NCBITaxon" && identifier.value,
    ));
}

export function normalizeArticleId(value) {
  return String(value ?? "")
    .replace(/\.md$/i, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function canonicalMediaRoute(page) {
  const normalizedId = normalizeArticleId(page.id);
  const id = page.category === "signature" ? normalizedId.replace(/-signature$/, "") : normalizedId;
  const category = page.category === "signature" || page.category === "disease" || id === "dysbiosis"
    ? "disease"
    : page.category;
  return { id, category };
}

export function mediaCoverageGroupFor(category) {
  if (category === "microbe") return "microorganisms";
  if (category === "metal") return "metals";
  if (category === "disease") return "diseases";
  if (category === "mechanism") return "mechanisms";
  if (category === "defense") return "host-defenses";
  if (category === "intervention") return "interventions";
  if (category === "stop") return "clinical-cautions";
  return "entity-analysis-reference";
}

export function suggestedAssetTypeFor(category, id) {
  if (category === "microbe") return "morphology";
  if (category === "metal") return "technical-specimen";
  if (category === "disease") return id === "dysbiosis" ? "microbial-community" : "pathology";
  if (category === "mechanism") return "mechanism";
  if (category === "defense") return "host-defense";
  if (category === "intervention") return "intervention";
  if (category === "stop") return "clinical-caution";
  return "evidence-index";
}

export function loadCanonicalMediaRoutes(projectRoot = process.cwd()) {
  const content = JSON.parse(readFileSync(resolve(projectRoot, "data/content.generated.json"), "utf8"));
  const routes = new Map();
  for (const page of content.pages ?? []) {
    const canonical = canonicalMediaRoute(page);
    const candidate = {
      id: canonical.id,
      title: page.title,
      category: canonical.category,
      sourceCategories: [page.category],
      route: `/article/${canonical.id}`,
    };
    const existing = routes.get(canonical.id);
    if (!existing) {
      routes.set(canonical.id, candidate);
      continue;
    }
    existing.sourceCategories = [...new Set([...existing.sourceCategories, page.category])].sort();
    if (page.category === "disease") {
      existing.title = page.title;
      existing.category = "disease";
    }
  }

  return [...routes.values()]
    .map((route) => {
      const coverageGroup = mediaCoverageGroupFor(route.category);
      return {
        ...route,
        coverageGroup,
        suggestedAssetType: suggestedAssetTypeFor(route.category, route.id),
      };
    })
    .sort((a, b) => {
      const groupDifference = groupById.get(a.coverageGroup).categoryOrder - groupById.get(b.coverageGroup).categoryOrder;
      return groupDifference || a.title.localeCompare(b.title, "en") || a.id.localeCompare(b.id, "en");
    })
    .map((route, index) => ({ queuePosition: index + 1, ...route }));
}

export function assertCanonicalMediaCorpus(routes) {
  if (routes.length !== MEDIA_PROGRAM_TOTAL) {
    throw new Error(`Scientific media corpus has ${routes.length} canonical routes; expected ${MEDIA_PROGRAM_TOTAL}.`);
  }
  const ids = new Set(routes.map((route) => route.id));
  if (ids.size !== routes.length) throw new Error("Scientific media corpus contains duplicate canonical route identifiers.");
  for (const group of mediaCoverageGroups) {
    const actual = routes.filter((route) => route.coverageGroup === group.id).length;
    if (actual !== group.total) {
      throw new Error(`${group.label} media corpus has ${actual} routes; expected ${group.total}.`);
    }
  }
}

export function selectNextMediaBatch(queue, batchSize) {
  if (!Number.isInteger(batchSize) || batchSize < 1) throw new Error("Scientific media batch size must be a positive integer.");

  const firstQueued = queue.find((route) => route.status === "queued");
  if (firstQueued) {
    return queue
      .filter((route) => route.coverageGroup === firstQueued.coverageGroup && route.status === "queued")
      .slice(0, batchSize);
  }

  // Once every canonical route has received an initial disposition, continue
  // only the explicitly revisable failures. Scientific holds, quarantines,
  // safety refusals, and permanent rejections remain fail-closed.
  const firstRevision = queue.find(
    (route) => route.status === "rejected" && route.rejectedMedia?.disposition === "revise",
  );
  if (!firstRevision) return [];
  return queue
    .filter(
      (route) => route.coverageGroup === firstRevision.coverageGroup
        && route.status === "rejected"
        && route.rejectedMedia?.disposition === "revise",
    )
    .slice(0, batchSize);
}
