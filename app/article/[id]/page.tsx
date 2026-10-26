import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DiseaseArticle } from "@/app/_components/DiseaseArticle";
import { StructuredData } from "@/app/_components/StructuredData";
import { WikiArticle } from "@/app/_components/WikiArticle";
import { isIndexableArticle } from "@/lib/article-indexing";
import { getArticleMedia } from "@/lib/article-media";
import { articleStructuredData, publicPageMetadata } from "@/lib/search-discovery";
import { canonicalArticleAliasId, canonicalDiseaseId, getDiseaseRecord, getWikiPage, normalizeWikiId, plainText } from "@/lib/wikibiome";

type RouteProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { id } = await params;
  const requestedPage = getWikiPage(id);
  const disease = requestedPage && ["disease", "signature"].includes(requestedPage.category)
    ? getDiseaseRecord(id)
    : undefined;
  const page = disease?.page ?? requestedPage;
  if (!page) return { title: "Article not found — WikiBiome" };
  const canonicalId = disease?.canonicalId ?? page.id;
  const media = getArticleMedia(canonicalId);
  const title = `${page.title} — WikiBiome`;
  const description = plainText(page.overview).slice(0, 180) || `Read the ${page.title} record in WikiBiome.`;
  return publicPageMetadata({
    title,
    description,
    path: `/article/${canonicalId}`,
    type: "article",
    index: isIndexableArticle(page),
    ...(media
      ? { image: { url: media.socialSrc, width: media.socialWidth, height: media.socialHeight, alt: media.alt } }
      : {}),
  });
}

export default async function ArticlePage({ params }: RouteProps) {
  const { id } = await params;
  const aliasId = canonicalArticleAliasId(id);
  if (aliasId !== normalizeWikiId(id)) permanentRedirect(`/article/${aliasId}`);
  const requestedPage = getWikiPage(id);
  if (!requestedPage) notFound();
  const disease = ["disease", "signature"].includes(requestedPage.category)
    ? getDiseaseRecord(id)
    : undefined;
  if (disease && requestedPage.category === "signature" && canonicalDiseaseId(id) !== id) {
    permanentRedirect(`/article/${disease.canonicalId}#signature`);
  }
  const canonicalId = disease?.canonicalId ?? requestedPage.id;
  const page = disease?.page ?? requestedPage;
  const media = getArticleMedia(canonicalId);
  const description = plainText(page.overview).slice(0, 180) || `Read the ${page.title} record in WikiBiome.`;
  const schema = articleStructuredData({
    page,
    canonicalId,
    description,
    updated: disease?.updated ?? page.updated,
    media,
  });

  return (
    <>
      <StructuredData data={schema} marker={media ? "data-article-media-schema" : "data-article-schema"} />
      {disease ? <DiseaseArticle record={disease} /> : <WikiArticle page={requestedPage} />}
    </>
  );
}
