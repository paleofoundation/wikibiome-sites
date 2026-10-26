import { assertSameOriginRequest, createSourceClaim, getResearcherSessionFromRequest, listClaimsForAccount } from "@/lib/research-network";

export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  return Response.json({ claims: await listClaimsForAccount(account.accountId) }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try {
    const claim = await createSourceClaim({ sourceId: typeof payload.sourceId === "string" ? payload.sourceId : "", account, evidenceNote: payload.evidenceNote });
    return Response.json({ claim }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The work could not be claimed." }, { status: 400 });
  }
}
