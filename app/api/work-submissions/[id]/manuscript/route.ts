import { env } from "cloudflare:workers";
import { addSubmissionFile, assertSameOriginRequest, cleanText, getResearcherSessionFromRequest, getResearchNetworkCapabilities } from "@/lib/research-network";

const MAX_PDF_BYTES = 25 * 1024 * 1024;

type PrivateManuscriptBucket = {
  put(key: string, value: Uint8Array, options: { httpMetadata: { contentType: string }; customMetadata: Record<string, string> }): Promise<unknown>;
  delete(key: string): Promise<void>;
};

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  if (!(await getResearchNetworkCapabilities()).manuscriptUploads) return Response.json({ error: "Manuscript uploads are disabled until the private scanning queue is configured." }, { status: 503 });
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_PDF_BYTES) return Response.json({ error: "Manuscripts must be 25 MB or smaller." }, { status: 413 });
  const bytes = new Uint8Array(await request.arrayBuffer());
  if (!bytes.length || bytes.length > MAX_PDF_BYTES) return Response.json({ error: "Manuscripts must be non-empty PDFs no larger than 25 MB." }, { status: 413 });
  const header = new TextDecoder().decode(bytes.slice(0, 5));
  if (header !== "%PDF-") return Response.json({ error: "Only valid PDF manuscripts are accepted." }, { status: 415 });
  const probe = new TextDecoder("latin1").decode(bytes);
  if (/\/(?:Encrypt|JavaScript|JS|Launch|EmbeddedFile|RichMedia|OpenAction|AcroForm|XFA)\b/.test(probe)) return Response.json({ error: "Encrypted PDFs and PDFs containing active or embedded content cannot be accepted." }, { status: 422 });
  const bucket = (env as unknown as { MANUSCRIPTS?: PrivateManuscriptBucket }).MANUSCRIPTS;
  if (!bucket) return Response.json({ error: "Private manuscript storage is not configured yet." }, { status: 503 });
  const { id } = await params;
  const filename = cleanText(request.headers.get("x-filename"), 240).replace(/[^a-zA-Z0-9._ -]/g, "_") || "manuscript.pdf";
  const key = `quarantine/${account.accountId}/${id}/${crypto.randomUUID()}.pdf`;
  await bucket.put(key, bytes, { httpMetadata: { contentType: "application/pdf" }, customMetadata: { originalFilename: filename, ownerAccountId: account.accountId, scanStatus: "quarantined" } });
  try {
    const file = await addSubmissionFile({ account, submissionId: id, filename, byteSize: bytes.length, r2Key: key });
    return Response.json({ file: { id: file.id, filename, byteSize: bytes.length, scanStatus: "quarantined" } }, { status: 201 });
  } catch (error) {
    await bucket.delete(key);
    return Response.json({ error: error instanceof Error ? error.message : "The manuscript could not be attached." }, { status: 400 });
  }
}
