import assert from "node:assert/strict";
import test from "node:test";

import {
  AUDIT_GATE_ISO,
  evaluateApexCanonical,
  evaluateContributionAuthBoundary,
  evaluateGate,
  evaluateHtmlRoute,
  evaluateHttpsUpgrade,
  evaluateRobots,
  evaluateSitemap,
  extractCanonical,
  summarizeChecks,
} from "../scripts/audit-wikibiome-post-cutover.mjs";

test("enforces the September 7 Asia/Nicosia gate", () => {
  assert.equal(evaluateGate(new Date("2026-09-06T20:59:59.999Z")).satisfied, false);
  assert.equal(evaluateGate(new Date(AUDIT_GATE_ISO)).satisfied, true);
});

test("extracts canonical links regardless of attribute order", () => {
  assert.equal(
    extractCanonical('<link href="https://www.wikibiome.com/article/nickel" rel="canonical">'),
    "https://www.wikibiome.com/article/nickel",
  );
  assert.equal(
    extractCanonical('<link rel="stylesheet"><link rel="canonical" href="https://www.wikibiome.com/support">'),
    "https://www.wikibiome.com/support",
  );
});

test("accepts either an apex redirect or an exact www canonical", () => {
  assert.equal(
    evaluateApexCanonical({
      status: 303,
      location: "https://www.wikibiome.com/",
      canonical: null,
    }).passed,
    true,
  );
  assert.equal(
    evaluateApexCanonical({
      status: 200,
      location: null,
      canonical: "https://www.wikibiome.com",
    }).passed,
    true,
  );
  assert.equal(
    evaluateApexCanonical({
      status: 200,
      location: null,
      canonical: "https://wikibiome.com",
    }).passed,
    false,
  );
});

test("requires a finite HTTP-to-HTTPS redirect chain", () => {
  const result = evaluateHttpsUpgrade({
    id: "http_www_https_upgrade",
    chain: {
      startUrl: "http://www.wikibiome.com/",
      finalUrl: "https://www.wikibiome.com/",
      loop: false,
      exceeded: false,
      error: null,
      hops: [
        {
          url: "http://www.wikibiome.com/",
          status: 308,
          location: "https://www.wikibiome.com/",
        },
        { url: "https://www.wikibiome.com/", status: 200, location: null },
      ],
    },
    allowedFinalUrls: ["https://www.wikibiome.com/"],
  });
  assert.equal(result.passed, true);
  assert.equal(
    evaluateHttpsUpgrade({
      id: "http_www_https_upgrade",
      chain: { ...result.evidence, loop: true, error: "Redirect loop detected" },
      allowedFinalUrls: ["https://www.wikibiome.com/"],
    }).passed,
    false,
  );
});

test("fails route-specific pages that canonicalize to the homepage", () => {
  const result = evaluateHtmlRoute({
    id: "support",
    status: 200,
    canonical: "https://www.wikibiome.com",
    canonicalPath: "/support",
    title: "Support WikiBiome",
    bytes: 100,
  });
  assert.equal(result.passed, false);
  assert.equal(result.evidence.expectedCanonical, "https://www.wikibiome.com/support");
});

test("requires the unauthenticated contribution ledger to retain its sign-in boundary", () => {
  assert.equal(
    evaluateContributionAuthBoundary({
      status: 307,
      location: "/signin-with-chatgpt?return_to=%2Fcontributions",
    }).passed,
    true,
  );
  assert.equal(
    evaluateContributionAuthBoundary({ status: 200, location: null }).passed,
    false,
  );
});

test("validates sitemap host, count, and representative records", () => {
  const samples = [
    "https://www.wikibiome.com/article/nickel",
    "https://www.wikibiome.com/source/ahmed-2025-metals-alzheimers-mechanistic-review",
  ];
  const filler = Array.from(
    { length: 2_498 },
    (_, index) => `https://www.wikibiome.com/article/example-${index}`,
  );
  const body = `<urlset>${[...samples, ...filler]
    .map((url) => `<url><loc>${url}</loc></url>`)
    .join("")}</urlset>`;
  assert.equal(
    evaluateSitemap({ status: 200, contentType: "application/xml; charset=utf-8", body }).passed,
    true,
  );
  assert.equal(
    evaluateSitemap({
      status: 200,
      contentType: "application/xml",
      body: body.replace("www.wikibiome.com/article/example-0", "wikibiome.com/article/example-0"),
    }).passed,
    false,
  );
});

test("validates the canonical sitemap declaration in robots", () => {
  assert.equal(
    evaluateRobots({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: "User-agent: *\nAllow: /\nSitemap: https://www.wikibiome.com/sitemap.xml\n",
    }).passed,
    true,
  );
});

test("summarizes required failures without treating diagnostics as release failures", () => {
  assert.deepEqual(
    summarizeChecks([
      { id: "a", required: true, passed: true },
      { id: "b", required: true, passed: false },
      { id: "c", required: false, passed: false },
    ]),
    {
      total: 3,
      requiredPassed: 1,
      requiredFailed: 1,
      diagnosticPassed: 0,
      diagnosticFailed: 1,
      failedIds: ["b", "c"],
    },
  );
});
