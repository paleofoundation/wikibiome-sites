import { assertSameOriginRequest, getResearcherSessionFromRequest } from "@/lib/research-network";
import { submitSyncedOrcidWork } from "@/lib/research-network-v2";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const { id } = await params;
  try {
    const submission = await submitSyncedOrcidWork(account, id);
    return Response.json({ submission: { id: submission.id, status: submission.status } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The ORCID work could not be submitted." }, { status: 400 });
  }
}
