#!/usr/bin/env node

import sharp from "sharp";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { articleMediaRegistry } from "../lib/article-media-registry.mjs";
import { requiredEmbeddedMetadataTokens } from "../lib/article-media-metadata.mjs";
import { assertArticleMediaRecord } from "../lib/article-media-validation.mjs";
import { assertCanonicalMediaCorpus, isArticleMediaTypeCompatible, loadCanonicalMediaRoutes } from "./article-media-corpus.mjs";
import { assertBatchPromptIntegrity, assertMediaOutputAudit, parseStrictJson } from "./article-media-batch-validation.mjs";
import { assertApprovedMediaReview } from "./article-media-review-log.mjs";

const projectRoot = process.cwd();
const masters = resolve(projectRoot, "media/masters");
const derivatives = resolve(projectRoot, "public/media-files");
const registerPath = resolve(projectRoot, "data/article-media-coverage.generated.json");
const reviewLogPath = resolve(projectRoot, "data/article-media-review-log.json");
const batchDirectory = resolve(projectRoot, "data/article-media-batches");
const canonicalRoutes = loadCanonicalMediaRoutes(projectRoot);
assertCanonicalMediaCorpus(canonicalRoutes);
const routesById = new Map(canonicalRoutes.map((route) => [route.id, route]));
if (!existsSync(reviewLogPath)) throw new Error("Scientific media review log is missing.");
const reviewLog = JSON.parse(readFileSync(reviewLogPath, "utf8"));
if (reviewLog.schemaVersion !== 2 || !reviewLog.reviews || !reviewLog.reviewingAuthorities) throw new Error("Scientific media review log schema is invalid.");
const batchManifests = readdirSync(batchDirectory)
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => ({ name, data: parseStrictJson(readFileSync(resolve(batchDirectory, name), "utf8"), name) }));

if (!existsSync(registerPath)) throw new Error("Article media program register is missing. Run npm run media:program:write.");
const program = JSON.parse(readFileSync(registerPath, "utf8"));
if (program.current.total !== canonicalRoutes.length) throw new Error("Article media program total does not match the canonical corpus.");
if (program.current.completed !== Object.keys(articleMediaRegistry).length) throw new Error("Article media program completed count does not match the reviewed registry.");
if (program.current.remaining !== canonicalRoutes.length - Object.keys(articleMediaRegistry).length) throw new Error("Article media program remaining count is incorrect.");

const expectedMasters = new Set();
const expectedDerivatives = new Set();
const registeredFiles = new Set();
for (const [id, media] of Object.entries(articleMediaRegistry)) {
  assertArticleMediaRecord(media);
  if (id !== media.pageId) throw new Error(`${id}: registry key does not match pageId.`);
  const route = routesById.get(id);
  if (!route) throw new Error(`${id}: reviewed media is not attached to a canonical article route.`);
  if (!isArticleMediaTypeCompatible(route, media)) {
    throw new Error(`${id}: ${media.assetType} is not an approved treatment for ${route.coverageGroup}.`);
  }
  assertApprovedReview(media);
  for (const filename of [media.masterSource, media.publishedFile, media.socialFile]) {
    if (registeredFiles.has(filename)) throw new Error(`${id}: duplicate canonical media filename ${filename}.`);
    registeredFiles.add(filename);
  }
  expectedMasters.add(media.masterSource);
  expectedDerivatives.add(media.publishedFile);
  expectedDerivatives.add(media.socialFile);
  await assertImage({
    path: join(masters, media.masterSource),
    media,
    role: "master",
    format: "png",
    minimumWidth: media.width,
    minimumHeight: media.height,
  });
  await assertImage({
    path: join(derivatives, media.publishedFile),
    media,
    role: "article derivative",
    format: "webp",
    width: media.width,
    height: media.height,
  });
  await assertImage({
    path: join(derivatives, media.socialFile),
    media,
    role: "social derivative",
    format: "webp",
    width: media.socialWidth,
    height: media.socialHeight,
    minimumBytes: 30_000,
  });
}

for (const [key, review] of Object.entries(reviewLog.reviews)) {
  if (review.disposition === "approved" && !articleMediaRegistry[review.pageId]) {
    throw new Error(`${key}: approved review has no matching publishable registry record.`);
  }
}

for (const hold of reviewLog.rejectedAssets.filter((asset) => asset.disposition === "scientific-identity-hold")) {
  if (!routesById.has(hold.pageId)) throw new Error(`${hold.pageId}: scientific-identity hold does not match a canonical route.`);
  if (articleMediaRegistry[hold.pageId]) throw new Error(`${hold.pageId}: scientific-identity hold forbids registry publication.`);
  if (!hold.reviewedOn || !hold.reviewingAuthority || !hold.reason || !hold.requiredResolution || hold.checkedUrls?.length < 2) {
    throw new Error(`${hold.pageId}: scientific-identity hold is incomplete.`);
  }
}

for (const { name, data } of batchManifests) {
  if (!data.promptRecord || !existsSync(resolve(projectRoot, data.promptRecord))) throw new Error(`${name}: immutable prompt provenance is missing.`);
  assertBatchPromptIntegrity(data, readFileSync(resolve(projectRoot, data.promptRecord), "utf8"), name);
  for (const asset of data.assets.filter((candidate) => candidate.assetType && candidate.revision)) {
    if (data.status === "reviewed") {
      if (!/^(accepted|approved)/.test(asset.decision ?? "")) throw new Error(`${name}/${asset.pageId}: reviewed batch disposition is invalid.`);
      if (!articleMediaRegistry[asset.pageId]) throw new Error(`${name}/${asset.pageId}: reviewed batch asset is not published in the reviewed registry.`);
    }
    if (data.status === "reviewed" || data.status === "approved-awaiting-promotion") assertMediaOutputAudit(asset, name);
  }
}

assertExactFiles(masters, expectedMasters, (name) => name.endsWith("-master.png"), "lossless master");
assertExactFiles(derivatives, expectedDerivatives, (name) => name.endsWith(".webp"), "published derivative");

for (const [id, media] of Object.entries(articleMediaRegistry)) {
  const queueRecord = program.queue.find((record) => record.id === id);
  if (!queueRecord || queueRecord.status !== "reviewed") throw new Error(`${id}: program queue does not mark the registry record reviewed.`);
  if (queueRecord.media?.publishedFile !== media.publishedFile || queueRecord.media?.masterSource !== media.masterSource || queueRecord.media?.socialFile !== media.socialFile) {
    throw new Error(`${id}: program register files differ from the reviewed registry.`);
  }
}

console.log(`Scientific media release gate passed: ${Object.keys(articleMediaRegistry).length} reviewed assets, ${canonicalRoutes.length - Object.keys(articleMediaRegistry).length} queued routes.`);

function assertApprovedReview(media) {
  const review = reviewLog.reviews[media.reviewLogKey];
  if (!review) throw new Error(`${media.pageId}: matching review-log entry ${media.reviewLogKey} is absent.`);
  assertApprovedMediaReview(media.reviewLogKey, review, reviewLog.reviewingAuthorities);
  const authority = reviewLog.reviewingAuthorities[review.reviewingAuthority];
  if (!authority?.name || !authority?.reviewerId || !authority?.scope) throw new Error(`${media.pageId}: reviewing authority is absent or incomplete.`);
  for (const field of ["pageId", "publishedFile", "masterSource", "socialFile", "revision", "reviewedOn"]) {
    if (review[field] !== media[field]) throw new Error(`${media.pageId}: review-log ${field} is inconsistent with the registry.`);
  }
  if (review.disposition !== "approved") throw new Error(`${media.pageId}: review-log disposition is not approved.`);
  if (review.scientificReferenceCheck?.status !== "pass" || !review.scientificReferenceCheck.notes) throw new Error(`${media.pageId}: scientific-reference review did not pass.`);
  if (review.subjectReview?.status !== "pass" || !review.subjectReview.notes) throw new Error(`${media.pageId}: morphology or subject review did not pass.`);
  if (review.accessibilityReview?.status !== "pass" || !review.accessibilityReview.notes) throw new Error(`${media.pageId}: accessibility review did not pass.`);
  if (!review.notes || !review.revisionLinkage) throw new Error(`${media.pageId}: review notes or revision linkage are missing.`);
  const reviewedUrls = new Set(review.scientificReferenceCheck.checkedUrls ?? []);
  for (const reference of media.scientificReferences) {
    if (!reviewedUrls.has(reference.url)) throw new Error(`${media.pageId}: scientific reference ${reference.url} was not checked in the review log.`);
  }
  if (reviewedUrls.size !== media.scientificReferences.length) throw new Error(`${media.pageId}: review log contains reference checks that do not match the registry.`);
}

async function assertImage({ path, media, role, format, width, height, minimumWidth, minimumHeight, minimumBytes = 40_000 }) {
  if (!existsSync(path)) throw new Error(`${media.pageId}: missing ${role} ${path}.`);
  if (statSync(path).size < minimumBytes) throw new Error(`${media.pageId}: ${role} is unexpectedly small.`);
  const metadata = await sharp(path).metadata();
  if (metadata.format !== format) throw new Error(`${media.pageId}: ${role} must be ${format}.`);
  if (width && metadata.width !== width) throw new Error(`${media.pageId}: ${role} width is ${metadata.width}; expected ${width}.`);
  if (height && metadata.height !== height) throw new Error(`${media.pageId}: ${role} height is ${metadata.height}; expected ${height}.`);
  if (minimumWidth && (!metadata.width || metadata.width < minimumWidth)) throw new Error(`${media.pageId}: ${role} is narrower than ${minimumWidth}px.`);
  if (minimumHeight && (!metadata.height || metadata.height < minimumHeight)) throw new Error(`${media.pageId}: ${role} is shorter than ${minimumHeight}px.`);
  const xmp = metadata.xmp?.toString("utf8") ?? "";
  if (!xmp) throw new Error(`${media.pageId}: ${role} has no embedded XMP/IPTC metadata.`);
  for (const token of requiredEmbeddedMetadataTokens(media)) {
    if (!xmp.includes(token)) throw new Error(`${media.pageId}: ${role} metadata is missing ${token}.`);
  }
}

function assertExactFiles(directory, expected, matchesScope, label) {
  if (!existsSync(directory)) throw new Error(`Reviewed ${label} directory is missing: ${directory}.`);
  const actual = readdirSync(directory).filter(matchesScope);
  for (const filename of actual) {
    if (!expected.has(filename)) throw new Error(`Unregistered ${label} would be published: ${filename}.`);
  }
  for (const filename of expected) {
    if (!actual.includes(filename)) throw new Error(`Registered ${label} is missing: ${filename}.`);
  }
}
