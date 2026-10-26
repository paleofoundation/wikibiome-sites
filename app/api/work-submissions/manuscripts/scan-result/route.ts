import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { submissionFiles } from "@/db/schema";
import { cleanText, recordAudit } from "@/lib/research-network";

type PrivateManuscriptBucket = { delete(key: string): Promise<void> };

export async function POST(request: Request) {
  const runtime = env as unknown as { WIKIBIOME_SCAN_WEBHOOK_SECRET?: string; MANUSCRIPTS?: PrivateManuscriptBucket };
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!runtime.WIKIBIOME_SCAN_WEBHOOK_SECRET || !safeEqual(runtime.WIKIBIOME_SCAN_WEBHOOK_SECRET, supplied)) return Response.json({ error: "Invalid scanner authorization." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  const r2Key = cleanText(payload.r2Key, 1000);
  const scanStatus = cleanText(payload.scanStatus, 40);
  const extractionStatus = cleanText(payload.extractionStatus, 40) || "pending";
  if (!r2Key || !["clean", "infected", "rejected", "scan_failed"].includes(scanStatus)) return Response.json({ error: "A valid quarantine key and scan status are required." }, { status: 400 });
  const file = (await getDb().select().from(submissionFiles).where(eq(submissionFiles.r2Key, r2Key)).limit(1))[0];
  if (!file) return Response.json({ error: "Quarantined manuscript not found." }, { status: 404 });
  await getDb().update(submissionFiles).set({ scanStatus, extractionStatus }).where(eq(submissionFiles.id, file.id));
  if ((scanStatus === "infected" || scanStatus === "rejected") && runtime.MANUSCRIPTS) await runtime.MANUSCRIPTS.delete(r2Key);
  await recordAudit(null, "work.file_scan_completed", "work_submission", file.submissionId, { fileId: file.id, scanStatus, extractionStatus });
  return Response.json({ fileId: file.id, scanStatus, extractionStatus });
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}
