#!/usr/bin/env node

import { articleAliasRedirects } from "../lib/article-alias-redirects.mjs";
import {
  LEGACY_SIGNATURE_REDIRECTS,
  NEVER_PUBLIC_ARTICLE_PATHS,
  ROUTING_ROBOTS_DISALLOWS,
  SIGNATURE_EXPLORER_REDIRECTS,
} from "../lib/routing-policy.mjs";

const DEFAULT_APEX_ORIGIN = "https://wikibiome.com";
const DEFAULT_CANONICAL_ORIGIN = "https://www.wikibiome.com";

export const LEGACY_REDIRECTS = Object.freeze([
  ...SIGNATURE_EXPLORER_REDIRECTS.map(({ source: path, destination, status }) => Object.freeze({ path, destination, status })),
  ...LEGACY_SIGNATURE_REDIRECTS.map(({ source: path, destination, status }) => Object.freeze({ path, destination, status })),
  ...articleAliasRedirects.map(({ source: path, destination }) => Object.freeze({ path, destination, status: 308 })),
  { path: "/article/DNA-damage", status: 301, destination: "/article/dna-damage" },
]);

export const GONE_PATHS = NEVER_PUBLIC_ARTICLE_PATHS;

const REPRESENTATIVES = Object.freeze([
  { path: "/article/akkermansia-muciniphila", schema: ["WebPage", "Article", "ImageObject"] },
  { path: "/source/scholefield-2024-brain-metallomics-dementia", schema: ["WebPage", "ScholarlyArticle"] },
  { path: "/category/microbe", schema: ["CollectionPage"] },
  { path: "/explore", schema: ["WebApplication"] },
]);

const REQUIRED_ROBOTS_RULES = Object.freeze(
  ROUTING_ROBOTS_DISALLOWS.map((path) => `Disallow: ${path}`),
);

function trimOrigin(value) {
  return value.replace(/\/+$/, "");
}

function option(arguments_, name, fallback) {
  const value = arguments_.find((argument) => argument.startsWith(`--${name}=`))?.slice(name.length + 3);
  return value === undefined ? fallback : value;
}

export function parseArguments(arguments_) {
  const expectedImagesValue = option(arguments_, "images", undefined);
  if (expectedImagesValue === undefined) throw new Error("--images is required and must match the intended live release manifest");
  const expectedImages = Number(expectedImagesValue);
  const apexStatus = Number(option(arguments_, "apex-status", "301"));
  const target = option(arguments_, "target", "candidate");
  if (!Number.isInteger(expectedImages) || expectedImages < 0) throw new Error("--images must be a non-negative integer");
  if (![301, 308].includes(apexStatus)) throw new Error("--apex-status must be 301 or 308");
  if (!["candidate", "production"].includes(target)) throw new Error("--target must be candidate or production");
  return {
    apexOrigin: trimOrigin(option(arguments_, "apex", DEFAULT_APEX_ORIGIN)),
    canonicalOrigin: trimOrigin(option(arguments_, "canonical", DEFAULT_CANONICAL_ORIGIN)),
    expectedImages,
    apexStatus,
    target,
    checkAllImages: !arguments_.includes("--sample-images"),
  };
}

function canonicalKey(value) {
  try {
    const url = new URL(value);
    const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
    return `${url.origin}${pathname}${url.search}`;
  } catch {
    return undefined;
  }
}

function canonicalHref(html) {
  return html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1];
}

function metaContent(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${escaped}["'][^>]*content=["']([^"']*)["']`, "i"))?.[1]
    ?? html.match(new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${escaped}["']`, "i"))?.[1];
}

function robotsDirectives(html) {
  return [...html.matchAll(/<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/gi)].map((match) => match[1].toLowerCase());
}

function schemaTypes(html, failures, path) {
  const types = new Set();
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const value = JSON.parse(match[1].replaceAll("&quot;", '"').replaceAll("&amp;", "&"));
      for (const node of value["@graph"] ?? [value]) {
        for (const type of Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]) if (type) types.add(type);
      }
    } catch (error) {
      failures.push(`${path}: invalid JSON-LD (${error instanceof Error ? error.message : String(error)})`);
    }
  }
  return types;
}

function locationKey(response, requestUrl) {
  const location = response.headers.get("location");
  if (!location) return undefined;
  return canonicalKey(new URL(location, requestUrl).toString());
}

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function imageSitemapEntries(xml) {
  return [...xml.matchAll(/<url>(?:(?!<\/url>)[\s\S])*?<loc>([^<]+)<\/loc>(?:(?!<\/url>)[\s\S])*?<image:loc>([^<]+)<\/image:loc>[\s\S]*?<\/url>/g)]
    .map((match) => ({ page: match[1], image: match[2] }));
}

async function request(fetchImpl, url, init, failures) {
  try {
    return await fetchImpl(url, { ...init, redirect: "manual" });
  } catch (error) {
    failures.push(`${url}: request failed (${error instanceof Error ? error.message : String(error)})`);
    return new Response(null, { status: 599 });
  }
}

export async function auditPublicRoutingContract({
  apexOrigin = DEFAULT_APEX_ORIGIN,
  canonicalOrigin = DEFAULT_CANONICAL_ORIGIN,
  expectedImages,
  apexStatus = 301,
  target = "candidate",
  checkAllImages = true,
  fetchImpl = fetch,
} = {}) {
  if (!Number.isInteger(expectedImages) || expectedImages < 0) {
    throw new Error("expectedImages is required and must be a non-negative integer");
  }
  if (!["candidate", "production"].includes(target)) throw new Error("target must be candidate or production");
  apexOrigin = trimOrigin(apexOrigin);
  canonicalOrigin = trimOrigin(canonicalOrigin);
  const candidateDefects = [];
  const liveStaleFindings = [];
  const findings = target === "production" ? liveStaleFindings : candidateDefects;

  for (const method of ["HEAD", "GET"]) {
    for (const path of ["/", "/robots.txt", "/sitemap.xml", "/about", "/unknown/deep/", "/article/DNA-damage?x=two%20words&x=%2F&empty="]) {
      const url = `${apexOrigin}${path}`;
      const response = await request(fetchImpl, url, { method }, findings);
      if (response.status !== apexStatus) findings.push(`apex ${method} ${path}: HTTP ${response.status}, expected ${apexStatus}`);
      if (response.headers.get("location") !== `${canonicalOrigin}${path}`) findings.push(`apex ${method} ${path}: redirect does not preserve exact path and query`);
    }
  }

  for (const redirect of LEGACY_REDIRECTS) {
    const url = `${canonicalOrigin}${redirect.path}`;
    const response = await request(fetchImpl, url, { method: "HEAD" }, findings);
    if (response.status !== redirect.status) findings.push(`${redirect.path}: HTTP ${response.status}, expected ${redirect.status}`);
    if (locationKey(response, url) !== canonicalKey(`${canonicalOrigin}${redirect.destination}`)) {
      findings.push(`${redirect.path}: redirect target is not ${redirect.destination}`);
    }
  }

  for (const path of GONE_PATHS) {
    const response = await request(fetchImpl, `${canonicalOrigin}${path}`, { headers: { accept: "text/html" } }, findings);
    const html = await response.text();
    if (response.status !== 410) findings.push(`${path}: HTTP ${response.status}, expected 410`);
    const directives = robotsDirectives(html);
    if (directives.length !== 1 || directives[0] !== "noindex, follow") findings.push(`${path}: expected exactly one noindex, follow directive`);
    if (canonicalKey(canonicalHref(html)) !== `${canonicalOrigin}/404`) findings.push(`${path}: canonical is not ${canonicalOrigin}/404`);
    if (!/<title>Article gone — WikiBiome<\/title>/i.test(html)) findings.push(`${path}: Article gone title is missing`);
  }

  const missingPath = "/article/lineage-audit-record-that-does-not-exist";
  const missingResponse = await request(fetchImpl, `${canonicalOrigin}${missingPath}`, { headers: { accept: "text/html" } }, findings);
  const missingHtml = await missingResponse.text();
  if (missingResponse.status !== 404) findings.push(`${missingPath}: HTTP ${missingResponse.status}, expected 404`);
  const missingDirectives = robotsDirectives(missingHtml);
  if (missingDirectives.length !== 1 || !missingDirectives[0].split(",").map((value) => value.trim()).includes("noindex")) {
    findings.push(`${missingPath}: missing page must emit one unambiguous noindex directive`);
  }
  if (canonicalKey(canonicalHref(missingHtml)) !== `${canonicalOrigin}/404`) findings.push(`${missingPath}: canonical is not ${canonicalOrigin}/404`);

  const representativeMetrics = { total: REPRESENTATIVES.length, status200: 0, selfCanonical: 0, socialPreview: 0, structuredData: 0 };
  for (const representative of REPRESENTATIVES) {
    const response = await request(fetchImpl, `${canonicalOrigin}${representative.path}`, { headers: { accept: "text/html" } }, findings);
    const html = await response.text();
    if (response.status === 200) representativeMetrics.status200 += 1;
    else findings.push(`${representative.path}: HTTP ${response.status}`);
    if (canonicalKey(canonicalHref(html)) === `${canonicalOrigin}${representative.path}`) representativeMetrics.selfCanonical += 1;
    else findings.push(`${representative.path}: missing self-canonical URL`);
    if (
      canonicalKey(metaContent(html, "og:url")) === `${canonicalOrigin}${representative.path}`
      && metaContent(html, "og:image")?.startsWith(`${canonicalOrigin}/`)
      && metaContent(html, "twitter:image")?.startsWith(`${canonicalOrigin}/`)
    ) representativeMetrics.socialPreview += 1;
    else findings.push(`${representative.path}: incomplete canonical Open Graph/X preview`);
    const types = schemaTypes(html, findings, representative.path);
    if (representative.schema.every((type) => types.has(type))) representativeMetrics.structuredData += 1;
    else findings.push(`${representative.path}: missing Schema.org type(s) ${representative.schema.filter((type) => !types.has(type)).join(", ")}`);
  }

  const [robotsResponse, sitemapResponse, fullSitemapResponse, imageSitemapResponse, supportResponse, thankYouResponse, checkoutResponse] = await Promise.all([
    request(fetchImpl, `${canonicalOrigin}/robots.txt`, undefined, findings),
    request(fetchImpl, `${canonicalOrigin}/sitemap.xml`, undefined, findings),
    request(fetchImpl, `${canonicalOrigin}/sitemap-full.xml`, undefined, findings),
    request(fetchImpl, `${canonicalOrigin}/image-sitemap.xml`, undefined, findings),
    request(fetchImpl, `${canonicalOrigin}/support`, { headers: { accept: "text/html" } }, findings),
    request(fetchImpl, `${canonicalOrigin}/support/thank-you`, { headers: { accept: "text/html" } }, findings),
    request(fetchImpl, `${canonicalOrigin}/api/create-checkout`, undefined, findings),
  ]);
  const [robots, sitemap, supportHtml] = await Promise.all([
    robotsResponse.text(), sitemapResponse.text(), supportResponse.text(),
  ]);

  for (const [path, response] of [["/robots.txt", robotsResponse], ["/sitemap.xml", sitemapResponse]]) {
    if (response.status !== 200) findings.push(`${path}: HTTP ${response.status}`);
  }
  for (const rule of REQUIRED_ROBOTS_RULES) if (!robots.includes(rule)) findings.push(`robots.txt: missing ${rule}`);
  if (JSON.stringify(robots.match(/^Sitemap: .+$/gm)) !== JSON.stringify([`Sitemap: ${canonicalOrigin}/sitemap.xml`])) findings.push("robots.txt: must advertise exactly the canonical sitemap");
  for (const [path, response] of [["/sitemap-full.xml", fullSitemapResponse], ["/image-sitemap.xml", imageSitemapResponse]]) {
    if (response.status !== 301 || response.headers.get("location") !== `${canonicalOrigin}/sitemap.xml`) findings.push(`${path}: must 301 to canonical sitemap.xml`);
  }

  const ordinaryUrls = sitemapLocations(sitemap);
  if (ordinaryUrls.length !== new Set(ordinaryUrls).size) findings.push("sitemap.xml: duplicate URLs");
  if (ordinaryUrls.some((url) => !url.startsWith(`${canonicalOrigin}/`))) findings.push("sitemap.xml: non-canonical origin");
  if (ordinaryUrls.includes(`${canonicalOrigin}/search`)) findings.push("sitemap.xml: search is advertised");
  const retiredPaths = new Set([...LEGACY_REDIRECTS.map((item) => item.path), ...GONE_PATHS]);
  if (ordinaryUrls.some((url) => retiredPaths.has(new URL(url).pathname))) findings.push("sitemap.xml: redirect or Gone URL is advertised");
  for (const prefix of ["/article/", "/category/"]) {
    if (!ordinaryUrls.some((url) => new URL(url).pathname.startsWith(prefix))) findings.push(`sitemap.xml: no ${prefix} records`);
  }
  if (ordinaryUrls.some((url) => new URL(url).pathname.startsWith("/source/"))) findings.push("sitemap.xml: citation-only source URL is advertised");

  const imageEntries = imageSitemapEntries(sitemap);
  if (imageEntries.length !== expectedImages) findings.push(`image-sitemap.xml: ${imageEntries.length} entries, expected ${expectedImages}`);
  if (/image:(?:title|caption|license)/.test(sitemap)) findings.push("image-sitemap.xml: deprecated metadata tags are present");
  if (imageEntries.some(({ page }) => !page.startsWith(`${canonicalOrigin}/article/`))) findings.push("image-sitemap.xml: non-canonical article URL");
  if (imageEntries.some(({ image }) => !image.startsWith(`${canonicalOrigin}/media/image/`))) findings.push("image-sitemap.xml: non-canonical image URL");

  const imageChecks = checkAllImages ? imageEntries : imageEntries.slice(0, Math.min(5, imageEntries.length));
  let healthyImages = 0;
  for (const entry of imageChecks) {
    const response = await request(fetchImpl, entry.image, { method: "HEAD" }, findings);
    if (response.status === 200 && response.headers.get("content-type")?.startsWith("image/webp") && response.headers.get("cache-control")?.includes("immutable")) healthyImages += 1;
    else findings.push(`${entry.image}: expected 200 image/webp with immutable caching`);
  }

  if (supportResponse.status !== 200 || canonicalKey(canonicalHref(supportHtml)) !== `${canonicalOrigin}/support`) findings.push("/support: expected a self-canonical 200 page");
  if (thankYouResponse.status !== 307 || locationKey(thankYouResponse, `${canonicalOrigin}/support/thank-you`) !== `${canonicalOrigin}/support`) {
    findings.push("/support/thank-you: expected redirect to /support");
  }
  if (checkoutResponse.status !== 404) findings.push(`/api/create-checkout: HTTP ${checkoutResponse.status}, expected 404 while Payment Link is authoritative`);

  return {
    target,
    apexOrigin,
    canonicalOrigin,
    expectedImages,
    routingPolicy: {
      legacyRedirects: LEGACY_REDIRECTS.length,
      gonePaths: GONE_PATHS.length,
      robotsDisallows: REQUIRED_ROBOTS_RULES.length,
    },
    representative: representativeMetrics,
    ordinarySitemapUrls: ordinaryUrls.length,
    imageSitemapEntries: imageEntries.length,
    imageEndpointsChecked: imageChecks.length,
    healthyImageEndpoints: healthyImages,
    candidateDefectCount: candidateDefects.length,
    liveStaleFindingCount: liveStaleFindings.length,
    candidateDefects,
    liveStaleFindings,
    failures: [...candidateDefects, ...liveStaleFindings],
  };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const report = await auditPublicRoutingContract(options);
  console.log(JSON.stringify(report, null, 2));
  if (report.failures.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href) await main();
