import registry from "../data/article-id-aliases.json" with { type: "json" };

export const ARTICLE_IDENTITY_POLICY_VERSION = 1;

export function normalizeArticleId(value) {
  return String(value ?? "")
    .replace(/\.md$/i, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getArticleAliases() {
  return Object.fromEntries(
    Object.entries(registry.aliases ?? {}).map(([alias, target]) => [
      normalizeArticleId(alias),
      normalizeArticleId(target),
    ]),
  );
}

export function validateArticleIdentityPolicy(content) {
  if (registry.schemaVersion !== ARTICLE_IDENTITY_POLICY_VERSION) {
    throw new Error(`Article identity registry schema ${registry.schemaVersion} does not match policy ${ARTICLE_IDENTITY_POLICY_VERSION}.`);
  }
  if (!String(registry.reviewedAt ?? "").trim() || !String(registry.authority ?? "").trim()) {
    throw new Error("The article identity registry must name its review date and approval authority.");
  }
  if (!content || !Array.isArray(content.pages)) {
    throw new Error("Article identity validation requires generated content pages.");
  }

  const pagesById = new Map();
  for (const page of content.pages) {
    const id = normalizeArticleId(page.id);
    pagesById.set(id, [...(pagesById.get(id) ?? []), page]);
  }
  const aliases = getArticleAliases();
  const retired = new Set((registry.retiredCanonicalIds ?? []).map(normalizeArticleId));

  for (const [alias, target] of Object.entries(aliases)) {
    if (!alias || !target || alias === target) throw new Error(`Invalid article alias ${alias || "<empty>"} -> ${target || "<empty>"}.`);
    if (!retired.has(alias)) throw new Error(`Article alias ${alias} is not explicitly retired.`);
    if (aliases[target]) throw new Error(`Article alias ${alias} targets another alias (${target}); alias chains are not allowed.`);
    if ((pagesById.get(alias) ?? []).length) throw new Error(`Retired article alias ${alias} re-entered public generation as a page.`);
    if ((pagesById.get(target) ?? []).length !== 1) {
      throw new Error(`Article alias ${alias} must resolve to exactly one canonical page (${target}).`);
    }
  }

  for (const retiredId of retired) {
    if (!aliases[retiredId]) throw new Error(`Retired canonical id ${retiredId} has no explicit redirect target.`);
    if ((pagesById.get(retiredId) ?? []).length) throw new Error(`Retired canonical id ${retiredId} re-entered public generation.`);
  }

  for (const [id, expected] of Object.entries(registry.canonicalTaxa ?? {})) {
    const normalizedId = normalizeArticleId(id);
    const matches = pagesById.get(normalizedId) ?? [];
    if (matches.length !== 1) throw new Error(`Canonical taxon ${normalizedId} must have exactly one public record.`);
    const page = matches[0];
    if (page.title !== expected.title) {
      throw new Error(`Canonical taxon ${normalizedId} has title ${page.title}, expected ${expected.title}.`);
    }
    if (Number(page.frontmatter?.ncbi_taxonomy_id) !== expected.ncbiTaxonomyId) {
      throw new Error(`Canonical taxon ${normalizedId} must retain NCBITaxon:${expected.ncbiTaxonomyId}.`);
    }
  }

  for (const [id, expected] of Object.entries(registry.canonicalArticles ?? {})) {
    const normalizedId = normalizeArticleId(id);
    const matches = pagesById.get(normalizedId) ?? [];
    if (matches.length !== 1) throw new Error(`Canonical article ${normalizedId} must have exactly one public record.`);
    const page = matches[0];
    if (page.title !== expected.title) {
      throw new Error(`Canonical article ${normalizedId} has title ${page.title}, expected ${expected.title}.`);
    }
  }

  const forbiddenTitles = new Set(registry.forbiddenCanonicalTitles ?? []);
  const obsoleteTitlePages = content.pages.filter((page) => forbiddenTitles.has(page.title));
  if (obsoleteTitlePages.length) {
    throw new Error(`Obsolete taxon titles re-entered public generation: ${obsoleteTitlePages.map((page) => page.id).join(", ")}.`);
  }

  const serializedPages = JSON.stringify(content.pages);
  const forbiddenPatterns = (registry.forbiddenPublicPatterns ?? []).filter((pattern) => serializedPages.includes(pattern));
  if (forbiddenPatterns.length) {
    throw new Error(`Unsupported retired identities re-entered public generation: ${forbiddenPatterns.join(", ")}.`);
  }

  return {
    aliasCount: Object.keys(aliases).length,
    retiredCanonicalCount: retired.size,
    canonicalTaxonCount: Object.keys(registry.canonicalTaxa ?? {}).length,
    canonicalArticleCount: Object.keys(registry.canonicalArticles ?? {}).length,
    forbiddenPatternCount: (registry.forbiddenPublicPatterns ?? []).length,
  };
}

export function getArticleIdentityRegistry() {
  return registry;
}
