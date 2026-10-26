import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StructuredData } from "@/app/_components/StructuredData";
import { WikiDirectory } from "@/app/_components/WikiDirectory";
import { collectionStructuredData, publicPageMetadata } from "@/lib/search-discovery";
import { categories, categoryLabel, getCategoryPages } from "@/lib/wikibiome";

type RouteProps = { params: Promise<{ category: string }> };
const categoryIds = new Set([...categories.map((category) => category.id), "other", "reference"]);

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { category } = await params;
  if (!categoryIds.has(category)) return { title: "Category not found — WikiBiome", robots: { index: false, follow: true } };
  const title = `${categoryLabel(category)} — WikiBiome`;
  const description = `Browse WikiBiome’s evidence-linked ${categoryLabel(category).toLowerCase()} records.`;
  return publicPageMetadata({
    title,
    description,
    path: `/category/${category}`,
  });
}

export default async function CategoryPage({ params }: RouteProps) {
  const { category } = await params;
  if (!categoryIds.has(category)) notFound();
  const pages = getCategoryPages(category);
  const label = categoryLabel(category);
  const description = category === "signature"
    ? "A reconciled index: each signature opens inside its canonical disease record, where five evidence layers and the full disease narrative live together."
    : `An alphabetical index of ${label.toLowerCase()} in the public WikiBiome knowledge base.`;
  return <><StructuredData data={collectionStructuredData({ path: `/category/${category}`, name: `${label} — WikiBiome`, description, pages })} marker="data-category-schema" /><WikiDirectory title={label} kicker={category === "signature" ? "Generated disease atlas" : "Knowledge domain"} description={description} pages={pages} /></>;
}
