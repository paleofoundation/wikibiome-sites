import { assertSameOriginRequest, createAuthorReview, getResearcherSessionFromRequest } from "@/lib/research-network";

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try {
    const review = await createAuthorReview({ account, claimId: payload.claimId, accuracy: payload.accuracy, context: payload.context, sourceUrl: payload.sourceUrl, conflictDisclosure: payload.conflictDisclosure });
    return Response.json({ review }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The author review could not be submitted." }, { status: 400 });
  }
}
