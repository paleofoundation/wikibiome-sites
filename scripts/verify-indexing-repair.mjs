import assert from "node:assert/strict";
import review from "../data/source-indexing-review.json" with { type: "json" };
import content from "../data/content.generated.json" with { type: "json" };

const base = process.argv.find((arg) => arg.startsWith("--base-url="))?.slice(11);
assert.ok(base, "Provide --base-url=http://localhost:PORT or the public production origin");
const results = [];
async function get(path) {
  const response = await fetch(new URL(path, base), { redirect: "manual" });
  return { response, body: await response.text() };
}
const sitemap = await get("/sitemap.xml");
assert.equal(sitemap.response.status, 200);
const entries = [...sitemap.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
const paths = entries.map((entry) => new URL(entry.match(/<loc>([^<]+)<\/loc>/)[1]).pathname);
assert.equal(new Set(paths).size, paths.length, "sitemap must not repeat canonical URLs");
assert.equal(paths.filter((path) => path.startsWith("/source/")).length, 0);
for (const path of ["/", "/about", "/category/microbe", "/category/metal", "/category/mechanism"]) {
  const { response, body } = await get(path);
  assert.equal(response.status, 200, path);
  const robots = [...body.matchAll(/<meta name="robots" content="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(robots, ["index, follow"], path);
  assert.ok(paths.includes(path), `${path} must remain in sitemap`);
  results.push({ path, status: response.status, robots: robots[0], inSitemap: true });
}
for (let i = 0; i < entries.length; i++) {
  if (!paths[i].startsWith("/article/")) assert.doesNotMatch(entries[i], /<lastmod>/, paths[i]);
}
// Every emitted timestamp must originate in an actual content update field.
const contentDates = new Set(content.pages.filter((page) => page.updated && Number.isFinite(Date.parse(page.updated))).map((page) => new Date(page.updated).toISOString()));
for (const entry of entries) {
  const timestamp = entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  if (timestamp) assert.ok(contentDates.has(timestamp), `unverifiable lastmod ${timestamp}`);
}
const sourceCases = [
  ...review.citationOnlySources.map(({ id }) => [id, false]),
  ["scholefield-2024-brain-metallomics-dementia", false],
  ["amadi-2022-dietary-interventions-asd-systematic-review", false],
  ["rizzi-2017-ibs-nickel-diet", false],
];
for (const [id, indexable] of sourceCases) {
  const path = `/source/${id}`;
  const { response, body } = await get(path);
  assert.equal(response.status, 200, path);
  const robots = [...body.matchAll(/<meta name="robots" content="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(robots, [indexable ? "index, follow" : "noindex, follow"], path);
  assert.ok(body.includes(`<link rel="canonical" href="https://www.wikibiome.com${path}"`), path);
  assert.equal(paths.includes(path), indexable, path);
  assert.ok(body.includes("Claim or review this work"), `${path} must retain researcher workflow`);
  results.push({ path, status: response.status, robots: robots[0], inSitemap: indexable });
}
for (const id of ["akkermansia-muciniphila", "autism-spectrum-disorder", "mollicutes"]) {
  const path = `/article/${id}/history`;
  const { response, body } = await get(path);
  assert.equal(response.status, 200, path);
  assert.match(body, /<meta name="robots" content="noindex, follow"/);
  assert.ok(body.includes("Recorded revisions"));
  assert.equal(paths.includes(path), false);
  results.push({ path, status: response.status, robots: "noindex, follow" });
}
for (const [path, destination] of [
  ["/signature-explorer", "/category/signature"],
  ["/signature-explorer.html", "/category/signature"],
  ["/signatures", "/category/signature"],
  ["/signature-explorer.html?disease=autism-spectrum-disorder&tag=a&tag=b", "/article/autism-spectrum-disorder?disease=autism-spectrum-disorder&tag=a&tag=b#signature"],
  ["/signatures?disease=not-a-disease", "/category/signature?disease=not-a-disease"],
]) {
  const { response } = await get(path);
  assert.equal(response.status, 308, path);
  assert.equal(response.headers.get("location"), destination, path);
  assert.equal((await get(destination)).response.status, 200, `${path} final destination`);
  results.push({ path, status: response.status, destination });
}
const robots = await get("/robots.txt");
assert.equal(robots.response.status, 200);
assert.doesNotMatch(robots.body, /^Disallow:\s*\/source\/\s*$/m);
assert.doesNotMatch(robots.body, /^Disallow:\s*\/article\/\*\/history\s*$/m);
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), base, passed: true, sitemapUrls: paths.length, articleUrls: paths.filter((path) => path.startsWith("/article/")).length, publicUrls: paths.filter((path) => !path.startsWith("/article/")).length, sourceUrls: 0, imageEntries: (sitemap.body.match(/<image:image>/g) ?? []).length, results }, null, 2));
