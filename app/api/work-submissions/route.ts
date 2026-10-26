import { assertSameOriginRequest, createWorkSubmission, getResearcherSessionFromRequest, listWorkSubmissions } from "@/lib/research-network";
import { lookupResearchMetadata, parseResearchIdentifier } from "@/lib/research-metadata";

export async function GET(request: Request) {
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  return Response.json({ submissions: await listWorkSubmissions(account.accountId) }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  const payload = await request.json() as Record<string, unknown>;
  try {
    const identifier = parseResearchIdentifier(payload.identifierType, payload.identifierValue);
    const metadata = await lookupResearchMetadata({ ...identifier, preprintTitle: payload.preprintTitle });
    const submission = await createWorkSubmission({
      account,
      identifierType: identifier.type,
      identifierValue: identifier.value,
      title: metadata.title,
      authors: metadata.authors,
      year: metadata.year,
      abstractText: metadata.abstractText,
      metadata: metadata.raw,
      rightsAttested: payload.rightsAttested === true,
      license: typeof payload.license === "string" ? payload.license : metadata.license,
    });
    return Response.json({ submission, metadata: { title: metadata.title, authors: metadata.authors, year: metadata.year, journal: metadata.journal } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The work could not be submitted.";
    const status = /temporarily unavailable/i.test(message) ? 503 : 400;
    return Response.json({ error: message }, { status });
  }
}
