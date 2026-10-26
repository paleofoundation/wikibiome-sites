import { env } from "cloudflare:workers";
import { flushNotification } from "@/lib/research-email";
import { assertSameOriginRequest, beginEmailVerification, enqueueNotification, getResearcherSessionFromRequest } from "@/lib/research-network";
import { getEmailVerificationStatus } from "@/lib/research-network-v2";

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  if (!account.email) return Response.json({ error: "Add a private contact email before requesting verification." }, { status: 400 });
  try {
    const verification = await beginEmailVerification(account.accountId, {
      email: account.email,
      researchNotifications: account.preferences.researchNotifications,
      communityDigest: account.preferences.communityDigest,
    });
    if (verification.alreadyVerified) return Response.json({ alreadyVerified: true, emailStatus: await getEmailVerificationStatus(account.accountId) });
    const url = new URL(request.url);
    const verificationUrl = `${url.origin}/api/account/email/verify?token=${encodeURIComponent(verification.token)}`;
    const queued = await enqueueNotification({ accountId: account.accountId, email: verification.email, kind: "email_verification", payload: { verificationUrl, researcherName: account.displayName } });
    const delivery = await flushNotification(queued.id);
    const runtime = env as unknown as Record<string, string | undefined>;
    return Response.json({ delivery, emailStatus: await getEmailVerificationStatus(account.accountId), ...(runtime.WIKIBIOME_EMAIL_DEBUG === "1" ? { verificationUrl } : {}) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Verification could not be requested." }, { status: 400 });
  }
}
