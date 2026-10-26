import { env } from "cloudflare:workers";
import { appendOrcidStatus } from "@/lib/orcid-auth.mjs";
import { consumeOauthState, createOrLinkOrcidAccount, createSession, normalizeOrcid, researcherSessionCookie } from "@/lib/research-network";

export async function GET(request: Request) {
  const runtime = env as unknown as Record<string, string | undefined>;
  const url = new URL(request.url);
  const stateValue = url.searchParams.get("state") || "";
  const state = stateValue ? await consumeOauthState(stateValue) : null;
  if (!state) return Response.redirect(new URL(appendOrcidStatus("/researcher/dashboard", "invalid_state"), request.url), 303);
  if (url.searchParams.get("error")) return Response.redirect(new URL(appendOrcidStatus(state.returnTo, "cancelled"), request.url), 303);
  const code = url.searchParams.get("code") || "";
  if (!code || !runtime.ORCID_CLIENT_ID || !runtime.ORCID_CLIENT_SECRET) return Response.redirect(new URL(appendOrcidStatus(state.returnTo, "configuration_error"), request.url), 303);

  const registry = runtime.ORCID_ENVIRONMENT === "sandbox" ? "https://sandbox.orcid.org" : "https://orcid.org";
  const redirectUri = runtime.ORCID_REDIRECT_URI || `${url.origin}/api/auth/orcid/callback`;
  const tokenResponse = await fetch(`${registry}/oauth/token`, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: runtime.ORCID_CLIENT_ID, client_secret: runtime.ORCID_CLIENT_SECRET, grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  });
  if (!tokenResponse.ok) return Response.redirect(new URL(appendOrcidStatus(state.returnTo, "token_error"), request.url), 303);
  const token = await tokenResponse.json() as { access_token?: string; orcid?: string; name?: string };
  let orcid = normalizeOrcid(token.orcid);
  let name = token.name || "";
  if (token.access_token) {
    const userInfo = await fetch(`${registry}/oauth/userinfo`, { headers: { accept: "application/json", authorization: `Bearer ${token.access_token}` } });
    if (userInfo.ok) {
      const identity = await userInfo.json() as { sub?: string; name?: string; given_name?: string; family_name?: string };
      orcid = normalizeOrcid(identity.sub) || orcid;
      name = identity.name || [identity.given_name, identity.family_name].filter(Boolean).join(" ") || name;
    }
  }
  if (!orcid) return Response.redirect(new URL(appendOrcidStatus(state.returnTo, "identity_error"), request.url), 303);

  const accountId = await createOrLinkOrcidAccount({
    orcid,
    name,
    linkAccountId: state.linkAccountId,
    chatgptUserId: state.chatgptUserId,
    chatgptEmail: state.chatgptEmail,
    chatgptName: state.chatgptName,
  });
  const session = await createSession(accountId);
  const destination = state.sourceId ? `/source/${encodeURIComponent(state.sourceId)}/claim` : state.returnTo;
  return new Response(null, { status: 303, headers: { location: new URL(destination, request.url).toString(), "set-cookie": researcherSessionCookie(session.token, request.url), "cache-control": "no-store" } });
}
