import { OrcidLink } from "@/app/_components/OrcidLink";
import { publishedPaperDetails } from "@/lib/paper-intake";
import Link from "@/app/_components/NativeLink";
import { ArticleTools } from "@/app/_components/ArticleTools";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { DirectoryRail } from "@/app/_components/WikiDirectory";
import { ResearchDiscussion } from "@/app/_components/ResearchDiscussion";
import { PageActivityTrail, PageCollaborationBar } from "@/app/_components/PageCollaboration";
import { listPublicAuthorReviews, listPublicClaimsForSource } from "@/lib/research-network";
import { findPagesUsingSource, normalizeDoi, type SourceRecord } from "@/lib/wikibiome";

export async function WikiSource({ id, source }: { id: string; source: SourceRecord }) {
  const usedBy = findPagesUsingSource(id);
  const doi = normalizeDoi(source.doi);
  const [claims, authorContext, publication] = await Promise.all([listPublicClaimsForSource(id), listPublicAuthorReviews(id), publishedPaperDetails(id)]);

  return (
    <>
      <WikiHeader />
      <main className="directory-shell source-shell">
        <DirectoryRail />
        <article className="source-main">
          <div className="directory-breadcrumbs"><Link href="/">WikiBiome</Link><span>/</span><b>Evidence source</b></div>
          <header className="source-header">
            <span>{source.keystone ? "Keystone evidence record" : "Evidence record"}</span>
            <h1>{source.title}</h1>
            <p>{source.authors?.join(", ") || "Authorship metadata pending"}</p>
            <ArticleTools title={source.title} canonicalPath={`/source/${id}`} updated={source.year ? `${source.year}-01-01` : undefined} kind="source" />
            <PageCollaborationBar targetType="source" targetId={id} />
          </header>
          {publication && <section className="paper-section"><h2>Publication &amp; review status</h2><p>{publication.metadata.publicationStatus}</p><p>{publication.metadata.affiliations.join(" · ")} · {publication.metadata.license}</p><p>WikiBiome editorial acceptance concerns these article changes; it does not confer external peer-review status on the report.</p><details><summary>WikiBiome review record</summary><p>{publication.reviewNote}</p><p>{publication.editorNote}</p><small>Publication verified {publication.publishedAt}</small></details></section>}
          <div className="source-grid">
            <section className="source-citation">
              <p className="source-label">Citation record</p>
              <dl>
                <div><dt>Year</dt><dd>{source.year ?? "Not recorded"}</dd></div>
                <div><dt>Journal</dt><dd>{source.journal ?? "Not recorded"}</dd></div>
                <div><dt>DOI</dt><dd>{doi.status === "valid" ? <a href={doi.href}>{doi.bare} ↗</a> : doi.status === "malformed" ? <span className="doi-warning">Flagged for editorial review</span> : "Not yet verified"}</dd></div>
                <div><dt>WikiBiome key</dt><dd><code>{id}</code></dd></div>
              </dl>
              {source.keystone && (
                <div className="keystone-note"><span>Why this source matters</span><p>{source.why_keystone}</p><small>Criteria met: {source.keystone_criteria_met?.join(" · ")}</small></div>
              )}
            </section>
            <section className="used-by">
              <p className="source-label">Used in {usedBy.length} visible records</p>
              {usedBy.map((page) => <Link href={`/article/${page.id}`} key={page.id}><span>{page.category}</span><b>{page.title}</b><i>→</i></Link>)}
              {!usedBy.length && <p>This source is indexed but has no public backlinks in the current article set.</p>}
            </section>
          </div>
          <section className="source-author-layer">
            <header><div><span>Author connection</span><h2>Are you an author of this work?</h2><p>Every coauthor may independently claim authorship through ORCID, check this record, add context, and see where the work is used.</p></div><Link href={`/source/${id}/claim`}>Claim or review this work →</Link></header>
            {!!claims.length && <div className="verified-author-list"><span>Verified author claims</span>{claims.map(({ researcher }) => <span className="researcher-identity" key={researcher.accountId}><Link href={`/researchers/${researcher.orcid}`}><b>{researcher.name}</b></Link><OrcidLink orcid={researcher.orcid} name={researcher.name} /></span>)}</div>}
            {!!authorContext.length && <div className="author-context-list" id="author-context"><h3>Moderated author context</h3>{authorContext.map((review) => <article key={review.id}><header><Link href={`/researchers/${review.researcher.orcid}`}>{review.researcher.name}</Link><span>{review.accuracy.replaceAll("_", " ")}</span></header><p>{review.context}</p>{review.sourceUrl && <a href={review.sourceUrl} target="_blank" rel="noreferrer">Supporting source ↗</a>}{review.conflictDisclosure && <small>Disclosure: {review.conflictDisclosure}</small>}<footer>Author context supplements—but does not replace—WikiBiome’s independent synthesis.</footer></article>)}</div>}
          </section>
          <ResearchDiscussion targetType="source" targetId={id} />
          <PageActivityTrail targetType="source" targetId={id} />
          <footer className="source-footer"><b>WikiBiome evidence integrity</b><span>Citation metadata is displayed directly from the public WikiBiome source index.</span><Link href="/article/gut-microbiome">Return to the encyclopedia →</Link></footer>
        </article>
      </main>
    </>
  );
}
