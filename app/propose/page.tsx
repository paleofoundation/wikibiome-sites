import type { Metadata } from "next";
import { ProposalForm } from "@/app/_components/ProposalForm";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getResearcherSession } from "@/lib/research-network";
import { allWikiPages } from "@/lib/wikibiome";
import { publicPageMetadata } from "@/lib/search-discovery";

export const dynamic = "force-dynamic";
export const metadata: Metadata = publicPageMetadata({ title: "Propose WikiBiome research content", description: "Propose a microbiome- or metallomics-anchored page, section, connection, or framework correction.", path: "/propose" });
export default async function ProposePage({ searchParams }: { searchParams: Promise<{ target?: string }> }) { const account = await getResearcherSession(); const { target = "" } = await searchParams; return <><WikiHeader/><main className="project-page proposal-page"><header className="project-page-hero"><span>Researcher editorial pathway</span><h1>Propose a missing connection.</h1><p>Help WikiBiome turn siloed evidence into a coherent microbiome–metallomics framework. Every proposal needs checkable evidence, a mechanistic link, and explicit causal limits.</p></header>{!account ? <section className="research-gate"><h2>Connect your ORCID iD to propose research content.</h2><p>Existing ChatGPT contribution history can be linked after ORCID authentication.</p><a href={`/api/auth/orcid/start?returnTo=${encodeURIComponent(`/propose${target ? `?target=${target}` : ""}`)}`}>Continue with ORCID</a></section> : !account.emailVerified ? <section className="research-gate"><h2>Verify your private email first.</h2><p>Verification protects attribution, moderation, and researcher-to-researcher participation.</p><a href="/researcher/dashboard">Complete researcher profile</a></section> : <ProposalForm initialTarget={target} pages={allWikiPages.map((page) => ({ id: page.id, title: page.title, category: page.category })).sort((a, b) => a.title.localeCompare(b.title))}/>}</main></>; }
