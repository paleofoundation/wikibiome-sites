#!/usr/bin/env node

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { articleMediaRegistry } from "../lib/article-media-registry.mjs";
import { articleMediaXmp } from "../lib/article-media-metadata.mjs";
import { assertArticleMediaRecord } from "../lib/article-media-validation.mjs";

if (!process.argv.includes("--acknowledge-lossy-source")) {
  throw new Error("Refusing reconstruction without --acknowledge-lossy-source. This command is only for the eight reviewed baseline derivatives whose original masters were not retained.");
}

const projectRoot = process.cwd();
const masters = resolve(projectRoot, "media/masters");
const derivatives = resolve(projectRoot, "public/media-files");
await mkdir(masters, { recursive: true });

let created = 0;
for (const media of Object.values(articleMediaRegistry)) {
  assertArticleMediaRecord(media);
  if (!media.masterProvenance.startsWith("Lossless preservation master reconstructed")) continue;
  const target = join(masters, media.masterSource);
  if (existsSync(target)) continue;
  const source = join(derivatives, media.publishedFile);
  if (!existsSync(source)) throw new Error(`${media.pageId}: reviewed source derivative is missing.`);
  await sharp(source)
    .withXmp(articleMediaXmp(media))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(target);
  created += 1;
}

console.log(`Created ${created} non-overwriting lossless preservation masters from the reviewed baseline derivatives.`);
