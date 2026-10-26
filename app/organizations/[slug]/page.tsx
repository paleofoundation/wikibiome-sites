import { OrcidLink } from "@/app/_components/OrcidLink";
import { publishedOrganizationPapers } from "@/lib/paper-intake";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/app/_components/NativeLink";
import { OrganizationSearch } from "@/app/_components/OrganizationSearch";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getOrganizationProfile, organizationForWebsite, organizationMonogram } from "@/lib/organization-profiles.mjs";
import { listPublicResearcherDirectory } from "@/lib/research-network";
import { getWikiPage, getSource, findPagesUsingSource, canonicalArticleId } from "@/lib/wikibiome";
import { publicPageMetadata } from "@/lib/search-discovery";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = getOrganizationProfile((await params).slug);
  return profile ? publicPageMetadata({ title: `${profile.name} — WikiBiome`, description: profile.description, path: `/organizations/${profile.slug}` }) : { title: "Organization not found — WikiBiome", robots: { index: false } };
}

export default async function OrganizationPage({ params }: Props) {
  const profile = getOrganizationProfile((await params).slug);
  if (!profile) notFound();
  const researchers = (await listPublicResearcherDirectory()).filter((person) => person.associations.some((association) => organizationForWebsite(association.url)?.slug === profile.slug));
  const affiliatedPapers = await publishedOrganizationPapers(profile.name);
  const works = profile.works.flatMap((work) => {
    const source = getSource(work.id);
    return source ? [{ ...work, source, articles: findPagesUsingSource(work.id, 3) }] : [];
  });
  return <><WikiHeader /><main className="organization-page">
    <div className="organization-topbar"><nav className="organization-breadcrumb" aria-label="Breadcrumb"><Link href="/institutions">Organizations &amp; projects</Link><span aria-hidden="true">/</span><span>{profile.name}</span></nav><OrganizationSearch compact /></div>
    <header className="organization-heading organization-detail-heading"><span className={`organization-monogram ${profile.slug}`} aria-hidden="true">{organizationMonogram(profile.slug)}</span><div><span className="organization-eyebrow">{profile.kind}</span><h1>{profile.name}</h1><p>{profile.description}</p><a className="organization-website" href={profile.website} target="_blank" rel="noopener noreferrer">Official website <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div></header>
    <nav className="organization-section-nav" aria-label="On this page"><a href="#explore">Explore the science</a><a href="#evidence">Related evidence</a><a href="#researchers">People</a><a href="#about">About</a></nav>
    <section className="organization-connection"><h2>Connection to WikiBiome</h2><div><p>{profile.connection}</p><a href={profile.connectionSource}>{profile.connectionSourceLabel} ↗</a></div></section>
    <section id="explore" className="organization-explore"><header><span className="organization-eyebrow">Reading paths</span><h2>Explore the science</h2></header><div className="organization-paths">{profile.paths.map((path, index) => <article key={path.title}><span className="organization-path-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{path.title}</h3><p>{path.description}</p><ul>{path.articles.map((id) => { const page = getWikiPage(id); return page ? <li key={id}><Link href={`/article/${canonicalArticleId(id)}`}>{page.title}<span aria-hidden="true"> →</span></Link></li> : null; })}</ul></article>)}</div></section>
    {affiliatedPapers.length > 0 && <section className="paper-section"><h2>Papers naming this organization</h2><p>Affiliations recorded in papers whose approved evidence has been published in WikiBiome.</p>{affiliatedPapers.map(p => <article key={p.id}><h3><Link href={`/source/${p.id}`}>{p.title}</Link></h3><p>{p.status}</p></article>)}</section>}
    <div className="organization-detail-grid">
      <section id="evidence"><header><span className="organization-eyebrow">Source trail</span><h2>Related evidence</h2><p>Selected reading on these subjects. These publications are not attributed to the organization.</p></header><ol className="organization-works">{works.map((work) => <li key={work.id}><span className="organization-work-meta">{work.source.year} · {work.source.journal || "Source record"}</span><h3><Link href={`/source/${work.id}`}>{work.source.title}</Link></h3><p>{work.reason}</p>{work.articles.length > 0 && <details className="organization-citations"><summary>Articles citing this work</summary><ul>{work.articles.map((page) => <li key={page.id}><Link href={`/article/${canonicalArticleId(page.id)}`}>{page.title}</Link></li>)}</ul></details>}</li>)}</ol></section>
      <aside className="organization-sidebar">
        <section id="researchers"><header><span className="organization-eyebrow">People</span><h2>Associated researchers</h2><p>Linked from their public profiles.</p></header>{researchers.length ? <ul className="organization-people">{researchers.map((person) => <li key={person.orcid}><span className="researcher-identity"><Link href={`/researchers/${person.orcid}`}><strong>{person.name}</strong></Link><OrcidLink orcid={person.orcid} name={person.name} /></span>{profile.founder?.orcid === person.orcid ? <a className="organization-role" href={profile.founder.source}>{profile.founder.label} ↗</a> : <small>Association shared by the researcher</small>}</li>)}</ul> : <p>No researcher links yet. <Link href="/researcher/dashboard#researcher-associations">Add to your profile</Link>.</p>}</section>
        {profile.related.length > 0 && <section className="organization-related-projects"><h2>Related projects</h2>{profile.related.map((item) => <Link className="organization-related" href={`/organizations/${item.slug}`} key={item.slug}><strong>{getOrganizationProfile(item.slug)?.name}</strong><small>{item.label}</small></Link>)}</section>}
      </aside>
    </div>
    <section id="about" className="organization-about"><header><span className="organization-eyebrow">Purpose &amp; provenance</span><h2>About {profile.name}</h2></header><div><p>{profile.overview}</p><p className="organization-source">Source: <a href={profile.source}>{profile.sourceLabel} ↗</a></p><details className="organization-note"><summary>How these connections are described</summary><p>This editorial overview describes public context and related reading. Researcher website associations are self-declared; reviewed institutional memberships are listed separately in the <Link href="/institutions#participating-organizations">organization network</Link>.</p></details></div></section>
  </main></>;
}
