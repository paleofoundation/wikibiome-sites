import { assertSameOriginRequest, createDiscussionReply, getResearcherSessionFromRequest } from "@/lib/research-network";
import { notifyDiscussionActivity } from "@/lib/research-network-v2";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  const { id } = await params;
  try {
    const result = await createDiscussionReply({ account, threadId: id, parentPostId: payload.parentPostId, body: payload.body, sourceUrl: payload.sourceUrl, conflictDisclosure: payload.conflictDisclosure });
    if (result.status === "published") await notifyDiscussionActivity({ actor: account, threadId: result.threadId, targetType: result.targetType, targetId: result.targetId, title: result.title, body: String(payload.body || ""), parentPostId: result.parentPostId, postId: result.postId });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The reply could not be posted." }, { status: 400 });
  }
}
