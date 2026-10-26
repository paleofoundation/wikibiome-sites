import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { ResearchToolsNav } from "@/app/_components/ResearchToolsNav";
import { StructuredData } from "@/app/_components/StructuredData";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getKeystoneStudies, KEYSTONE_CRITERIA } from "@/lib/research-tools";
import { publicPageMetadata, researchToolStructuredData } from "@/lib/search-discovery";

const title = "Keystone studies — WikiBiome";
const description = "Audit the studies that provide structurally important connections across WikiBiome’s evidence graph.";
export const metadata: Metadata = publicPageMetadata({ title, description, path: "/keystone" });

type PageProps = { searchParams: Promise<{ criterion?: string }> };

export default async function KeystonePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const criterion = Number(params.criterion) || undefined;
  const studies = getKeystoneStudies(criterion);
  const allStudies = getKeystoneStudies();
  const verified = allStudies.filter((study) => study.metadataStatus === "verified DOI").length;
  const dependencies = new Set(allStudies.flatMap((study) => study.usedBy.map((page) => page.id))).size;
  return (
    <>
      <StructuredData data={researchToolStructuredData({ path: "/keystone", name: title, description })} marker="data-research-tool-schema" />
      <WikiHeader />
      <main className="tool-page keystone-page">
        <header className="tool-hero keystone-hero"><div><span>Structural evidence</span><h1>Keystone studies</h1><p>A Keystone designation identifies research that WikiBiome depends on to connect metals, microbes, mechanisms, and disease. It is a transparent graph role—not a citation prize, journal ranking, or claim that every source has equal publication status.</p></div><dl><div><dt>{allStudies.length}</dt><dd>designated studies</dd></div><div><dt>{dependencies}</dt><dd>dependent pages</dd></div><div><dt>{verified}</dt><dd>verified DOI records</dd></div></dl></header>
        <ResearchToolsNav active="keystone" />

        <section className="keystone-criteria" aria-labelledby="criteria-title"><header><span>Classification contract</span><h2 id="criteria-title">At least three of five criteria</h2><p>The source data carries the criteria and editorial rationale; this page regenerates the designation list and every dependency link from the synchronized corpus.</p></header><div>{KEYSTONE_CRITERIA.map((item) => <article className={criterion === item.id ? "active" : ""} key={item.id}><span>{String(item.id).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p><Link href={criterion === item.id ? "/keystone" : `/keystone?criterion=${item.id}`}>{criterion === item.id ? "Show all studies" : `Filter by criterion ${item.id}`} →</Link></article>)}</div></section>

        <section className="keystone-library" aria-labelledby="library-title"><header><div><span>Generated library</span><h2 id="library-title">{criterion ? `Criterion ${criterion}: ${KEYSTONE_CRITERIA.find((item) => item.id === criterion)?.title}` : "All designated studies"}</h2><p>{studies.length} records, ordered by the number of canonical pages that use them.</p></div></header><div>{studies.map((study) => <details className="keystone-study" key={study.id}><summary><span className="keystone-star">★</span><div><small>{study.journal ?? "Journal metadata pending"}{study.year ? ` · ${study.year}` : ""}</small><h3>{study.title}</h3><p>{study.authors.slice(0, 4).join(", ")}{study.authors.length > 4 ? " et al." : ""}</p></div><dl><div><dt>{study.usedBy.length}</dt><dd>dependent pages</dd></div><div><dt>{study.criteria.length}/5</dt><dd>criteria</dd></div></dl><i aria-hidden="true">⌄</i></summary><div className="keystone-detail"><section><span>Why Keystone</span><p>{study.rationale}</p></section><section><span>Criteria met</span><div>{study.criteria.map((id) => { const item = KEYSTONE_CRITERIA.find((candidate) => candidate.id === id); return <b key={id}>{id} · {item?.title}</b>; })}</div></section><section><span>Used by canonical pages</span><div>{study.usedBy.slice(0, 12).map((page) => <Link href={`/article/${page.id}`} key={page.id}>{page.title}</Link>)}</div></section><footer><Link href={`/source/${study.id}`}>Open evidence record →</Link>{study.doi && <a href={`https://doi.org/${study.doi}`} target="_blank" rel="noreferrer">DOI ↗</a>}<b className={`metadata-${study.metadataStatus.replace(/\s+/g, "-")}`}>{study.metadataStatus}</b></footer></div></details>)}</div></section>
        <aside className="tool-method-note"><strong>Publication metadata</strong><p>All {allStudies.length} currently designated studies have verified DOI and publication identity metadata. Keystone status remains a graph role, not a quality ranking or a claim that every source has equal evidentiary weight.</p></aside>
      </main>
    </>
  );
}
