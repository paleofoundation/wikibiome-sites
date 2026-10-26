# WikiBiome search-discovery baseline — 2026-09-01

Historical snapshot: preserve these September 1 observations for provenance. The current operational baseline is `docs/operations/search-baseline-2026-09-05.md`.

Status: implementation validated in an isolated worktree; not deployed by this task.

Base commit: `2b6444c`.

Production observations were captured around 09:00–09:14 UTC on September 1, 2026. Candidate observations come from the rendered build in this worktree. Production remains unchanged until the WikiBiome control task integrates and deploys the commit.

## Baseline-to-candidate delta

| Metric | Live production baseline | Validated candidate | Delta |
| --- | ---: | ---: | ---: |
| representative HTML routes returning 200 | 4/4 | 4/4 | 0 |
| representative self-canonical URLs | 1/4 | 4/4 | +3 |
| representative canonical Open Graph/X previews with images | 0/4 | 4/4 | +4 |
| representative route-specific Schema.org contract coverage | 0/4 | 4/4 | +4 |
| ordinary sitemap URLs | 2,644 | 2,648 | +4 |
| sitemap declarations in robots.txt | 1/2 | 2/2 | +1 |
| reviewed image sitemap entries | 0/8 (`/image-sitemap.xml` returned 404) | 8/8 | +8 |
| canonical reviewed image endpoints healthy | 8/8 | 8/8 | 0; remains 100% |
| parameterized search noindex contract | absent | present | +1 control |
| full rendered indexable routes with one self-canonical | not previously measured | 3,375/3,375 | new baseline |
| full discovered article/source link failures | not previously measured | 0 across 5,267 rendered routes | new baseline |

The +4 ordinary-sitemap difference is the candidate corpus/build state relative to the live deployment, not four URLs introduced by the search implementation. The search change does not add page URLs to the ordinary sitemap.

## Live production evidence

- `/`, `/robots.txt`, `/sitemap.xml`, the representative article/source/category/tool pages, and the canonical Akkermansia image returned HTTP 200.
- `/image-sitemap.xml` returned HTTP 404.
- `/sitemap.xml` contained 2,644 `<loc>` records and no image extension entries.
- `robots.txt` advertised only `/sitemap.xml`.
- The reviewed Akkermansia image returned `image/webp`, immutable one-year caching, and `X-Content-Type-Options: nosniff`.
- The Akkermansia article self-canonicalized and supplied image metadata, but it lacked canonical `og:url` and the complete Article/WebPage/ImageObject graph required by the candidate contract.
- The representative source, category, and research tool each canonicalized to the homepage and suppressed preview images; no route-specific JSON-LD was present.
- Public web searches for `site:wikibiome.com` and the representative Akkermansia article returned no results through the available search interface. This is an observation only; it is not proof of index exclusion, and it is not a ranking statement.
- The unauthenticated PageSpeed Insights API request returned quota error 429, so no public lab or CrUX performance score is claimed in this baseline.
- A read-only DNS lookup found a public `google-site-verification` TXT record at `wikibiome.com`. This is a verification mechanism, but it does not prove current account access, property state, sitemap submission, or report data without authenticated Search Console evidence.
- The homepage contained neither a Google nor Bing verification meta tag, and `/BingSiteAuth.xml` returned 404. No public Bing ownership evidence was found.

## Candidate validation evidence

`npm run build`:

- 821 pages and 1,891 source records audited;
- 6,424 article references generated;
- 0 referenced source IDs without metadata;
- 0 DOI values flagged;
- build completed successfully.

`node --test tests/rendered-html.test.mjs`:

- 20 tests passed;
- 0 failed;
- includes registered-only media routing, image sitemap, canonical metadata, social previews, route-specific structured data, query noindex, invalid-category 404, known-search-host classification, ordinary-referral exclusion, and signature-alias canonicalization.

`npm run search:audit`:

- representative HTTP 200: 4/4;
- self-canonical: 4/4;
- canonical Open Graph/X preview: 4/4;
- expected structured data: 4/4;
- ordinary sitemap: 2,648 unique canonical records;
- image sitemap: 8/8 reviewed records;
- canonical image endpoints: 8/8 healthy;
- robots sitemap declarations: 2/2;
- parameterized search noindex: pass;
- failures: 0.

`npm run corpus:audit`:

- 5,267 routes rendered;
- 1,456 article-family routes;
- 3,782 source-family routes;
- 3,683 article paragraphs checked;
- 3,375/3,375 indexable HTML routes with exactly one self-canonical URL;
- 0 discovered internal article/source link failures.

## Account-gated baseline gaps

No direct Search Console or Bing Webmaster dashboard evidence was available in this worktree, and neither `GOOGLE_SITE_VERIFICATION` nor `BING_SITE_VERIFICATION` was configured. The public Google DNS record noted above does not close the authenticated evidence gap. Therefore the following are explicitly not complete:

- Google Search Console property ownership verification;
- Google ordinary/image sitemap submission and processing evidence;
- Google Page indexing, Crawl stats, URL Inspection, selected-canonical, Core Web Vitals, Web Search, or Image Search evidence;
- Bing Webmaster property ownership verification;
- Bing sitemap submission/processing, Site Explorer, URL Inspection, crawl, or search-performance evidence;
- deployed Rich Results Test / Schema Markup Validator evidence for the candidate output;
- post-deployment PageSpeed Insights and field-data baseline.

The control task should complete those actions after integration and deployment using `docs/operations/indexing-runbook.md`, then attach screenshots/exports and update this baseline without rewriting the pre-deployment observations.
