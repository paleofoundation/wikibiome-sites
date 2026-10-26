import { generateArticleEvidence, getDiseaseRecord, type WikiPage } from "@/lib/wikibiome";
import { articleQuality } from "@/lib/article-quality.mjs";

export function getArticleQuality(page: WikiPage) {
  const disease = ["disease", "signature"].includes(page.category) ? getDiseaseRecord(page.id) : undefined;
  return articleQuality(disease?.page ?? page,
    (disease?.evidence ?? generateArticleEvidence(page)).references,
    [page.editorialStatus, ...(disease?.signaturePages.map((record) => record.editorialStatus) ?? [])]);
}

export function isIndexableArticle(page: WikiPage) {
  return getArticleQuality(page).eligible;
}
