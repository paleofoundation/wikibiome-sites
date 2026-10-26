import {
  assertSameOriginRequest,
  getResearcherSessionFromRequest,
} from "@/lib/research-network";
import {
  actOnPaper,
  paperAccess,
  verifyPaperPublication,
} from "@/lib/paper-intake";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, { params }: Context) {
  try {
    const a = await getResearcherSessionFromRequest(request);
    if (!a) throw new Error("Sign in with ORCID.");
    return Response.json(
      { paper: await paperAccess(a, (await params).id) },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Paper not found or access unavailable." },
      { status: 404 },
    );
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOriginRequest(request);
    const a = await getResearcherSessionFromRequest(request);
    if (!a)
      return Response.json({ error: "Sign in with ORCID." }, { status: 401 });
    const input = (await request.json()) as Record<string, unknown>;
    const { id } = await params;
    const paper =
      input.action === "verify_publication"
        ? await verifyPaperPublication(a, id)
        : await actOnPaper(a, id, input);
    return Response.json({ paper });
  } catch (e) {
    return Response.json(
      {
        error:
          e instanceof Error ? e.message : "The decision could not be saved.",
      },
      { status: 400 },
    );
  }
}
