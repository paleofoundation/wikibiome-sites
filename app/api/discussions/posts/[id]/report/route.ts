import { assertSameOriginRequest, getResearcherSessionFromRequest, reportDiscussionPost } from "@/lib/research-network";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  const { id } = await params;
  try {
    return Response.json({ report: await reportDiscussionPost({ account, postId: id, reason: payload.reason }) }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The report could not be submitted." }, { status: 400 });
  }
}
