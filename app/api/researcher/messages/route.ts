import { assertSameOriginRequest, getResearcherSessionFromRequest } from "@/lib/research-network";
import { createContactRequest, listMessageThreads, sendResearcherMessage, setMessagingPreference } from "@/lib/research-network-v2";

export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  return Response.json({ messagingEnabled: account.messagingEnabled, threads: await listMessageThreads(account.accountId) }, { headers: { "cache-control": "private, no-store" } });
}

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try {
    if (payload.action === "contact") return Response.json(await createContactRequest(account, payload.recipientOrcid, payload.subject), { status: 201 });
    if (payload.action === "message") return Response.json(await sendResearcherMessage(account, payload.threadId, payload.body), { status: 201 });
    if (payload.action === "preference") return Response.json(await setMessagingPreference(account, payload.enabled === true));
    return Response.json({ error: "Choose a valid messaging action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The messaging action could not be completed." }, { status: 400 });
  }
}
