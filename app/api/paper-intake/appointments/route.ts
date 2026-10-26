import {
  assertSameOriginRequest,
  getResearcherSessionFromRequest,
} from "@/lib/research-network";
import { appointReviewer } from "@/lib/paper-intake";
export async function POST(request: Request) {
  try {
    assertSameOriginRequest(request);
    const a = await getResearcherSessionFromRequest(request);
    if (!a) throw new Error("Sign in with ORCID.");
    const p = (await request.json()) as Record<string, unknown>;
    await appointReviewer(
      a,
      String(p.orcid || ""),
      String(p.topic || ""),
      p.active !== false,
    );
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Appointment failed." },
      { status: 400 },
    );
  }
}
