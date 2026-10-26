import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { ContributionDashboard } from "@/app/_components/ContributionDashboard";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { isModerator, listContributionsForUser, listModerationQueue } from "@/lib/contributions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your contributions — WikiBiome", robots: { index: false, follow: false } };

export default function ContributionsPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  return <AuthenticatedDashboard searchParams={searchParams} />;
}

async function AuthenticatedDashboard({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const user = await requireChatGPTUser("/contributions");
  const { submitted } = await searchParams;
  const moderator = isModerator(user.userId);
  const [own, queue] = await Promise.all([listContributionsForUser(user.userId), moderator ? listModerationQueue() : Promise.resolve([])]);
  return <><WikiHeader /><main className="contributions-page"><header><div><span>Contribution workspace</span><h1>{moderator ? "Editorial review" : "Your contributions"}</h1><p>{user.displayName} · Signed-in WikiBiome contributor</p></div><nav><Link href="/contribute">How contribution works</Link><Link href="/search">Find another article</Link><a href={chatGPTSignOutPath("/")}>Sign out</a></nav></header>{submitted === "1" && <aside className="contribution-success"><strong>Submission received.</strong><span>It is now in the moderated review queue.</span></aside>}<ContributionDashboard own={own} queue={queue} moderator={moderator} /></main></>;
}
