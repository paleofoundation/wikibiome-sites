import type { Metadata } from "next";
import { MessageCenter } from "@/app/_components/MessageCenter";
import { ResearcherWorkspaceNav } from "@/app/_components/ResearcherWorkspaceNav";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getResearcherSession } from "@/lib/research-network";
import { listMessageThreads, unreadNotificationCount } from "@/lib/research-network-v2";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Researcher messages — WikiBiome", robots: { index: false, follow: false } };
export default async function ResearcherMessagesPage({ searchParams }: { searchParams: Promise<{ recipient?: string }> }) { const account = await getResearcherSession(); if (!account) return <><WikiHeader/><main className="research-gate"><h1>ORCID sign-in required</h1><a href="/api/auth/orcid/start?returnTo=/researcher/messages">Continue with ORCID</a></main></>; const { recipient = "" } = await searchParams; const [threads, unread] = await Promise.all([listMessageThreads(account.accountId), unreadNotificationCount(account.accountId)]); return <><WikiHeader/><main className="research-workspace"><header className="workspace-hero"><span>Researcher network</span><h1>Private messages</h1><p>Make a focused contact request, wait for consent, then continue a private research conversation.</p></header><ResearcherWorkspaceNav active="messages" unread={unread}/><MessageCenter accountId={account.accountId} initialThreads={threads} initialEnabled={account.messagingEnabled} initialRecipient={recipient}/></main></>; }
