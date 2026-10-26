#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  MIN_PUBLIC_ANALYSIS_REFERENCES,
  PUBLIC_CONTENT_POLICY_VERSION,
  applyPublicContentPolicy,
  getPublicContentExclusions,
} from "./public-content-policy.mjs";
import {
  EDITORIAL_STATUS_POLICY_VERSION,
  applyEditorialStatusPolicy,
  getEditorialStatusRegistry,
} from "./editorial-status-policy.mjs";
import {
  SOURCE_METADATA_POLICY_VERSION,
  normalizeSourceDoi,
  normalizeSourceMetadata,
  normalizeSourceYear,
} from "./source-metadata-policy.mjs";
import {
  ARTICLE_IDENTITY_POLICY_VERSION,
  getArticleIdentityRegistry,
  validateArticleIdentityPolicy,
} from "./article-identity-policy.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const auditOnly = has("--audit-only");
const sanitizeCurrent = has("--sanitize-current");
const skipBuild = has("--skip-build");
const sourceRoot = resolve(projectRoot, valueAfter("--source", "work/reference-wikibiome"));
const targetPath = resolve(projectRoot, valueAfter("--content", "data/content.generated.json"));
const manifestPath = resolve(projectRoot, valueAfter("--manifest", "data/content-manifest.generated.json"));
const sourceAliasRegistry = JSON.parse(readFileSync(resolve(projectRoot, "data/source-id-aliases.json"), "utf8"));
const editorialStatusPath = resolve(projectRoot, "data/editorial-statuses.json");
const articleIdentityPath = resolve(projectRoot, "data/article-id-aliases.json");
const editorialStatusRegistry = getEditorialStatusRegistry();
const articleIdentityRegistry = getArticleIdentityRegistry();
const sourceIdAliases = Object.fromEntries(
  Object.entries(sourceAliasRegistry.aliases ?? {}).map(([alias, target]) => [normalizeId(alias), normalizeId(target)]),
);
let sourceCommit = null;
let inputPath = targetPath;
let cleanupSnapshot = null;
let retainedExclusions = [];
let retainedManifest;

if (sanitizeCurrent) {
  assertExists(manifestPath, `Content manifest not found: ${manifestPath}.`);
  const currentManifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  retainedManifest = currentManifest;
  sourceCommit = currentManifest.source?.commit ?? null;
  retainedExclusions = currentManifest.publicContentPolicy?.excludedPages ?? [];
} else if (!auditOnly) {
  assertExists(sourceRoot, `Upstream clone not found: ${sourceRoot}`);
  if (skipBuild) {
    sourceCommit = gitCommit(sourceRoot);
    inputPath = resolve(sourceRoot, "src/content.generated.json");
  } else {
    const snapshot = prepareUpstreamSnapshot(sourceRoot);
    sourceCommit = snapshot.commit;
    cleanupSnapshot = snapshot.cleanup;
    inputPath = resolve(snapshot.root, "src/content.generated.json");
    try {
      rebuildUpstream(snapshot.root);
    } catch (error) {
      cleanupSnapshot();
      throw error;
    }
  }
}

assertExists(inputPath, `Content file not found: ${inputPath}`);
const raw = readFileSync(inputPath, "utf8");
if (cleanupSnapshot) cleanupSnapshot();
const parsedContent = JSON.parse(raw);
const metadataNormalization = normalizeSourceMetadata(parsedContent);
const metadataContent = auditOnly ? parsedContent : metadataNormalization.content;
const sourceMetadataNormalization = metadataNormalization.audit;
const lingeringExclusions = getPublicContentExclusions(metadataContent.pages);
if (auditOnly && lingeringExclusions.length) {
  throw new Error(`${lingeringExclusions.length} internal operational records are still present in the public corpus. Run node scripts/sync-wikibiome-content.mjs --sanitize-current.`);
}
const { content: policyContent, exclusions: newlyExcluded, normalizations } = applyPublicContentPolicy(metadataContent);
if (sanitizeCurrent && !lingeringExclusions.length && JSON.stringify(policyContent) === JSON.stringify(metadataContent)) {
  throw new Error("The current corpus already satisfies the public-content policy; refusing an unchanged rewrite.");
}
const statusSourceCommit = sourceCommit ?? JSON.parse(readFileSync(manifestPath, "utf8")).source?.commit;
const { content, appliedCount: appliedEditorialStatuses, registeredCount: registeredEditorialStatuses } = applyEditorialStatusPolicy(policyContent, statusSourceCommit);
const articleIdentityAudit = validateArticleIdentityPolicy(content);
const exclusions = [...retainedExclusions, ...newlyExcluded].filter((entry, index, all) => (
  all.findIndex((candidate) => candidate.id === entry.id) === index
));
const audit = auditContent(content);
if (audit.invalidSourceYears.length || audit.malformedDois.length) {
  throw new Error(`Generated content retains ${audit.invalidSourceYears.length} invalid source year values and ${audit.malformedDois.length} invalid DOI values. Run npm run content:sync to apply the source-metadata policy.`);
}
const sha256 = createHash("sha256").update(raw).digest("hex");

if (auditOnly) {
  verifyManifest(manifestPath, sha256);
  printSummary(audit, content, "audited");
  process.exit(0);
}

const normalizedRaw = `${JSON.stringify(content, null, 2)}\n`;
const normalizedSha256 = createHash("sha256").update(normalizedRaw).digest("hex");
const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: {
    repository: "https://github.com/paleofoundation/wikibiome.git",
    branch: "main",
    commit: sourceCommit,
    contentGeneratedAt: content._generated ?? null,
    platform: content._platform ?? null,
  },
  content: {
    path: "data/content.generated.json",
    sha256: normalizedSha256,
    pages: content.pages.length,
    sources: Object.keys(content.sourceLookup).length,
  },
  sourceMetadataPolicy: retainedManifest?.sourceMetadataPolicy ?? {
    version: SOURCE_METADATA_POLICY_VERSION,
    normalizedYearCount: sourceMetadataNormalization.normalizedYears.length,
    omittedYearCount: sourceMetadataNormalization.omittedYears.length,
    normalizedDoiCount: sourceMetadataNormalization.normalizedDois.length,
    omittedDoiCount: sourceMetadataNormalization.omittedDois.length,
    ...sourceMetadataNormalization,
  },
  publicContentPolicy: {
    version: PUBLIC_CONTENT_POLICY_VERSION,
    minimumAnalysisReferences: MIN_PUBLIC_ANALYSIS_REFERENCES,
    excludedCount: exclusions.length,
    excludedPages: exclusions,
  },
  editorialNormalization: retainedManifest?.editorialNormalization ?? {
    leadPromotionCount: normalizations.leadPromotions.length,
    leadPromotionSamples: normalizations.leadPromotions.slice(0, 20),
  },
  editorialStatusPolicy: {
    version: EDITORIAL_STATUS_POLICY_VERSION,
    sourceCommit: editorialStatusRegistry.sourceCommit,
    registeredCount: registeredEditorialStatuses,
    appliedRecordCount: appliedEditorialStatuses,
    registrySha256: createHash("sha256").update(readFileSync(editorialStatusPath)).digest("hex"),
  },
  articleIdentityPolicy: {
    version: ARTICLE_IDENTITY_POLICY_VERSION,
    reviewedAt: articleIdentityRegistry.reviewedAt,
    authority: articleIdentityRegistry.authority,
    registrySha256: createHash("sha256").update(readFileSync(articleIdentityPath)).digest("hex"),
    ...articleIdentityAudit,
  },
  audit,
};

writeFileSync(targetPath, normalizedRaw);
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
printSummary(audit, content, "synchronized");
console.log(`${exclusions.length} internal operational records excluded from public publishing.`);
console.log(`${normalizations.leadPromotions.length} source-authored lead sections normalized into article introductions.`);
console.log(`${appliedEditorialStatuses} records carry explicit editorial statuses from ${registeredEditorialStatuses} registry decisions.`);
console.log(`Source commit: ${sourceCommit ?? "unavailable"}`);
console.log(`Manifest: ${manifestPath}`);

function prepareUpstreamSnapshot(root) {
  console.log("Fetching paleofoundation/wikibiome origin/main...");
  run("git", ["-C", root, "fetch", "--quiet", "origin", "main"], "Unable to fetch origin/main.");
  const commit = run("git", ["-C", root, "rev-parse", "origin/main"], "Unable to resolve origin/main.").stdout.trim();
  const tempRoot = mkdtempSync(join(tmpdir(), "wikibiome-source-"));
  const snapshotRoot = join(tempRoot, "repo");
  try {
    run("git", ["-C", root, "worktree", "add", "--quiet", "--detach", snapshotRoot, commit], "Unable to create a clean upstream snapshot.");
  } catch (error) {
    rmSync(tempRoot, { recursive: true, force: true });
    throw error;
  }
  return {
    root: snapshotRoot,
    commit,
    cleanup() {
      spawnSync("git", ["-C", root, "worktree", "remove", "--force", snapshotRoot], { encoding: "utf8" });
      rmSync(tempRoot, { recursive: true, force: true });
    },
  };
}

function rebuildUpstream(root) {
  const script = resolve(root, "scripts/build-content.cjs");
  assertExists(script, `Upstream build script not found: ${script}`);
  const result = spawnSync(process.execPath, [script, "--platform", "all"], {
    cwd: root,
    env: {
      ...process.env,
      NODE_PATH: [resolve(projectRoot, "node_modules"), process.env.NODE_PATH].filter(Boolean).join(":"),
    },
    encoding: "utf8",
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error("The upstream Markdown-to-JSON generator failed. Run npm install, then retry content:sync.");
  }
}

function auditContent(content) {
  if (!content || !Array.isArray(content.pages) || !content.sourceLookup || typeof content.sourceLookup !== "object") {
    throw new Error("Invalid WikiBiome content: pages and sourceLookup are required.");
  }
  const pageIds = new Set();
  const duplicatePageIds = new Set();
  for (const page of content.pages) {
    if (!page.id) throw new Error("Invalid WikiBiome content: a page is missing its id.");
    if (pageIds.has(page.id)) duplicatePageIds.add(page.id);
    pageIds.add(page.id);
  }

  const sourceLookup = content.sourceLookup;
  const normalizedSourceLookup = Object.fromEntries(
    Object.entries(sourceLookup).map(([id, source]) => [normalizeId(id), source]),
  );
  const missingMetadata = new Set();
  const resolvedSourceAliases = new Set();
  const malformedDois = [];
  const invalidSourceYears = [];
  let pagesWithReferences = 0;
  let generatedReferences = 0;
  let pagesWithSourceDrift = 0;
  let recoveredInlineReferences = 0;
  let declaredOnlyReferences = 0;
  let belowThresholdPages = 0;

  for (const page of content.pages) {
    const inline = extractInlineSources(page, pageIds, sourceLookup);
    const declared = unique([
      ...(Array.isArray(page.sources) ? page.sources : []),
      ...(Array.isArray(page.frontmatter?.sources) ? page.frontmatter.sources : []),
    ].map(normalizeId).filter(Boolean));
    const references = unique([...inline, ...declared]);
    const declaredSet = new Set(declared);
    const inlineSet = new Set(inline);
    const recovered = inline.filter((id) => !declaredSet.has(id));
    const declaredOnly = declared.filter((id) => !inlineSet.has(id));

    if (references.length) pagesWithReferences += 1;
    generatedReferences += references.length;
    if (recovered.length || declaredOnly.length) pagesWithSourceDrift += 1;
    recoveredInlineReferences += recovered.length;
    declaredOnlyReferences += declaredOnly.length;
    if (page.belowThreshold && !page.isStub) belowThresholdPages += 1;
    for (const id of references) {
      const canonicalId = sourceIdAliases[id] ?? id;
      if (canonicalId !== id && normalizedSourceLookup[canonicalId]) resolvedSourceAliases.add(id);
      if (!normalizedSourceLookup[canonicalId]) missingMetadata.add(id);
    }
  }

  for (const [id, source] of Object.entries(sourceLookup)) {
    if (Object.hasOwn(source, "year")) {
      const year = normalizeSourceYear(source.year);
      if (year.status !== "valid") invalidSourceYears.push({ id, value: source.year });
    }
    if (Object.hasOwn(source, "doi")) {
      const doi = normalizeSourceDoi(source.doi);
      if (doi.status !== "valid") malformedDois.push({ id, value: source.doi, reason: doi.status });
    }
  }

  return {
    duplicatePageIds: [...duplicatePageIds].sort(),
    pagesWithReferences,
    generatedReferences,
    pagesWithSourceDrift,
    recoveredInlineReferences,
    declaredOnlyReferences,
    missingSourceMetadataIds: [...missingMetadata].sort(),
    resolvedSourceAliasIds: [...resolvedSourceAliases].sort(),
    malformedDois,
    invalidSourceYears,
    belowThresholdPages,
  };
}

function extractInlineSources(page, pageIds, sourceLookup) {
  const text = [page.overview ?? "", ...(page.sections ?? []).map((section) => section.body ?? "")].join("\n");
  const regex = /\[?\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]\]?/g;
  const ids = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const id = normalizeId(match[1]);
    const looksLikeSource = id in sourceLookup || /^[a-z]+-(?:[a-z]+-)*\d{4}-/.test(id);
    if (id && !pageIds.has(id) && looksLikeSource && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

function normalizeId(value) {
  return String(value)
    .replace(/\.md$/i, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function verifyManifest(path, sha256) {
  assertExists(path, `Content manifest not found: ${path}. Run npm run content:sync.`);
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  if (manifest.content?.sha256 !== sha256) {
    throw new Error("Generated content no longer matches its source manifest. Run npm run content:sync.");
  }
  if (manifest.publicContentPolicy?.version !== PUBLIC_CONTENT_POLICY_VERSION
      || manifest.publicContentPolicy?.minimumAnalysisReferences !== MIN_PUBLIC_ANALYSIS_REFERENCES) {
    throw new Error("Generated content does not match the current public-content policy. Run npm run content:sync.");
  }
  if (manifest.sourceMetadataPolicy?.version !== SOURCE_METADATA_POLICY_VERSION) {
    throw new Error("Generated content does not match the current source-metadata policy. Run npm run content:sync.");
  }
  const articleIdentitySha256 = createHash("sha256").update(readFileSync(articleIdentityPath)).digest("hex");
  if (manifest.articleIdentityPolicy?.version !== ARTICLE_IDENTITY_POLICY_VERSION
      || manifest.articleIdentityPolicy?.registrySha256 !== articleIdentitySha256) {
    throw new Error("Generated content does not match the current article-identity policy. Run npm run content:sync.");
  }
  const registrySha256 = createHash("sha256").update(readFileSync(editorialStatusPath)).digest("hex");
  if (manifest.editorialStatusPolicy?.version !== EDITORIAL_STATUS_POLICY_VERSION
      || manifest.editorialStatusPolicy?.sourceCommit !== editorialStatusRegistry.sourceCommit
      || manifest.editorialStatusPolicy?.registrySha256 !== registrySha256
      || manifest.source?.commit !== editorialStatusRegistry.sourceCommit) {
    throw new Error("Generated content does not match the explicit editorial-status registry. Run npm run content:sync after re-auditing source-bound statuses.");
  }
}

function gitCommit(root) {
  const result = spawnSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

function run(command, commandArgs, failureMessage) {
  const result = spawnSync(command, commandArgs, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim();
    throw new Error(`${failureMessage}${detail ? ` ${detail}` : ""}`);
  }
  return result;
}

function printSummary(audit, content, verb) {
  console.log(`WikiBiome content ${verb}: ${content.pages.length} pages, ${Object.keys(content.sourceLookup).length} source records.`);
  console.log(`${audit.generatedReferences} article references generated; ${audit.recoveredInlineReferences} recovered from inline citations.`);
  console.log(`${audit.missingSourceMetadataIds.length} referenced source IDs lack registry metadata; ${audit.malformedDois.length} DOI values are flagged.`);
  console.log(`${audit.invalidSourceYears.length} invalid source years remain in generated content.`);
  console.log(`${articleIdentityAudit.aliasCount} retired article IDs resolve through the audited identity registry.`);
  if (audit.duplicatePageIds.length) {
    const sample = audit.duplicatePageIds.slice(0, 8).join(", ");
    console.log(`${audit.duplicatePageIds.length} duplicate page IDs flagged (${sample}${audit.duplicatePageIds.length > 8 ? ", …" : ""}). The first upstream record remains canonical.`);
  }
}

function assertExists(path, message) {
  if (!existsSync(path)) throw new Error(message);
}

function unique(items) {
  return [...new Set(items)];
}
