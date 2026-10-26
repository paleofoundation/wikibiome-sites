#!/usr/bin/env node

import content from "../data/content.generated.json" with { type: "json" };
import { articleMediaRegistry } from "../lib/article-media-registry.mjs";
import { articleAliasRedirects } from "../lib/article-alias-redirects.mjs";
import {
  LEGACY_SIGNATURE_REDIRECTS,
  NEVER_PUBLIC_ARTICLE_PATHS,
  PUBLIC_ORIGIN,
  ROUTING_ROBOTS_DISALLOWS,
  SIGNATURE_EXPLORER_REDIRECTS,
} from "../lib/routing-policy.mjs";

const baseUrlArg = process.argv.find((argument) => argument.startsWith("--base-url="));
const externalBaseUrl = baseUrlArg?.slice("--base-url=".length).replace(/\/+$/, "");
const mode = externalBaseUrl ? "external" : "rendered-local";
const failures = [];

let worker;
async function localFetch(pathname, init) {
  if (!worker) {
    const workerUrl = new URL("../dist/server/index.js", import.meta.url);
    workerUrl.searchParams.set("search-audit", `${process.pid}-${Date.now()}`);
    ({ default: worker } = await import(workerUrl.href));
  }
  return worker.fetch(
    new Request(`http://localhost${pathname}`, init),
    {
      ASSETS: {
        fetch: async () => new Response("webp", { headers: { "content-type": "application/octet-stream" } }),
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function fetchPath(pathname, init) {
  return externalBaseUrl
    ? fetch(`${externalBaseUrl}${pathname}`, { ...init, redirect: "manual" })
    : localFetch(pathname, init);
}

function canonicalKey(value) {
  try {
    const url = new URL(value, PUBLIC_ORIGIN);
    const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
    return `${url.origin}${pathname}`;
  } catch {
    return undefined;
  }
}

function metaContent(html, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<meta [^>]*(?:property|name)="${escaped}"[^>]*content="([^"]*)"`, "i"))?.[1];
}

function structuredTypes(html) {
  const types = new Set();
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(match[1].replaceAll("&quot;", '"').replaceAll("&amp;", "&"));
      const nodes = data["@graph"] ?? [data];
      for (const node of nodes) {
        for (const type of Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]) {
          if (type) types.add(type);
        }
      }
    } catch (error) {
      failures.push(`invalid JSON-LD: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return types;
}

const representatives = [
  { path: "/article/akkermansia-muciniphila", type: "article", schema: ["WebPage", "Article", "ImageObject"] },
  { path: "/source/scholefield-2024-brain-metallomics-dementia", type: "source", schema: ["WebPage", "ScholarlyArticle"] },
  { path: "/category/microbe", type: "category", schema: ["CollectionPage"] },
  { path: "/explore", type: "research-tool", schema: ["WebApplication"] },
];

const representativeMetrics = {
  total: representatives.length,
  status200: 0,
  selfCanonical: 0,
  socialPreview: 0,
  structuredData: 0,
};

for (const representative of representatives) {
  const response = await fetchPath(representative.path, { headers: { accept: "text/html" } });
  const html = await response.text();
  if (response.status === 200) representativeMetrics.status200 += 1;
  else failures.push(`${representative.path}: HTTP ${response.status}`);

  const expectedCanonical = canonicalKey(`${PUBLIC_ORIGIN}${representative.path}`);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (canonicalKey(canonical) === expectedCanonical) representativeMetrics.selfCanonical += 1;
  else failures.push(`${representative.path}: canonical ${canonical ?? "missing"}, expected ${expectedCanonical}`);

  const openGraphUrl = metaContent(html, "og:url");
  const openGraphImage = metaContent(html, "og:image");
  const twitterImage = metaContent(html, "twitter:image");
  if (canonicalKey(openGraphUrl) === expectedCanonical && openGraphImage?.startsWith(`${PUBLIC_ORIGIN}/`) && twitterImage?.startsWith(`${PUBLIC_ORIGIN}/`)) {
    representativeMetrics.socialPreview += 1;
  } else {
    failures.push(`${representative.path}: incomplete canonical Open Graph/X preview`);
  }

  const types = structuredTypes(html);
  if (representative.schema.every((type) => types.has(type))) representativeMetrics.structuredData += 1;
  else failures.push(`${representative.path}: missing Schema.org type(s) ${representative.schema.filter((type) => !types.has(type)).join(", ")}`);
}

const [robotsResponse, sitemapResponse, imageSitemapResponse, searchResponse] = await Promise.all([
  fetchPath("/robots.txt"),
  fetchPath("/sitemap.xml"),
  fetchPath("/image-sitemap.xml"),
  fetchPath("/search?q=nickel", { headers: { accept: "text/html" } }),
]);
const [robots, sitemap, searchHtml] = await Promise.all([
  robotsResponse.text(),
  sitemapResponse.text(),
  searchResponse.text(),
]);

if (robotsResponse.status !== 200) failures.push(`/robots.txt: HTTP ${robotsResponse.status}`);
if (sitemapResponse.status !== 200) failures.push(`/sitemap.xml: HTTP ${sitemapResponse.status}`);
if (imageSitemapResponse.status !== 301 || imageSitemapResponse.headers.get("location") !== `${PUBLIC_ORIGIN}/sitemap.xml`) failures.push("image-sitemap.xml must redirect to the sole sitemap");
if (!robots.includes(`Sitemap: ${PUBLIC_ORIGIN}/sitemap.xml`)) failures.push("robots.txt does not advertise the ordinary sitemap");
if (JSON.stringify(robots.match(/^Sitemap: .+$/gm)) !== JSON.stringify([`Sitemap: ${PUBLIC_ORIGIN}/sitemap.xml`])) failures.push("robots.txt must advertise only the canonical sitemap");
for (const path of ROUTING_ROBOTS_DISALLOWS) {
  if (!robots.includes(`Disallow: ${path}`)) failures.push(`robots.txt does not include required exclusion ${path}`);
}

const ordinaryUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (ordinaryUrls.length !== new Set(ordinaryUrls).size) failures.push("ordinary sitemap contains duplicate URLs");
if (ordinaryUrls.some((url) => !url.startsWith(`${PUBLIC_ORIGIN}/`))) failures.push("ordinary sitemap contains a non-canonical origin");

const imagePageUrls = [...sitemap.matchAll(/<url>(?:(?!<\/url>)[\s\S])*?<loc>([^<]+)<\/loc>(?:(?!<\/url>)[\s\S])*?<image:loc>([^<]+)<\/image:loc>[\s\S]*?<\/url>/g)]
  .map((match) => ({ page: match[1], image: match[2] }));
const sitemapArticleIds = new Set(ordinaryUrls.filter((url) => url.includes("/article/")).map((url) => new URL(url).pathname.slice(9)));
const expectedImageEntries = Object.values(articleMediaRegistry)
  .filter(media => sitemapArticleIds.has(media.pageId))
  .map((media) => ({ page: `${PUBLIC_ORIGIN}/article/${media.pageId}`, image: `${PUBLIC_ORIGIN}${media.src}` }))
  .sort((a, b) => a.page.localeCompare(b.page));
const actualImageEntries = imagePageUrls.toSorted((a, b) => a.page.localeCompare(b.page));
if (JSON.stringify(actualImageEntries) !== JSON.stringify(expectedImageEntries)) failures.push("image sitemap does not exactly match the reviewed media registry");
if (/image:(?:title|caption|license)/.test(sitemap)) failures.push("image sitemap emits deprecated metadata tags");

const imageChecks = await Promise.all(expectedImageEntries.map(async (entry) => {
  const path = new URL(entry.image).pathname;
  const response = await fetchPath(path, { method: "HEAD" });
  return {
    path,
    status: response.status,
    contentType: response.headers.get("content-type"),
    cacheControl: response.headers.get("cache-control"),
  };
}));
for (const image of imageChecks) {
  if (image.status !== 200 || image.contentType !== "image/webp" || !image.cacheControl?.includes("immutable")) {
    failures.push(`${image.path}: expected 200 image/webp with immutable caching`);
  }
}

const searchCanonical = searchHtml.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
if (canonicalKey(searchCanonical) !== `${PUBLIC_ORIGIN}/search`) failures.push("parameterized search does not canonicalize to /search");
if (!/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(searchHtml)) failures.push("parameterized search is not noindex");

const sitemapFullResponse = await fetchPath("/sitemap-full.xml");
if (sitemapFullResponse.status !== 301 || sitemapFullResponse.headers.get("location") !== `${PUBLIC_ORIGIN}/sitemap.xml`) failures.push("sitemap-full.xml must redirect to the sole sitemap");
if (ordinaryUrls.includes(`${PUBLIC_ORIGIN}/search`)) failures.push("search must not appear in the sitemap");
for (const path of ["/search", "/search?category=microbe", "/search?q=&category=microbe", "/search?page=2"]) {
  const response = await fetchPath(path);
  const html = await response.text();
  if (response.status !== 200 || !/<meta name="robots" content="noindex, follow"/.test(html)) failures.push(`${path}: expected noindex search`);
}

const redirectChecks = [
  ...SIGNATURE_EXPLORER_REDIRECTS.map(({ source: path, destination: location, status }) => ({ path, location, status })),
  ...LEGACY_SIGNATURE_REDIRECTS.map(({ source: path, destination: location, status }) => ({ path, location, status })),
  ...articleAliasRedirects.map(({ source: path, destination: location }) => ({ path, location, status: 308 })),
  { path: "/article/DNA-damage?utm_source=console", status: 301, location: "/article/dna-damage?utm_source=console" },
];
for (const check of redirectChecks) {
  const response = await fetchPath(check.path, { headers: { accept: "text/html" } });
  if (response.status !== check.status) failures.push(`${check.path}: HTTP ${response.status}, expected ${check.status}`);
  const location = response.headers.get("location");
  if (location !== check.location) failures.push(`${check.path}: location ${location ?? "missing"}, expected ${check.location}`);
}

const htmlRobots = (html) => [...html.matchAll(/<meta name="robots" content="([^"]+)"/gi)].map((match) => match[1]);
const htmlCanonical = (html) => html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
const htmlTitle = (html) => html.match(/<title>(.*?)<\/title>/i)?.[1];
const boundaryChecks = [
  { path: "/article/not-a-real-record", status: 404, title: "Article not found — WikiBiome" },
  ...NEVER_PUBLIC_ARTICLE_PATHS.map((path) => ({ path, status: 410, title: "Article gone — WikiBiome" })),
];
for (const check of boundaryChecks) {
  const response = await fetchPath(check.path, { headers: { accept: "text/html" } });
  const html = await response.text();
  if (response.status !== check.status) failures.push(`${check.path}: HTTP ${response.status}, expected ${check.status}`);
  if (htmlTitle(html) !== check.title) failures.push(`${check.path}: title ${htmlTitle(html) ?? "missing"}, expected ${check.title}`);
  if (htmlCanonical(html) !== `${PUBLIC_ORIGIN}/404`) failures.push(`${check.path}: canonical ${htmlCanonical(html) ?? "missing"}, expected ${PUBLIC_ORIGIN}/404`);
  const robotsMeta = htmlRobots(html);
  if (JSON.stringify(robotsMeta) !== JSON.stringify(["noindex, follow"])) failures.push(`${check.path}: robots metadata ${JSON.stringify(robotsMeta)}, expected one noindex, follow`);
}

const report = {
  mode,
  baseUrl: externalBaseUrl ?? "built worker",
  representative: representativeMetrics,
  ordinarySitemapUrls: ordinaryUrls.length,
  reviewedImageSitemapEntries: actualImageEntries.length,
  reviewedRegistryEntries: expectedImageEntries.length,
  canonicalImageEndpointsHealthy: imageChecks.filter((image) => image.status === 200 && image.contentType === "image/webp" && image.cacheControl?.includes("immutable")).length,
  robotsSitemapsAdvertised: ["sitemap.xml", "image-sitemap.xml"].filter((name) => robots.includes(`Sitemap: ${PUBLIC_ORIGIN}/${name}`)).length,
  parameterizedSearchNoindex: /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(searchHtml),
  auditedRedirectPaths: redirectChecks.length,
  auditedGoneArticlePaths: NEVER_PUBLIC_ARTICLE_PATHS.length,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
