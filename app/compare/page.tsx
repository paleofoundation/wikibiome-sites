import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { ResearchToolsNav } from "@/app/_components/ResearchToolsNav";
import { StructuredData } from "@/app/_components/StructuredData";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { compareConditions, conditionOptions } from "@/lib/research-tools";
import { publicPageMetadata, researchToolStructuredData } from "@/lib/search-discovery";

const title = "Compare condition signatures — WikiBiome";
const description = "Compare two canonical disease signatures layer by layer with shared and unique signals linked to their evidence pages.";
export const metadata: Metadata = publicPageMetadata({ title, description, path: "/compare" });

type PageProps = { searchParams: Promise<{ a?: string; b?: string }> };
type Item = { id: string; label: string; pageId?: string };

function SignalList({ items, empty = "None indexed" }: { items: Item[]; empty?: string }) {
  if (!items.length) return <p className="comparison-empty">{empty}</p>;
  return <div className="comparison-signals">{items.map((item) => item.pageId ? <Link href={`/article/${item.pageId}`} key={item.id}>{item.label}</Link> : <span key={item.id}>{item.label}</span>)}</div>;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const comparison = compareConditions(params.a, params.b);
  if (!comparison) return null;
  const { a, b } = comparison;
  return (
    <>
      <StructuredData data={researchToolStructuredData({ path: "/compare", name: title, description })} marker="data-research-tool-schema" />
      <WikiHeader />
      <main className="tool-page compare-page">
        <header className="tool-hero"><div><span>Comparative evidence</span><h1>Compare conditions</h1><p>Put two canonical disease records side by side. The result is a shareable, deterministic comparison of what is shared, what is unique, and how much evidence each record currently carries.</p></div><dl><div><dt>{comparison.score}%</dt><dd>weighted overlap</dd></div><div><dt>{comparison.sharedCount}</dt><dd>shared signals</dd></div></dl></header>
        <ResearchToolsNav active="compare" />
        <form className="compare-form" action="/compare"><div><label htmlFor="compare-a">First condition</label><select id="compare-a" name="a" defaultValue={a.id}>{conditionOptions.map((condition) => <option value={condition.id} key={condition.id}>{condition.name}</option>)}</select></div><span aria-hidden="true">↔</span><div><label htmlFor="compare-b">Second condition</label><select id="compare-b" name="b" defaultValue={b.id}>{conditionOptions.map((condition) => <option value={condition.id} key={condition.id}>{condition.name}</option>)}</select></div><button type="submit">Compare evidence</button></form>

        <section className="comparison-summary" aria-labelledby="comparison-title"><div><span>Comparison</span><h2 id="comparison-title"><Link href={`/article/${a.id}`}>{a.name}</Link><i>and</i><Link href={`/article/${b.id}`}>{b.name}</Link></h2><p>{comparison.sharedSourceCount} references occur in both reconciled evidence sets. Shared signals do not establish shared causes, diagnoses, or treatments.</p></div><dl><div><dt>{a.referenceCount}</dt><dd>{a.name} references</dd></div><div><dt>{b.referenceCount}</dt><dd>{b.name} references</dd></div><div><dt>{comparison.sharedSourceCount}</dt><dd>shared references</dd></div></dl></section>

        <section className="comparison-layers" aria-label="Layer-by-layer comparison">{comparison.layers.map((layer, index) => <article id={layer.id} key={layer.id}><header><span>{String(index + 1).padStart(2, "0")}</span><h2>{layer.title}</h2><b>{layer.shared.length} shared</b></header><div className="comparison-grid"><section><h3>Shared</h3><SignalList items={layer.shared} /></section><section><h3>Only in {a.name}</h3><SignalList items={layer.onlyA} /></section><section><h3>Only in {b.name}</h3><SignalList items={layer.onlyB} /></section></div></article>)}</section>
        <aside className="tool-method-note"><strong>Generator rule</strong><p>The comparison reads the same merged signatures and deduplicated references as the public disease pages. Matching is direction-aware, URLs are shareable, and each recognized organism, metal, mechanism, or disease signal links back to its encyclopedia record.</p></aside>
      </main>
    </>
  );
}
