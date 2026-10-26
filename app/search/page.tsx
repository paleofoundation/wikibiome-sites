import type { Metadata } from "next";
import { WikiDirectory } from "@/app/_components/WikiDirectory";
import { publicPageMetadata } from "@/lib/search-discovery";
import { searchWiki, wikiStats } from "@/lib/wikibiome";

export function generateMetadata(): Metadata {
  return publicPageMetadata({
    title: "Search WikiBiome",
    description: `Search ${wikiStats.totalPages} evidence-linked microbiome articles.`,
    path: "/search",
    index: false,
  });
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "all" } = await searchParams;
  const pages = searchWiki(q, 80, category);
  return <WikiDirectory title={q ? `Search: “${q}”` : "Search WikiBiome"} kicker="Encyclopedia search" description={q ? `Ranked matches across titles, topics, categories, and article introductions${category !== "all" ? `, filtered to ${category}.` : "."}` : `Search all ${wikiStats.totalPages} public WikiBiome articles.`} pages={pages} query={q} searchCategory={category} showSearchFilters />;
}
