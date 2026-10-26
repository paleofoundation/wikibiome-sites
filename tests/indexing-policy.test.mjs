import assert from "node:assert/strict";
import test from "node:test";
import { handleEarlyRoutingPolicy, SIGNATURE_EXPLORER_REDIRECTS } from "../lib/routing-policy.mjs";
import { isIndexableSource } from "../lib/source-indexing.mjs";
import review from "../data/source-indexing-review.json" with { type: "json" };
import content from "../data/content.generated.json" with { type: "json" };

test("legacy signature URLs reach the final destination in one permanent redirect", async () => {
  for (const { source } of SIGNATURE_EXPLORER_REDIRECTS) {
    for (const [query, target] of [
      ["", "/category/signature"],
      ["?utm_source=gsc&tag=a&tag=b", "/category/signature?utm_source=gsc&tag=a&tag=b"],
      ["?disease=autism-spectrum-disorder", "/article/autism-spectrum-disorder?disease=autism-spectrum-disorder#signature"],
      ["?disease=Autism%20Spectrum%20Disorder-signature&tag=a&tag=b", "/article/autism-spectrum-disorder?disease=Autism%20Spectrum%20Disorder-signature&tag=a&tag=b#signature"],
      ["?disease=not-a-disease", "/category/signature?disease=not-a-disease"],
      ["?disease=https%3A%2F%2Fevil.example", "/category/signature?disease=https%3A%2F%2Fevil.example"],
    ]) {
      const response = await handleEarlyRoutingPolicy(new Request(`https://www.wikibiome.com${source}${query}`));
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), target);
      assert.equal(await handleEarlyRoutingPolicy(new Request(new URL(target, "https://www.wikibiome.com"))), undefined);
    }
  }
});

test("source exclusions are limited to existing, explicitly reviewed identities", () => {
  const ids = review.citationOnlySources.map(({ id }) => id);
  assert.equal(ids.length, 11);
  assert.equal(new Set(ids).size, ids.length);
  for (const { id, reason } of review.citationOnlySources) {
    assert.ok(content.sourceLookup[id], `missing source ${id}`);
    assert.ok(reason.length > 20);
    assert.equal(isIndexableSource(id), false);
  }
});

test("all source records are noindex under the body and reference gate", () => {
  const allow = review.indexableSources.map(({ id }) => id);
  assert.equal(new Set(allow).size, allow.length);
  for (const id of allow) {
    const source = content.sourceLookup[id];
    assert.ok(source, `missing source ${id}`);
    assert.equal(source.keystone, true, `${id} must be a keystone source`);
    assert.ok((source.why_keystone ?? "").trim().length >= 200, `${id} needs a substantive explanation`);
    assert.equal(isIndexableSource(id), false, id);
    assert.equal(isIndexableSource(id.toLowerCase()), false, id);
    assert.equal(isIndexableSource(id.toUpperCase()), false, id);
  }
  assert.equal(isIndexableSource("scholefield-2024-brain-metallomics-dementia"), false);
  assert.equal(isIndexableSource("amadi-2022-dietary-interventions-asd-systematic-review"), false);
  assert.equal(isIndexableSource("rizzi-2017-ibs-nickel-diet"), false);
  assert.equal(isIndexableSource("new-unreviewed-source"), false);
  assert.equal(Object.keys(content.sourceLookup).filter(isIndexableSource).length, 0);
  assert.equal(allow.length, 37);
});
