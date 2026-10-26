import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  GONE_PATHS,
  LEGACY_REDIRECTS,
  auditPublicRoutingContract,
  parseArguments,
} from "../scripts/audit-public-routing-contract.mjs";
import { articleAliasRedirects } from "../lib/article-alias-redirects.mjs";
import {
  LEGACY_SIGNATURE_REDIRECTS,
  NEVER_PUBLIC_ARTICLE_PATHS,
  ROUTING_ROBOTS_DISALLOWS,
  SIGNATURE_EXPLORER_REDIRECTS,
} from "../lib/routing-policy.mjs";

const apex = "https://apex.example";
const canonical = "https://www.example";

function metadata(path, types, { noindex = false } = {}) {
  const url = `${canonical}${path}`;
  return `<!doctype html><html><head><title>Example</title><link rel="canonical" href="${url}"><meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}"><meta property="og:url" content="${url}"><meta property="og:image" content="${canonical}/media/social/example.webp"><meta name="twitter:image" content="${canonical}/media/social/example.webp"><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": types.map((type) => ({ "@type": type })) })}</script></head></html>`;
}

function fixtureFetch({ brokenRedirect = false } = {}) {
  const redirects = new Map(LEGACY_REDIRECTS.map((item) => [item.path, item]));
  const images = [
    { page: `${canonical}/article/one`, image: `${canonical}/media/image/one.webp` },
    { page: `${canonical}/article/two`, image: `${canonical}/media/image/two.webp` },
  ];
  const sitemap = `<?xml version="1.0"?><urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${images.map(({ page, image }) => `<url><loc>${page}</loc><image:image><image:loc>${image}</image:loc></image:image></url>`).join("")}<url><loc>${canonical}/category/microbe</loc></url></urlset>`;
  const robots = [
    "User-agent: *",
    "Allow: /",
    ...ROUTING_ROBOTS_DISALLOWS.map((path) => `Disallow: ${path}`),
    `Sitemap: ${canonical}/sitemap.xml`,
  ].join("\n");

  return async (input) => {
    const url = new URL(input);
    if (url.origin === apex) return new Response(null, { status: 301, headers: { location: `${canonical}${url.pathname}${url.search}` } });
    const redirect = redirects.get(url.pathname);
    if (redirect) return new Response(null, { status: brokenRedirect ? 200 : redirect.status, headers: { location: `${canonical}${redirect.destination}` } });
    if (GONE_PATHS.includes(url.pathname)) {
      return new Response(`<!doctype html><title>Article gone — WikiBiome</title><meta name="robots" content="noindex, follow"><link rel="canonical" href="${canonical}/404">`, { status: 410 });
    }
    if (url.pathname === "/article/lineage-audit-record-that-does-not-exist") return new Response(`<!doctype html><title>Not found</title><meta name="robots" content="noindex, follow"><link rel="canonical" href="${canonical}/404">`, { status: 404 });
    if (url.pathname === "/robots.txt") return new Response(robots);
    if (url.pathname === "/sitemap.xml") return new Response(sitemap);
    if (["/sitemap-full.xml", "/image-sitemap.xml"].includes(url.pathname)) return new Response(null, { status: 301, headers: { location: `${canonical}/sitemap.xml` } });
    if (url.pathname.startsWith("/media/image/")) return new Response(null, { headers: { "content-type": "image/webp", "cache-control": "public, max-age=31536000, immutable" } });
    if (url.pathname === "/support") return new Response(`${metadata("/support", [])}<a href="https://buy.stripe.com/example">Support</a>`);
    if (url.pathname === "/support/thank-you") return new Response(null, { status: 307, headers: { location: "/support" } });
    if (url.pathname === "/api/create-checkout") return new Response(null, { status: 404 });
    const representative = {
      "/article/akkermansia-muciniphila": ["WebPage", "Article", "ImageObject"],
      "/source/scholefield-2024-brain-metallomics-dementia": ["WebPage", "ScholarlyArticle"],
      "/category/microbe": ["CollectionPage"],
      "/explore": ["WebApplication"],
    }[url.pathname];
    if (representative) return new Response(metadata(url.pathname, representative));
    return new Response(null, { status: 404 });
  };
}

test("parses explicit public audit options", () => {
  assert.deepEqual(parseArguments(["--apex=https://a.example/", "--canonical=https://c.example/", "--images=7", "--apex-status=301", "--sample-images"]), {
    apexOrigin: "https://a.example",
    canonicalOrigin: "https://c.example",
    expectedImages: 7,
    apexStatus: 301,
    target: "candidate",
    checkAllImages: false,
  });
  assert.throws(() => parseArguments(["--images=-1"]), /non-negative integer/);
  assert.throws(() => parseArguments([]), /--images is required/);
  assert.throws(() => parseArguments(["--images=7", "--apex-status=302"]), /301 or 308/);
  assert.throws(() => parseArguments(["--images=7", "--target=preview"]), /candidate or production/);
});

test("documents count-explicit predeployment and postdeployment public audits", () => {
  const runbook = readFileSync(new URL("../docs/operations/indexing-runbook.md", import.meta.url), "utf8");
  assert.match(runbook, /--images=<release-registry-count> --target=production/);
  assert.match(runbook, /--images=<deployed-registry-count> --target=candidate/);
  assert.match(runbook, /Never copy a previous count forward as a default/);
  assert.match(runbook, /search-baseline-2026-09-05\.md/);
});

test("derives redirects and every Gone route from authoritative policy", () => {
  assert.strictEqual(GONE_PATHS, NEVER_PUBLIC_ARTICLE_PATHS);
  assert.ok(GONE_PATHS.length > 5, "the verifier must cover the generated exclusion set, not the former five-path sample");
  assert.equal(
    LEGACY_REDIRECTS.length,
    SIGNATURE_EXPLORER_REDIRECTS.length + LEGACY_SIGNATURE_REDIRECTS.length + articleAliasRedirects.length + 1,
  );
  assert.ok(LEGACY_REDIRECTS.some(({ path }) => path === "/article/candida-auris/history"));
});

test("accepts a complete lineage-neutral public contract", async () => {
  const report = await auditPublicRoutingContract({
    apexOrigin: apex,
    canonicalOrigin: canonical,
    expectedImages: 2,
    fetchImpl: fixtureFetch(),
  });
  assert.deepEqual(report.failures, []);
  assert.deepEqual(report.representative, { total: 4, status200: 4, selfCanonical: 4, socialPreview: 4, structuredData: 4 });
  assert.equal(report.healthyImageEndpoints, 2);
  assert.equal(report.candidateDefectCount, 0);
  assert.equal(report.liveStaleFindingCount, 0);
  assert.deepEqual(report.candidateDefects, []);
  assert.deepEqual(report.liveStaleFindings, []);
});

test("requires explicit media coverage in programmatic audits", async () => {
  await assert.rejects(() => auditPublicRoutingContract({ fetchImpl: fixtureFetch() }), /expectedImages is required/);
});

test("reports an exact legacy status regression", async () => {
  const report = await auditPublicRoutingContract({
    apexOrigin: apex,
    canonicalOrigin: canonical,
    expectedImages: 2,
    fetchImpl: fixtureFetch({ brokenRedirect: true }),
  });
  assert.ok(report.failures.some((failure) => failure.includes("/signature-explorer: HTTP 200, expected 308")));
  assert.ok(report.candidateDefects.length > 0);
  assert.ok(report.candidateDefectCount > 0);
  assert.deepEqual(report.liveStaleFindings, []);
});

test("separates observed production drift from candidate defects", async () => {
  const report = await auditPublicRoutingContract({
    apexOrigin: apex,
    canonicalOrigin: canonical,
    expectedImages: 2,
    target: "production",
    fetchImpl: fixtureFetch({ brokenRedirect: true }),
  });
  assert.deepEqual(report.candidateDefects, []);
  assert.equal(report.candidateDefectCount, 0);
  assert.equal(report.liveStaleFindingCount, report.liveStaleFindings.length);
  assert.ok(report.liveStaleFindings.some((finding) => finding.includes("/signature-explorer: HTTP 200, expected 308")));
});
