import { assertSameOriginRequest, createInstitutionBatch, getResearcherSessionFromRequest } from "@/lib/research-network";

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try {
    return Response.json({ batch: await createInstitutionBatch({ account, institutionId: payload.institutionId, format: payload.format, identifiers: payload.identifiers }) }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The batch could not be submitted." }, { status: 400 });
  }
}
