import { assertSameOriginRequest, clearResearcherSessionCookie, revokeResearcherSessionFromRequest, safeReturnTo } from "@/lib/research-network";

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch { return Response.json({ error: "Request rejected." }, { status: 403 }); }
  await revokeResearcherSessionFromRequest(request);
  const url = new URL(request.url);
  return new Response(null, {
    status: 303,
    headers: {
      location: new URL(safeReturnTo(url.searchParams.get("returnTo"), "/"), request.url).toString(),
      "set-cookie": clearResearcherSessionCookie(request.url),
      "cache-control": "no-store",
    },
  });
}
