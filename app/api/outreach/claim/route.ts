import { consumeCitationNoticeToken } from "@/lib/research-network";

export async function GET(request: Request) {
  const url = new URL(request.url);
  try {
    const sourceId = await consumeCitationNoticeToken(url.searchParams.get("contact"), url.searchParams.get("token"));
    if (!sourceId) return new Response("This claim link is invalid, expired, or already used.", { status: 410, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
    return Response.redirect(new URL(`/source/${encodeURIComponent(sourceId)}/claim`, request.url), 303);
  } catch {
    return new Response("This claim link is unavailable.", { status: 503, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  }
}
