import {
  assertSameOriginRequest,
  getResearcherSessionFromRequest,
} from "@/lib/research-network";
import {
  digest,
  dispatchPaper,
  paperAccess,
  paperCapabilities,
  paperRuntime,
  q,
  savePaper,
} from "@/lib/paper-intake";
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, { params }: Context) {
  try {
    assertSameOriginRequest(request);
    const account = await getResearcherSessionFromRequest(request);
    if (!account?.emailVerified)
      return Response.json(
        { error: "Sign in and verify your private email." },
        { status: 401 },
      );
    const paper = await paperAccess(account, (await params).id);
    if (
      paper.accountId !== account.accountId ||
      paper.status !== "awaiting_file"
    )
      throw new Error(
        "This paper cannot receive another PDF. Revisions must be submitted through editorial review.",
      );
    if (!(await paperCapabilities()).uploads)
      return Response.json(
        {
          error:
            "PDF uploads are waiting for an operational processing service and appointed reviewers. Your submission details are saved.",
        },
        { status: 503 },
      );
    const max = 25 * 1024 * 1024;
    if (Number(request.headers.get("content-length") || 0) > max)
      return Response.json(
        { error: "PDFs must be 25 MB or smaller." },
        { status: 413 },
      );
    const bytes = await request.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > max)
      return Response.json(
        { error: "PDFs must be non-empty and 25 MB or smaller." },
        { status: 413 },
      );
    if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-")
      throw new Error("Choose a PDF document.");
    const hash = await digest(bytes);
    if (
      await q(
        "SELECT id FROM paper_intakes WHERE file_hash = ? AND id != ?",
        hash,
        paper.id,
      ).first()
    )
      throw new Error(
        "This exact PDF is already in the intake queue. It will not create another contribution.",
      );
    const bucket = paperRuntime().MANUSCRIPTS;
    if (!bucket) throw new Error("Private file storage is unavailable.");
    const key = `paper-quarantine/${paper.id}/${hash}.pdf`;
    await bucket.put(key, bytes, {
      httpMetadata: { contentType: "application/pdf" },
    });
    paper.fileKey = key;
    paper.fileHash = hash;
    paper.status = "awaiting_processing";
    paper.packet.provenance.documentHash = hash;
    paper.packet.provenance.scanStatus = "quarantined";
    try {
      const saved = await savePaper(paper, account.accountId, "file_uploaded", {
        hash,
        byteSize: bytes.byteLength,
      });
      return Response.json({ paper: await dispatchPaper(saved) });
    } catch (e) {
      await bucket.delete(key);
      throw e;
    }
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 400 },
    );
  }
}
export async function GET(request: Request, { params }: Context) {
  try {
    const a = await getResearcherSessionFromRequest(request);
    if (!a) throw new Error("Sign in.");
    const p = await paperAccess(a, (await params).id);
    if (p.packet.provenance.scanStatus !== "clean" || !p.fileKey)
      return Response.json(
        {
          error:
            "The PDF is unavailable until a clean scan is recorded. Extracted pilot passages are shown in the workspace.",
        },
        { status: 409 },
      );
    const file = await paperRuntime().MANUSCRIPTS?.get(p.fileKey);
    if (!file) throw new Error("File unavailable.");
    return new Response(file.body, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": 'attachment; filename="manuscript.pdf"',
        "cache-control": "private, no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return Response.json(
      { error: "File not found or access unavailable." },
      { status: 404 },
    );
  }
}
