import test from "node:test";
import assert from "node:assert/strict";

import { isArticleMediaTypeCompatible, mediaCoverageGroups, selectNextMediaBatch } from "../scripts/article-media-corpus.mjs";

test("prioritizes metals and diseases before microorganisms in the scientific-media queue", () => {
  const orderedGroups = [...mediaCoverageGroups]
    .sort((left, right) => left.categoryOrder - right.categoryOrder)
    .map((group) => group.id);

  assert.deepEqual(orderedGroups.slice(0, 3), ["metals", "diseases", "microorganisms"]);
});

test("allows a morphology asset on an intervention route only for an NCBI-identified taxon", () => {
  const route = { coverageGroup: "interventions" };
  const identifiedTaxon = {
    assetType: "morphology",
    subjectKind: "taxon",
    scientificIdentifiers: [{ authority: "NCBI Taxonomy", propertyID: "NCBITaxon", value: "316435" }],
  };

  assert.equal(isArticleMediaTypeCompatible(route, identifiedTaxon), true);
  assert.equal(isArticleMediaTypeCompatible(route, { ...identifiedTaxon, subjectKind: "intervention" }), false);
  assert.equal(isArticleMediaTypeCompatible(route, { ...identifiedTaxon, scientificIdentifiers: [] }), false);
  assert.equal(isArticleMediaTypeCompatible({ coverageGroup: "mechanisms" }, identifiedTaxon), false);
});

test("continues with explicit revisions only after the primary media queue is exhausted", () => {
  const route = (id, status, disposition, coverageGroup = "mechanisms") => ({
    id,
    status,
    coverageGroup,
    ...(disposition ? { rejectedMedia: { disposition } } : {}),
  });
  const primaryQueue = [
    route("held", "scientific-hold", null, "microorganisms"),
    route("revision-a", "rejected", "revise"),
    route("new-a", "queued", null, "host-defenses"),
    route("new-b", "queued", null, "host-defenses"),
  ];
  assert.deepEqual(selectNextMediaBatch(primaryQueue, 6).map(({ id }) => id), ["new-a", "new-b"]);

  const revisionQueue = [
    route("permanent", "rejected", "rejected-after-output-audit"),
    route("revision-a", "rejected", "revise"),
    route("revision-b", "rejected", "revise"),
    route("revision-other-group", "rejected", "revise", "interventions"),
    route("quarantine", "rejected", "quarantined-scientific-interpretation-conflict"),
  ];
  assert.deepEqual(selectNextMediaBatch(revisionQueue, 1).map(({ id }) => id), ["revision-a"]);
  assert.deepEqual(selectNextMediaBatch(revisionQueue, 6).map(({ id }) => id), ["revision-a", "revision-b"]);
  assert.deepEqual(selectNextMediaBatch([route("held", "scientific-hold")], 6), []);
  assert.throws(() => selectNextMediaBatch([], 0), /positive integer/);
});
