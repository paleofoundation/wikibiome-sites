#!/usr/bin/env node

import { resolve4, resolveCname } from "node:dns/promises";
import { pathToFileURL } from "node:url";
import tls from "node:tls";

export const AUDIT_GATE_ISO = "2026-09-06T21:00:00.000Z";
export const CANONICAL_ORIGIN = "https://www.wikibiome.com";
export const STRIPE_SUPPORT_URL = "https://buy.stripe.com/bJefZjaif6IFd8Z4PL6EU03";
export const LEGACY_DEPLOYMENT_URL =
  "https://wikibiome-kziwi715f-karen-pendergrass-projects.vercel.app/";
export const LEGACY_CNAME = "7d875abacccdc8f1.vercel-dns-016.com";

const USER_AGENT = "WikiBiome post-cutover audit/1.0";
const FETCH_TIMEOUT_MS = 20_000;
const MAX_REDIRECTS = 8;

export const HTML_ROUTES = [
  { id: "home", path: "/", canonicalPath: "/" },
  { id: "category", path: "/category/microbe", canonicalPath: "/category/microbe" },
  { id: "article", path: "/article/nickel", canonicalPath: "/article/nickel" },
  {
    id: "source",
    path: "/source/ahmed-2025-metals-alzheimers-mechanistic-review",
    canonicalPath: "/source/ahmed-2025-metals-alzheimers-mechanistic-review",
  },
  { id: "search", path: "/search?q=nickel", canonicalPath: "/search" },
  { id: "support", path: "/support", canonicalPath: "/support" },
  {
    id: "support_thank_you",
    path: "/support/thank-you",
    canonicalPath: "/support/thank-you",
  },
  { id: "contribute", path: "/contribute", canonicalPath: "/contribute" },
  { id: "explore", path: "/explore?focus=nickel", canonicalPath: "/explore" },
  {
    id: "clusters",
    path: "/clusters?condition=alzheimers-disease",
    canonicalPath: "/clusters",
  },
  {
    id: "compare",
    path: "/compare?a=alzheimers-disease&b=parkinsons-disease",
    canonicalPath: "/compare",
  },
  { id: "keystone", path: "/keystone", canonicalPath: "/keystone" },
];

export const MANUAL_EVIDENCE = [
  {
    id: "production_identity",
    requirement:
      "Read the active Sites project, version, deployment, and source commit metadata at audit time.",
  },
  {
    id: "representative_browser",
    requirement: "Render representative routes in a real browser and inspect console/network state.",
  },
  {
    id: "owner_auth_moderation",
    requirement:
      "Authenticate as the owner and confirm the live moderation queue read-only without changing account or contribution data.",
  },
  {
    id: "stripe_api",
    requirement:
      "Read the live Microbiome Signatures LLC Payment Link configuration, disclosure, amount model, and after-completion redirect without creating a Checkout Session.",
  },
  {
    id: "worker_logs",
    requirement:
      "Query the available recent production worker-log window and resolve every 5xx, exception, error, or failed outcome.",
  },
  {
    id: "search_index",
    requirement:
      "Capture public search results and available Search Console or Bing evidence that canonical www URLs are entering indexes.",
  },
  {
    id: "vercel_rollback_metadata",
    requirement:
      "Confirm the retained Vercel deployment is Ready and still retains the former domain-alias rollback metadata.",
  },
];

function normalizeUrl(value) {
  if (!value) return null;
  const url = new URL(value);
  url.hash = "";
  if (url.pathname === "/") url.pathname = "";
  return url.toString().replace(/\/$/, "");
}

function decodeHtmlAttribute(value) {
  return value
    ?.replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export function extractCanonical(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const rel = tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
    if (!rel.split(/\s+/).some((value) => value.toLowerCase() === "canonical")) continue;
    return decodeHtmlAttribute(tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1]) ?? null;
  }
  return null;
}

export function extractTitle(html) {
  return decodeHtmlAttribute(html.match(/<title>([^<]+)<\/title>/i)?.[1]) ?? null;
}

export function evaluateGate(now = new Date()) {
  const gate = new Date(AUDIT_GATE_ISO);
  return {
    gateIso: AUDIT_GATE_ISO,
    nowIso: now.toISOString(),
    satisfied: now.valueOf() >= gate.valueOf(),
    millisecondsRemaining: Math.max(0, gate.valueOf() - now.valueOf()),
  };
}

export function evaluateApexCanonical({ status, location, canonical }) {
  const expected = normalizeUrl(`${CANONICAL_ORIGIN}/`);
  const redirected = [301, 302, 303, 307, 308].includes(status)
    && normalizeUrl(new URL(location, "https://wikibiome.com/").toString()) === expected;
  const canonicalized = status === 200 && normalizeUrl(canonical) === expected;
  return {
    passed: redirected || canonicalized,
    mode: redirected ? "redirect" : canonicalized ? "canonical" : "invalid",
    expected,
    observed: { status, location: location ?? null, canonical: canonical ?? null },
  };
}

export function evaluateHttpsUpgrade({ id, chain, allowedFinalUrls }) {
  const first = chain.hops[0] ?? null;
  const final = chain.hops.at(-1) ?? null;
  const allowed = allowedFinalUrls.map(normalizeUrl);
  const finalUrl = normalizeUrl(chain.finalUrl);
  return {
    id,
    category: "http",
    required: true,
    passed:
      !chain.error
      && !chain.loop
      && !chain.exceeded
      && chain.hops.length >= 2
      && [301, 302, 303, 307, 308].includes(first?.status)
      && final?.status === 200
      && allowed.includes(finalUrl),
    evidence: {
      startUrl: chain.startUrl,
      finalUrl: chain.finalUrl,
      allowedFinalUrls,
      loop: chain.loop,
      exceeded: chain.exceeded,
      error: chain.error,
      hops: chain.hops,
    },
  };
}

export function evaluateHtmlRoute({ id, status, canonical, canonicalPath, title, bytes }) {
  const expectedCanonical = normalizeUrl(new URL(canonicalPath, CANONICAL_ORIGIN).toString());
  const observedCanonical = normalizeUrl(canonical);
  const evidence = {
    status,
    title,
    bytes,
    expectedCanonical,
    observedCanonical,
  };
  return {
    id: `http_${id}`,
    category: "http",
    required: true,
    passed: status === 200 && observedCanonical === expectedCanonical,
    evidence,
  };
}

export function evaluateContributionAuthBoundary({ status, location }) {
  const redirectedToSignIn = [301, 302, 303, 307, 308].includes(status)
    && location?.startsWith("/signin-with-chatgpt");
  return {
    id: "contribution_auth_boundary",
    category: "auth",
    required: true,
    passed: Boolean(redirectedToSignIn),
    evidence: { status, location: location ?? null },
  };
}

export function evaluateSitemap({ status, contentType, body, minimumUrlCount = 2_500 }) {
  const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    decodeHtmlAttribute(match[1]),
  );
  const invalidHosts = locations.filter((value) => {
    try {
      return new URL(value).origin !== CANONICAL_ORIGIN;
    } catch {
      return true;
    }
  });
  const requiredSamples = [
    `${CANONICAL_ORIGIN}/article/nickel`,
    `${CANONICAL_ORIGIN}/source/ahmed-2025-metals-alzheimers-mechanistic-review`,
  ];
  const missingSamples = requiredSamples.filter((value) => !locations.includes(value));
  const evidence = {
    status,
    contentType,
    urlCount: locations.length,
    minimumUrlCount,
    invalidHostCount: invalidHosts.length,
    invalidHostSamples: invalidHosts.slice(0, 10),
    missingSamples,
  };
  return {
    id: "sitemap",
    category: "indexing",
    required: true,
    passed:
      status === 200
      && /^application\/xml\b/i.test(contentType ?? "")
      && locations.length >= minimumUrlCount
      && invalidHosts.length === 0
      && missingSamples.length === 0,
    evidence,
  };
}

export function evaluateRobots({ status, contentType, body }) {
  const expected = `Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`;
  return {
    id: "robots",
    category: "indexing",
    required: true,
    passed:
      status === 200
      && /^text\/plain\b/i.test(contentType ?? "")
      && body.split(/\r?\n/).includes(expected),
    evidence: { status, contentType, expected, present: body.includes(expected) },
  };
}

export function summarizeChecks(checks) {
  const required = checks.filter((check) => check.required);
  const diagnostic = checks.filter((check) => !check.required);
  return {
    total: checks.length,
    requiredPassed: required.filter((check) => check.passed).length,
    requiredFailed: required.filter((check) => !check.passed).length,
    diagnosticPassed: diagnostic.filter((check) => check.passed).length,
    diagnosticFailed: diagnostic.filter((check) => !check.passed).length,
    failedIds: checks.filter((check) => !check.passed).map((check) => check.id),
  };
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "user-agent": USER_AGENT },
  });
  return {
    status: response.status,
    location: response.headers.get("location"),
    contentType: response.headers.get("content-type"),
    cacheControl: response.headers.get("cache-control"),
    body: await response.text(),
  };
}

async function captureRedirectChain(startUrl) {
  const hops = [];
  const visited = new Set();
  let current = new URL(startUrl);

  for (let index = 0; index <= MAX_REDIRECTS; index += 1) {
    const currentUrl = current.toString();
    if (visited.has(currentUrl)) {
      return {
        startUrl,
        finalUrl: currentUrl,
        hops,
        loop: true,
        exceeded: false,
        error: "Redirect loop detected",
      };
    }
    visited.add(currentUrl);

    let response;
    try {
      response = await fetchText(current);
    } catch (error) {
      return {
        startUrl,
        finalUrl: currentUrl,
        hops,
        loop: false,
        exceeded: false,
        error: error.message,
      };
    }

    hops.push({ url: currentUrl, status: response.status, location: response.location });
    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return {
        startUrl,
        finalUrl: currentUrl,
        hops,
        loop: false,
        exceeded: false,
        error: null,
      };
    }
    if (!response.location) {
      return {
        startUrl,
        finalUrl: currentUrl,
        hops,
        loop: false,
        exceeded: false,
        error: "Redirect response omitted Location",
      };
    }
    current = new URL(response.location, current);
  }

  return {
    startUrl,
    finalUrl: current.toString(),
    hops,
    loop: false,
    exceeded: true,
    error: `Redirect chain exceeded ${MAX_REDIRECTS} hops`,
  };
}

async function captureTls(hostname) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, rejectUnauthorized: true },
      () => {
        const certificate = socket.getPeerCertificate();
        resolve({
          id: `tls_${hostname}`,
          category: "tls",
          required: true,
          passed: socket.authorized && Boolean(certificate?.fingerprint256),
          evidence: {
            authorized: socket.authorized,
            authorizationError: socket.authorizationError ?? null,
            subject: certificate?.subject ?? null,
            subjectAltName: certificate?.subjectaltname ?? null,
            issuer: certificate?.issuer ?? null,
            validFrom: certificate?.valid_from ?? null,
            validTo: certificate?.valid_to ?? null,
            fingerprint256: certificate?.fingerprint256 ?? null,
          },
        });
        socket.end();
      },
    );
    socket.setTimeout(10_000, () => socket.destroy(new Error("TLS timeout")));
    socket.on("error", (error) => {
      resolve({
        id: `tls_${hostname}`,
        category: "tls",
        required: true,
        passed: false,
        evidence: { error: error.message },
      });
    });
  });
}

async function captureDns() {
  const checks = [];
  for (const [id, hostname] of [
    ["dns_apex", "wikibiome.com"],
    ["dns_legacy_cname_target", LEGACY_CNAME],
  ]) {
    try {
      const addresses = await resolve4(hostname);
      checks.push({
        id,
        category: "dns",
        required: true,
        passed: addresses.length > 0,
        evidence: { hostname, addresses },
      });
    } catch (error) {
      checks.push({
        id,
        category: "dns",
        required: true,
        passed: false,
        evidence: { hostname, error: error.message },
      });
    }
  }

  try {
    const targets = await resolveCname("www.wikibiome.com");
    const normalized = targets.map((value) => value.toLowerCase().replace(/\.$/, ""));
    checks.push({
      id: "dns_www",
      category: "dns",
      required: true,
      passed: normalized.includes("custom-domains.chatgpt.site"),
      evidence: { hostname: "www.wikibiome.com", targets },
    });
  } catch (error) {
    checks.push({
      id: "dns_www",
      category: "dns",
      required: true,
      passed: false,
      evidence: { hostname: "www.wikibiome.com", error: error.message },
    });
  }
  return checks;
}

async function runPublicAudit({ mode, now = new Date() }) {
  const gate = evaluateGate(now);
  const checks = [];

  try {
    const apex = await fetchText("https://wikibiome.com/");
    const apexCanonical = extractCanonical(apex.body);
    const apexResult = evaluateApexCanonical({
      status: apex.status,
      location: apex.location,
      canonical: apexCanonical,
    });
    checks.push({
      id: "http_apex_canonical",
      category: "http",
      required: true,
      passed: apexResult.passed,
      evidence: apexResult,
    });
  } catch (error) {
    checks.push({
      id: "http_apex_canonical",
      category: "http",
      required: true,
      passed: false,
      evidence: { error: error.message },
    });
  }

  const [apexHttpChain, wwwHttpChain] = await Promise.all([
    captureRedirectChain("http://wikibiome.com/"),
    captureRedirectChain("http://www.wikibiome.com/"),
  ]);
  checks.push(
    evaluateHttpsUpgrade({
      id: "http_apex_https_upgrade",
      chain: apexHttpChain,
      allowedFinalUrls: ["https://wikibiome.com/", `${CANONICAL_ORIGIN}/`],
    }),
    evaluateHttpsUpgrade({
      id: "http_www_https_upgrade",
      chain: wwwHttpChain,
      allowedFinalUrls: [`${CANONICAL_ORIGIN}/`],
    }),
  );

  for (const route of HTML_ROUTES) {
    try {
      const response = await fetchText(new URL(route.path, CANONICAL_ORIGIN));
      checks.push(
        evaluateHtmlRoute({
          ...route,
          status: response.status,
          canonical: extractCanonical(response.body),
          title: extractTitle(response.body),
          bytes: Buffer.byteLength(response.body),
        }),
      );
      if (route.id === "support") {
        checks.push({
          id: "support_stripe_link",
          category: "support",
          required: true,
          passed: response.body.includes(STRIPE_SUPPORT_URL),
          evidence: { expectedUrl: STRIPE_SUPPORT_URL },
        });
      }
    } catch (error) {
      checks.push({
        id: `http_${route.id}`,
        category: "http",
        required: true,
        passed: false,
        evidence: { error: error.message },
      });
      if (route.id === "support") {
        checks.push({
          id: "support_stripe_link",
          category: "support",
          required: true,
          passed: false,
          evidence: { expectedUrl: STRIPE_SUPPORT_URL, error: error.message },
        });
      }
    }
  }

  try {
    const contributions = await fetchText(`${CANONICAL_ORIGIN}/contributions`);
    checks.push(
      evaluateContributionAuthBoundary({
        status: contributions.status,
        location: contributions.location,
      }),
    );
  } catch (error) {
    checks.push({
      id: "contribution_auth_boundary",
      category: "auth",
      required: true,
      passed: false,
      evidence: { error: error.message },
    });
  }

  try {
    const sitemap = await fetchText(`${CANONICAL_ORIGIN}/sitemap.xml`);
    checks.push(
      evaluateSitemap({
        status: sitemap.status,
        contentType: sitemap.contentType,
        body: sitemap.body,
      }),
    );
  } catch (error) {
    checks.push({
      id: "sitemap",
      category: "indexing",
      required: true,
      passed: false,
      evidence: { error: error.message },
    });
  }

  try {
    const robots = await fetchText(`${CANONICAL_ORIGIN}/robots.txt`);
    checks.push(
      evaluateRobots({
        status: robots.status,
        contentType: robots.contentType,
        body: robots.body,
      }),
    );
  } catch (error) {
    checks.push({
      id: "robots",
      category: "indexing",
      required: true,
      passed: false,
      evidence: { error: error.message },
    });
  }

  for (const [id, url] of [
    ["stripe_checkout_available", STRIPE_SUPPORT_URL],
    ["legacy_deployment_available", LEGACY_DEPLOYMENT_URL],
  ]) {
    try {
      const response = await fetchText(url);
      checks.push({
        id,
        category: id.startsWith("stripe") ? "support" : "rollback",
        required: true,
        passed: response.status >= 200 && response.status < 400,
        evidence: { status: response.status, location: response.location },
      });
    } catch (error) {
      checks.push({
        id,
        category: id.startsWith("stripe") ? "support" : "rollback",
        required: true,
        passed: false,
        evidence: { error: error.message },
      });
    }
  }

  checks.push(...(await captureDns()));
  checks.push(
    ...(await Promise.all([
      captureTls("wikibiome.com"),
      captureTls("www.wikibiome.com"),
    ])),
  );

  const summary = summarizeChecks(checks);
  const publicDecision = summary.requiredFailed
    ? "NO_GO_PUBLIC_CHECKS"
    : "PUBLIC_CHECKS_PASS_MANUAL_EVIDENCE_REQUIRED";
  return {
    schemaVersion: 1,
    mode,
    capturedAt: now.toISOString(),
    gate,
    eligibleForRetirementDecision: false,
    publicDecision: mode === "baseline" ? "PRE_GATE_BASELINE" : publicDecision,
    summary,
    checks,
    manualEvidenceRequired: MANUAL_EVIDENCE,
    completion: {
      publicChecksComplete: true,
      manualEvidenceComplete: false,
      reason:
        "This runner cannot satisfy the authenticated browser, platform-log, search-index, Stripe API, or Vercel metadata evidence requirements by itself.",
    },
    safety:
      "Read-only evidence only. This runner never deploys, pushes, changes DNS, initiates payment, changes account data, or retires the rollback target.",
  };
}

function printHelp() {
  process.stdout.write(`Usage: node scripts/audit-wikibiome-post-cutover.mjs [--baseline]\n\n`);
  process.stdout.write(`Default audit mode refuses to run before ${AUDIT_GATE_ISO}.\n`);
  process.stdout.write("--baseline permits a labeled pre-gate capture and never issues a retirement decision.\n");
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const args = new Set(rawArgs);
  if (args.has("--help") || args.has("-h")) {
    printHelp();
    return;
  }
  const unknownArgs = rawArgs.filter((arg) => arg !== "--baseline");
  if (unknownArgs.length > 0) {
    process.stderr.write(`Unknown argument(s): ${unknownArgs.join(", ")}\n`);
    printHelp();
    process.exitCode = 2;
    return;
  }
  const mode = args.has("--baseline") ? "baseline" : "audit";
  const gate = evaluateGate();
  if (mode === "audit" && !gate.satisfied) {
    process.stdout.write(`${JSON.stringify({
      schemaVersion: 1,
      mode,
      capturedAt: gate.nowIso,
      gate,
      publicDecision: "TIME_GATE_NOT_REACHED",
      eligibleForRetirementDecision: false,
    }, null, 2)}\n`);
    process.exitCode = 2;
    return;
  }

  const report = await runPublicAudit({ mode });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (mode === "audit" && report.summary.requiredFailed > 0) process.exitCode = 1;
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
