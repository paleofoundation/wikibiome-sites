# Editorial batch audit: source structure normalization

Source authority: `paleofoundation/wikibiome` commit `62e006cf0ced1dce706a6438f6461602229a9f26`.

This batch changes no scientific wording, citations, conclusions, identifiers, or source metadata. It losslessly promotes source-authored first sections named `Overview`, `Definition`, or `Intervention Summary` into the article lead. It also distinguishes empty semantic parent headings from empty public leaves and suppresses comment-only maintenance placeholders from rendering.

## Before and after

| Measure | Baseline | After batch | Delta |
|---|---:|---:|---:|
| Upstream/public records | 821 | 821 | 0 |
| Canonical routes | 714 | 714 | 0 |
| Records with warnings | 664 | 131 | -533 |
| Canonical routes with warnings | 598 | 122 | -476 |
| Empty public-section warnings | 360 routes | 0 routes | -360 |
| Missing introductions | 308 routes | 31 routes | -277 |
| Below evidence threshold | 94 routes | 94 routes | 0 |
| No generated references | 53 routes | 53 routes | 0 |
| No substantive article content | 14 routes | 13 routes | -1 |
| Blocked records | 0 | 0 | 0 |

Categories overlap. The former 360-route empty-section warning was entirely structural: 386 records use an empty level-two semantic parent followed by populated level-three children. No raw empty leaf survives the public renderer. One comment-only `gestational-diabetes` source placeholder is intentionally suppressed rather than rendered as a blank section.

The substantive-content reduction from 14 to 13 records reclassifies `glossary` as an intentional lead-only reference index. The remaining 13 records are source-side auto-created stubs containing only maintenance comments and remain unresolved.

## Route samples

- Lead promotions: `actinobacteria`, `anxiety`, `cadmium`, `ferroptosis`, `microbial-metallomics`, `dietary-fiber-ckd`.
- Structural parents retained with populated children: `acidaminococcus`, `acinetobacter-baumannii`, `akkermansia-muciniphila`, `arsenic`.
- Comment-only public leaf suppressed: `gestational-diabetes` / `Metal Associations`.
- Still missing introductions: `barium`, `microbiome-diversity-metrics`, `b-cell-depletion-therapy-ms`, `stop-diagnostic-overclaiming-discovery-phase`.
- Still lacking substantive content: `barium`, `cladosporium`, `fusarium`, `listeria`, `proteus`, `pseudomonas`, `strontium`, `subdoligranulum`, `titanium`, `treponema`, `uranium`, `vanadium`, `vibrio`.

## Verification

- `npm run editorial:audit -- --json`: 821 records, 714 routes, 131 warning records, 122 warning routes, 0 blocked.
- `npm run content:audit`: 821 pages, 1,891 source records, 6,424 references, 0 missing source metadata, 0 malformed DOI values.
- `npm test`: build passed; 18/18 rendered tests passed.
- `npm run corpus:audit`: 5,256 routes checked (1,456 article requests, 3,782 source requests); all discovered article/source links resolved.

No source-side content gaps were waived in this batch.
