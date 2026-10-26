import type { Metadata } from "next";
import { ResearcherWorkspaceNav } from "@/app/_components/ResearcherWorkspaceNav";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { WorkDiscovery } from "@/app/_components/WorkDiscovery";
import { getResearcherSession } from "@/lib/research-network";
import { listResearcherWorkDiscovery, unreadNotificationCount } from "@/lib/research-network-v2";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Find my work — WikiBiome", robots: { index: false, follow: false } };

export default async function ResearcherWorksPage() {
  const account = await getResearcherSession();
  if (!account) return <><WikiHeader /><main className="research-gate"><span>Researcher work discovery</span><h1>Connect your ORCID iD.</h1><p>WikiBiome can compare your public ORCID works with its evidence corpus without blocking sign-in.</p><a href="/api/auth/orcid/start?returnTo=/researcher/works">Continue with ORCID</a></main></>;
  const [initial, unread] = await Promise.all([listResearcherWorkDiscovery(account.accountId), unreadNotificationCount(account.accountId)]);
  return <><WikiHeader /><main className="research-workspace"><header className="workspace-hero"><span>Researcher workspace</span><h1>Find my work</h1><p>Search WikiBiome directly or compare its source corpus with the public works on ORCID. You always confirm a match before a claim becomes public.</p></header><ResearcherWorkspaceNav active="works" unread={unread}/><WorkDiscovery initial={initial}/></main></>;
}
