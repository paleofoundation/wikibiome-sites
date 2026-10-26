#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(projectRoot, "work/reference-wikibiome");
const manifestPath = resolve(projectRoot, "data/content-manifest.generated.json");
const asJson = process.argv.includes("--json");

assertExists(resolve(sourceRoot, ".git"), `Official WikiBiome clone not found at ${sourceRoot}.`);
assertExists(manifestPath, `Content manifest not found at ${manifestPath}.`);

run("git", ["-C", sourceRoot, "fetch", "--quiet", "origin", "main"], "Unable to fetch paleofoundation/wikibiome origin/main.");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const synchronizedCommit = manifest.source?.commit;
const upstreamCommit = run("git", ["-C", sourceRoot, "rev-parse", "origin/main"], "Unable to resolve origin/main.").stdout.trim();
if (!synchronizedCommit) throw new Error("The content manifest does not record a synchronized source commit.");

const changed = synchronizedCommit !== upstreamCommit;
const comparison = changed
  ? run(
      "git",
      ["-C", sourceRoot, "diff", "--shortstat", synchronizedCommit, upstreamCommit, "--", "wiki", "src", "scripts/build-content.cjs"],
      "Unable to compare the synchronized and upstream commits.",
    ).stdout.trim()
  : "No upstream source changes.";

const report = {
  repository: manifest.source?.repository ?? "https://github.com/paleofoundation/wikibiome.git",
  synchronizedCommit,
  upstreamCommit,
  changed,
  comparison,
  checkedAt: new Date().toISOString(),
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(changed ? "WikiBiome upstream refresh available." : "WikiBiome content is synchronized with origin/main.");
  console.log(`Synchronized: ${synchronizedCommit}`);
  console.log(`Upstream:     ${upstreamCommit}`);
  console.log(comparison);
}

function assertExists(path, message) {
  if (!existsSync(path)) throw new Error(message);
}

function run(command, args, failureMessage) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim();
    throw new Error(`${failureMessage}${detail ? ` ${detail}` : ""}`);
  }
  return result;
}
