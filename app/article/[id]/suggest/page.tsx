import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { canonicalArticleAliasId, canonicalArticleId, getWikiPage, normalizeWikiId } from "@/lib/wikibiome";

export const dynamic = "force-dynamic";
type RouteProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { id } = await params;
  const page = getWikiPage(id);
  return { title: page ? `Suggest an edit: ${page.title} — WikiBiome` : "Article not found — WikiBiome", robots: { index: false, follow: false } };
}

export default async function SuggestEditPage({ params }: RouteProps) {
  const { id } = await params;
  const aliasId = canonicalArticleAliasId(id);
  if (aliasId !== normalizeWikiId(id)) permanentRedirect(`/article/${aliasId}/suggest`);
  const page = getWikiPage(id);
  if (!page) notFound();
  const canonicalId = canonicalArticleId(id);
  if (canonicalId !== id) redirect(`/article/${canonicalId}/suggest`);
  redirect(`/propose?target=${encodeURIComponent(page.id)}`);
}
