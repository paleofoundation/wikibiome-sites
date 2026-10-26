import contentManifest from "../data/content-manifest.generated.json" with { type: "json" };
import content from "../data/content.generated.json" with { type: "json" };

export const PUBLIC_ORIGIN = "https://www.wikibiome.com";
export const ROUTING_POLICY_VERSION = 3;

export const SIGNATURE_EXPLORER_REDIRECTS = Object.freeze([
  Object.freeze({ source: "/signature-explorer", destination: "/category/signature", status: 308 }),
  Object.freeze({ source: "/signature-explorer.html", destination: "/category/signature", status: 308 }),
  Object.freeze({ source: "/signatures", destination: "/category/signature", status: 308 }),
]);

export const LEGACY_SIGNATURE_REDIRECTS = Object.freeze([
  Object.freeze({
    source: "/article/autism-spectrum-disorder-signature",
    destination: "/article/autism-spectrum-disorder#signature",
    status: 308,
  }),
]);

export const ROUTING_ROBOTS_DISALLOWS = Object.freeze([
  "/api/",
  "/contributions",
  "/article/*/suggest",
  "/source/*/claim",
  "/researcher/dashboard",
  "/researcher/moderation",
  "/signin-with-chatgpt",
  "/signout-with-chatgpt",
  "/callback",
  "/media-files/",
]);

export const ROBOTS_TXT = Object.freeze([
  "User-agent: *",
  "Allow: /",
  ...ROUTING_ROBOTS_DISALLOWS.map((path) => `Disallow: ${path}`),
  "",
  `Sitemap: ${PUBLIC_ORIGIN}/sitemap.xml`,
  "",
].join("\n"));

export const NEVER_PUBLIC_ARTICLE_PATHS = Object.freeze(
  (contentManifest.publicContentPolicy?.excludedPages ?? [])
    .map((page) => `/article/${normalizePathId(page.id)}`)
    .sort(),
);

export const AUDITED_GONE_ARTICLE_PATHS = Object.freeze([
  "/article/author-outreach-campaign-2026",
  "/article/batch-preview-2026-04-19-auto-discovered-stubs",
  "/article/landmark-outreach-email",
  "/article/lint-report-2026-04-19",
  "/article/zero-reference-pages-2026-04-19",
]);

const signatureExplorerRedirectMap = new Map(SIGNATURE_EXPLORER_REDIRECTS.map((rule) => [rule.source, rule]));
const diseaseIds = new Set(content.pages.filter((page) => page.category === "disease").map((page) => normalizePathId(page.id)));
const legacySignatureRedirectMap = new Map(LEGACY_SIGNATURE_REDIRECTS.map((rule) => [rule.source, rule]));
const neverPublicArticlePathSet = new Set(NEVER_PUBLIC_ARTICLE_PATHS);
const htmlErrorCacheControl = "public, max-age=300";
const staticFilePattern = /\.[a-z0-9]{1,8}$/i;

export async function handleEarlyRoutingPolicy(request) {
  const url = new URL(request.url);
  // Redirect before route aliases, error boundaries, robots, or static assets.
  // Preserve escaping, trailing slashes, and repeated query parameters.
  if (url.hostname === "wikibiome.com") {
    return redirectResponse(`${PUBLIC_ORIGIN}${url.pathname}${url.search}`, 301);
  }
  const path = normalizePath(url.pathname);

  const signatureExplorerRedirect = signatureExplorerRedirectMap.get(path);
  if (signatureExplorerRedirect) {
    return redirectResponse(signatureExplorerDestination(url.search), signatureExplorerRedirect.status);
  }

  const legacySignatureRedirect = legacySignatureRedirectMap.get(path);
  if (legacySignatureRedirect) {
    return redirectResponse(withPreservedQuery(legacySignatureRedirect.destination, url.search), legacySignatureRedirect.status);
  }

  if (path.startsWith("/article/") && /[A-Z]/.test(url.pathname)) {
    return redirectResponse(`${normalizePath(url.pathname).toLowerCase()}${url.search}`, 301);
  }

  if (neverPublicArticlePathSet.has(path)) {
    return htmlBoundaryResponse(request, 410, path);
  }

  if (path === "/robots.txt") {
    return new Response(request.method === "HEAD" ? null : ROBOTS_TXT, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  }

  if (path === "/sitemap-full.xml" || path === "/image-sitemap.xml") {
    return redirectResponse(`${PUBLIC_ORIGIN}/sitemap.xml${url.search}`, 301);
  }

  return undefined;
}

export function signatureExplorerDestination(search) {
  const disease = normalizePathId(new URLSearchParams(search).get("disease")).replace(/-signature$/, "");
  const destination = diseaseIds.has(disease) ? `/article/${disease}#signature` : "/category/signature";
  return withPreservedQuery(destination, search);
}

export function maybeReplaceNotFoundResponse(request, response) {
  if (response.status !== 404 || !shouldRenderHtmlBoundary(request)) return response;
  return htmlBoundaryResponse(request, 404, new URL(request.url).pathname);
}

export function htmlBoundaryResponse(request, status, pathname) {
  const title = boundaryTitle(status, pathname);
  const heading = status === 410 ? "This WikiBiome record is gone." : "This WikiBiome page was not found.";
  const detail = status === 410
    ? "The requested record is deliberately excluded from the public encyclopedia rather than published as a soft 404."
    : "The requested URL is not a public WikiBiome route.";
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="canonical" href="${PUBLIC_ORIGIN}/404">
<meta name="robots" content="noindex, follow">
</head>
<body>
<main>
<p>${status}</p>
<h1>${escapeHtml(heading)}</h1>
<p>${escapeHtml(detail)}</p>
<p><a href="/search">Search the encyclopedia</a> · <a href="/">Return to WikiBiome</a></p>
</main>
</body>
</html>`;
  return new Response(request.method === "HEAD" ? null : html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": htmlErrorCacheControl,
      "x-robots-tag": "noindex, follow",
    },
  });
}

export function shouldRenderHtmlBoundary(request) {
  if (!["GET", "HEAD"].includes(request.method)) return false;
  const pathname = new URL(request.url).pathname;
  if (pathname.startsWith("/api/") || pathname.startsWith("/media/") || pathname.startsWith("/_next/")) return false;
  if (staticFilePattern.test(pathname) && pathname !== "/404.html") return false;
  const accept = request.headers.get("accept") ?? "";
  return !accept || accept.includes("text/html") || accept.includes("*/*");
}

function boundaryTitle(status, pathname) {
  if (status === 410) return "Article gone — WikiBiome";
  if (pathname.startsWith("/article/")) return "Article not found — WikiBiome";
  if (pathname.startsWith("/source/")) return "Source not found — WikiBiome";
  if (pathname.startsWith("/category/")) return "Category not found — WikiBiome";
  return "Page not found — WikiBiome";
}

function redirectResponse(destination, status) {
  return new Response(null, {
    status,
    headers: {
      location: destination,
      "cache-control": "public, max-age=3600",
    },
  });
}

function normalizePath(value) {
  const path = String(value || "/").replace(/\/+$/, "");
  return path || "/";
}

function normalizePathId(value) {
  return String(value ?? "")
    .replace(/\.md$/i, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function withPreservedQuery(destination, search) {
  if (!search) return destination;
  const [pathAndQuery, hash = ""] = destination.split("#");
  const joiner = pathAndQuery.includes("?") ? "&" : "?";
  return `${pathAndQuery}${joiner}${search.slice(1)}${hash ? `#${hash}` : ""}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
