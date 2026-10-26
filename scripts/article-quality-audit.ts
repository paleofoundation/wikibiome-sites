import { GET, publicRoutes } from "../app/sitemap.xml/route";
import { allWikiPages, canonicalArticleId, canonicalSourceId, getWikiPage } from "../lib/wikibiome";
import sourceReview from "../data/source-indexing-review.json";
import { getArticleQuality } from "../lib/article-indexing";

export async function auditSitemap(suppliedXml?: string) {
  const pages = [...new Set(allWikiPages.map((page) => canonicalArticleId(page.id)))].map((id) => getWikiPage(id)).filter((page) => page !== undefined);
  const rows = pages.map((page) => ({ path: `/article/${page.id}`, section: page.category, ...getArticleQuality(page) }));
  const xml = suppliedXml ?? await GET().text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const byPath = new Map(rows.map((row) => [row.path, row]));
  const failures: string[] = [];
  if (new Set(urls).size !== urls.length) failures.push("Duplicate sitemap URLs");
  for (const url of urls) {
    const parsed = new URL(url);
    const row = byPath.get(parsed.pathname);
    if (parsed.origin !== "https://www.wikibiome.com" || parsed.search || parsed.hash || !(row?.eligible || publicRoutes.includes(parsed.pathname))) failures.push(`${url}: ${row?.reasons.join(", ") ?? "not an eligible article or established public route"}`);
  }
  for (const row of rows) {
    if (row.eligible && !urls.includes(`https://www.wikibiome.com${row.path}`)) failures.push(`${row.path}: qualifying article missing from sitemap`);
  }
  for (const path of publicRoutes) {
    if (!urls.includes(`https://www.wikibiome.com${path}`)) failures.push(`${path}: public crawl entry point missing from sitemap`);
  }
  const citationSourcePaths = [...new Set(sourceReview.indexableSources.map(({ id }) => `/source/${canonicalSourceId(id)}`))];
  return { rows, urls, failures, publicRoutes, citationSourcePaths };
}
