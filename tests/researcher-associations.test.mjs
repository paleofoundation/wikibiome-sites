import test from "node:test";
import assert from "node:assert/strict";
import { normalizeResearcherAssociations, readResearcherAssociations } from "../lib/researcher-associations.mjs";

test("accepts association websites with or without a scheme and preserves their labels", () => {
  const links = normalizeResearcherAssociations([
    { name: " TECRID ", url: "TECRID.com" },
    { name: "Heavy Metal Index", url: "https://HeavyMetalIndex.com" },
  ]);
  assert.deepEqual(links, [{ name: "TECRID", url: "https://tecrid.com/" }, { name: "Heavy Metal Index", url: "https://heavymetalindex.com/" }]);
  assert.deepEqual(readResearcherAssociations(JSON.stringify(links)), links);
  assert.deepEqual(normalizeResearcherAssociations([]), []);
});

test("rejects unsafe schemes, credentials, incomplete rows, duplicate URLs, and oversized lists", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,hello", "file:///etc/passwd", "https://user:secret@example.com", "not a website", ""]) {
    assert.throws(() => normalizeResearcherAssociations([{ name: "Example", url }]));
  }
  assert.throws(() => normalizeResearcherAssociations([{ name: "", url: "https://example.com" }]));
  assert.throws(() => normalizeResearcherAssociations([{ name: "One", url: "EXAMPLE.com" }, { name: "Two", url: "https://example.com/" }]));
  assert.throws(() => normalizeResearcherAssociations(Array.from({ length: 13 }, (_, i) => ({ name: `Link ${i}`, url: `https://example${i}.com` }))));
  assert.deepEqual(readResearcherAssociations('broken JSON'), []);
  assert.deepEqual(readResearcherAssociations('[{"name":"Unsafe","url":"javascript:alert(1)"}]'), []);
});
