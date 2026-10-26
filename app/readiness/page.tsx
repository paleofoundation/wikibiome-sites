import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getCutoverReport, type CutoverItem } from "@/lib/cutover-readiness";
import { filterMigrationEntries, getMigrationReport } from "@/lib/readiness";
import { publicPageMetadata } from "@/lib/search-discovery";

export const metadata: Metadata = publicPageMetadata({
  title: "Go-live and corpus readiness — WikiBiome",
  description: "A transparent cutover, migration, and evidence-integrity register for WikiBiome.",
  path: "/readiness",
});

type SearchParams = Promise<{ status?: string; category?: string; q?: string }>;

export default async function ReadinessPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const report = getMigrationReport();
  const cutover = getCutoverReport();
  const entries = filterMigrationEntries({ status: filters.status, category: filters.category, query: filters.q });
  const categories = [...new Set(report.entries.map((entry) => entry.category))].sort();

  return (
    <>
      <WikiHeader query={filters.q} />
      <main className="readiness-page">
        <div className="readiness-breadcrumbs"><Link href="/">WikiBiome</Link><span>/</span><b>Go-live register</b></div>
        <header className="readiness-hero">
          <span>Cutover control · synchronized source</span>
          <h1>Every route accounted for. Every blocker named.</h1>
          <p>This is the working register for moving the new WikiBiome to wikibiome.com. It separates launch requirements from improvements that can continue safely after the domain changes.</p>
          <div className="readiness-summary">
            <article className="ready"><strong>{cutover.complete}</strong><span>cutover items complete</span><small>Implemented and checked</small></article>
            <article className="review"><strong>{cutover.active}</strong><span>active programs</span><small>Safe to continue after launch</small></article>
            <article className="blocked"><strong>{cutover.external}</strong><span>external decisions</span><small>Owner, legal, or DNS authority</small></article>
            <article><strong>{cutover.requiredOpen}</strong><span>required items open</span><small>Must close before DNS moves</small></article>
            <article><strong>{report.canonicalRoutes}</strong><span>canonical routes</span><small>Generated from {report.totalRecords} records</small></article>
          </div>
        </header>

        <section className="cutover-register" aria-labelledby="cutover-title">
          <header><div><span>Go-live control</span><h2 id="cutover-title">Cutover register</h2></div><p>Updated from implemented system checks and the current hosting state.</p></header>
          <div className="cutover-gate-note"><strong>{cutover.requiredOpen ? `${cutover.requiredOpen} decisions remain before DNS can move.` : "The technical DNS gate is clear."}</strong><p>“Safe after launch” means the work stays visible and continues without breaking route continuity or hiding evidence warnings.</p></div>
          <div className="cutover-list">
            {cutover.items.map((item, index) => (
              <article className={`cutover-item ${item.status}`} key={item.id}>
                <span className="cutover-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="cutover-copy"><p><span>{item.area}</span><b className={`cutover-state ${item.status}`}>{item.status}</b></p><h3>{item.title}</h3><div>{item.evidence}</div>{item.nextAction && <small><strong>Next:</strong> {item.nextAction}</small>}</div>
                <aside><span>{item.gate}</span><small>{item.owner}</small><RegisterLink item={item} /></aside>
              </article>
            ))}
          </div>
        </section>

        <section className="readiness-ledger" id="corpus-ledger" aria-labelledby="ledger-title">
          <header>
            <div><span>Migration control</span><h2 id="ledger-title">Corpus ledger</h2></div>
            <p>{entries.length} of {report.totalRecords} records shown</p>
          </header>
          <form className="readiness-filters">
            <label><span>Status</span><select name="status" defaultValue={filters.status ?? "all"}><option value="all">All states</option><option value="ready">Ready</option><option value="documented">Documented limitation</option><option value="review">Review</option><option value="blocked">Blocked</option></select></label>
            <label><span>Domain</span><select name="category" defaultValue={filters.category ?? "all"}><option value="all">All domains</option>{categories.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
            <label className="readiness-query"><span>Find a record or warning</span><input name="q" defaultValue={filters.q ?? ""} placeholder="Akkermansia, citation, template…" /></label>
            <button type="submit">Filter ledger</button>
          </form>

          <div className="ledger-table-wrap">
            <table className="ledger-table">
              <thead><tr><th>Record</th><th>Domain</th><th>Canonical destination</th><th>Evidence</th><th>State</th></tr></thead>
              <tbody>
                {entries.slice(0, 250).map((entry) => (
                  <tr key={entry.key}>
                    <td><strong>{entry.title}</strong><small>{entry.id}{entry.recordCount > 1 ? ` · record ${entry.recordNumber}/${entry.recordCount}` : ""}</small></td>
                    <td><span className="ledger-domain">{entry.category}</span><small>{entry.sectionCount} sections</small></td>
                    <td><Link href={entry.canonicalUrl}>{entry.canonicalId}</Link>{entry.pairedRecordCount > 1 && <small>{entry.pairedRecordCount} records reconciled</small>}</td>
                    <td><b>{entry.referenceCount}</b><small>{entry.missingMetadataCount ? `${entry.missingMetadataCount} metadata warnings` : "references generated"}</small></td>
                    <td><span className={`ledger-state ${entry.status}`}>{entry.status}</span>{entry.issues.length ? <small title={entry.issues.map((issue) => issue.label).join("; ")}>{entry.issues[0].label}{entry.issues.length > 1 ? ` +${entry.issues.length - 1}` : ""}</small> : <small>Checks passed</small>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {entries.length > 250 && <p className="ledger-limit">Showing the first 250 filtered records. Refine the filters to inspect the remaining {entries.length - 250}.</p>}
          {!entries.length && <div className="ledger-empty"><strong>No records match these filters.</strong><Link href="/readiness">Clear filters</Link></div>}
        </section>

        <footer className="readiness-method">
          <div><span>Source snapshot</span><code>{report.sourceCommit.slice(0, 12)}</code></div>
          <p>{report.duplicateIds} duplicate identifiers are explicitly reconciled. {report.missingSourceMetadata
            ? `${report.missingSourceMetadata} cited source identifiers remain in the editorial metadata queue.`
            : `All cited source identifiers resolve to source records; ${report.resolvedSourceAliases} historical citation aliases are reconciled by the registry.`}</p>
        </footer>
      </main>
    </>
  );
}

function RegisterLink({ item }: { item: CutoverItem }) {
  if (!item.href) return null;
  if (/^https?:/.test(item.href)) return <a href={item.href} target="_blank" rel="noreferrer">Inspect ↗</a>;
  return <Link href={item.href}>Inspect →</Link>;
}
