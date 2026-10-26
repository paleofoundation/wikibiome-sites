import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { InstitutionRequestForm } from "@/app/_components/InstitutionRequestForm";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getResearcherSession, institutionPublicIdentifier, listApprovedInstitutions, listPublicResearcherDirectory } from "@/lib/research-network";
import { publicPageMetadata } from "@/lib/search-discovery";
import { OrganizationDirectory } from "@/app/_components/OrganizationDirectory";
import { OrganizationSearch } from "@/app/_components/OrganizationSearch";
import { organizationProfiles, searchOrganizationProfiles, matchesOrganizationQuery } from "@/lib/organization-profiles.mjs";

type Props = { searchParams: Promise<{ q?: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return publicPageMetadata({ title: "Organizations & projects — WikiBiome", description: "Find organizations, research platforms, and evidence projects by name, researcher, website, or research topic.", path: "/institutions", index: !q?.trim() });
}

export default async function InstitutionsPage({ searchParams }: Props) {
  const [{ q = "" }, account, institutions] = await Promise.all([searchParams, getResearcherSession(), listApprovedInstitutions()]);
  const query = q.trim().slice(0, 200);
  const researchers = query ? await listPublicResearcherDirectory() : [];
  const matchingResearchers = researchers.filter((person) => matchesOrganizationQuery(query, `${person.name} ${person.orcid}`));
  const profiles = query ? searchOrganizationProfiles(query, researchers) : organizationProfiles;
  const reviewed = institutions.filter((item) => {
    const text = `${item.name} ${item.websiteUrl || ""} ${item.description || ""} ${item.country || ""} ${item.organizationType.replaceAll("_", " ")}`;
    return matchesOrganizationQuery(query, text) || researchers.some((person) => person.verifiedAffiliations.some((affiliation) => affiliation.identifier === institutionPublicIdentifier(item)) && matchesOrganizationQuery(query, `${text} ${person.name} ${person.orcid}`));
  });
  const count = profiles.length + reviewed.length;
  return <><WikiHeader /><main className="organizations-index">
    <header className="organization-heading"><span className="organization-eyebrow">The WikiBiome network</span><h1>Organizations &amp; projects</h1><p>Find the people and projects behind the science.</p></header>
    <OrganizationSearch query={query}/>
    <p className="organization-results-count" role="status">{count} {count === 1 ? "organization or project" : "organizations & projects"}{query ? ` for “${query}”` : " in the network"}</p>
    {matchingResearchers.length > 0 && <div className="organization-researcher-matches"><span>Matching researchers</span>{matchingResearchers.map((person) => <Link href={`/researchers/${person.orcid}`} key={person.orcid}>{person.name}</Link>)}<small>Results include organizations linked from these public researcher profiles.</small></div>}
    <OrganizationDirectory profiles={profiles} title={query ? "Matching projects" : "Explore the network"}/>
    {count === 0 && <section className="organization-empty"><h2>No matching organizations</h2><p>{matchingResearchers.length ? "These researchers have no matching organization pages linked yet. You can explore their profiles above." : "Try an organization or researcher name, website, or broader topic such as metals, signatures, or standards."}</p><Link href="/institutions">View all organizations &amp; projects</Link></section>}
    {(reviewed.length > 0 || !query) && <section id="participating-organizations" className="institution-directory"><header><h2>Reviewed research organizations</h2><span>{reviewed.length} approved</span></header>{reviewed.length ? reviewed.map((item) => <Link href={`/institutions/${institutionPublicIdentifier(item)}`} key={item.id}><b>{item.name}</b><span>{item.identityStatus === "ror_verified" ? `ROR verified${item.country ? ` · ${item.country}` : ""}` : `${item.organizationType.replaceAll("_", " ")} · WikiBiome reviewed`}</span><i aria-hidden="true">→</i></Link>) : <p>The organization pilot is accepting its first reviewed profiles.</p>}</section>}
    <details className="organization-participation"><summary>Represent an organization? Request a reviewed profile</summary><section className="institution-boundaries"><article><b>ROR when available</b><p>A delayed ROR record does not block a reviewed provisional profile.</p></article><article><b>Human verification</b><p>Administrator and researcher relationships require a matching domain or documented manual review.</p></article><article><b>Free participation</b><p>Organization pages and moderated collection intake are free. Payment never affects approval or visibility.</p></article></section>{account?.emailVerified ? <InstitutionRequestForm /> : <section className="research-gate inline"><h2>Request access as a verified researcher</h2><p>Connect ORCID and verify your private email before requesting an organization profile.</p><a href={account ? "/researcher/dashboard" : "/api/auth/orcid/start?returnTo=/institutions"}>{account ? "Verify private email" : "Continue with ORCID"}</a></section>}</details>
  </main></>;
}
