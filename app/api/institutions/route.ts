import { assertSameOriginRequest, createInstitution, getResearcherSessionFromRequest } from "@/lib/research-network";

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try {
    const created = await createInstitution({
      account,
      ror: payload.ror,
      name: payload.name,
      website: payload.website,
      organizationType: payload.organizationType,
      relationship: payload.relationship,
      description: payload.description,
      evidenceNote: payload.evidenceNote,
    });
    return Response.json({ institution: { institutionId: created.institutionId, identifier: created.identifier, ror: created.ror }, organization: created.organization }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The institution request could not be submitted." }, { status: 400 });
  }
}
