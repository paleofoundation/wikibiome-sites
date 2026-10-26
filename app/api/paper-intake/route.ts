import {
  assertSameOriginRequest,
  getResearcherSessionFromRequest,
} from "@/lib/research-network";
import { createPaper, listPapers } from "@/lib/paper-intake";
export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account)
    return Response.json({ error: "Sign in with ORCID." }, { status: 401 });
  return Response.json(
    { papers: await listPapers(account) },
    { headers: { "cache-control": "no-store" } },
  );
}
export async function POST(request: Request) {
  try {
    assertSameOriginRequest(request);
    const account = await getResearcherSessionFromRequest(request);
    if (!account)
      return Response.json({ error: "Sign in with ORCID." }, { status: 401 });
    return Response.json(await createPaper(account, await request.json()), {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Submission unavailable.",
      },
      { status: 400 },
    );
  }
}
