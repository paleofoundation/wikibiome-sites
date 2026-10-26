import { assertSameOriginRequest, blockResearcher, getResearcherSessionFromRequest } from "@/lib/research-network";

export async function POST(request: Request, { params }: { params: Promise<{ orcid: string }> }) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const { orcid } = await params;
  try {
    return Response.json(await blockResearcher({ account, orcid }));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The researcher could not be blocked." }, { status: 400 });
  }
}
