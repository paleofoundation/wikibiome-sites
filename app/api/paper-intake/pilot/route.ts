import pilot from "@/data/paper-intake-pilot.json";
import {
  assertSameOriginRequest,
  getResearcherSessionFromRequest,
  isModeratorRole,
} from "@/lib/research-network";
import { digest, hydratePacket, paperRuntime, q } from "@/lib/paper-intake";
import { paperIdentity } from "@/lib/paper-intake-policy.mjs";
import { bridgeAuthorized } from "@/lib/paper-intake-bridge";
import type { PaperPacket } from "@/lib/paper-intake-types";
export async function POST(request: Request) {
  try {
    const service = await bridgeAuthorized(request);
    if (!service) assertSameOriginRequest(request);
    const account = service
      ? null
      : await getResearcherSessionFromRequest(request);
    if (
      !service &&
      (!account ||
        (account.orcid !== pilot.ownerOrcid && !isModeratorRole(account.role)))
    )
      return Response.json(
        { error: "This pilot belongs to its submitting researcher." },
        { status: 403 },
      );
    const owner = await q(
      "SELECT account_id FROM researcher_profiles WHERE orcid = ?",
      pilot.ownerOrcid,
    ).first<{ account_id: string }>();
    if (!owner)
      throw new Error("The pilot author needs a researcher profile first.");
    const id = "metals-microbiome-pilot";
    let fileKey: string | null = null;
    if (request.headers.get("content-type") === "application/pdf") {
      const bytes = await request.arrayBuffer();
      if (
        bytes.byteLength > 25 * 1024 * 1024 ||
        (await digest(bytes)) !== pilot.packet.provenance.documentHash
      )
        throw new Error(
          "The pilot PDF must exactly match the scanned document fingerprint.",
        );
      const bucket = paperRuntime().MANUSCRIPTS;
      if (!bucket)
        throw new Error("Private manuscript storage is unavailable.");
      fileKey = `paper-pilot/${id}/${pilot.packet.provenance.documentHash}.pdf`;
      await bucket.put(fileKey, bytes, {
        httpMetadata: { contentType: "application/pdf" },
      });
    }
    const packet = await hydratePacket(
      structuredClone(pilot.packet) as PaperPacket,
    );
    await q(
      "INSERT INTO paper_intakes (id, account_id, identity_key, title, topic, status, packet_json, file_hash) VALUES (?, ?, ?, ?, ?, 'metadata_review', ?, ?) ON CONFLICT DO NOTHING",
      id,
      owner.account_id,
      paperIdentity(packet.metadata),
      packet.metadata.title,
      pilot.topic,
      JSON.stringify(packet),
      packet.provenance.documentHash,
    ).run();
    if (fileKey)
      await q(
        "UPDATE paper_intakes SET file_key = ? WHERE id = ? AND file_hash = ? AND file_key IS NULL",
        fileKey,
        id,
        packet.provenance.documentHash,
      ).run();
    const row = await q(
      "SELECT id FROM paper_intakes WHERE identity_key = ? AND account_id = ?",
      paperIdentity(packet.metadata),
      owner.account_id,
    ).first<{ id: string }>();
    if (!row)
      throw new Error(
        "This source is already associated with another submission; an editor must reconcile it.",
      );
    return Response.json({ id: row.id });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Pilot unavailable." },
      { status: 400 },
    );
  }
}
