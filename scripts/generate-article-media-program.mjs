#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { articleMediaRegistry } from "../lib/article-media-registry.mjs";
import {
  assertCanonicalMediaCorpus,
  initialMediaBaseline,
  loadCanonicalMediaRoutes,
  mediaCoverageGroups,
  selectNextMediaBatch,
} from "./article-media-corpus.mjs";
import { activeMediaReviewStatuses, assertBatchPromptIntegrity, assertMediaOutputAudit, parseStrictJson } from "./article-media-batch-validation.mjs";

const projectRoot = process.cwd();
const outputPath = resolve(projectRoot, "data/article-media-coverage.generated.json");
const manifestPath = resolve(projectRoot, "data/content-manifest.generated.json");
const contentPath = resolve(projectRoot, "data/content.generated.json");
const registryPath = resolve(projectRoot, "lib/article-media-registry.mjs");
const reviewLogPath = resolve(projectRoot, "data/article-media-review-log.json");
const batchDirectory = resolve(projectRoot, "data/article-media-batches");
const shouldWrite = process.argv.includes("--write");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const reviewLog = JSON.parse(readFileSync(reviewLogPath, "utf8"));
const sourceCanonicalRoutes = loadCanonicalMediaRoutes(projectRoot);
assertCanonicalMediaCorpus(sourceCanonicalRoutes);
const sourceCanonicalIds = new Set(sourceCanonicalRoutes.map((route) => route.id));
const queueReplacements = reviewLog.rejectedAssets.filter(
  (asset) => asset.disposition === "scientific-identity-hold-resolved" && asset.queueReplacement,
);
const replacementByRetiredId = new Map(queueReplacements.map((asset) => [asset.pageId, asset]));
const replacementByCanonicalId = new Map(queueReplacements.map((asset) => [asset.queueReplacement.pageId, asset]));
const coverageOrder = new Map(mediaCoverageGroups.map((group) => [group.id, group.categoryOrder]));
const canonicalRoutes = sourceCanonicalRoutes
  .map((route) => {
    const transition = replacementByRetiredId.get(route.id);
    if (transition) {
      const replacement = transition.queueReplacement;
      if (!replacement.pageId || !replacement.title || !replacement.route || !replacement.controlledIdentifier || replacement.coverageStatus !== "uncovered") {
        throw new Error(`${transition.pageId}: resolved identity queue replacement is incomplete.`);
      }
      if (sourceCanonicalIds.has(replacement.pageId)) {
        throw new Error(`${transition.pageId}: retired and replacement identities both appear in the source media corpus.`);
      }
      return {
        ...route,
        id: replacement.pageId,
        title: replacement.title,
        route: replacement.route,
        controlledIdentifier: replacement.controlledIdentifier,
        identityTransition: {
          retiredPageId: transition.pageId,
          resolvedOn: transition.resolvedOn,
          disposition: transition.disposition,
        },
      };
    }
    const integratedResolution = replacementByCanonicalId.get(route.id);
    return integratedResolution
      ? { ...route, controlledIdentifier: integratedResolution.queueReplacement.controlledIdentifier }
      : route;
  })
  .sort((a, b) => {
    const groupDifference = coverageOrder.get(a.coverageGroup) - coverageOrder.get(b.coverageGroup);
    return groupDifference || a.title.localeCompare(b.title, "en") || a.id.localeCompare(b.id, "en");
  })
  .map((route, index) => ({ ...route, queuePosition: index + 1 }));
assertCanonicalMediaCorpus(canonicalRoutes);

const reviewedIds = new Set(Object.keys(articleMediaRegistry));
const batchManifests = readdirSync(batchDirectory)
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => {
    const path = resolve(batchDirectory, name);
    return { name, path, data: parseStrictJson(readFileSync(path, "utf8"), name) };
  });
for (const { name, data } of batchManifests) {
  if (!data.batchId || !data.category || !data.status || !Array.isArray(data.assets)) throw new Error(`${name}: media batch manifest is incomplete.`);
  if (!data.promptRecord || !existsSync(resolve(projectRoot, data.promptRecord))) throw new Error(`${name}: immutable prompt record is missing.`);
  assertBatchPromptIntegrity(data, readFileSync(resolve(projectRoot, data.promptRecord), "utf8"), name);
  if (data.status === "reviewed") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.reviewedOn ?? "")) throw new Error(`${name}: reviewed batch requires a review date.`);
    for (const asset of data.assets.filter((candidate) => candidate.assetType && candidate.revision)) {
      if (!/^(accepted|approved)/.test(asset.decision ?? "")) throw new Error(`${name}/${asset.pageId}: reviewed asset does not have an accepted or approved disposition.`);
      assertMediaOutputAudit(asset, name);
      if (!reviewedIds.has(asset.pageId)) throw new Error(`${name}/${asset.pageId}: reviewed batch asset is absent from the public registry.`);
    }
  }
  if (activeMediaReviewStatuses.has(data.status)) {
    for (const asset of data.assets.filter((candidate) => candidate.assetType && candidate.revision)) assertMediaOutputAudit(asset, name);
  }
}
const scientificHolds = new Map(
  reviewLog.rejectedAssets
    .filter((asset) => ["scientific-identity-hold", "scientific-media-hold", "quarantined-scientific-interpretation-conflict"].includes(asset.disposition))
    .map((asset) => [asset.pageId, asset]),
);
const resolvedRejectionDispositions = new Set(["scientific-identity-hold-resolved"]);
const rejectedRoutes = new Map(
  reviewLog.rejectedAssets
    .filter((asset) => !resolvedRejectionDispositions.has(asset.disposition) && !scientificHolds.has(asset.pageId))
    .map((asset) => [asset.pageId, asset]),
);
const canonicalRouteIds = new Set(canonicalRoutes.map((route) => route.id));
for (const hold of scientificHolds.values()) {
  if (!canonicalRouteIds.has(hold.pageId)) {
    throw new Error(`${hold.pageId}: unresolved scientific hold no longer maps to a canonical article route.`);
  }
}
const inReview = new Map();
for (const manifest of batchManifests.filter(({ data }) => activeMediaReviewStatuses.has(data.status))) {
  for (const asset of manifest.data.assets.filter((candidate) => candidate.assetType && candidate.revision && candidate.draft)) {
    if (reviewedIds.has(asset.pageId)) throw new Error(`${asset.pageId}: reviewed registry record still appears in an awaiting-review batch.`);
    if (scientificHolds.has(asset.pageId)) throw new Error(`${asset.pageId}: route cannot be both in review and on scientific hold.`);
    if (!canonicalRouteIds.has(asset.pageId)) throw new Error(`${asset.pageId}: review candidate no longer maps to a canonical article route.`);
    if (inReview.has(asset.pageId)) throw new Error(`${asset.pageId}: route appears in more than one awaiting-review batch.`);
    inReview.set(asset.pageId, { batchId: manifest.data.batchId, ...asset });
  }
}
const queue = canonicalRoutes.map((route) => ({
  ...route,
  status: reviewedIds.has(route.id) ? "reviewed" : scientificHolds.has(route.id) ? "scientific-hold" : inReview.has(route.id) ? "in-review" : rejectedRoutes.has(route.id) ? "rejected" : "queued",
  ...(reviewedIds.has(route.id)
    ? {
        media: {
          assetType: articleMediaRegistry[route.id].assetType,
          revision: articleMediaRegistry[route.id].revision,
          reviewedOn: articleMediaRegistry[route.id].reviewedOn,
          masterSource: articleMediaRegistry[route.id].masterSource,
          publishedFile: articleMediaRegistry[route.id].publishedFile,
          socialFile: articleMediaRegistry[route.id].socialFile,
        },
      }
    : scientificHolds.has(route.id)
      ? {
          scientificHold: {
            reviewedOn: scientificHolds.get(route.id).reviewedOn,
            reviewingAuthority: scientificHolds.get(route.id).reviewingAuthority,
            reason: scientificHolds.get(route.id).reason,
            requiredResolution: scientificHolds.get(route.id).requiredResolution,
          },
        }
      : inReview.has(route.id)
        ? {
            reviewCandidate: {
              batchId: inReview.get(route.id).batchId,
              decision: inReview.get(route.id).decision,
              draft: inReview.get(route.id).draft,
              sha256: inReview.get(route.id).sha256,
            },
          }
        : rejectedRoutes.has(route.id)
          ? {
              rejectedMedia: {
                batchId: rejectedRoutes.get(route.id).batchId,
                reviewedOn: rejectedRoutes.get(route.id).reviewedOn,
                reviewingAuthority: rejectedRoutes.get(route.id).reviewingAuthority,
                disposition: rejectedRoutes.get(route.id).disposition,
                reason: rejectedRoutes.get(route.id).reason,
                ...(rejectedRoutes.get(route.id).requiredResolution ? { requiredResolution: rejectedRoutes.get(route.id).requiredResolution } : {}),
                ...(rejectedRoutes.get(route.id).supersededBy ? { supersededBy: rejectedRoutes.get(route.id).supersededBy } : {}),
              },
            }
        : {}),
}));

const categories = mediaCoverageGroups.map((group) => {
  const records = queue.filter((route) => route.coverageGroup === group.id);
  const completed = records.filter((route) => route.status === "reviewed").length;
  return {
    id: group.id,
    label: group.label,
    total: records.length,
    completed,
    remaining: records.length - completed,
  };
});

const completed = queue.filter((route) => route.status === "reviewed").length;
const nextBatch = selectNextMediaBatch(queue, reviewLog.reviewableBatchSize)
      .map(({ queuePosition, id, title, route, category, coverageGroup, suggestedAssetType, controlledIdentifier, status, rejectedMedia }) => ({
        queuePosition,
        id,
        title,
        route,
        category,
        coverageGroup,
        suggestedAssetType,
        ...(controlledIdentifier ? { controlledIdentifier } : {}),
        ...(status === "rejected" && rejectedMedia?.disposition === "revise"
          ? {
              revisionOf: {
                batchId: rejectedMedia.batchId,
                disposition: rejectedMedia.disposition,
                reason: rejectedMedia.reason,
                ...(rejectedMedia.requiredResolution ? { requiredResolution: rejectedMedia.requiredResolution } : {}),
              },
            }
          : {}),
      }));

const digest = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const program = {
  schemaVersion: 1,
  generatedOn: reviewLog.updatedOn,
  sourceEvidence: {
    upstreamRepository: manifest.source.repository,
    upstreamCommit: manifest.source.commit,
    contentManifest: "data/content-manifest.generated.json",
    contentFile: "data/content.generated.json",
    contentSha256: digest(contentPath),
    registryFile: "lib/article-media-registry.mjs",
    registrySha256: digest(registryPath),
    reviewLog: "data/article-media-review-log.json",
    reviewLogSha256: digest(reviewLogPath),
    batchManifests: batchManifests.map(({ name, path, data }) => ({
      file: `data/article-media-batches/${name}`,
      batchId: data.batchId,
      status: data.status,
      sha256: digest(path),
    })),
  },
  baseline: initialMediaBaseline,
  current: {
    total: queue.length,
    completed,
    remaining: queue.length - completed,
    rejected: reviewLog.rejectedAssets.length,
    revised: reviewLog.revisedAssets.length,
    scientificHolds: scientificHolds.size,
    inReview: inReview.size,
  },
  categories,
  rejectedAssets: reviewLog.rejectedAssets,
  revisedAssets: reviewLog.revisedAssets,
  nextBatch,
  queue,
};

const serialized = `${JSON.stringify(program, null, 2)}\n`;
if (shouldWrite) {
  writeFileSync(outputPath, serialized);
  console.log(`Wrote deterministic ${queue.length}-route media program to ${outputPath}.`);
} else {
  const current = readFileSync(outputPath, "utf8");
  if (current !== serialized) {
    throw new Error("The article media program register is stale. Run npm run media:program:write.");
  }
  console.log(`Article media program register is current: ${completed} completed, ${queue.length - completed} remaining.`);
}
