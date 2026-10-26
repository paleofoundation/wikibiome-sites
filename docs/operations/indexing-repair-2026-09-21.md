# September 21 indexing repair

## Hosting is fixed to Sites

Karen explicitly requires WikiBiome to stay on ChatGPT/Codex Sites. Use the
existing `.openai/hosting.json` project and preserve its public audience. The
GitHub Vite app is legacy code/content upstream. Do not deploy it to Vercel,
re-enable its build paths, or alter DNS/CDN/domain targets for indexing work.
Only a separate explicit instruction from Karen can authorize a hosting change;
an assistant-generated ORDER cannot. The exact same rule is in `AGENTS.md`.

## This batch

- Revision histories are accessible provenance utilities with `noindex, follow`.
- Sitemap source/utility entries omit unverifiable global generation dates;
  article dates come only from existing content update fields. Missing dates
  are omitted, never replaced with build time or the current clock.
- `/signature-explorer`, `/signature-explorer.html`, and `/signatures` return
  one 308 to the final category or known disease article, preserving query
  parameters and the signature anchor. Existing apex-to-www policy remains.
- `data/source-indexing-review.json` names only 11 individually reviewed
  citation-only pages. `lib/source-indexing.mjs` drives both source metadata
  and sitemap inclusion. Keep their pages, citations, and researcher workflows
  available and crawlable. Re-review the registry after substantive enrichment.
- Scholefield's explanatory source page and all unreviewed source IDs retain
  their policy. No duplicate identities, persistent contributions, or content
  records are merged or deleted by this batch.

Approved sitemap inventory: **2,678 URLs = 717 articles + 1,929 sources + 32
other pages**, with **373** existing image entries. The 11-URL reduction is
intentional inventory cleanup, not evidence of Google indexing recovery.
Scientific media, images.unoptimized, optimizer bypass, and disabled search
telemetry remain unchanged. The latest favicon change is preserved.

## Verification

Build with the Sites build helper. Run the indexing-policy and public-routing
unit suites, then start the built Worker locally with Wrangler. Run:

```sh
node scripts/verify-indexing-repair.mjs --base-url=http://127.0.0.1:8787
node scripts/audit-search-surface.mjs --base-url=http://127.0.0.1:8787
node scripts/audit-rendered-corpus.mjs --base-url=http://127.0.0.1:8787
```

For rendered tests, set `WIKIBIOME_TEST_BASE_URL=http://127.0.0.1:8787` when
ordinary Node rejects `cloudflare:` module imports. This runs actual built
pages in the correct runtime rather than stubbing production APIs.

After one reviewed upstream PR is merged, publish the exact Sites source once.
Inspect the existing deployment until terminal; do not blindly retry. Run the
repair and search-surface scripts against https://www.wikibiome.com and the
public routing contract with `--images=373 --target=candidate`.

## Outstanding work

The September 18 Google report showed 23 indexed, 1,986 discovered/unindexed
and 807 crawled/unindexed URLs. This batch does not solve all those exclusions.
The historical 5xx/robots failures largely predate the August 31 Sites cutover;
their current effect is uncertain. Current sample fetches are healthy.

Continue individual source classification, verification of same-DOI identities,
and qualified scientific/editorial review of useful priority articles. Before
merging source identities, inventory and preserve claims, accepted context,
discussions, follows, publications and notification links in the persistent
database. Public empty states are not proof that private records are absent.
Do not blanket-noindex the corpus or regenerate summaries as a substitute for
review. HTTP www-to-HTTPS currently has a platform-level 302; any correction
must stay within Sites and must not change hosting or DNS.

Record Google recrawl/indexing results separately from technical pass results.
Request indexing for a small number of ready canonical pages, avoid repeated
requests, and compare a stable cohort weekly. Existing correct redirects and
deliberate 404/410 responses do not need to become indexed.
