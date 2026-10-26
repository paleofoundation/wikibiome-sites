import { assertSameOriginRequest, createDiscussionThread, getResearcherSessionFromRequest, listPublicDiscussions } from "@/lib/research-network";
import { notifyDiscussionActivity } from "@/lib/research-network-v2";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedType = url.searchParams.get("targetType");
  const targetType = requestedType === "source" ? "source" : requestedType === "proposal" ? "proposal" : "article";
  const targetId = url.searchParams.get("targetId")?.slice(0, 180) || "";
  const beforeValue = url.searchParams.get("before") || "";
  const before = beforeValue && !Number.isNaN(new Date(beforeValue).valueOf()) ? new Date(beforeValue).toISOString() : undefined;
  if (!targetId) return Response.json({ error: "A discussion target is required." }, { status: 400 });
  const account = await getResearcherSessionFromRequest(request);
  const discussions = await listPublicDiscussions(targetType, targetId, account?.accountId, before);
  const nextCursor = discussions.length === 50 ? discussions.at(-1)?.thread.updatedAt ?? null : null;
  return Response.json({ discussions, nextCursor }, { headers: { "cache-control": account ? "private, no-store" : "public, max-age=30" } });
}

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try {
    const result = await createDiscussionThread({ account, targetType: payload.targetType, targetId: payload.targetId, title: payload.title, category: payload.category, body: payload.body, sourceUrl: payload.sourceUrl, conflictDisclosure: payload.conflictDisclosure });
    if (result.status === "published") await notifyDiscussionActivity({ actor: account, threadId: result.threadId, targetType: payload.targetType === "source" ? "source" : payload.targetType === "proposal" ? "proposal" : "article", targetId: String(payload.targetId || ""), title: String(payload.title || "New discussion"), body: String(payload.body || ""), postId: result.postId });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The discussion could not be created." }, { status: 400 });
  }
}
