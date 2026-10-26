import { assertSameOriginRequest, getResearcherSessionFromRequest } from "@/lib/research-network";
import { createProposal, listProposalsForAccount, withdrawProposal } from "@/lib/research-network-v2";

export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  return Response.json({ proposals: await listProposalsForAccount(account.accountId) }, { headers: { "cache-control": "private, no-store" } });
}

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try { return Response.json(await createProposal(account, payload), { status: 201 }); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "The proposal could not be submitted." }, { status: 400 }); }
}

export async function PATCH(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try { return Response.json(await withdrawProposal(account, payload.id)); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "The proposal could not be withdrawn." }, { status: 400 }); }
}
