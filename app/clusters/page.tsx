import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { ResearchToolsNav } from "@/app/_components/ResearchToolsNav";
import { StructuredData } from "@/app/_components/StructuredData";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { conditionOptions, getClusterMatrix, getConditionNeighborhood, resolveCondition } from "@/lib/research-tools";
import { publicPageMetadata, researchToolStructuredData } from "@/lib/search-discovery";

const title = "Condition clusters — WikiBiome";
const description = "Explore disease neighborhoods generated from shared metallomic, taxonomic, immune, ecological, and virulence signals.";
export const metadata: Metadata = publicPageMetadata({ title, description, path: "/clusters" });

type PageProps = { searchParams: Promise<{ condition?: string }> };

function pairKey(a: string, b: string) { return [a, b].sort().join("|"); }

export default async function ClustersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selected = resolveCondition(params.condition);
  const neighborhood = getConditionNeighborhood(selected?.id, 10);
  const matrix = getClusterMatrix(selected?.id, 12);
  return (
    <>
      <StructuredData data={researchToolStructuredData({ path: "/clusters", name: title, description })} marker="data-research-tool-schema" />
      <WikiHeader />
      <main className="tool-page clusters-page">
        <header className="tool-hero"><div><span>Signature atlas</span><h1>Condition clusters</h1><p>Diseases are placed together only when their structured signatures share directional evidence—elevated with elevated, depleted with depleted—across metals, taxa, host response, ecology, or virulence.</p></div><dl><div><dt>{conditionOptions.length}</dt><dd>canonical signatures</dd></div><div><dt>8</dt><dd>direction-aware layers</dd></div></dl></header>
        <ResearchToolsNav active="clusters" />

        <section className="cluster-selector">
          <div><span>Selected neighborhood</span><h2>{selected?.name}</h2><p>Choose a condition to rebuild the matrix around its strongest evidence overlaps.</p></div>
          <form action="/clusters"><label htmlFor="cluster-condition">Condition</label><select id="cluster-condition" name="condition" defaultValue={selected?.id}>{conditionOptions.map((condition) => <option value={condition.id} key={condition.id}>{condition.name}</option>)}</select><button type="submit">Build cluster</button></form>
        </section>

        <section className="cluster-matrix-section" aria-labelledby="matrix-title">
          <header><span>Shareable evidence matrix</span><h2 id="matrix-title">The {selected?.name} neighborhood</h2><p>Each non-diagonal cell links to a full, reproducible comparison. Percentages are weighted Jaccard overlap across populated signature layers—not disease risk or causality.</p></header>
          <div className="cluster-matrix-scroll"><table className="cluster-matrix"><thead><tr><th scope="col">Condition</th>{matrix.conditions.map((condition) => <th scope="col" title={condition.name} key={condition.id}><span>{condition.name}</span></th>)}</tr></thead><tbody>{matrix.conditions.map((row) => <tr key={row.id}><th scope="row"><Link href={`/clusters?condition=${row.id}`}>{row.name}</Link></th>{matrix.conditions.map((column) => { if (row.id === column.id) return <td className="self" aria-label={`${row.name}, selected condition`} key={column.id}>●</td>; const pair = matrix.cells.get(pairKey(row.id, column.id)); const score = pair?.score ?? 0; return <td className={`score-${Math.min(4, Math.ceil(score / 8))}`} key={column.id}>{pair ? <Link href={`/compare?a=${row.id}&b=${column.id}`} aria-label={`Compare ${row.name} with ${column.name}: ${score}% signature overlap`}>{score}%</Link> : <span aria-label="No indexed overlap">—</span>}</td>; })}</tr>)}</tbody></table></div>
        </section>

        <section className="cluster-pairs" aria-labelledby="pair-title"><header><span>Strongest relationships</span><h2 id="pair-title">What the cluster actually shares</h2></header><div>{neighborhood.map((pair) => { const other = pair.a.id === selected?.id ? pair.b : pair.a; const shared = pair.layers.flatMap((layer) => layer.shared).slice(0, 8); return <article key={other.id}><header><span>{pair.score}% overlap</span><h3><Link href={`/article/${other.id}`}>{other.name}</Link></h3><p>{pair.sharedCount} shared signature signals · {pair.sharedSourceCount} shared references</p></header><div>{shared.map((item) => item.pageId ? <Link href={`/article/${item.pageId}`} key={item.id}>{item.label}</Link> : <span key={item.id}>{item.label}</span>)}</div><footer><Link href={`/compare?a=${selected?.id}&b=${other.id}`}>Open layer-by-layer comparison →</Link></footer></article>; })}</div></section>
        <aside className="tool-method-note"><strong>Generator rule</strong><p>Clusters are generated at request time from reconciled disease records. Legacy disease/signature duplicates are removed, opposite-direction signals do not count as a match, and every score opens its underlying layer comparison.</p></aside>
      </main>
    </>
  );
}
