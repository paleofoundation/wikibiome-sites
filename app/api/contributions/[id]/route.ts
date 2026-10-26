import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isModerator, moderateContribution } from "@/lib/contributions";
import { assertSameOriginRequest } from "@/lib/research-network";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in is required." }, { status: 401 });
  if (!isModerator(user.userId)) return Response.json({ error: "Moderator access is required." }, { status: 403 });

  const { id } = await params;
  const payload = await request.json() as { status?: string; moderatorNote?: string };
  const allowed = new Set(["accepted", "declined", "needs_revision"]);
  if (!payload.status || !allowed.has(payload.status)) return Response.json({ error: "Choose a valid moderation decision." }, { status: 400 });
  const contribution = await moderateContribution(id, payload.status as "accepted" | "declined" | "needs_revision", payload.moderatorNote?.trim().slice(0, 4000) ?? "");
  if (!contribution) return Response.json({ error: "Contribution not found." }, { status: 404 });
  return Response.json({ contribution });
}
