import { assertSameOriginRequest, getResearcherSessionFromRequest } from "@/lib/research-network";
import { getRoundtableInterest, saveRoundtableInterest, withdrawRoundtableInterest } from "@/lib/research-network-v2";

export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  return Response.json({ interest: await getRoundtableInterest(account.accountId) }, { headers: { "cache-control": "private, no-store" } });
}

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try { return Response.json(await saveRoundtableInterest(account, payload)); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Roundtable interest could not be saved." }, { status: 400 }); }
}

export async function DELETE(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  return Response.json(await withdrawRoundtableInterest(account));
}
