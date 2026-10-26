import test from "node:test";
import assert from "node:assert/strict";
import { materialPageChange, isPublishedProposalChange, isPublishedAuthorContext } from "../lib/public-page-history-policy.mjs";

const page = "---\ntitle: Example\nsource_count: 2\nupdated: 2026-01-01\n---\nA supported finding.\n";
test("internal bookkeeping, comments and whitespace do not enter public history", () => {
  assert.equal(materialPageChange(page, page.replace("source_count: 2", "source_count: 3").replace("2026-01-01", "2026-10-16") + "\n<!-- review completed -->\n"), null);
  assert.equal(materialPageChange(page, page.replace("A supported", "A   supported")), null);
  assert.equal(materialPageChange(page, page.replace("supported finding", "[[finding|supported finding]]")), null);
  assert.equal(materialPageChange(page, page.replace("supported finding", "**supported finding**")), null);
});
test("material content and evidence changes qualify regardless of batch commit wording", () => {
  assert.equal(materialPageChange(page, page.replace("supported finding", "finding with a corrected limitation")).materialChange, true);
  assert.equal(materialPageChange(page, page.replace("title: Example", "title: Corrected scientific name")).materialChange, true);
  assert.match(materialPageChange("", page).summary, /Created “Example”: A supported finding/);
});
test("acceptance without publication is not a page change", () => {
  const proposal = { status: "accepted", proposedContent: "New evidence" };
  assert.equal(isPublishedProposalChange(proposal), false);
  assert.equal(isPublishedProposalChange({ ...proposal, publishedCommit: "a".repeat(40) }), true);
  assert.equal(isPublishedProposalChange({ ...proposal, status: "withdrawn", publishedCommit: "a".repeat(40) }), false);
  assert.equal(isPublishedProposalChange({ ...proposal, publishedCommit: "unverified" }), false);
});
test("source context must actually contain published text", () => {
  assert.equal(isPublishedAuthorContext({ status: "accepted", context: " " }), false);
  assert.equal(isPublishedAuthorContext({ status: "pending", context: "Explanation" }), false);
  assert.equal(isPublishedAuthorContext({ status: "accepted", context: "Explanation" }), true);
});


test("describes the specific section and changed scientific wording", () => {
  const before = "## Taxonomic Identity\nThe phylum is Verrucomicrobia.\n\n## Evidence\nEvidence remains observational.";
  const after = before.replace("Verrucomicrobia", "Verrucomicrobiota");
  const change = materialPageChange(before, after);
  assert.match(change.summary, /Taxonomic Identity.*Verrucomicrobiota/);
  assert.match(change.description, /Verrucomicrobia.*Verrucomicrobiota/);
  assert.doesNotMatch(change.description, /Revised “Evidence”/);
});
test("describes additions, removals, reference changes and evidence grades", () => {
  const before = "---\ntitle: Example\nsources: [study-one]\nevidence_level: observational\n---\n## Findings\nA cautious conclusion.\n## Old claim\nUnsupported treatment claim.";
  const after = "---\ntitle: Example\nsources: [study-one, study-two]\nevidence_level: randomized\n---\n## Findings\nA cautious conclusion.\n## Limitation\nThe trial did not assess long-term safety.";
  const change = materialPageChange(before, after);
  assert.match(change.description, /Added “Limitation”: The trial did not assess long-term safety/);
  assert.match(change.description, /Removed “Old claim”: Unsupported treatment claim/);
  assert.match(change.description, /Added references: study-two/);
  assert.match(change.description, /Evidence level changed from “observational” to “randomized”/);
});
test("keeps uncertainty in excerpts and does not turn edits into stronger scientific claims", () => {
  const change = materialPageChange("## Findings\nResults are preliminary.", "## Findings\nResults are preliminary and do not establish causation.");
  assert.match(change.description, /do not establish causation/);
});

test("describes citation additions as evidence changes rather than rewritten scientific claims", () => {
  const before = "## Gut barrier\nMaintains the mucus layer.";
  const after = "## Gut barrier\nMaintains the mucus layer [[duan-2020-gut-microbiota-heavy-metal-probiotic-strategy]].";
  const change = materialPageChange(before, after);
  assert.match(change.summary, /Added citations to “Gut barrier”: duan 2020/);
  assert.doesNotMatch(change.description, /Revised “Gut barrier”/);
});

test("identifies removed duplicate references without claiming the article prose changed", () => {
  const before = "---\nsources: [study-one, study-one]\n---\nUnchanged claim.";
  const change = materialPageChange(before, before.replace("study-one, study-one", "study-one"));
  assert.match(change.summary, /Removed duplicate references entries for study-one/);
  assert.doesNotMatch(change.description, /Unchanged claim/);
});
