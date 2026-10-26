import { assertSameOriginRequest, getResearcherSessionFromRequest } from "@/lib/research-network";
import { listNotifications, markNotificationsRead, unreadNotificationCount } from "@/lib/research-network-v2";

export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const beforeValue = new URL(request.url).searchParams.get("before") || "";
  const before = beforeValue && !Number.isNaN(new Date(beforeValue).valueOf()) ? new Date(beforeValue).toISOString() : undefined;
  const notifications = await listNotifications(account.accountId, before);
  return Response.json({ notifications, unread: await unreadNotificationCount(account.accountId), nextCursor: notifications.length === 100 ? notifications.at(-1)?.createdAt ?? null : null }, { headers: { "cache-control": "private, no-store" } });
}

export async function PATCH(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  return Response.json(await markNotificationsRead(account.accountId, payload.ids));
}
