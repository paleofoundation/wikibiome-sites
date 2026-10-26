import {
  getResearcherSessionFromRequest,
  isModeratorRole,
} from "@/lib/research-network";
import { articleHash, digest, paperAccess } from "@/lib/paper-intake";
import {
  assertFreshTargets,
  hasPaperConflict,
} from "@/lib/paper-intake-policy.mjs";
import manifest from "@/data/content-manifest.generated.json";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const a = await getResearcherSessionFromRequest(request);
    if (!a || !isModeratorRole(a.role))
      return Response.json(
        { error: "Editor access required." },
        { status: 403 },
      );
    const paper = await paperAccess(a, (await params).id);
    if (paper.status !== "approved" || hasPaperConflict(a, paper))
      throw new Error("Only independently approved packets can be exported.");
    assertFreshTargets(
      paper.packet.changes,
      Object.fromEntries(
        await Promise.all(
          paper.packet.changes.map(async (c) => [
            c.targetId,
            await articleHash(c.targetId),
          ]),
        ),
      ),
    );
    const m = paper.packet.metadata;
    const sourceMarkdown = `---\nid: ${JSON.stringify(m.sourceId)}\ntitle: ${JSON.stringify(m.title)}\ntype: source\nauthors: ${JSON.stringify(m.authors)}\nyear: ${m.year}\ndoi: ${JSON.stringify(m.doi)}\njournal: ${JSON.stringify(m.affiliations[0] || "Publication details pending")}\npublication_status: ${JSON.stringify(m.publicationStatus)}\nlicense: ${JSON.stringify(m.license)}\naffiliations: ${JSON.stringify(m.affiliations)}\nauthor_orcids: ${JSON.stringify(m.authorOrcids)}\nkeystone: false\n---\n\n# ${m.title}\n\n${m.abstract}\n\n## Publication and evidence status\n\n${m.publicationStatus}. References reported through this synthesis remain secondary evidence until the underlying study is checked.\n\n## WikiBiome editorial record\n\nSubmission ${paper.id}, approved revision ${paper.packet.approval?.revision}. Document SHA-256: ${paper.fileHash}.\n`;
    const payload = {
      schemaVersion: 1,
      intakeId: paper.id,
      revision: paper.revision,
      sourceId: m.sourceId,
      baseCommit: manifest.source.commit,
      sourceMarkdown,
      changes: paper.packet.changes,
      claims: paper.packet.claims,
      review: paper.packet.review,
      approval: paper.packet.approval,
    };
    return Response.json(
      { ...payload, packetHash: await digest(JSON.stringify(payload)) },
      {
        headers: {
          "content-disposition": `attachment; filename="${paper.id}-approved.json"`,
          "cache-control": "private, no-store",
        },
      },
    );
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Export unavailable." },
      { status: 409 },
    );
  }
}
