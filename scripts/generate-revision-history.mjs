#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import content from "../data/content.generated.json" with { type: "json" };
import manifest from "../data/content-manifest.generated.json" with { type: "json" };
import { PAGE_HISTORY_POLICY_VERSION, materialPageChange } from "../lib/public-page-history-policy.mjs";
import identityRegistry from "../data/article-id-aliases.json" with { type: "json" };

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(projectRoot, "work/reference-wikibiome");
const targetPath = resolve(projectRoot, "data/revisions.generated.json");
const blobCache = new Map();
const gitCache = new Map();
const auditOnly = process.argv.includes("--audit-only");

if (auditOnly) {
  if (!existsSync(targetPath)) throw new Error("Revision history is missing. Run npm run revisions:sync.");
  const current = JSON.parse(readFileSync(targetPath, "utf8"));
  if (current.policyVersion !== PAGE_HISTORY_POLICY_VERSION) throw new Error("Regenerate history with the material page-change policy.");
  if (Object.values(current.histories).some(history => history.revisions.some(revision => revision.materialChange !== true || !revision.summary || !revision.description || /^(Updated article content|Updated published article information|Article content first published)$/.test(revision.summary)))) throw new Error("History contains an unverified page change.");
  if (current.sourceCommit !== manifest.source.commit) throw new Error("Revision history does not match the synchronized WikiBiome source commit.");
  if (current.records !== content.pages.length) throw new Error("Revision history does not account for the complete content inventory.");
  console.log(`WikiBiome revision history audited: ${current.records} records, ${current.revisions} revision entries.`);
  process.exit(0);
}

if (!existsSync(resolve(sourceRoot, ".git"))) throw new Error(`Official WikiBiome clone not found at ${sourceRoot}.`);
if (process.argv.includes("--classify-existing")) {
  const current = JSON.parse(readFileSync(targetPath, "utf8"));
  const available = new Map();
  let omittedUnavailable = Number(current.omittedUnavailable || 0);
  const entries = Object.values(current.histories).flatMap(history => history.revisions);
  const specs = new Set();
  for (const revision of entries) {
    if (!available.has(revision.hash)) available.set(revision.hash, spawnSync("git", ["-C", sourceRoot, "cat-file", "-e", `${revision.hash}^{commit}`], { encoding: "utf8" }).status === 0);
    if (!available.get(revision.hash)) continue;
    const parent = git(["rev-list", "--parents", "-n", "1", revision.hash]).trim().split(/\s+/)[1];
    specs.add(`${revision.hash}:${revision.path}`);
    if (parent) specs.add(`${parent}:${revision.path}`);
  }
  const keys = [...specs];
  const batch = spawnSync("git", ["-C", sourceRoot, "cat-file", "--batch"], { env: { ...process.env, GIT_NO_LAZY_FETCH: "1" }, input: keys.join("\n") + "\n", maxBuffer: 300 * 1024 * 1024 });
  if (batch.status !== 0) throw new Error("Unable to load historical page snapshots.");
  let offset = 0;
  for (const key of keys) {
    const end = batch.stdout.indexOf(10, offset);
    const header = batch.stdout.subarray(offset, end).toString("utf8");
    offset = end + 1;
    if (header.endsWith(" missing")) { blobCache.set(key, ""); continue; }
    const size = Number(header.split(" ").at(-1));
    blobCache.set(key, batch.stdout.subarray(offset, offset + size).toString("utf8"));
    offset += size + 1;
  }
  for (const history of Object.values(current.histories)) {
    history.revisions = history.revisions.flatMap(revision => {
      if (!available.has(revision.hash)) available.set(revision.hash, spawnSync("git", ["-C", sourceRoot, "cat-file", "-e", `${revision.hash}^{commit}`], { encoding: "utf8" }).status === 0);
      if (!available.get(revision.hash)) { omittedUnavailable++; return []; }
      return classifyRevision(revision);
    });
  }
  current.schemaVersion = 2;
  current.policyVersion = PAGE_HISTORY_POLICY_VERSION;
  current.revisions = Object.values(current.histories).reduce((total, history) => total + history.revisions.length, 0);
  current.omittedUnavailable = omittedUnavailable;
  writeFileSync(targetPath, `${JSON.stringify(current, null, 2)}\n`);
  console.log(`Verified ${current.revisions} material changes; omitted ${omittedUnavailable} entries without accessible source diffs.`);
  process.exit(0);
}

const sourceCommit = manifest.source.commit;
git(["cat-file", "-e", `${sourceCommit}^{commit}`]);

const trackedFiles = git(["ls-tree", "-r", "--name-only", sourceCommit]).split("\n").filter((path) => path.endsWith(".md"));
const pathsByBase = new Map();
for (const path of trackedFiles) {
  const base = path.split("/").at(-1);
  pathsByBase.set(base, [...(pathsByBase.get(base) ?? []), path]);
}

const uniqueIds = [...new Set(content.pages.map((page) => page.id))];
const histories = {};
let revisionCount = 0;
for (const id of uniqueIds) {
  const declaredRevisionPaths = [
    ...(identityRegistry.canonicalTaxa?.[id]?.revisionPaths ?? []),
    ...(identityRegistry.canonicalArticles?.[id]?.revisionPaths ?? []),
  ];
  const paths = [...new Set([...(pathsByBase.get(`${id}.md`) ?? []), ...declaredRevisionPaths])];
  const revisions = paths.flatMap((path) => historyForPath(path));
  const uniqueRevisions = [...new Map(revisions.map((revision) => [`${revision.hash}:${revision.path}`, revision])).values()]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 16);
  revisionCount += uniqueRevisions.length;
  histories[id] = { paths, revisions: uniqueRevisions };
}

const output = {
  schemaVersion: 2,
  policyVersion: PAGE_HISTORY_POLICY_VERSION,
  generatedAt: new Date().toISOString(),
  repository: "https://github.com/paleofoundation/wikibiome",
  sourceCommit,
  records: content.pages.length,
  canonicalIds: uniqueIds.length,
  revisions: revisionCount,
  histories,
};
writeFileSync(targetPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`WikiBiome revision history generated: ${output.records} records, ${output.revisions} revision entries.`);

function readBlob(commit, path) {
  const key = `${commit}:${path}`;
  if (!blobCache.has(key)) {
    const exists = spawnSync("git", ["-C", sourceRoot, "cat-file", "-e", key], { encoding: "utf8" });
    blobCache.set(key, exists.status === 0 ? git(["show", key]) : "");
  }
  return blobCache.get(key);
}

function historyForPath(path) {
  const raw = git(["log", "--follow", "--numstat", "--format=@@%H%x09%aI%x09%an%x09%s", "-16", sourceCommit, "--", path]);
  const revisions = [];
  let current;
  for (const line of raw.split("\n")) {
    if (line.startsWith("@@")) {
      const [hash, date, author, ...subject] = line.slice(2).split("\t");
      current = { hash, date, author, subject: subject.join(" "), path, additions: 0, deletions: 0 };
      revisions.push(current);
      continue;
    }
    if (!current) continue;
    const match = line.match(/^(\d+|-)\t(\d+|-)\t/);
    if (!match) continue;
    current.additions += match[1] === "-" ? 0 : Number(match[1]);
    current.deletions += match[2] === "-" ? 0 : Number(match[2]);
  }
  return revisions.flatMap(classifyRevision);
}

function classifyRevision(revision) {
    const path = revision.path;
    const parent = git(["rev-list", "--parents", "-n", "1", revision.hash]).trim().split(/\s+/)[1];
    const changed = git(["diff-tree", "--root", "--no-commit-id", "--name-status", "-r", "-M", revision.hash]).trim().split("\n").map(line => line.split("\t"));
    const entry = changed.find(parts => parts.at(-1) === path) || changed.find(parts => parts.at(-1)?.split("/").at(-1) === path.split("/").at(-1));
    if (!entry) return [];
    const currentPath = entry.at(-1);
    const oldPath = entry[0].startsWith("R") ? entry[1] : currentPath;
    const before = parent ? readBlob(parent, oldPath) : "";
    const after = readBlob(revision.hash, currentPath);
    const change = materialPageChange(before, after);
    return change ? [{ ...revision, path: currentPath, ...change }] : [];
}

function git(args) {
  const cacheKey = JSON.stringify(args);
  if (gitCache.has(cacheKey)) return gitCache.get(cacheKey);
  const result = spawnSync("git", ["-C", sourceRoot, ...args], { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr?.trim() || `git ${args[0]} failed`);
  gitCache.set(cacheKey, result.stdout);
  return result.stdout;
}
