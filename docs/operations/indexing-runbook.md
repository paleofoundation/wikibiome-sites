# WikiBiome indexing and search-discovery runbook

This runbook makes canonical WikiBiome pages and reviewed scientific media discoverable and measurable. It does not promise crawling, indexing, image inclusion, traffic, or ranking. Search engines make those decisions independently.

## Ownership and release boundary

The task explicitly authorized by the user owns integration, deployment, production verification, and rollback. DNS and Request indexing are out of scope for the September 18 cleanup.

Scientific media is consumed only through `lib/article-media-registry.mjs`. Search work may validate and expose registered records through canonical pages, structured data, and embedded sitemap image entries. It must not edit media masters, invent records, process unreviewed experiments, or generate images.

## Technical contract

- Production origin: `https://www.wikibiome.com`.
- Every indexable HTML page emits one self-canonical URL.
- All internal search results, including the base page, empty queries, categories, and pagination, canonicalize to `/search` and emit `noindex, follow`.
- Private contribution, claim, and moderation surfaces remain excluded from indexing.
- `https://www.wikibiome.com/sitemap.xml` is the only sitemap source of truth. It contains canonical indexable public page URLs and their reviewed images. Search and the 12 audited articles without substantive content are excluded; substantive encyclopedia content remains indexable.
- `/image-sitemap.xml` and `/sitemap-full.xml` permanently redirect (301) to the main sitemap. They must not be submitted separately. Main-sitemap image entries use canonical `/media/image/{filename}` URLs and omit images belonging to noindex articles.
- Image title, caption, credit, identifiers, review status, and license are published visibly, in embedded IPTC/XMP, and in Schema.org `ImageObject`. Current Google guidance treats `image:title`, `image:caption`, and `image:license` sitemap tags as deprecated, so the canonical sitemap emits only supported `image:loc` data.
- Direct `/media-files/` storage URLs are excluded from crawling and carry `X-Robots-Tag: noindex`. Legacy `/media/{filename}` requests permanently redirect to the registered canonical image or social endpoint.

## Local release gate

Use Node.js `>=22.13.0` and run:

```bash
npm install
npm run search:verify
npm run search:audit:public -- --images=<release-registry-count> --target=production --sample-images
```

The first gate builds the site, runs the focused rendered suite, validates the canonical sitemap and its images, checks representative article/source/category/tool metadata and Schema.org graphs, checks every advertised image endpoint, and renders the full discovered corpus for HTTP, internal-link, paragraph, and self-canonical failures. The second command is a read-only observation of the currently deployed release. It intentionally requires an explicit image count; obtain that number from the release's reviewed registry after applying the noindex article exclusions. Never copy a previous count forward as a default.

Use `--target=production` before deployment so differences from the accepted candidate are reported as `liveStaleFindings`, not candidate defects. Use `--sample-images` only for a quick checkpoint; the final pre/post-release evidence must omit it and check every advertised image.

Current reference invariants are recorded in `docs/operations/search-baseline-2026-09-05.md`. The release gate itself is count-driven rather than date-driven:

- representative status/self-canonical/social-preview/structured-data checks: 4/4 each;
- ordinary sitemap count equals the approved generated content/sitemap release evidence;
- embedded image count equals the reviewed registry minus media belonging to noindex articles;
- canonical registered image endpoints: 100% healthy;
- robots sitemap declarations: exactly 1, the www main sitemap;
- parameterized search: canonical `/search` plus `noindex`;
- full corpus: 0 broken discovered article/source links and 0 self-canonical failures.

If content changes intentionally alter counts, update the baseline only after reviewing the diff between the content manifest, sitemap, and media registry.

## Post-deployment public verification

After the control task deploys the approved commit, run:

```bash
npm run search:audit -- --base-url=https://www.wikibiome.com
npm run search:audit:public -- --images=<deployed-registry-count> --target=candidate
```

The first command validates the deployed search surface against the local reviewed registry. The second validates apex-to-`www`, authoritative redirects and Gone routes, 404/410 metadata, sitemap compatibility, robots exclusions, support/Stripe behavior, and every immutable image endpoint. `--target=candidate` makes any mismatch a release defect after the candidate is supposed to be live.

Then perform these checks from an unauthenticated browser and retain output or screenshots with a UTC timestamp and deployment identifier:

1. Confirm `200` for `/robots.txt` and `/sitemap.xml`; confirm both old sitemap routes return 301 to the canonical sitemap.
2. Confirm exactly one sitemap declaration appears in `robots.txt`.
3. Confirm the article, source, category, and research-tool samples emit a self-canonical URL, canonical `og:url`, Open Graph image, X image, and expected JSON-LD types.
4. Confirm a reviewed image returns `200 image/webp`, `X-Content-Type-Options: nosniff`, and immutable versioned caching.
5. Confirm an unregistered filename returns `404`, a legacy registered URL returns `308`, and raw storage is not advertised by pages or sitemaps.
6. Confirm `/search?q=nickel` emits canonical `/search` and `noindex, follow`.
7. Confirm a nonexistent category returns `404`, not a soft-404 directory.
8. Run the Google Rich Results Test or Schema Markup Validator on representative deployed URLs. Record results even when a valid Schema.org type has no Google rich-result feature.
9. Run PageSpeed Insights for the homepage, reviewed-image article, source, category, and research-tool sample on mobile and desktop. Save lab results and note whether field data is available.

Representative URLs:

- article: `/article/akkermansia-muciniphila`;
- source: `/source/amadi-2022-dietary-interventions-asd-systematic-review`;
- category: `/category/microbe`;
- research tool: `/explore`;
- image: `/media/image/akkermansia-muciniphila-morphology-v2.webp`.

## Google Search Console

These steps require an authenticated owner or full user. Do not mark them complete from code presence alone.

Known evidence as of September 2, 2026: authenticated access to the `sc-domain:wikibiome.com` property was observed; the apex ordinary and image sitemap URLs were submitted and successfully read; a homepage indexing request was acknowledged; and validation was started for the server-error, soft-404, robots-blocked, and selected-canonical groups after explicit user confirmation. These are historical submissions, not proof of current processing or successful indexing. Reinspect their current state after deployment and do not resubmit merely because this runbook is being followed.

1. First look for the existing `wikibiome.com` domain property. The September 1 baseline found a public `google-site-verification` TXT record at the apex, but only the authenticated Search Console property can prove which account owns that token and whether access is current. Do not alter the record from this task.
2. If the owner instead requires a URL-prefix verification method, copy the exact HTML token and configure `GOOGLE_SITE_VERIFICATION` in the production environment. Never commit the token.
3. Deploy through the control task, inspect the homepage source for the exact meta value when that method is used, and click **Verify**.
4. Retain only `https://www.wikibiome.com/sitemap.xml` in the Sitemaps report. Remove obsolete apex sitemap/image and www sitemap-full submissions. Do not request indexing; Rae owns that action.
5. Capture direct evidence: property name, verified-owner state, sitemap submission/last-read status, discovered URL counts, and any processing error.
6. Use URL Inspection on the representative article, source, category, tool, and image-containing article. Record declared canonical, Google-selected canonical, crawl allowed state, fetch/render result, last crawl, and indexing state.
7. Inspect Page indexing, Crawl stats, Core Web Vitals, HTTPS, Manual actions, and Security issues. Export or screenshot nonzero errors.
8. In Search performance, track Web and Image search separately. Record clicks, impressions, CTR, and average position as observations, not guarantees. Filter landing pages by `/article/`, `/source/`, `/category/`, and research-tool paths.

## Bing Webmaster Tools

These steps also require authenticated ownership.

1. Prefer importing the already verified Search Console property when the owner approves that permission; otherwise add `https://www.wikibiome.com/` manually.
2. For meta verification, copy the exact Bing value into `BING_SITE_VERIFICATION`. The rendered homepage emits it as `msvalidate.01`. Do not commit the token.
3. After the control-task deployment, verify the property and retain the successful verification evidence.
4. Use only `https://www.wikibiome.com/sitemap.xml` and record processing state, discovered counts, and errors.
5. Inspect the representative URLs in URL Inspection and Site Explorer. Record crawl status, index status, canonical/redirect observations, and blocked or error URLs.
6. Review Crawl Information, SEO reports, Security, and IndexNow settings if the owner later chooses to use IndexNow. IndexNow is not enabled by this change.

## Privacy-conscious measurement

No external analytics vendor is introduced. The browser uses the self-hosted `web-vitals` package and posts allowlisted events to `/api/search-observability`; the endpoint writes them to existing runtime logs.

`search_landing` is emitted only for recognized search-engine hostnames. Ordinary referrals are not counted. The event contains the normalized landing path and search-engine family. It excludes the full referrer and query.

`core_web_vital` is sampled at 10% and contains only normalized path, CLS/INP/LCP name, numeric value, Google-library rating, and navigation type. It excludes cookies, account/session IDs, IP fields, user-agent fields, full referrers, search terms, metric-instance IDs, and attribution targets.

Aggregate logs by day, normalized path, event, source, metric, and rating. Access to raw operational logs should follow the host's least-privilege and retention controls. Do not join these events to authenticated-user records.

Image discovery is measured from Search Console's Image search performance and sitemap processing, not from raw image requests. Raw requests include bots, previews, caches, and readers and must not be interpreted as indexed-image counts.

## Alert thresholds

| Signal | Warning | Critical / release stop |
| --- | --- | --- |
| Search audit | any representative count below 4/4 | any failure in `npm run search:audit` |
| Canonicals and links | any new mismatch or broken discovered link | more than 0 self-canonical or internal route failures |
| Ordinary sitemap | unexpected count movement or >2% day-over-day change without a content manifest change | non-200, invalid XML, duplicate URL, wrong origin, or >5% unexplained count movement |
| Image sitemap | count differs from reviewed registry | non-200, unregistered/draft URL, deprecated tag, or canonical image failure |
| Search Console/Bing crawl | new blocked-canonical, redirect, soft-404, or duplicate cluster | any 5xx crawl error; submitted sitemap cannot be read; indexed canonical changes away from `www` on a representative page |
| Index coverage | >5% or 25-URL week-over-week increase in unexpected exclusions after the first 28 days | >10% or 50-URL decrease in indexed submitted canonicals, excluding an approved removal |
| Image discovery | no processed canonical sitemap after 7 days, or no Image-search baseline after 28 days (investigate, not a ranking failure) | processed image count falls below the indexable registry count, or Image impressions drop >30% over matched 28-day windows after volume is established |
| Core Web Vitals p75 | LCP >2.5 s, INP >200 ms, or CLS >0.10 for two 7-day windows with at least 50 samples | LCP >4.0 s, INP >500 ms, or CLS >0.25 for a 7-day window with at least 50 samples |
| Search landing telemetry | no events for 24 hours after known search traffic is established | endpoint rejects valid contract events or logs include disallowed fields |

Low-volume and launch-period data is noisy. Investigate threshold crossings; do not describe them as ranking causes without evidence.

## Weekly indexing review

1. Run the external search audit against production.
2. Compare ordinary-sitemap count to the generated content manifest and embedded-image count to the indexable media registry.
3. Review Google and Bing sitemap processing, crawl errors, canonical selections, and representative URL inspections.
4. Export 7-day and 28-day Search performance for Web and Image; compare matched periods.
5. Aggregate privacy-limited search landings and CWV p75 by route family.
6. Record exceptions, owner, due date, evidence link, and whether a rollback or forward fix is recommended.
7. Never interpret submission, crawl, impressions, or indexing as a ranking guarantee.

## Rollback

The implementation is isolated in one commit. Before production integration, rollback by dropping that commit. After integration but before additional dependent changes, revert it with `git revert <commit>` through the control task.

If only telemetry is malfunctioning, a forward fix may temporarily remove `<SearchObservability />` from `app/layout.tsx` while preserving canonical metadata and sitemaps. If image delivery fails, revert the worker routing change and sitemap image entries together so the sitemap never advertises broken endpoints. Search Console and Bing sitemap submissions can be removed without DNS changes, but retain screenshots and note the removal date.

## September 18 apex boundary

Public GET `/` currently receives a GoDaddy forwarding 301 that drops queries; other apex GET paths return 404 and HEAD requests return 405. These requests do not reach the Sites Worker. The application now has a first-rule 301 preserving exact path and query, with Worker-first asset routing, but this does not override the registrar's external forwarding service. Do not mark the live apex redirect PASS from application tests. Restoring apex traffic to Sites requires a separately owned routing/DNS change or a correction by the forwarding provider; no DNS change is authorized in this cleanup.

Use the exact 301 checks in `audit-public-routing-contract.mjs`. The September 18 candidate main sitemap has 2,689 pages and 373 images (12 empty article records and the search page removed; all 385 media files remain available).

For routes using Cloudflare imports, run the search and corpus auditors against a local Worker runtime using `--base-url=http://localhost:<port>`, instead of the Node-only built-worker fallback.
