import { getResearcherSessionFromRequest } from "@/lib/research-network";
import { getEmailVerificationStatus } from "@/lib/research-network-v2";

export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401, headers: { "cache-control": "private, no-store" } });
  return Response.json({ emailStatus: await getEmailVerificationStatus(account.accountId) }, { headers: { "cache-control": "private, no-store" } });
}
