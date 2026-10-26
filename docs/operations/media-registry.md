# WikiBiome scientific media registry

Every publishable scientific image is declared in `lib/article-media-registry.mjs` and must have an exact approved entry in `data/article-media-review-log.json`. The registry and review log are joint publication inputs; a file cannot appear as reviewed article media when either record is absent or inconsistent.

New prompt records use paired `<!-- PROMPT <page-id> START/END -->` markers around the exact fenced input. Both media gates recompute every marker-bound prompt SHA-256 and fail on drift, duplicate or orphaned blocks, missing candidate-asset hashes, or hashed assets without a matching block. Historical unmarked prompt packets remain readable as legacy provenance.

Approved review entries should be assembled in a temporary JSON object keyed by `pageId|publishedFile`, then merged with `npm run media:reviews:merge -- --records <file> --updated-on YYYY-MM-DD`. The merger validates approval disposition, registered reviewing authority, scientific-reference checks, subject review, accessibility review, revision linkage, filenames, and keys; it refuses to overwrite existing reviews and never writes into the authority or rejection ledgers.

## Canonical filenames

The generator derives all three filenames from the canonical article slug, an approved asset type, and a positive revision number:

- Published image: `{article-slug}-{asset-type}-v{revision}.webp`
- Social preview: `{article-slug}-{asset-type}-v{revision}-social.webp`
- Lossless master: `{article-slug}-{asset-type}-v{revision}-master.png`

Published files are delivered through `/media/image/{filename}` and social previews through `/media/social/{filename}`. These canonical endpoints preserve the semantic filename while enforcing the registry allowlist, `image/webp`, `nosniff`, and immutable versioned caching at the application boundary. Binary storage lives separately in `public/media-files`; direct storage URLs are excluded from crawling and carry `X-Robots-Tag: noindex`. Prior `/media/{filename}` URLs permanently redirect to the corresponding canonical image or social endpoint.

`/image-sitemap.xml` is generated only from this registry. It links each reviewed article to its canonical primary image URL. Current Google image-sitemap guidance supports `image:loc`; the image title, caption, credit, review state, and license context are supplied on the article through visible attribution, embedded IPTC/XMP, and the page's Schema.org `ImageObject`. Deprecated `image:title`, `image:caption`, and `image:license` sitemap tags are deliberately not emitted.

Approved asset types are `morphology`, `pathology`, `technical-specimen`, `microbial-community`, `mechanism`, `intervention`, `host-defense`, `clinical-caution`, and `evidence-index`. The generator rejects invalid slugs, unapproved asset types, non-positive revisions, or filenames that differ from the derived names. The release gate also limits each type to compatible corpus categories.

## Required scientific record

Every entry must include subject identity, alt text, caption, description, credit, provenance, master provenance, creation and review dates, a reusable license, editorial review status, identifier-review status, accessibility-review status, publication status, scientific visual references, trained-algorithmic-media disclosure, and the controlled identifiers required for its subject class. Taxa require an NCBI Taxonomy identifier, scientific name, and taxonomic rank; elements require PubChem element and compound identifiers; conditions require a MeSH identifier. Broader WikiBiome concepts use the canonical article identifier plus additional authority identifiers when applicable.

The processor embeds the record in the lossless master and both WebP derivatives as XMP/IPTC metadata. Article pages publish the disclosure and review key visibly and link the record through Schema.org structured data, including page-specific Open Graph and X images.

## Auditable review boundary

Each review-log key is `{pageId}|{publishedFile}`. Its approved record must exactly match the registry page ID, revision, master, article derivative, social derivative, and review date. It also records:

- the named reviewing authority and stable reviewer ID;
- every checked scientific-reference URL;
- subject or morphology outcome;
- accessibility outcome;
- approved, revise, or rejected disposition;
- notes and revision or supersession linkage.

The release gate rejects missing authorities, unchecked registry references, failed review outcomes, non-approved dispositions, orphan approvals, and any registry/log inconsistency. Drafts, revised concepts, and rejected concepts remain outside the registry and `public/media-files`.

## Master-file boundary

Only reviewed canonical PNG masters belong in `media/masters`. Unpublished experiments and superseded concepts belong in ignored `work/media-drafts`; they must be reviewed, logged, registered, and assigned a canonical revision before promotion.

The original generation masters for the eight-asset baseline were not retained. Their current PNGs are explicitly recorded as lossless preservation masters reconstructed from the reviewed WebP derivatives, not as original generation masters. New assets retain the selected original lossless PNG.

## Deterministic coverage program

`data/article-media-coverage.generated.json` is generated from the synchronized content corpus, registry, review log, and sorted batch manifests. It covers exactly 710 canonical article routes and records baseline, completed and remaining counts, category totals, revisions/rejections, scientific holds, candidates in review, next batch, and the complete deterministic queue. Routes in an `awaiting-control-review` batch are marked `in-review` and skipped by later generation batches without being counted as completed.

If the scientific identity of a canonical route cannot be verified against the required authority, record a `scientific-identity-hold`. Held routes remain uncovered and count toward the remaining total, are skipped by subsequent generation batches, and cannot enter the reviewed registry until the hold is explicitly resolved. The release gate rejects any registry record that conflicts with an active hold.

Generation prompts are immutable provenance, not evidence that a rendered output obeyed a requested count. Every accepted generated asset requires an identified, dated human `outputAudit` that records the visible subject count or grouping, sets `promptCountTrusted` to `false`, and marks metadata consistency as passed only after the visual review, alt text, caption, description, registry, and structured metadata agree. The program generator and release gate reject reviewed batches with a missing or inconsistent output audit.

Reviewed registry images are also the only images eligible for directory/search thumbnails and the `<image:image>` extension in `sitemap.xml`. Scientific-identity holds, pending candidates, rejected drafts, and superseded drafts never enter either surface.

```sh
npm run media:program:write
npm run media:process
npm run media:check
```

`npm run media:process` with no arguments deliberately rebuilds every reviewed record. During a normal batch promotion, pass each accepted owner as `--promote <page-id> --source <reviewed-png>`; the processor then creates and validates only those new masters and derivatives. The subsequent whole-registry release gate remains mandatory, so targeted processing reduces recompression work without reducing corpus validation.

`npm run build` includes the current-register and scientific-media release gates through `prebuild`.
