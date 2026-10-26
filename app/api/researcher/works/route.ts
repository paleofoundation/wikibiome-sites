import { assertSameOriginRequest, getResearcherSessionFromRequest } from "@/lib/research-network";
import { listResearcherWorkDiscovery, syncResearcherWorks } from "@/lib/research-network-v2";

export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  let syncWarning = "";
  try { await syncResearcherWorks(account, "automatic"); } catch (error) { syncWarning = error instanceof Error ? error.message : "ORCID works could not be refreshed."; }
  return Response.json({ ...(await listResearcherWorkDiscovery(account.accountId)), syncWarning }, { headers: { "cache-control": "private, no-store" } });
}

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  try {
    const manualSync = await syncResearcherWorks(account, "manual");
    return Response.json({ ...(await listResearcherWorkDiscovery(account.accountId)), manualSync });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "ORCID works could not be refreshed." }, { status: 400 });
  }
}
