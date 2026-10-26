import assert from "node:assert/strict";
import test from "node:test";
import { mergeApprovedMediaReviews } from "../scripts/article-media-review-log.mjs";

const authority = { name: "Authority", reviewerId: "reviewer", scope: "scope" };
const base = { schemaVersion: 2, updatedOn: "2026-09-05", reviewingAuthorities: { authority }, reviews: {}, rejectedAssets: [] };
const key = "example-route|example-route-pathology-v1.webp";
const review = {
  pageId: "example-route",
  publishedFile: "example-route-pathology-v1.webp",
  masterSource: "example-route-pathology-v1-master.png",
  socialFile: "example-route-pathology-v1-social.webp",
  revision: 1,
  reviewingAuthority: "authority",
  reviewedOn: "2026-09-06",
  scientificReferenceCheck: { status: "pass", checkedUrls: ["https://example.org/a", "https://example.org/b"], notes: "Checked." },
  subjectReview: { status: "pass", notes: "Reviewed." },
  accessibilityReview: { status: "pass", notes: "Validated." },
  disposition: "approved",
  notes: "Accepted exact source.",
  revisionLinkage: { supersedes: null, supersededBy: null },
};

test("merges approved reviews only into the reviews map", () => {
  const merged = mergeApprovedMediaReviews(base, { [key]: review }, "2026-09-06");
  assert.equal(merged.reviews[key], review);
  assert.deepEqual(merged.reviewingAuthorities, base.reviewingAuthorities);
  assert.deepEqual(merged.rejectedAssets, base.rejectedAssets);
  assert.equal(merged.updatedOn, "2026-09-06");
});

test("refuses overwrite, misplaced keys, and unregistered authorities", () => {
  assert.throws(() => mergeApprovedMediaReviews({ ...base, reviews: { [key]: review } }, { [key]: review }, "2026-09-06"), /refusing to overwrite/);
  assert.throws(() => mergeApprovedMediaReviews(base, { wrong: review }, "2026-09-06"), /review key does not match/);
  assert.throws(
    () => mergeApprovedMediaReviews(base, { [key]: { ...review, reviewingAuthority: "missing" } }, "2026-09-06"),
    /not registered or complete/,
  );
  assert.throws(
    () => mergeApprovedMediaReviews(base, { [key]: { ...review, masterSource: "wrong-master.png" } }, "2026-09-06"),
    /filename is not canonical/,
  );
});

test("fails closed on incomplete scientific, subject, and accessibility review", () => {
  assert.throws(
    () => mergeApprovedMediaReviews(base, { [key]: { ...review, scientificReferenceCheck: { status: "pass", checkedUrls: [] } } }, "2026-09-06"),
    /scientific reference check is incomplete/,
  );
  assert.throws(() => mergeApprovedMediaReviews(base, { [key]: { ...review, subjectReview: null } }, "2026-09-06"), /subject review is incomplete/);
  assert.throws(
    () => mergeApprovedMediaReviews(base, { [key]: { ...review, accessibilityReview: null } }, "2026-09-06"),
    /accessibility review is incomplete/,
  );
});
