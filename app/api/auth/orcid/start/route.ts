import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { appendOrcidStatus } from "@/lib/orcid-auth.mjs";
import { createOauthState, getResearcherSessionFromRequest, safeReturnTo } from "@/lib/research-network";

export async function GET(request: Request) {
  const runtime = env as unknown as Record<string, string | undefined>;
  const requestUrl = new URL(request.url);
  const returnTo = safeReturnTo(requestUrl.searchParams.get("returnTo"));
  if (!runtime.ORCID_CLIENT_ID || !runtime.ORCID_CLIENT_SECRET) return Response.redirect(new URL(appendOrcidStatus(returnTo, "not_configured"), request.url), 303);
  const [chatgpt, researcher] = await Promise.all([getChatGPTUser(), getResearcherSessionFromRequest(request)]);
  const sourceId = requestUrl.searchParams.get("sourceId")?.slice(0, 180) || undefined;
  const state = await createOauthState({
    returnTo,
    sourceId,
    linkAccountId: researcher?.accountId,
    chatgptUserId: chatgpt?.userId,
    chatgptEmail: chatgpt?.email,
    chatgptName: chatgpt?.displayName,
  });
  const registry = runtime.ORCID_ENVIRONMENT === "sandbox" ? "https://sandbox.orcid.org" : "https://orcid.org";
  const redirectUri = runtime.ORCID_REDIRECT_URI || `${requestUrl.origin}/api/auth/orcid/callback`;
  const authorize = new URL("/oauth/authorize", registry);
  authorize.searchParams.set("client_id", runtime.ORCID_CLIENT_ID);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("scope", "openid");
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("state", state);
  return Response.redirect(authorize, 303);
}
