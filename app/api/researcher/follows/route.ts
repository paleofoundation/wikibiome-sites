import { assertSameOriginRequest, getResearcherSessionFromRequest } from "@/lib/research-network";
import { setFollow } from "@/lib/research-network-v2";

async function mutate(request: Request, enabled: boolean) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try { return Response.json(await setFollow(account, payload.targetType, payload.targetId, enabled)); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Follow preference could not be updated." }, { status: 400 }); }
}

export async function POST(request: Request) { return mutate(request, true); }
export async function DELETE(request: Request) { return mutate(request, false); }
