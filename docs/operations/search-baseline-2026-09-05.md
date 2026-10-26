# WikiBiome search-discovery baseline — 2026-09-05

Status: the accepted Vinext candidate is locally validated, while the public site still exposes an older routing/indexing release. This report separates live release drift from candidate defects and makes no crawling, indexing, traffic, or ranking guarantee.

## Provenance and boundaries

- Control snapshot inspected: `0c64adad64b36c49f9442a0669c45be15bd9c261`.
- Policy-driven public verifier integrated in control history: `6fdaa53`.
- Canonical public origin: `https://www.wikibiome.com`.
- Live observations were read-only. This task did not deploy, push, alter DNS, submit a property or sitemap, request indexing, or start a validation.
- Scientific-media state was consumed through `lib/article-media-registry.mjs`. No master, draft, derivative, review decision, or generated image was changed.

## Baseline-to-candidate delta

| Metric | Current public release | Validated candidate | Delta / interpretation |
| --- | ---: | ---: | --- |
| representative article/source/category/tool HTTP 200 | 4/4 | 4/4 | no change |
| representative self-canonical | 4/4 | 4/4 | no change |
| representative canonical Open Graph/X preview | 4/4 | 4/4 | no change |
| representative Schema.org contract | 4/4 | 4/4 | no change |
| ordinary sitemap URLs | 2,692 | 2,692 | no change |
| reviewed image-sitemap entries | 129 | 140 | +11 accepted candidate assets awaiting release |
| canonical immutable image endpoints healthy | 129/129 | 140/140 | both observed sets 100% healthy |
| authoritative redirect routes passing | 40/43 | 43/43 | three live routes remain stale |
| generated excluded routes with intended 410 boundary | 0/46 | 46/46 policy coverage | live returns generic 404; candidate owns the explicit Gone boundary |
| authoritative robots exclusions present | 7/10 | 10/10 | three private/researcher exclusions await release |
| `/sitemap-full.xml` compatibility | 404 | 200 parity with `/sitemap.xml` | candidate restores compatibility |
| generic missing-article metadata | 404 without required canonical/noindex | 404 with canonical `/404` and one `noindex, follow` | candidate fixes soft/conflicting metadata |
| support/Stripe contract | pass | pass | Payment Link remains authoritative; retired checkout API is 404 |

The public verifier emitted 199 `liveStaleFindings` and zero `candidateDefects`. The high finding count is deliberately granular: each of 46 excluded routes is checked for status, robots directive, canonical, and title. It is not 199 independent application regressions.

## Candidate evidence

The candidate build and test gate reported:

- 817 public-content records and 1,939 source records audited;
- 6,447 article references generated, including 349 recovered inline citations;
- zero referenced source IDs without registry metadata and zero flagged DOI values;
- 13 retired article identities resolving through the audited redirect registry;
- 710 canonical routes in the deterministic editorial/media program;
- 140 reviewed registry assets and 570 remaining routes;
- 61/61 project tests passing, including 7/7 public-verifier fixtures and 31/31 rendered search tests;
- four of four representative status, canonical, social-preview, and structured-data checks;
- 2,692 canonical ordinary-sitemap URLs;
- 140/140 image-sitemap, reviewed-registry, and immutable endpoint checks;
- two of two sitemap declarations in robots;
- all 43 authoritative redirect paths and all 46 generated Gone paths checked against the built worker;
- parameterized search canonicalized to `/search` with `noindex`;
- privacy-limited search observability tests proving ordinary referral traffic is not classified as search traffic.
- 5,368 discovered routes rendered: 1,461 article-family routes, 3,878 source-family routes, and 4,294 article paragraphs;
- 3,415/3,415 indexable HTML routes emitted exactly one self-canonical URL, with zero discovered internal article/source-link failures.

`npm run lint` completed with zero errors and eleven existing `@next/next/no-img-element` warnings. Those warnings are not introduced by the verifier and remain performance-review inputs rather than ignored failures.

## Read-only production evidence

The all-image public command was:

```bash
npm run search:audit:public -- --images=129 --target=production
```

Observed passing contracts:

- all four representative record types returned 200 with self-canonical metadata, Open Graph/X images, and required Schema.org types;
- `/sitemap.xml` contained 2,692 canonical URLs;
- `/image-sitemap.xml` contained exactly the explicitly expected 129 entries;
- all 129 advertised canonical images returned `200 image/webp` with immutable caching;
- all 39 generated article-alias redirects and the legacy disease-signature redirect passed;
- the support page was self-canonical and linked to the approved Stripe Payment Link;
- `/support/thank-you` was self-canonical and noindex;
- `/api/create-checkout` remained 404.

Grouped live release drift:

- the apex host serves 200 instead of permanently redirecting the full path and query to `www`;
- `/signature-explorer`, `/signature-explorer.html`, and uppercase `/article/DNA-damage` do not yet implement the accepted redirect contract;
- the 46 generated public-exclusion paths return the old generic 404 output rather than the accepted 410 boundary and metadata;
- a generic missing article lacks the accepted canonical `/404` and unambiguous `noindex, follow` metadata;
- `/sitemap-full.xml` returns 404;
- robots lacks `/source/*/claim`, `/researcher/dashboard`, and `/researcher/moderation` exclusions.

These are deployment-state findings. They do not contradict the passing local candidate gate, and they are not evidence about rankings.

## Authenticated search-engine evidence

The latest direct Google evidence remains the September 2 authenticated checkpoint recorded in commit `816439bb4c02f82e620a281acb90a8d5d0d87713`:

- authenticated access to the `sc-domain:wikibiome.com` property was observed;
- `https://wikibiome.com/sitemap.xml` was submitted and successfully read with 2,685 discovered pages;
- `https://wikibiome.com/image-sitemap.xml` was submitted and successfully read with 93 discovered pages;
- the homepage live test reported that the URL was available to Google and could be indexed;
- after explicit user confirmation, the homepage indexing request was acknowledged and placed in the priority crawl queue;
- validation was started for server-error, soft-404, robots-blocked, and Google-selected-canonical mismatch groups;
- the expected redirect group and the search-engine-selected `Crawled - currently not indexed` group were deliberately not represented as code fixes.

Those discovered counts predate later content and media releases. Submission, a successful read, a live-test result, a validation start, or a crawl-queue acknowledgement does not prove current indexing, image inclusion, successful validation, or ranking.

No authenticated Bing Webmaster evidence is present. Bing property ownership/import, sitemap processing, URL Inspection, Site Explorer, crawl information, and search-performance evidence remain account-gated.

## Authenticated read-only checkpoint — 2026-09-05

The existing logged-in `sc-domain:wikibiome.com` property was inspected without clicking **Test live URL**, **Request indexing**, **Validate fix**, **Submit**, export, removal, or settings controls.

Page indexing still showed the August 28 data snapshot:

- 31 indexed and 819 not indexed;
- 4 `Page with redirect` and 793 `Crawled - currently not indexed`, both `Not Started`;
- 10 server errors, 7 soft 404s, 1 robots-blocked URL, and 1 selected-canonical mismatch, all with validation `Started`;
- 3 redirect errors with validation `Passed`.

Because that report predates the current public and candidate releases, these are historical Google crawl classifications, not 819 current application defects.

Submitted sitemap state was directly visible:

| Sitemap | Submitted | Last read | Status | Discovered pages |
| --- | --- | --- | --- | ---: |
| `https://www.wikibiome.com/sitemap.xml` | Sep 4 | Sep 4 | Success | 670 |
| `https://wikibiome.com/sitemap.xml` | Sep 2 | Sep 4 | Success | 670 |
| `https://wikibiome.com/image-sitemap.xml` | Sep 2 | Sep 5 | Success | 2 |
| `https://www.wikibiome.com/sitemap-full.xml` | Apr 15 | Apr 15 | Success | 340 |

The successful reads prove fetch/parse acceptance, not complete discovery. Google's 670 ordinary and 2 image discoveries are materially below the live XML counts of 2,692 and 129. Recheck after the accepted routing release and investigate if the gap persists beyond the runbook thresholds; do not infer a ranking cause from it.

Stored URL Inspection results, without a new live test or indexing request:

| Representative | Stored Google state | Crawl/canonical evidence |
| --- | --- | --- |
| article `/article/akkermansia-muciniphila` | Crawled, currently not indexed | last crawl Jun 5; crawl and indexing allowed; fetch successful; user canonical correct; Google selected inspected URL |
| source `/source/amadi-2022-dietary-interventions-asd-systematic-review` | Unknown to Google | no stored crawl, sitemap, or canonical evidence |
| category `/category/microbe` | Crawled, currently not indexed | last crawl May 5; crawl and indexing allowed; fetch successful; user canonical correct; Google selected inspected URL |
| tool `/explore` | Crawled, currently not indexed | last crawl Jun 3; fetch successful; stored user canonical was the homepage; Google selected inspected URL, reflecting the old deployment |
| image `/media/image/akkermansia-muciniphila-morphology-v2.webp` | Unknown to Google | no stored crawl or referring-sitemap evidence |

Performance for the selected three-month window, June 4 through September 3, was 2 Web Search clicks, 583 impressions, 0.3% CTR, and average position 53.6. Image Search showed zero clicks and zero impressions. These are observations, not targets or guarantees.

Core Web Vitals, last updated September 4, had insufficient 90-day Chrome UX Report usage data for both mobile and desktop. The HTTPS report, updated September 5, showed zero non-HTTPS URLs, one HTTPS URL, and no critical issues. Manual Actions and Security Issues both reported no issues detected.

## Measurement baseline and remaining evidence

The candidate records only allowlisted first-party events in existing operational logs:

- recognized search-engine family plus normalized landing path for `search_landing`;
- sampled CLS, INP, and LCP value/rating/navigation type for `core_web_vital`;
- no search query, full referrer, cookie, account/session identifier, explicit IP field, user-agent field, metric-instance ID, or attribution target.

No external analytics or monitoring vendor was selected, so no marketplace service or third-party tracking script was introduced. Image discovery must be measured from authenticated image-search performance and sitemap processing, not raw image requests.

Current missing evidence:

- post-release public verifier with the deployed registry count and zero release defects;
- terminal Google validation outcomes and post-release crawl/index coverage, selected canonicals, Web/Image performance, and sitemap processing counts;
- authenticated Bing ownership and processing evidence;
- post-release PageSpeed Insights lab results and any available field/Core Web Vitals data;
- accumulated privacy-limited production telemetry sufficient to calculate route-family search landings and CWV percentiles.

Use `docs/operations/indexing-runbook.md` for the post-deployment checklist, alert thresholds, weekly review, and rollback. Do not close any missing external item without dated direct evidence.
