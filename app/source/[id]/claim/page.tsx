import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/app/_components/NativeLink";
import { SourceClaimForm } from "@/app/_components/SourceClaimForm";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getResearcherSession, listClaimsForAccount } from "@/lib/research-network";
import { findPagesUsingSource, getSource } from "@/lib/wikibiome";

type Props = { params: Promise<{ id: string }> };
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Claim a cited work — WikiBiome", robots: { index: false, follow: false } };

export default async function SourceClaimPage({ params }: Props) {
  const { id } = await params;
  const source = getSource(id);
  if (!source) notFound();
  const account = await getResearcherSession();
  const placements = findPagesUsingSource(id);
  return <><WikiHeader /><main className="claim-page"><header><span>Author claim · {placements.length} WikiBiome placements</span><h1>{source.title}</h1><p>{source.authors?.join(", ") || "Authorship metadata pending"} · {source.journal || "Journal pending"} · {source.year || "Year pending"}</p><Link href={`/source/${id}`}>View public source record →</Link></header>{!account ? <section className="research-gate inline"><span>Step 1</span><h2>Authenticate with ORCID</h2><p>The signed claim link can bring you here, but it is not proof of authorship. WikiBiome requires ORCID authentication and a separate verified private email.</p><a href={`/api/auth/orcid/start?returnTo=${encodeURIComponent(`/source/${id}/claim`)}`}>Continue with ORCID</a></section> : !account.emailVerified ? <section className="research-gate inline"><span>Step 1</span><h2>Verify your private email</h2><p>Your ORCID iD is connected. Add and verify a private email before claiming, posting, or submitting.</p><Link href="/researcher/dashboard">Complete researcher profile</Link></section> : <SourceClaimForm sourceId={id} existingClaim={(await listClaimsForAccount(account.accountId)).find((claim) => claim.sourceId === id) || null} />}</main></>;
}
