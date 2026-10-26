import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getInstitutionByIdentifier, institutionPublicIdentifier, listAcceptedInstitutionBatches, listInstitutionResearchers } from "@/lib/research-network";

type Props = { params: Promise<{ ror: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ror } = await params;
  const institution = await getInstitutionByIdentifier(ror);
  return institution?.status === "approved" ? { title: `${institution.name} — WikiBiome research organization`, description: institution.description || `Research participation by ${institution.name} on WikiBiome.` } : { title: "Research organization not found — WikiBiome" };
}

export default async function InstitutionPage({ params }: Props) {
  const { ror } = await params;
  const institution = await getInstitutionByIdentifier(ror);
  if (!institution || institution.status !== "approved") notFound();
  const [researchers, batches] = await Promise.all([listInstitutionResearchers(institution.id), listAcceptedInstitutionBatches(institution.id)]);
  const works = batches.flatMap((batch) => parseIdentifiers(batch.identifiersJson).map((identifier) => ({ identifier, format: batch.format, batchId: batch.id }))).slice(0, 500);
  const identifier = institutionPublicIdentifier(institution);
  const rorVerified = institution.identityStatus === "ror_verified";
  const structuredData = { "@context": "https://schema.org", "@type": "Organization", name: institution.name, url: `https://www.wikibiome.com/institutions/${identifier}`, sameAs: rorVerified ? `https://ror.org/${institution.ror}` : institution.websiteUrl || undefined, identifier: rorVerified ? { "@type": "PropertyValue", propertyID: "ROR", value: institution.ror } : undefined, location: institution.country || undefined };
  return <><WikiHeader /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} /><main className="research-profile institution-profile"><header><span>{rorVerified ? "ROR-verified research organization" : "WikiBiome-reviewed provisional organization"}</span><h1>{institution.name}</h1>{rorVerified ? <a href={`https://ror.org/${institution.ror}`} target="_blank" rel="noreferrer">ROR {institution.ror} ↗</a> : institution.websiteUrl ? <a href={institution.websiteUrl} target="_blank" rel="noreferrer">Organization website ↗</a> : null}{institution.description && <p>{institution.description}</p>}</header><section className="institution-summary"><article><strong>{researchers.length}</strong><span>participating ORCID researchers</span></article><article><strong>{batches.reduce((total, batch) => total + batch.recordCount, 0)}</strong><span>accepted batch records</span></article><article><strong>{rorVerified ? "ROR" : "Reviewed"}</strong><span>{rorVerified ? "persistent organization identity" : "ROR can be linked when available"}</span></article></section><section className="profile-works"><header><span>Accepted collections</span><h2>Works contributed through reviewed batches</h2></header>{works.length ? works.map((work, index) => <article key={`${work.batchId}-${index}`}><span>{work.format.toUpperCase()}</span><div><h3>{work.identifier}</h3><p>Accepted for WikiBiome’s editorial ingestion workflow; acceptance does not guarantee a public citation.</p></div></article>) : <p>No accepted batch works yet.</p>}</section><section className="profile-works"><header><span>Participants</span><h2>Researchers connected to this organization</h2></header>{researchers.length ? researchers.map(({ researcher, role }) => <article key={researcher.accountId}><span>{role.replaceAll("_", " ")}</span><div><h3><Link href={`/researchers/${researcher.orcid}`}>{researcher.name}</Link></h3><p>{[...new Set([...researcher.expertiseSelf, ...researcher.expertiseInferred])].join(" · ") || "Expertise not listed"}</p></div></article>) : <p>No public researcher memberships yet.</p>}</section><aside className="editorial-firewall"><b>Organization participation is not endorsement.</b><p>Profiles show reviewed relationships and accepted works. They do not sell placement, rank organizations, guarantee citation, or allow an administrator to claim authorship for an individual.</p></aside></main></>;
}

function parseIdentifiers(value: string) {
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []; } catch { return []; }
}
