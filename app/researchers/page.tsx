/* eslint-disable @next/next/no-img-element -- Photos are served by WikiBiome's versioned R2-backed route. */
import { OrcidLink } from "@/app/_components/OrcidLink";
import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { listPublicResearcherDirectory } from "@/lib/research-network";
import { matchResearcherDirectoryEntry, researcherExpertiseClusters } from "@/lib/researcher-discovery";
import { publicPageMetadata } from "@/lib/search-discovery";

type Props = { searchParams: Promise<{ q?: string; expertise?: string }> };

export const dynamic = "force-dynamic";
export const metadata: Metadata = publicPageMetadata({
  title: "Find microbiome researchers — WikiBiome",
  description: "Search ORCID-authenticated researchers by evidence-linked expertise, organization, name, and scientific focus.",
  path: "/researchers",
});

export default async function ResearchersPage({ searchParams }: Props) {
  const { q = "", expertise = "" } = await searchParams;
  const researchers = await listPublicResearcherDirectory();
  const results = researchers.filter((researcher) => matchResearcherDirectoryEntry({
    query: q,
    cluster: expertise,
    name: researcher.name,
    orcid: researcher.orcid,
    biography: researcher.biography,
    affiliations: [...researcher.affiliations, ...researcher.verifiedAffiliations.map((item) => item.name)],
    expertise: [...researcher.expertiseSelf, ...researcher.expertiseInferred],
    clusterSlugs: researcher.impact.clusterSlugs,
  }));
  const activeCluster = researcherExpertiseClusters.find((cluster) => cluster.slug === expertise);
  const verifiedWorks = researchers.reduce((total, researcher) => total + researcher.impact.verifiedWorks, 0);
  const evidenceFootprints = researchers.filter((researcher) => researcher.impact.linkedArticles > 0).length;

  return <><WikiHeader /><main className="research-directory-page">
    <header className="research-directory-hero"><div><span>Evidence-linked researcher network</span><h1>Find the people behind the evidence.</h1><p>Search by researcher, organization, ORCID iD, or scientific focus. Expertise inferred from verified work is labeled separately from what researchers declare about themselves.</p></div><dl><div><dt>{researchers.length}</dt><dd>public researchers</dd></div><div><dt>{verifiedWorks}</dt><dd>verified works</dd></div><div><dt>{evidenceFootprints}</dt><dd>active evidence footprints</dd></div></dl></header>

    <section className="researcher-finder" aria-labelledby="researcher-finder-title">
      <header><span>Researcher directory</span><h2 id="researcher-finder-title">Search people and expertise</h2></header>
      <form role="search" action="/researchers"><label className="sr-only" htmlFor="researcher-query">Search researchers</label><input id="researcher-query" name="q" defaultValue={q} placeholder="Try microbial metallomics, heavy metals, an organization, or a name"/><button>Search researchers</button></form>
      {(q || expertise) && <p className="directory-query-summary"><b>{results.length}</b> result{results.length === 1 ? "" : "s"}{q ? <> for “{q}”</> : null}{activeCluster ? <> in <strong>{activeCluster.name}</strong></> : null} · <Link href="/researchers">Clear filters</Link></p>}
    </section>

    <section className="researcher-clusters" aria-labelledby="researcher-clusters-title"><header><span>Explore by scientific focus</span><h2 id="researcher-clusters-title">Evidence-based expertise clusters</h2><p>Clusters overlap by design. They are generated from verified works and the WikiBiome articles those works support—not from popularity.</p></header><div>{researcherExpertiseClusters.map((cluster) => { const count = researchers.filter((researcher) => researcher.impact.clusterSlugs.includes(cluster.slug)).length; return <Link className={expertise === cluster.slug ? "active" : ""} href={`/researchers?expertise=${cluster.slug}`} key={cluster.slug}><span>{count} researcher{count === 1 ? "" : "s"}</span><h3>{cluster.name}</h3><p>{cluster.description}</p><b>Explore cluster →</b></Link>; })}</div></section>

    <section className="researcher-results" aria-labelledby="researcher-results-title"><header><div><span>{activeCluster ? activeCluster.name : "Public profiles"}</span><h2 id="researcher-results-title">{q || activeCluster ? "Matching researchers" : "All researchers"}</h2></div><b>{results.length}</b></header>{results.length ? <div>{results.map((researcher) => <article key={researcher.accountId}><div className="researcher-avatar">{researcher.photoAvailable ? <img src={`/researchers/${researcher.orcid}/photo${researcher.photoUpdatedAt ? `?v=${encodeURIComponent(researcher.photoUpdatedAt)}` : ""}`} alt={researcher.photoAlt || `Professional portrait of ${researcher.name}`}/> : <span aria-hidden="true">{initials(researcher.name)}</span>}</div><div><span>{researcher.role.replaceAll("_", " ")}</span><h3><Link href={`/researchers/${researcher.orcid}`}>{researcher.name}</Link></h3><p>{researcher.biography || "ORCID-authenticated WikiBiome researcher."}</p><small>{researcher.verifiedAffiliations.map((item) => item.name).concat(researcher.affiliations).slice(0, 3).join(" · ")}</small><OrcidLink orcid={researcher.orcid} name={researcher.name} /><div className="researcher-topic-list">{[...new Set([...researcher.expertiseInferred, ...researcher.expertiseSelf])].slice(0, 6).map((topic) => <span key={topic}>{topic}</span>)}</div></div><dl><div><dt>{researcher.impact.verifiedWorks}</dt><dd>verified works</dd></div><div><dt>{researcher.impact.keystoneWorks}</dt><dd>Keystone works</dd></div><div><dt>{researcher.impact.linkedArticles}</dt><dd>linked articles</dd></div></dl></article>)}</div> : <div className="directory-empty"><span>0</span><h2>No matching researcher yet.</h2><p>Try a broader term, clear the expertise filter, or invite a researcher to connect their ORCID iD.</p><Link href="/researchers">Browse all researchers →</Link></div>}</section>

    <section className="research-directory-invitation"><div><span>For researchers</span><h2>Make your work discoverable without turning scholarship into a popularity contest.</h2><p>Connect ORCID, verify authorship, add a professional profile, and choose which notifications or collaboration requests you want.</p></div><div><a className="research-primary" href="/api/auth/orcid/start?returnTo=/researcher/dashboard">Connect ORCID</a><Link href="/researcher/works">Find or add my work</Link><Link href="/institutions">Add an organization</Link></div></section>
  </main></>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "R";
}
