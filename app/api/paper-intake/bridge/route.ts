import { bridgeAuthorized } from "@/lib/paper-intake-bridge";
import {
  digest,
  hydratePacket,
  paperRuntime,
  rawPaper,
  savePaper,
} from "@/lib/paper-intake";
import { validateEvidencePacket } from "@/lib/paper-intake-policy.mjs";
import type { PaperPacket } from "@/lib/paper-intake-types";
export async function GET(request: Request) {
  if (!(await bridgeAuthorized(request)))
    return Response.json(
      { error: "Service authorization required." },
      { status: 401 },
    );
  const url = new URL(request.url);
  const paper = await rawPaper(url.searchParams.get("id") || "");
  if (
    !paper ||
    !paper.fileKey ||
    !["awaiting_processing", "processing", "processing_failed"].includes(
      paper.status,
    )
  )
    return Response.json({ error: "No processable file." }, { status: 404 });
  if (url.searchParams.get("file") === "1") {
    const file = await paperRuntime().MANUSCRIPTS?.get(paper.fileKey);
    return file
      ? new Response(file.body, {
          headers: {
            "content-type": "application/pdf",
            "content-length": String(file.size),
            "cache-control": "no-store",
          },
        })
      : new Response(null, { status: 404 });
  }
  return Response.json(
    {
      id: paper.id,
      revision: paper.revision,
      hash: paper.fileHash,
      metadata: paper.packet.metadata,
      topic: paper.topic,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
export async function POST(request: Request) {
  if (!(await bridgeAuthorized(request)))
    return Response.json(
      { error: "Service authorization required." },
      { status: 401 },
    );
  try {
    const input = (await request.json()) as {
      id: string;
      revision: number;
      hash: string;
      resultId: string;
      error?: string;
      scanStatus: string;
      packet?: PaperPacket;
      pages?: { page: number; text: string }[];
    };
    const paper = await rawPaper(input.id);
    if (!paper) throw new Error("Paper not found.");
    if (paper.fileHash !== input.hash)
      throw new Error("Document hash mismatch.");
    // Repeated successful callbacks are acknowledgements, never new revisions.
    if (
      (paper.packet.provenance as { resultId?: string }).resultId ===
      input.resultId
    )
      return Response.json({ ok: true, duplicate: true });
    if (
      paper.revision !== input.revision ||
      !["awaiting_processing", "processing", "processing_failed"].includes(
        paper.status,
      )
    )
      throw new Error("Stale processing result.");
    if (!input.resultId || !/^[a-f0-9]{64}$/.test(input.resultId))
      throw new Error("A processing result digest is required.");
    if (input.scanStatus !== "clean" || input.error) {
      paper.status = "processing_failed";
      paper.packet.provenance.scanStatus = input.scanStatus;
      paper.packet.processingError =
        input.error?.slice(0, 1000) || "The PDF did not pass scanning.";
      if (
        ["infected", "rejected"].includes(input.scanStatus) &&
        paper.fileKey
      ) {
        await paperRuntime().MANUSCRIPTS?.delete(paper.fileKey);
        paper.fileKey = null;
      }
    } else {
      if (
        !input.packet ||
        !input.pages ||
        input.pages.length > 300 ||
        JSON.stringify(input.pages).length > 1500000
      )
        throw new Error("Missing or oversized extraction.");
      validateEvidencePacket(input.packet, input.pages);
      // Identity, submitter-declared authors, and canonical source identity cannot be
      // rewritten by model output; disputed metadata becomes an editorial flag.
      const original = paper.packet.metadata;
      if (
        input.packet.metadata.title !== original.title ||
        input.packet.metadata.doi !== original.doi
      )
        input.packet.flags.push({
          id: "metadata-mismatch",
          message:
            "Extracted title or DOI differs from the submitted details. Confirm the correct metadata.",
          blocking: true,
        });
      input.packet.metadata.sourceId = original.sourceId;
      input.packet.metadata.authorOrcids = [
        ...new Set([
          ...original.authorOrcids,
          ...(input.packet.metadata.authorOrcids || []),
        ]),
      ];
      input.packet.metadata.authors = [
        ...new Set([...original.authors, ...input.packet.metadata.authors]),
      ];
      input.packet.provenance = {
        ...input.packet.provenance,
        documentHash: input.hash,
        pageCount: input.pages.length,
        scanStatus: "clean",
        mode: "automated_extraction",
      };
      if (paper.fileKey)
        await paperRuntime().MANUSCRIPTS?.put(
          `${paper.fileKey}.pages.json`,
          JSON.stringify(input.pages),
          { httpMetadata: { contentType: "application/json" } },
        );
      paper.packet = await hydratePacket(input.packet);
      paper.status = "metadata_review";
    }
    Object.assign(paper.packet.provenance, { resultId: input.resultId });
    await savePaper(paper, null, "processing_result", {
      scanStatus: input.scanStatus,
      resultId: input.resultId,
    });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      {
        error: e instanceof Error ? e.message : "Processing callback rejected.",
      },
      { status: 409 },
    );
  }
}
