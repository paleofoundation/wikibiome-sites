import { createCitationNoticeContact, enqueueNotification, getResearcherSessionFromRequest, markCitationNoticeSent, assertSameOriginRequest } from "@/lib/research-network";
import { flushNotification, unsubscribeToken } from "@/lib/research-email";
import { getSource } from "@/lib/wikibiome";

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try {
    const contact = await createCitationNoticeContact(account, { email: payload.email, sourceId: payload.sourceId, provenance: payload.provenance, jurisdictionRule: payload.jurisdictionRule });
    const source = getSource(contact.sourceId);
    if (!source) throw new Error("Source not found.");
    const origin = new URL(request.url).origin;
    const unsubscribe = await unsubscribeToken(contact.email);
    const message = await enqueueNotification({ email: contact.email, kind: "citation_notice", payload: {
      sourceTitle: source.title,
      sourceUrl: `${origin}/source/${encodeURIComponent(contact.sourceId)}`,
      claimUrl: `${origin}/api/outreach/claim?contact=${encodeURIComponent(contact.id)}&token=${encodeURIComponent(contact.token)}`,
      unsubscribeUrl: `${origin}/api/email/unsubscribe?email=${encodeURIComponent(contact.email)}&token=${encodeURIComponent(unsubscribe)}`,
    } });
    const delivery = await flushNotification(message.id);
    if (delivery.sent) await markCitationNoticeSent(contact.id);
    return Response.json({ queued: true, delivery }, { status: 202 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The citation notice could not be queued." }, { status: 400 });
  }
}
