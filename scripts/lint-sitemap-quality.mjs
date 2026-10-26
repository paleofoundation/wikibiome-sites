#!/usr/bin/env node
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Load the same canonical records and GET handler as production. In-memory
// bundling only resolves TypeScript aliases; no alternate corpus is written.
const root = fileURLToPath(new URL("../", import.meta.url));
const result = await build({ absWorkingDir: root, entryPoints: ["scripts/article-quality-audit.ts"], bundle: true, platform: "node", format: "esm", packages: "external", write: false, logLevel: "silent" });
const { auditSitemap } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
const arg = (name) => process.argv.find((value) => value.startsWith(`${name}=`))?.slice(name.length + 1);
export const report = await auditSitemap(arg("--sitemap") ? readFileSync(arg("--sitemap"), "utf8") : undefined);
for (const section of [...new Set(report.rows.map((row) => row.section))].sort()) {
  const rows = report.rows.filter((row) => row.section === section);
  const ok = rows.filter((row) => row.eligible).length;
  console.log(`${section}: PASS/OK ${ok}, FAIL/THIN ${rows.length - ok}, TOTAL ${rows.length}`);
}
console.log(`Sitemap URLs: ${report.urls.length}; failing URLs: ${report.failures.length}`);
if (arg("--report")) writeFileSync(arg("--report"), `${JSON.stringify(report, null, 2)}\n`);
if (report.failures.length) {
  for (const failure of report.failures) console.error(failure);
  process.exitCode = 1;
}
