import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { ProposalList } from "@/app/_components/ProposalList";
import { ResearcherWorkspaceNav } from "@/app/_components/ResearcherWorkspaceNav";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getResearcherSession } from "@/lib/research-network";
import { listProposalsForAccount, unreadNotificationCount } from "@/lib/research-network-v2";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Research proposals — WikiBiome", robots: { index: false, follow: false } };
export default async function ResearcherProposalsPage() { const account = await getResearcherSession(); if (!account) return <><WikiHeader/><main className="research-gate"><h1>ORCID sign-in required</h1><a href="/api/auth/orcid/start?returnTo=/researcher/proposals">Continue with ORCID</a></main></>; const [proposals, unread] = await Promise.all([listProposalsForAccount(account.accountId), unreadNotificationCount(account.accountId)]); return <><WikiHeader/><main className="research-workspace"><header className="workspace-hero"><span>Researcher workspace</span><h1>Scientific proposals</h1><p>Track page, section, connection, and framework proposals through editorial review and upstream publication.</p><Link href="/propose">Create a proposal →</Link></header><ResearcherWorkspaceNav active="proposals" unread={unread}/><ProposalList initial={proposals}/></main></>; }
