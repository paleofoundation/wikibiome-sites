import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { StructuredData } from "@/app/_components/StructuredData";
import { WikiSource } from "@/app/_components/WikiSource";
import { publicPageMetadata, sourceStructuredData } from "@/lib/search-discovery";
import { canonicalSourceId, getSource } from "@/lib/wikibiome";
import { isIndexableSource } from "@/lib/source-indexing.mjs";

type RouteProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { id } = await params;
  const source = getSource(id);
  if (!source) return { title: "Source not found — WikiBiome" };
  const canonicalId = canonicalSourceId(id);
  const title = `${source.title} — WikiBiome source`;
  const description = `${source.authors?.join(", ") || "WikiBiome source"}. ${source.journal || "Journal pending"}, ${source.year || "year pending"}.`;
  return publicPageMetadata({
    title,
    description,
    path: `/source/${canonicalId}`,
    type: "article",
    index: isIndexableSource(canonicalId),
  });
}

export default async function SourcePage({ params }: RouteProps) {
  const { id } = await params;
  const source = getSource(id);
  if (!source) notFound();
  const canonicalId = canonicalSourceId(id);
  if (canonicalId !== id) permanentRedirect(`/source/${canonicalId}`);
  return <><StructuredData data={sourceStructuredData(canonicalId, source)} marker="data-source-schema" /><WikiSource id={canonicalId} source={source} /></>;
}
