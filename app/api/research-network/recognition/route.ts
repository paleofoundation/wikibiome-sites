import { assertSameOriginRequest, getResearcherSessionFromRequest } from "@/lib/research-network";
import { awardHumanRecognition, listRoundtableShortlist, revokeRecognition } from "@/lib/research-network-v2";

export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  try { return Response.json({ shortlist: await listRoundtableShortlist(account) }, { headers: { "cache-control": "private, no-store" } }); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Shortlist unavailable." }, { status: 403 }); }
}

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try {
    return Response.json(payload.action === "revoke"
      ? await revokeRecognition(account, { accountId: payload.accountId, level: payload.level, reason: payload.reason })
      : await awardHumanRecognition(account, { accountId: payload.accountId, level: payload.level, sourceType: payload.sourceType, sourceId: payload.sourceId, reason: payload.reason }));
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Recognition could not be updated." }, { status: 400 }); }
}
