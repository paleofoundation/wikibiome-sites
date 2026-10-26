import { DiscussionBoard } from "@/app/_components/DiscussionBoard";
import { getResearcherSession, listPublicDiscussions } from "@/lib/research-network";

export async function ResearchDiscussion({ targetType, targetId }: { targetType: "article" | "source" | "proposal"; targetId: string }) {
  const account = await getResearcherSession();
  const discussions = await listPublicDiscussions(targetType, targetId, account?.accountId);
  return <DiscussionBoard targetType={targetType} targetId={targetId} viewer={{ signedIn: Boolean(account), emailVerified: Boolean(account?.emailVerified), accountId: account?.accountId }} initialDiscussions={discussions} />;
}
