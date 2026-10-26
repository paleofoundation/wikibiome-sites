# WikiBiome scientific media review — entity, analysis, and reference Batch 122

Date: 2026-09-07  
Authorized parent: `f42be3354b4af5db20bd8063608ee842e49b9b1a`  
Authority-audit commit: `67a9b45a2ba72bf31f17e2e6000bed2e605ec9d5`  
Prompt-freeze commit: `caa0e07d0858c53bf91daf1ba8c71e6e3399b9fe`

## Review method

Exactly two built-in image-generation calls were made, one for each cleared chemical route. Both generator-owned PNGs were copied byte-identically into the project and inspected at native 1536 × 1024 detail. Prompt intent was treated as untrusted. Literal group and heavy-atom counts, connectivity, prohibited content, alpha field, edge contact, crop bounds, and exact SHA-256 values were audited.

The other four routes received no generation call. No public master, article image, social image, registry record, structured media, endpoint, or image-sitemap entry is authorized by this review.

## Rejected and quarantined outputs

### `kynurenine`

- Source SHA-256: `72926983b49103c96388685125d5ea694fe7442518b12ce0e679c9eee512849d`; 1,433,072 bytes.
- Generation record: `exec-d1dae637-ed00-4296-8270-0f620f8ab8f6.png`; project original: `work/media-drafts/entity-analysis-reference-batch-122/kynurenine-draft.png`.
- Literal output: one connected 15-center model with 10 graphite carbon-context, 2 blue nitrogen-context, and 3 rose oxygen-context centers. The six-carbon ring, adjacent ring amino and side-chain attachments, ketone, alpha-amino, and carboxyl graph are present.
- Visual-field failure: 1,349,616 pixels are fully transparent, 223,248 are partially transparent, and zero are fully opaque. Broad black, gray, red, and blue glow or haze replaces the encoded pale field; one nonzero-alpha pixel enters the outer 32-pixel band. Nonzero alpha spans x=55–1463 and y=86–999.

### `metformin`

- Source SHA-256: `2e844707cb36bb6c1b84cbab11327e9c2bc10754a995740e623685e557ea357b`; 1,329,828 bytes.
- Generation record: `exec-6cd769af-b23b-4bb4-89dd-575239e8b3e3.png`; project original: `work/media-drafts/entity-analysis-reference-batch-122/metformin-draft.png`.
- Literal output: one connected nine-center model with four graphite carbon-context and five blue nitrogen-context centers. The dimethyl-substituted nitrogen, two guanidine carbons, bridging nitrogen, and three terminal nitrogen centers are present; no oxygen or chlorine center is visible.
- Visual-field failure: 1,374,740 pixels are fully transparent, 198,124 are partially transparent, and zero are fully opaque. Broad black, gray, and blue glow or haze replaces the encoded pale field; nine nonzero-alpha pixels enter the outer 32-pixel band. Nonzero alpha spans x=35–1521 and y=21–967.

Both exact sources are rejected and quarantined. They must not be flattened, edited, color-corrected, reused, mastered, derived, registered, or published. Any future attempt requires a separately audited revision prompt and a new authorized built-in call.

## Asset-free scientific holds

- `metal-disease-matrix`: a 62-source multi-element, multi-condition synthesis without a versioned public matrix dataset.
- `methanobrevibacter-smithii`: current species identity and type strain are established, but the entity-class route lacks direct morphology sources and cannot enter the microorganism pipeline.
- `neisseria-meningitidis`: current risk-group-2 species identity and type strain are established, but the route is source-free, misclassified, and combines morphology with disease and metal-virulence claims.
- `oxalobacter`: current genus and type species are established, but the route is source-free, misclassified, and combines morphology with unsupported biochemical and clinical claims.

## Publication boundary

Zero exact source hashes are eligible for acceptance or promotion. All six routes remain uncovered and are excluded from registry ownership, public masters and WebPs, media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap. A separate Control Tower zero-hash disposition must be committed before the deterministic register advances.
