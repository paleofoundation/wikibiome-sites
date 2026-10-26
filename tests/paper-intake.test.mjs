import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  assertFreshTargets,
  assertPaperDecision,
  hasPaperConflict,
  normalizePaperDoi,
  paperIdentity,
  publicationEligible,
  validateEvidencePacket,
} from "../lib/paper-intake-policy.mjs";
import {
  rankCandidates,
  responsePacket,
  extractionSchema,
} from "../services/paper-ingestion/extraction.mjs";
const pilot = JSON.parse(
  readFileSync(new URL("../data/paper-intake-pilot.json", import.meta.url)),
);
const reviewer = {
  accountId: "reviewer",
  orcid: "0000-0001-1111-1111",
  displayName: "Independent Person",
  role: "researcher",
};
const paper = {
  accountId: "owner",
  reviewerAccountId: "reviewer",
  status: "in_review",
  packet: pilot.packet,
};
test("DOI variants share one contribution identity", () => {
  assert.equal(
    paperIdentity({ doi: "https://doi.org/10.1234/ABC" }),
    paperIdentity({ doi: "doi:10.1234/abc" }),
  );
  assert.equal(normalizePaperDoi(" DOI:10.1234/ABC "), "10.1234/abc");
});
test("authorship conflicts include ORCID, name and submitter identity", () => {
  assert.equal(
    hasPaperConflict({ ...reviewer, orcid: pilot.ownerOrcid }, paper),
    true,
  );
  assert.equal(
    hasPaperConflict({ ...reviewer, displayName: "Karen Pendergrass" }, paper),
    true,
  );
  assert.equal(
    hasPaperConflict({ ...reviewer, accountId: "owner" }, paper),
    true,
  );
  assert.equal(hasPaperConflict(reviewer, paper), false);
});
test("review requires appointment, assignment and explicit independence", () => {
  const input = {
    actor: reviewer,
    paper,
    action: "recommend",
    appointed: true,
    disclosure: "No competing interests",
    confirmedIndependent: true,
  };
  assert.doesNotThrow(() => assertPaperDecision(input));
  for (const invalid of [
    { appointed: false },
    { confirmedIndependent: false },
    { disclosure: "" },
    { actor: { ...reviewer, accountId: "unassigned" } },
  ])
    assert.throws(() => assertPaperDecision({ ...input, ...invalid }));
});
test("reviewer cannot act as the final editor", () => {
  const input = {
    actor: { ...reviewer, role: "moderator" },
    paper: { ...paper, status: "recommended" },
    action: "approve",
    appointed: true,
    disclosure: "None",
    confirmedIndependent: true,
  };
  assert.throws(() => assertPaperDecision(input), /separate editor/);
  assert.doesNotThrow(() =>
    assertPaperDecision({
      ...input,
      actor: { ...input.actor, accountId: "editor" },
    }),
  );
});
test("an article revision change invalidates approval", () => {
  assert.doesNotThrow(() =>
    assertFreshTargets([{ targetId: "nickel", baseHash: "a" }], {
      nickel: "a",
    }),
  );
  assert.throws(
    () =>
      assertFreshTargets([{ targetId: "nickel", baseHash: "a" }], {
        nickel: "b",
      }),
    /new review/,
  );
});
test("partial or metadata-only publication earns no credit", () => {
  const p = {
    status: "approved",
    packet: { changes: [{ targetId: "one" }, { targetId: "two" }] },
  };
  const live = {
    sourceExists: true,
    sameCommit: true,
    sourceMetadataMatches: true,
    targets: {
      one: { hasText: true, hasSource: true },
      two: { hasText: true, hasSource: true },
    },
  };
  assert.equal(publicationEligible(p, live), true);
  assert.equal(
    publicationEligible({ ...p, status: "recommended" }, live),
    false,
  );
  assert.equal(
    publicationEligible(p, { ...live, targets: { one: live.targets.one } }),
    false,
  );
  assert.equal(
    publicationEligible(p, { ...live, sourceMetadataMatches: false }),
    false,
  );
});
test("claim extraction rejects fabricated passages and invalid evidence types", () => {
  const p = structuredClone(pilot.packet);
  const pages = p.claims.map((c) => ({
    page: c.page,
    text: p.claims
      .filter((x) => x.page === c.page)
      .map((x) => x.passage)
      .join("\n"),
  }));
  assert.doesNotThrow(() => validateEvidencePacket(p, pages));
  p.claims[0].passage = "This sentence is fabricated.";
  assert.throws(() => validateEvidencePacket(p, pages), /does not match/);
  p.claims[0] = structuredClone(pilot.packet.claims[0]);
  p.claims[0].evidenceType = "proven_universal_cause";
  assert.throws(() => validateEvidencePacket(p, pages), /classification/);
});
test("pilot preserves institutional review state and bibliography problems", () => {
  assert.equal(pilot.packet.references.length, 50);
  assert.match(
    pilot.packet.metadata.publicationStatus,
    /external peer review not completed/,
  );
  assert.equal(pilot.packet.provenance.scanStatus, "clean");
  assert.equal(
    pilot.packet.flags.find((f) => f.id === "reference-47").blocking,
    true,
  );
  assert.match(
    pilot.packet.claims.find((c) => c.id === "ms").limitations,
    /not a human MS trial/,
  );
});
test("incomplete and refused model responses cannot become packets", () => {
  assert.throws(
    () => responsePacket({ status: "incomplete", output: [] }),
    /incomplete/,
  );
  assert.throws(
    () =>
      responsePacket({
        status: "completed",
        output: [{ content: [{ type: "refusal" }] }],
      }),
    /no structured/,
  );
  assert.deepEqual(
    responsePacket({
      status: "completed",
      output: [{ content: [{ type: "output_text", text: '{"ok":true}' }] }],
    }),
    { ok: true },
  );
});
test("candidate retrieval prioritizes the selected topic", () => {
  const pages = [
    { id: "unrelated", title: "Travel", overview: "" },
    { id: "nickel", title: "Nickel", overview: "urease" },
    { id: "metallomics", title: "Metallomics", overview: "metal function" },
  ];
  assert.equal(
    rankCandidates(pages, { title: "Nickel urease" }, "metallomics", "")[0].id,
    "metallomics",
  );
  assert.equal(extractionSchema.additionalProperties, false);
});
