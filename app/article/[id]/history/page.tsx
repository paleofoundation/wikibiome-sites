import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { notFound, permanentRedirect } from "next/navigation";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { publicPageMetadata } from "@/lib/search-discovery";
import { canonicalArticleAliasId, canonicalArticleId, categoryLabel, getWikiPage, normalizeWikiId } from "@/lib/wikibiome";
import { PAGE_HISTORY_DESCRIPTION } from "@/lib/public-page-history-policy.mjs";
import { getRevisionHistory } from "@/lib/revisions";

type RouteProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { id } = await params;
  const page = getWikiPage(id);
  if (!page) return { title: "Revision history not found — WikiBiome" };
  const canonicalId = canonicalArticleId(id);
  const title = `Revision history: ${page.title} — WikiBiome`;
  const description = `Source provenance and revision history for the WikiBiome article ${page.title}.`;
  return publicPageMetadata({ title, description, path: `/article/${canonicalId}/history`, type: "article", index: false });
}

export default async function ArticleHistoryPage({ params }: RouteProps) {
  const { id } = await params;
  const aliasId = canonicalArticleAliasId(id);
  if (aliasId !== normalizeWikiId(id)) permanentRedirect(`/article/${aliasId}/history`);
  const page = getWikiPage(id);
  if (!page) notFound();
  const canonicalId = canonicalArticleId(id);
  if (canonicalId !== id) permanentRedirect(`/article/${canonicalId}/history`);
  const history = getRevisionHistory(page);

  return (
    <>
      <WikiHeader />
      <main className="history-page">
        <div className="history-breadcrumbs"><Link href="/">WikiBiome</Link><span>/</span><Link href={`/article/${page.id}`}>{page.title}</Link><span>/</span><b>History</b></div>
        <header className="history-hero">
          <span>Article provenance · official upstream repository</span>
          <h1>Revision history:<br />{page.title}</h1>
          <p>{PAGE_HISTORY_DESCRIPTION} Each entry links to its source revision.</p>
          <nav><Link href={`/article/${page.id}`}>Article</Link><Link className="active" href={`/article/${page.id}/history`}>History <b>{history.revisions.length}</b></Link><Link href={`/article/${page.id}/suggest`}>Suggest edit</Link><a href={`${history.repository}/tree/${history.sourceCommit}/${history.paths[0] ?? ""}`}>Current source ↗</a></nav>
        </header>

        <section className="history-provenance">
          <div><span>Canonical record</span><strong>{page.id}</strong><small>{categoryLabel(page.category)}</small></div>
          <div><span>Tracked source files</span><strong>{history.paths.length}</strong><small>{history.paths[0] ?? "Generated record"}</small></div>
          <div><span>Visible revisions</span><strong>{history.revisions.length}</strong><small>Most recent first</small></div>
          <div><span>Source snapshot</span><strong>{history.sourceCommit.slice(0, 10)}</strong><small>Bound to this build</small></div>
        </section>

        <section className="revision-timeline" aria-labelledby="revision-title">
          <header><span>Readable change sets</span><h2 id="revision-title">Recorded revisions</h2></header>
          {history.revisions.map((revision, index) => (
            <article key={`${revision.hash}-${revision.path}`}>
              <div className="revision-index"><span>{String(index + 1).padStart(2, "0")}</span><i /></div>
              <div className="revision-copy">
                <header><time dateTime={revision.date}>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(revision.date))}</time><span>{revision.author}</span></header>
                <h3>{revision.summary}</h3>
                {revision.description !== revision.summary && <p style={{ whiteSpace: "pre-line" }}>{revision.description}</p>}
                <code>{revision.path}</code>
                <footer><span className="diff-add">+{revision.additions} lines</span><span className="diff-remove">−{revision.deletions} lines</span><a href={`${history.repository}/commit/${revision.hash}`}>Inspect exact diff ↗</a></footer>
              </div>
            </article>
          ))}
          {!history.revisions.length && <div className="history-empty"><strong>No material page changes have been recorded yet.</strong><p>Its provenance still resolves to the synchronized source snapshot and generating article.</p></div>}
        </section>
      </main>
    </>
  );
}
