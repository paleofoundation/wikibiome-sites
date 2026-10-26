import { allWikiPages, canonicalArticleId, categories, getWikiPage } from "@/lib/wikibiome";
import { getArticleMedia, type ArticleMedia } from "@/lib/article-media";

import { organizationProfiles } from "@/lib/organization-profiles.mjs";

import { PUBLIC_ORIGIN as ORIGIN } from "@/lib/search-discovery";
import { isIndexableArticle } from "@/lib/article-indexing";
type SitemapEntry = {
  path: string;
  lastmod?: string;
  priority: string;
  media?: ArticleMedia;
};
// Home, hubs and established utility routes remain crawl entry points.
// The quality gate applies to articles; citation-only source pages stay excluded.
export const publicRoutes = [
  "/",
  ...[...categories.map((category) => `/category/${category.id}`), "/category/other", "/category/reference"],
  "/explore",
  "/clusters",
  "/compare",
  "/keystone",
  "/about",
  "/readiness",
  "/support",
  "/contribute",
  "/researchers",
  "/submit-work",
  "/institutions",
  ...organizationProfiles.map((profile) => `/organizations/${profile.slug}`),
  "/research-standard",
  "/privacy",
  "/terms",
  "/contact",
];

export function GET() {
  const articleMap = new Map<string, string | undefined>();
  for (const page of allWikiPages) {
    const id = canonicalArticleId(page.id);
    const canonicalPage = getWikiPage(id);
    if (!canonicalPage || !isIndexableArticle(canonicalPage)) continue;
    // A build/sync timestamp is not evidence that an article changed.
    const updated = validDate(page.updated);
    const existing = articleMap.get(id);
    if (!articleMap.has(id) || (updated && (!existing || updated > existing))) articleMap.set(id, updated);
  }

  const entries: SitemapEntry[] = [
    ...publicRoutes.map((path) => ({ path, priority: path === "/" ? "1.0" : "0.7" })),
    ...[...articleMap.entries()].map(([id, lastmod]) => ({ path: `/article/${id}`, lastmod, priority: "0.8", media: getArticleMedia(id) })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.map((entry) => {
    const media = entry.media;
    const image = media ? `<image:image><image:loc>${escapeXml(`${ORIGIN}${media.src}`)}</image:loc></image:image>` : "";
    return `  <url><loc>${escapeXml(`${ORIGIN}${entry.path}`)}</loc>${entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""}${image}<changefreq>${entry.path === "/" ? "daily" : "weekly"}</changefreq><priority>${entry.priority}</priority></url>`;
  }).join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}

function validDate(value: string | undefined) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString();
}

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
