import type { Metadata } from "next";
import { NotificationCenter } from "@/app/_components/NotificationCenter";
import { ResearcherWorkspaceNav } from "@/app/_components/ResearcherWorkspaceNav";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getResearcherSession } from "@/lib/research-network";
import { listNotifications, unreadNotificationCount } from "@/lib/research-network-v2";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Research notifications — WikiBiome", robots: { index: false, follow: false } };
export default async function ResearcherNotificationsPage() { const account = await getResearcherSession(); if (!account) return <><WikiHeader/><main className="research-gate"><h1>ORCID sign-in required</h1><a href="/api/auth/orcid/start?returnTo=/researcher/notifications">Continue with ORCID</a></main></>; const [items, unread] = await Promise.all([listNotifications(account.accountId), unreadNotificationCount(account.accountId)]); const nextCursor = items.length === 100 ? items.at(-1)?.createdAt ?? null : null; return <><WikiHeader/><main className="research-workspace"><header className="workspace-hero"><span>Researcher workspace</span><h1>Notifications</h1><p>Follow replies, decisions, collaboration requests, and activity on work connected to you.</p></header><ResearcherWorkspaceNav active="notifications" unread={unread}/><NotificationCenter initial={items} initialNextCursor={nextCursor}/></main></>; }
