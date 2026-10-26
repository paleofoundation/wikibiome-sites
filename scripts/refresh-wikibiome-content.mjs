#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(projectRoot, "work/reference-wikibiome");
const manifestPath = resolve(projectRoot, "data/content-manifest.generated.json");
const force = process.argv.includes("--force");

const dirty = git(projectRoot, ["status", "--short"]).stdout.trim();
if (dirty) {
  throw new Error("The WikiBiome site worktree is not clean. Review or commit current changes before running the automated refresh gate.");
}

run("git", ["-C", sourceRoot, "fetch", "--quiet", "origin", "main"], "Unable to fetch paleofoundation/wikibiome origin/main.");
const manifestBefore = JSON.parse(readFileSync(manifestPath, "utf8"));
const synchronizedCommit = manifestBefore.source?.commit;
const upstreamCommit = git(sourceRoot, ["rev-parse", "origin/main"]).stdout.trim();

if (!force && synchronizedCommit === upstreamCommit) {
  run(process.execPath, ["scripts/sync-wikibiome-content.mjs", "--audit-only"], "The synchronized content audit failed.");
  run(process.execPath, ["scripts/generate-revision-history.mjs", "--audit-only"], "The revision-history audit failed.");
  console.log(`No WikiBiome content refresh required; origin/main remains ${upstreamCommit}.`);
  process.exit(0);
}

console.log(`Refreshing WikiBiome content from ${synchronizedCommit ?? "unknown"} to ${upstreamCommit}...`);
run(process.execPath, ["scripts/sync-wikibiome-content.mjs"], "WikiBiome content synchronization failed.");
run(process.execPath, ["scripts/generate-revision-history.mjs"], "WikiBiome revision-history generation failed.");
run("npm", ["test"], "The refreshed WikiBiome release gate failed.");

const manifestAfter = JSON.parse(readFileSync(manifestPath, "utf8"));
console.log(`WikiBiome refresh gate passed for ${manifestAfter.source.commit}.`);
console.log("The generated change set is ready for editorial review; it has not been committed, pushed, or deployed.");

function git(root, args) {
  return run("git", ["-C", root, ...args], `git ${args[0]} failed.`);
}

function run(command, args, failureMessage) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 100 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) throw new Error(failureMessage);
  return result;
}
