import { assertSameOriginRequest, getResearcherSessionFromRequest } from "@/lib/research-network";
import { reportResearcherMessage } from "@/lib/research-network-v2";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  const { id } = await params;
  try { return Response.json(await reportResearcherMessage(account, id, payload.reason)); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "The message could not be reported." }, { status: 400 }); }
}
