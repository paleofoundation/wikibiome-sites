#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { mergeApprovedMediaReviews } from "./article-media-review-log.mjs";

const args = process.argv.slice(2);
const recordsArgument = valueAfter("--records");
const reviewLogArgument = valueAfter("--review-log") ?? "data/article-media-review-log.json";
const updatedOn = valueAfter("--updated-on");
if (!recordsArgument || !updatedOn) {
  throw new Error("Usage: node scripts/merge-article-media-reviews.mjs --records <approved-records.json> --updated-on YYYY-MM-DD [--review-log <path>]");
}

const reviewLogPath = resolve(process.cwd(), reviewLogArgument);
const additionsPath = resolve(process.cwd(), recordsArgument);
const reviewLog = JSON.parse(readFileSync(reviewLogPath, "utf8"));
const additions = JSON.parse(readFileSync(additionsPath, "utf8"));
const merged = mergeApprovedMediaReviews(reviewLog, additions, updatedOn);
writeFileSync(reviewLogPath, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`Merged ${Object.keys(additions).length} approved media reviews into ${reviewLogArgument}.`);

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
}
