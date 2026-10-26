import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { assertBatchPromptIntegrity, parseStrictJson } from "../scripts/article-media-batch-validation.mjs";

const prompt = "Exact frozen scientific prompt.";
const promptSha256 = createHash("sha256").update(prompt).digest("hex");
const promptRecord = `<!-- PROMPT example-route START -->\n\`\`\`text\n${prompt}\n\`\`\`\n<!-- PROMPT example-route END -->`;
const batch = { assets: [{ pageId: "example-route", promptSha256 }] };

test("rejects duplicate JSON keys before media manifests are parsed", () => {
  assert.deepEqual(parseStrictJson('{"status":"reviewed","assets":[{"pageId":"one"}]}', "valid.json"), {
    status: "reviewed",
    assets: [{ pageId: "one" }],
  });
  assert.throws(
    () => parseStrictJson('{"status":"reviewed","status":"prompt-frozen"}', "duplicate.json"),
    /duplicate\.json: duplicate key "status"/,
  );
  assert.throws(
    () => parseStrictJson('{"assets":[{"pageId":"one","pageId":"two"}]}', "nested.json"),
    /nested\.json: duplicate key "pageId"/,
  );
});

test("verifies marker-bound immutable prompt hashes", () => {
  assert.deepEqual(assertBatchPromptIntegrity(batch, promptRecord, "example.json"), {
    mode: "marker-bound",
    verified: 1,
  });
});

test("fails closed when immutable prompt text drifts", () => {
  assert.throws(
    () => assertBatchPromptIntegrity(batch, promptRecord.replace("scientific", "changed"), "example.json"),
    /SHA-256 differs/,
  );
});

test("fails closed for duplicate, orphaned, or missing prompt blocks", () => {
  assert.throws(() => assertBatchPromptIntegrity(batch, `${promptRecord}\n${promptRecord}`, "example.json"), /more than once/);
  assert.throws(
    () => assertBatchPromptIntegrity(batch, promptRecord.replaceAll("example-route", "orphan-route"), "example.json"),
    /no matching manifest record/,
  );
  assert.throws(
    () => assertBatchPromptIntegrity({ assets: [...batch.assets, { pageId: "missing-route", promptSha256 }] }, promptRecord, "example.json"),
    /has no immutable prompt block/,
  );
  assert.throws(
    () => assertBatchPromptIntegrity({ assets: [{ pageId: "example-route" }] }, promptRecord, "example.json"),
    /SHA-256 is missing or invalid/,
  );
});

test("binds quarantined prompts to explicit non-public manifest records", () => {
  assert.deepEqual(
    assertBatchPromptIntegrity(
      { assets: [], quarantinedGenerations: [{ pageId: "example-route", promptSha256 }] },
      promptRecord,
      "quarantine.json",
    ),
    { mode: "marker-bound", verified: 1 },
  );
});

test("retains compatibility with legacy unmarked prompt records", () => {
  assert.deepEqual(assertBatchPromptIntegrity(batch, "# Legacy exact prompts", "legacy.json"), {
    mode: "legacy-unmarked",
    verified: 0,
  });
});
