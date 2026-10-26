#!/usr/bin/env node

import content from "../data/content.generated.json" with { type: "json" };
import articleAliasRegistry from "../data/article-id-aliases.json" with { type: "json" };

const externalBaseUrl = process.argv.find(value => value.startsWith("--base-url="))?.slice("--base-url=".length).replace(/\/+$/, "");
let worker;
if (!externalBaseUrl) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("audit", `${process.pid}-${Date.now()}`);
  ({ default: worker } = await import(workerUrl.href));
}

const diseaseIds = new Set(content.pages.filter((page) => page.category === "disease").map((page) => page.id));
const normalizeId = (value) => String(value).replace(/\.md$/i, "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const articleIds = new Set();
for (const page of content.pages) {
  const base = page.id.replace(/-signature$/, "");
  articleIds.add(page.category === "signature" && diseaseIds.has(base) ? base : page.id);
}
const legacyArticleRedirects = new Map(
  Object.entries(articleAliasRegistry.aliases).map(([alias, target]) => [`/article/${alias}`, `/article/${target}`]),
);

const initialRoutes = [
  "/",
  "/search?q=nickel",
  "/readiness",
  "/explore",
  "/clusters",
  "/compare",
  "/keystone",
  "/contribute",
  "/support",
  "/about",
  "/researchers",
  "/submit-work",
  "/institutions",
  "/research-standard",
  "/privacy",
  "/terms",
  "/contact",
  ...[...new Set(content.pages.map((page) => page.category))].map((category) => `/category/${category}`),
  ...[...articleIds].map((id) => `/article/${id}`),
  ...legacyArticleRedirects.keys(),
  ...Object.keys(content.sourceLookup).map((id) => `/source/${normalizeId(id)}`),
];

const queued = new Set(initialRoutes);
const pending = [...initialRoutes];
const failures = [];
let checked = 0;
let articleRoutes = 0;
let sourceRoutes = 0;
let articleParagraphs = 0;
let indexableHtmlRoutes = 0;
let selfCanonicalRoutes = 0;

function canonicalKey(value) {
  try {
    const url = new URL(value, "https://www.wikibiome.com");
    const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
    return `${url.origin}${pathname}`;
  } catch {
    return undefined;
  }
}

function visibleWordCount(markup) {
  return markup
    .replace(/<span class="citation-preview"[\s\S]*?<\/span>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/&[^;]+;/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function visibleText(markup) {
  return markup
    .replace(/<span class="citation-preview"[\s\S]*?<\/span>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function auditArticleReadability(pathname, html) {
  const articleBody = html.match(/<article class="article-body[^"]*"[\s\S]*?(?=<section class="references-section"|<footer class="article-provenance"|<\/article>)/)?.[0];
  if (!articleBody) return;
  if (/<\/sup>[.,;:!?]/.test(articleBody)) failures.push(`${pathname}: punctuation appears after an inline citation marker`);
  if (/<\/sup>[,\s]+<sup class="article-citation"/.test(articleBody)) failures.push(`${pathname}: adjacent citation markers retain a comma or space`);
  if (/\s--\s/.test(visibleText(articleBody))) failures.push(`${pathname}: typewriter double hyphen appears in visible article prose`);
  if (/<p(?:\s+class="[^"]*")?>\s*---+\s*<\/p>/.test(articleBody)) failures.push(`${pathname}: Markdown thematic break rendered as article prose`);
  if (/&lt;!--|--&gt;/.test(articleBody)) failures.push(`${pathname}: source maintenance comment rendered as article prose`);
  for (const paragraph of articleBody.matchAll(/<p(?:\s+class="[^"]*")?>([\s\S]*?)<\/p>/g)) {
    const wordCount = visibleWordCount(paragraph[1]);
    articleParagraphs += 1;
    if (wordCount > 90) failures.push(`${pathname}: generated article paragraph has ${wordCount} words (90 maximum): ${visibleText(paragraph[1]).slice(0, 140)}…`);
  }
}

async function render(pathname) {
  const response = externalBaseUrl ? await fetch(`${externalBaseUrl}${pathname}`, { redirect: "manual", headers: { accept: "text/html" } }) : await worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = await response.text();
  checked += 1;
  if (pathname.startsWith("/article/")) articleRoutes += 1;
  if (pathname.startsWith("/source/")) sourceRoutes += 1;

  const redirect = response.status >= 300 && response.status < 400 ? response.headers.get("location") : null;
  const expectedLegacyRedirect = legacyArticleRedirects.get(pathname);
  if (expectedLegacyRedirect) {
    if (response.status !== 308) failures.push(`${pathname}: expected permanent HTTP 308, received ${response.status}`);
    if (redirect !== expectedLegacyRedirect) failures.push(`${pathname}: expected redirect to ${expectedLegacyRedirect}, received ${redirect ?? "none"}`);
  }
  const platformAuthRedirect = redirect && /^\/(?:signin-with-chatgpt|signout-with-chatgpt|callback)(?:[/?#]|$)/.test(redirect);
  if (redirect) {
    if (redirect.startsWith("/") && !platformAuthRedirect && !queued.has(redirect)) {
      queued.add(redirect);
      pending.push(redirect);
    }
  } else if (response.status !== 200) failures.push(`${pathname}: HTTP ${response.status}`);
  if (response.status === 200 && !/<title>[^<]+<\/title>/i.test(html)) failures.push(`${pathname}: document title missing`);
  if (/Server error 500|Oops, an error occurred|Internal Server Error/i.test(html)) failures.push(`${pathname}: runtime error marker rendered`);
  if (response.status === 200 && pathname.startsWith("/article/")) auditArticleReadability(pathname, html);
  if (response.status === 200 && /<html\b/i.test(html) && !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) {
    indexableHtmlRoutes += 1;
    const canonicals = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/gi)].map((match) => match[1]);
    const expected = canonicalKey(new URL(pathname, "https://www.wikibiome.com").pathname);
    if (canonicals.length !== 1) {
      failures.push(`${pathname}: expected one canonical link, found ${canonicals.length}`);
    } else if (canonicalKey(canonicals[0]) !== expected) {
      failures.push(`${pathname}: canonical ${canonicals[0]} does not match ${expected}`);
    } else {
      selfCanonicalRoutes += 1;
    }
  }

  for (const match of html.matchAll(/href="(\/(?:article|source)\/[^"?#]+)[^"]*"/g)) {
    const target = match[1];
    // The authenticated suggestion generator is exercised once in the focused
    // suite; rendering it for every article only repeats the same auth redirect.
    if (target.endsWith("/suggest")) continue;
    if (!queued.has(target)) {
      queued.add(target);
      pending.push(target);
    }
  }
}

const concurrency = 32;
async function workerLoop() {
  while (pending.length) {
    const route = pending.shift();
    if (route) await render(route);
  }
}

await Promise.all(Array.from({ length: concurrency }, workerLoop));

const uniqueFailures = [...new Set(failures)];
console.log(`Rendered corpus audit: ${checked} routes checked (${articleRoutes} articles, ${sourceRoutes} source records, ${articleParagraphs} article paragraphs).`);
console.log(`Canonical audit: ${selfCanonicalRoutes}/${indexableHtmlRoutes} indexable HTML routes emit exactly one self-canonical URL.`);
if (uniqueFailures.length) {
  console.error(`${uniqueFailures.length} route failures detected:`);
  uniqueFailures.slice(0, 50).forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("All discovered internal article and source links resolve successfully.");
