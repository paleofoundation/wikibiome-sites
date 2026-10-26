import assert from "node:assert/strict";
import test from "node:test";
import { selectArticleMediaRecordsForProcessing } from "../scripts/article-media-processing-plan.mjs";

const registry = {
  alpha: { pageId: "alpha" },
  beta: { pageId: "beta" },
  gamma: { pageId: "gamma" },
};

test("rebuilds the complete reviewed registry when no promotions are supplied", () => {
  assert.deepEqual(selectArticleMediaRecordsForProcessing(registry, []), [registry.alpha, registry.beta, registry.gamma]);
});

test("processes only explicitly promoted records in deterministic argument order", () => {
  assert.deepEqual(
    selectArticleMediaRecordsForProcessing(registry, [{ pageId: "gamma" }, { pageId: "alpha" }]),
    [registry.gamma, registry.alpha],
  );
});

test("fails closed for unknown or duplicate promotion owners", () => {
  assert.throws(
    () => selectArticleMediaRecordsForProcessing(registry, [{ pageId: "missing" }]),
    /promotion is forbidden until a fully reviewed registry record exists/,
  );
  assert.throws(
    () => selectArticleMediaRecordsForProcessing(registry, [{ pageId: "alpha" }, { pageId: "alpha" }]),
    /duplicate promotion argument/,
  );
});
