export const evidenceTypes = [
  "biochemical",
  "cellular",
  "animal",
  "human_observational",
  "human_interventional",
  "synthesis",
  "hypothesis",
];
export const paperStatusLabels = {
  awaiting_file: "Awaiting PDF",
  awaiting_processing: "Awaiting processing service",
  processing: "Scanning and extracting",
  processing_failed: "Processing needs attention",
  metadata_review: "Confirm extracted details",
  awaiting_reviewer: "Awaiting reviewer assignment",
  in_review: "With appointed reviewer",
  needs_revision: "Changes requested",
  recommended: "Awaiting editor decision",
  approved: "Approved · awaiting publication",
  published: "Published in WikiBiome",
  declined: "Not accepted",
  withdrawn: "Withdrawn",
};
export function normalizePaperDoi(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .toLowerCase();
}
export function paperIdentity({ doi, title, authors, year }) {
  if (doi) return `doi:${normalizePaperDoi(doi)}`;
  const norm = (v) =>
    String(v || "")
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  return `work:${norm(title)}|${(authors || []).map(norm).sort().join("|")}|${year || ""}`;
}
export function hasPaperConflict(actor, paper) {
  if (!actor || actor.accountId === paper.accountId) return true;
  const meta = paper.packet?.metadata || {};
  if (
    [
      ...(meta.authorOrcids || []),
      ...(paper.packet?.provenance?.knownAuthorOrcids || []),
    ].includes(actor.orcid)
  )
    return true;
  const norm = (v) =>
    String(v || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  return [
    ...(meta.authors || []),
    ...(paper.packet?.provenance?.knownAuthors || []),
  ].some((name) => norm(name) === norm(actor.displayName));
}
export function assertPaperDecision({
  actor,
  paper,
  action,
  appointed,
  disclosure,
  confirmedIndependent,
}) {
  if (hasPaperConflict(actor, paper))
    throw new Error(
      "Authors and submitters cannot review or approve their own paper.",
    );
  if (!confirmedIndependent || !String(disclosure || "").trim())
    throw new Error(
      "Disclose your interests and confirm that you can review independently.",
    );
  if (
    action === "recommend" &&
    (!appointed ||
      paper.reviewerAccountId !== actor.accountId ||
      paper.status !== "in_review")
  )
    throw new Error("An active, assigned topic reviewer is required.");
  if (
    action === "approve" &&
    (!["moderator", "site_admin"].includes(actor.role) ||
      paper.status !== "recommended" ||
      paper.reviewerAccountId === actor.accountId)
  )
    throw new Error("A separate editor must approve the reviewed changes.");
}
export function assertFreshTargets(changes, currentHashes) {
  for (const change of changes) {
    if (change.baseHash !== (currentHashes[change.targetId] || "new"))
      throw new Error(
        `The article ${change.targetId} has changed. Refresh the proposed change and obtain a new review.`,
      );
  }
}
export function validateEvidencePacket(packet, pages) {
  if (
    !packet?.metadata?.title ||
    !Array.isArray(packet.metadata.authors) ||
    !packet.metadata.authors.length
  )
    throw new Error("The paper needs a title and authors.");
  if (!packet.metadata.publicationStatus)
    throw new Error("Record the paper's publication and review status.");
  if (
    !Array.isArray(packet.claims) ||
    !packet.claims.length ||
    packet.claims.length > 100
  )
    throw new Error("Extract between one and 100 supported claims.");
  const ids = new Set();
  const norm = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  for (const claim of packet.claims) {
    if (!claim.id || ids.has(claim.id))
      throw new Error("Claim identifiers must be unique.");
    ids.add(claim.id);
    if (!evidenceTypes.includes(claim.evidenceType))
      throw new Error("Each claim needs a supported evidence classification.");
    if (
      !Number.isInteger(claim.page) ||
      claim.page < 1 ||
      !claim.passage ||
      !claim.statement ||
      !claim.limitations
    )
      throw new Error(
        "Every claim needs its page, passage, statement, and limitations.",
      );
    const page = pages.find((p) => p.page === claim.page);
    if (!page || !norm(page.text).includes(norm(claim.passage)))
      throw new Error(
        `Claim ${claim.id} does not match its cited PDF passage.`,
      );
    if (!["paper", "secondary_citation"].includes(claim.support))
      throw new Error(
        "Distinguish the paper's own interpretation from secondary citations.",
      );
  }
  if (
    !Array.isArray(packet.changes) ||
    !packet.changes.length ||
    packet.changes.length > 40
  )
    throw new Error("Propose between one and 40 article changes.");
  const targets = new Set();
  for (const change of packet.changes) {
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(change.targetId) ||
      targets.has(change.targetId)
    )
      throw new Error("Use one change per canonical article.");
    targets.add(change.targetId);
    if (
      !change.section ||
      !change.proposedText ||
      !change.rationale ||
      !change.claimIds?.length ||
      change.claimIds.some((id) => !ids.has(id))
    )
      throw new Error(
        "Every proposed change must refer to extracted claims and include its wording and rationale.",
      );
    if (
      !["addition", "correction", "contradiction", "new_page"].includes(
        change.kind,
      )
    )
      throw new Error("Choose a supported change type.");
  }
  return packet;
}
export function publicationEligible(paper, live) {
  if (
    paper.status !== "approved" ||
    !live.sourceExists ||
    !live.sameCommit ||
    !live.sourceMetadataMatches
  )
    return false;
  return (
    paper.packet.changes.length > 0 &&
    paper.packet.changes.every(
      (c) =>
        live.targets[c.targetId]?.hasSource &&
        live.targets[c.targetId]?.hasText,
    )
  );
}
