import { env } from "cloudflare:workers";
import { flushPendingNotifications } from "@/lib/research-email";
import { assertSameOriginRequest, sha256 } from "@/lib/research-network";

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch { return Response.json({ error: "Notification dispatch is not authorized." }, { status: 401 }); }
  const runtime = env as unknown as Record<string, string | undefined>;
  const expected = runtime.WIKIBIOME_NOTIFICATION_DISPATCH_SECRET || "";
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !provided || await sha256(expected) !== await sha256(provided)) {
    return Response.json({ error: "Notification dispatch is not authorized." }, { status: 401 });
  }
  const requestedLimit = Number(new URL(request.url).searchParams.get("limit") || 20);
  const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(100, Math.trunc(requestedLimit))) : 20;
  const results = await flushPendingNotifications(limit);
  return Response.json({ processed: results.length, results }, { headers: { "cache-control": "private, no-store" } });
}
