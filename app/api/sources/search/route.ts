import { searchResearchSources } from "@/lib/research-network-v2";
import { lookupResearchMetadata } from "@/lib/research-metadata";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const cursor = url.searchParams.get("cursor") || undefined;
  const limit = Number(url.searchParams.get("limit") || 25);
  let resolvedQuery = query;
  let resolvedPmid: string | null = null;
  const pmid = query.trim().match(/^(?:pmid:\s*)?(\d{5,12})$/i)?.[1];
  if (pmid) {
    try {
      const metadata = await lookupResearchMetadata({ type: "pmid", value: pmid });
      resolvedQuery = metadata.doi || metadata.title;
      resolvedPmid = pmid;
    } catch {
      // Preserve local corpus search when PubMed is unavailable.
    }
  }
  return Response.json({ ...searchResearchSources(resolvedQuery, cursor, limit), resolvedPmid }, { headers: { "cache-control": "public, max-age=60" } });
}
