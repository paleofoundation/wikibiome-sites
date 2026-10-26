import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { ResearchToolsNav } from "@/app/_components/ResearchToolsNav";
import { StructuredData } from "@/app/_components/StructuredData";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getKnowledgeNeighborhood, graphArticleOptions, knowledgeGraphStats, type GraphNode } from "@/lib/research-tools";
import { publicPageMetadata, researchToolStructuredData } from "@/lib/search-discovery";
import { categoryLabel } from "@/lib/wikibiome";

const title = "Explore the knowledge system — WikiBiome";
const description = "Follow organisms, metals, diseases, mechanisms, and interventions through the WikiBiome knowledge system.";
export const metadata: Metadata = publicPageMetadata({ title, description, path: "/explore" });

type PageProps = { searchParams: Promise<{ focus?: string }> };

function graphPositions(nodes: GraphNode[]) {
  const width = 1120;
  const height = 650;
  const center = { x: width / 2, y: height / 2 };
  const positions = new Map<string, { x: number; y: number }>();
  const focus = nodes.find((node) => node.depth === 0);
  if (focus) positions.set(focus.id, center);
  for (const depth of [1, 2]) {
    const ring = nodes.filter((node) => node.depth === depth).sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label));
    const radiusX = depth === 1 ? 265 : 480;
    const radiusY = depth === 1 ? 190 : 285;
    ring.forEach((node, index) => {
      const angle = -Math.PI / 2 + index * (Math.PI * 2 / Math.max(ring.length, 1));
      positions.set(node.id, { x: center.x + Math.cos(angle) * radiusX, y: center.y + Math.sin(angle) * radiusY });
    });
  }
  return { width, height, positions };
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const graph = getKnowledgeNeighborhood(params.focus, 36);
  const layout = graphPositions(graph.nodes);
  return (
    <>
      <StructuredData data={researchToolStructuredData({ path: "/explore", name: title, description })} marker="data-research-tool-schema" />
      <WikiHeader />
      <main className="tool-page graph-page">
        <header className="tool-hero graph-hero">
          <div><span>Connected encyclopedia</span><h1>Knowledge graph</h1><p>Open one article’s evidence neighborhood at a time. The graph is regenerated from canonical WikiBiome relationships, so disease-signature duplicates and stale hand-built connections are removed before display.</p></div>
          <dl><div><dt>{knowledgeGraphStats.nodes}</dt><dd>canonical nodes</dd></div><div><dt>{knowledgeGraphStats.connections.toLocaleString()}</dt><dd>deduplicated connections</dd></div></dl>
        </header>
        <ResearchToolsNav active="graph" />

        <section className="graph-workbench" aria-labelledby="graph-title">
          <header>
            <div><span>Evidence neighborhood</span><h2 id="graph-title">{graph.focus?.label ?? "WikiBiome"}</h2><p>{graph.nodes.length} visible articles · {graph.links.length} relationships within this neighborhood</p></div>
            <form action="/explore" role="search">
              <label htmlFor="graph-focus">Center the graph on an article</label>
              <div><input id="graph-focus" name="focus" list="graph-article-options" defaultValue={graph.focus?.label} placeholder="Try nickel or Akkermansia" /><button type="submit">Recenter</button></div>
              <datalist id="graph-article-options">{graphArticleOptions.map((node) => <option value={node.label} key={node.id} />)}</datalist>
            </form>
          </header>
          <div className="graph-legend" aria-label="Knowledge domains shown">{[...new Set(graph.nodes.map((node) => node.category))].sort().map((category) => <span className={`graph-${category}`} key={category}><i />{categoryLabel(category)}</span>)}</div>
          <div className="graph-canvas" role="img" aria-label={`Relationship graph centered on ${graph.focus?.label ?? "WikiBiome"}`}>
            <svg viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
              <g className="graph-lines">{graph.links.map((link) => { const source = layout.positions.get(link.source); const target = layout.positions.get(link.target); return source && target ? <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} key={`${link.source}-${link.target}`} /> : null; })}</g>
              <g className="graph-nodes">{graph.nodes.map((node) => { const position = layout.positions.get(node.id); if (!position) return null; const radius = node.depth === 0 ? 34 : node.depth === 1 ? 12 : 8; return <a href={`/article/${node.id}`} aria-label={`${node.label}, ${categoryLabel(node.category)}, ${node.sourceCount} sources`} key={node.id}><circle className={`graph-${node.category}`} cx={position.x} cy={position.y} r={radius} /><text className={node.depth === 0 ? "focus" : ""} x={position.x} y={position.y + radius + 15} textAnchor="middle">{node.label.length > 25 ? `${node.label.slice(0, 23)}…` : node.label}</text></a>; })}</g>
            </svg>
          </div>
        </section>

        <section className="graph-connections" aria-labelledby="connections-title">
          <header><span>Directly connected</span><h2 id="connections-title">Why these articles are nearby</h2><p>Spatial position is deterministic presentation, not a biological distance measurement. Every item below opens the canonical article.</p></header>
          <div>{graph.directConnections.map(({ node, explanation }) => <article key={node.id}><span className={`graph-${node.category}`}><i />{categoryLabel(node.category)}</span><h3><Link href={`/article/${node.id}`}>{node.label}</Link></h3><p>{explanation}</p><footer><b>{node.sourceCount} sources</b><Link href={`/explore?focus=${encodeURIComponent(node.id)}`}>Make this the center →</Link></footer></article>)}</div>
        </section>

        <aside className="tool-method-note"><strong>Generator rule</strong><p>The graph consumes the same synchronized page records as the encyclopedia. Legacy signature slugs are resolved to their canonical disease pages, self-links are discarded, and duplicate edges collapse into one connection.</p></aside>
      </main>
    </>
  );
}
