import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { articleQuality, realReferenceKeys, removePlaceholderText } from "../lib/article-quality.mjs";
import { renderedArticleQuality } from "../lib/rendered-article-quality.mjs";
import content from "../data/content.generated.json" with { type: "json" };
import { PLACEHOLDER_PATTERN } from "../lib/article-quality.mjs";

const references = [1, 2, 3].map((number) => ({ id: `study-${number}`, title: `Filed study ${number}`, authors: ["Independent Author"], year: 2024, doi: `10.1234/study-${number}`, missingMetadata: false }));
const page = { category: "microbe", overview: Array(400).fill("word").join(" "), sections: [] };

test("the word and reference boundaries are inclusive and count real unique sources", () => {
  assert.equal(articleQuality(page, references).eligible, true);
  assert.equal(articleQuality({ ...page, overview: Array(399).fill("word").join(" ") }, references).eligible, false);
  assert.equal(articleQuality(page, references.slice(0, 2)).eligible, false);
  assert.equal(realReferenceKeys([...references, references[0], { ...references[0], id: "alias" }]).length, 3);
  assert.equal(realReferenceKeys([{ ...references[0], authors: ["Karen Pendergrass"] }, { ...references[1], missingMetadata: true }, { id: "fake", title: "Claim" }]).length, 0);
});

test("exclusions win even over a long, fully cited body", () => {
  for (const category of ["intervention", "stop"]) assert.equal(articleQuality({ ...page, category }, references).eligible, false);
  assert.equal(articleQuality(page, references, [{ publicLabel: "Evidence-limited source record" }]).eligible, false);
  assert.equal(articleQuality({ ...page, overview: `${page.overview} To be populated from source analysis.` }, references).eligible, false);
});

test("cleanup removes template instructions without creating replacement claims", () => {
  assert.equal(removePlaceholderText("Filed context. Triangle evidence needs to be populated from the source literature."), "Filed context.");
  assert.equal(removePlaceholderText("*To be populated from source analysis.*"), "");
  assert.equal(removePlaceholderText("*No triangles populated yet. Sources discussing this intervention need to be reviewed and triangle edges constructed per CLAUDE.md.*"), "");
  assert.equal(removePlaceholderText("Probiotics are under development."), "Probiotics are under development.");
});

test("the synchronized public corpus contains no visible template instructions", () => {
  for (const record of content.pages) {
    const text = [record.overview, ...(record.sections ?? []).map(({ body }) => body)].join("\n").replace(/<!--[\s\S]*?-->/g, "");
    assert.equal(PLACEHOLDER_PATTERN.test(text), false, record.id);
  }
});

test("citation lists and maintenance comments cannot pad the article word count", () => {
  const padded = { ...page, overview: "Short body.", sections: [{ heading: "Key Sources", body: page.overview }, { heading: "Connections", body: page.overview }, { heading: "Context", body: `<!-- ${page.overview} -->` }] };
  assert.equal(articleQuality(padded, references).bodyWords, 2);
});

test("rendered gate rejects a summary even when the source model passed", () => {
  const row = { reasons: [], realReferenceNumbers: [1, 2, 3] };
  const head = '<meta name="robots" content="index, follow">';
  const refs = [1, 2, 3].map((number) => `<li id="reference-${number}">Citation</li>`).join("");
  const html = `${head}<div class="lead-copy">Short summary.</div><nav>${page.overview}</nav>${refs}`;
  assert.match(renderedArticleQuality(html, row).reasons.join(" "), /rendered body has 2 words/);
  assert.deepEqual(renderedArticleQuality(`${head}<div class="lead-copy">${page.overview}</div>${refs}`, row).reasons, []);
});

test("lint exits nonzero when an excluded URL is inserted into the sitemap", () => {
  const folder = mkdtempSync(join(tmpdir(), "wikibiome-gate-test-"));
  try {
    const path = join(folder, "bad.xml");
    const reportPath = join(folder, "report.json");
    const baseline = spawnSync(process.execPath, ["scripts/lint-sitemap-quality.mjs", `--report=${reportPath}`], { cwd: new URL("../", import.meta.url), encoding: "utf8" });
    assert.equal(baseline.status, 0, baseline.stderr);
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    for (const route of ["/", "/about", "/category/microbe", "/category/metal", "/category/mechanism"]) {
      assert.ok(report.urls.includes(`https://www.wikibiome.com${route}`), route);
    }
    const xml = `<urlset>${report.urls.map(url => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;
    writeFileSync(path, xml.replace("</urlset>", '<url><loc>https://www.wikibiome.com/article/curcumin</loc></url></urlset>'));
    const result = spawnSync(process.execPath, ["scripts/lint-sitemap-quality.mjs", `--sitemap=${path}`], { cwd: new URL("../", import.meta.url), encoding: "utf8", maxBuffer: 1024 * 1024 });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /microbe: PASS\/OK \d+, FAIL\/THIN \d+/);
    assert.match(result.stderr, /curcumin: excluded-section/);
    assert.doesNotMatch(result.stderr, /missing from sitemap/);
    writeFileSync(path, xml.replace('<url><loc>https://www.wikibiome.com/</loc></url>', ''));
    const missingHome = spawnSync(process.execPath, ["scripts/lint-sitemap-quality.mjs", `--sitemap=${path}`], { cwd: new URL("../", import.meta.url), encoding: "utf8" });
    assert.equal(missingHome.status, 1);
    assert.match(missingHome.stderr, /public crawl entry point missing from sitemap/);
    writeFileSync(path, xml.replace("</urlset>", '<url><loc>https://www.wikibiome.com/source/scholefield-2024-brain-metallomics-dementia</loc></url></urlset>'));
    const source = spawnSync(process.execPath, ["scripts/lint-sitemap-quality.mjs", `--sitemap=${path}`], { cwd: new URL("../", import.meta.url), encoding: "utf8" });
    assert.equal(source.status, 1);
    assert.match(source.stderr, /source\/scholefield.*not an eligible article or established public route/);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});
