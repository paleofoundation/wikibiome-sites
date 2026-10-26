import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workSubmissions } from "@/db/schema";
import { assertSameOriginRequest, getResearcherSessionFromRequest, recordAudit } from "@/lib/research-network";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const { id } = await params;
  const payload = await request.json() as Record<string, unknown>;
  if (payload.status !== "withdrawn") return Response.json({ error: "Researchers may only withdraw their own submission." }, { status: 400 });
  const submission = (await getDb().select().from(workSubmissions).where(and(eq(workSubmissions.id, id), eq(workSubmissions.accountId, account.accountId))).limit(1))[0];
  if (!submission || ["accepted", "declined", "withdrawn"].includes(submission.status)) return Response.json({ error: "This submission cannot be withdrawn." }, { status: 409 });
  await getDb().update(workSubmissions).set({ status: "withdrawn", updatedAt: new Date().toISOString() }).where(eq(workSubmissions.id, id));
  await recordAudit(account.accountId, "work.withdrawn", "work_submission", id, {});
  return Response.json({ id, status: "withdrawn" });
}
