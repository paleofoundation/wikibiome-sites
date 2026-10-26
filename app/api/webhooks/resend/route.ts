import { applyResendEvent, verifyResendWebhook } from "@/lib/research-email";

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!await verifyResendWebhook(request, rawBody)) return Response.json({ error: "Invalid webhook signature." }, { status: 401 });
  let payload: Record<string, unknown>;
  try { payload = JSON.parse(rawBody) as Record<string, unknown>; } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  return Response.json({ applied: await applyResendEvent(payload, request.headers.get("svix-id") || undefined) });
}
