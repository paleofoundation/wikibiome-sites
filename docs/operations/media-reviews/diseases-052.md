# Immutable native review — diseases Batch 052

Reviewed: 2026-09-06  
Authorized parent: `35152d4acb220de9a983a54c16780a35c8260f46`  
Audit and prompt-freeze commit: `5c6cd2b0b1154573de370cd496be7932b9ce4713`

Exactly one built-in image-generation call was made for each of the six frozen prompts. All six returned a 1536 × 1024 PNG. Original generation records remain preserved by the built-in generator, with byte-identical project-bound copies under `work/media-drafts/diseases-batch-052/`. This record reports literal native output rather than prompt intent. All candidates remain review-only and require separate Control Tower native-resolution exact-hash acceptance before any promotion.

## Exact sources and native dispositions

| Route | Generation record | SHA-256 | Bytes | Models / groups | Proposed crop |
| --- | --- | --- | ---: | ---: | --- |
| `huntingtons-disease` | `exec-7b97f5b6-2105-4320-af62-af91d32d6649.png` | `cba77e4bc5d91a7aed671344b4e88ba7e4e83d8724ddfe6bd709b87404dc368b` | 1,684,521 | 3 / 3 | contain |
| `hypertension` | `exec-d7cc2aa0-e334-4443-b294-fa9a1a8c3422.png` | `bafbdd7618b4dc2dbbc5da403bcd00d247824d25b672210b9cc3a0604b47f3b7` | 1,803,514 | 3 / 3 | contain |
| `inflammatory-bowel-disease` | `exec-ddbb7a08-4e31-4f8f-b4dd-d8c97fd3a865.png` | `a34968bb6a50c37ee5bffb908c8eac5bb565620c2645792d66762ae1b6ba09b8` | 2,152,787 | 3 / 3 | contain |
| `ibs` | `exec-762379d0-3539-4362-820c-f95046187b4b.png` | `ab837454e3fad5b60165456ae0ca9124769b11e065bf046009b39db0733638eb` | 2,044,927 | 3 / 3 | contain |
| `long-covid` | `exec-ce76c947-7c75-452f-8564-c283edfafba7.png` | `ba99090a6bd04e0cf26b56dd4df2ff12998ae8094c1cbe0ce2c207ee7e0d4917` | 1,655,558 | 4 / 4 | contain |
| `major-depressive-disorder` | `exec-f5314b6f-fae6-4487-a752-6ae54926ae25.png` | `50c7b82570fafbbf887299998ed75f10236ad897b6e86f0d8c3c1c757c665152` | 1,791,554 | 2 / 2 | contain |

## Literal output and limitation audit

- Huntington disease: three complete groups—intact lateral brain, coronal brain cutaway with paired deep blue and rose structures, and one connected network with five prominent neuron bodies. This does not show atrophy, a lesion, gene result, symptom, stage, or diagnosis. Fine terminal branches approach the horizontal margins but remain visibly complete; contain is required.
- Hypertension: three complete groups—heart with proximal major vessels, longitudinal muscular-artery segment with open lumen, and layered arterial cross-section with patent lumen. No pressure measurement or vascular damage is shown; anatomy cannot establish hypertension.
- Inflammatory bowel disease: three complete groups—digestive orientation containing colon and coiled small bowel, plus two layered bowel-wall cutaways. One cutaway has an even outer wall and the other a focal rounded deeper-wall bulge. These are selected structural teaching patterns, not literal endoscopy or histology, universal inflammation, subtype classification, stage, or diagnosis.
- Irritable bowel syndrome: three complete groups—intact colon, orderly bowel-wall cross-section with open lumen, and an intact brain over a short colon-like segment connected by two fine neutral nerve-like strands. No visible structural inflammation or damage is present. The strands are not a named pathway or asserted mechanism.
- Long COVID: four complete groups—paired lungs with central airway and laryngeal framework, heart, intact brain, and skeletal-muscle fascicle. All appear undamaged. The selected systems communicate heterogeneity only and do not imply universal involvement, a single lesion, biomarker, mechanism, symptom set, stage, or diagnosis. Fine pale structures approach the horizontal margins but remain complete; contain is required.
- Major depressive disorder: two complete groups—intact lateral brain and one distributed connected network with nine prominent blue or pale-rose neuron bodies. The plate has no patient, mood trope, lesion, neurotransmitter, scan heatmap, or diagnostic sign and does not reduce depression to a single mechanism.

Across all originals, native inspection found no labels, text, arrows, patient identity, facial expression, distressed pose, medication, instruments, blood, gore, decorative particles, room, border, signature, watermark, or visibly clipped complete teaching model. The 32-pixel outer-band dark-pixel counts below luma 128 are respectively 26, 0, 0, 0, 6, and 0 in route order above; the nonzero pixels are fine specimen detail near pale horizontal margins, not a vignette or dark field. `contain` is proposed for every later social derivative because each asset contains multiple complete teaching groups and several approach the horizontal bounds. No output has a public registry key, master, derivative, endpoint, schema node, or sitemap entry.

## Promotion crop verification

All six deterministic 1200 × 630 social derivatives were inspected at native detail on 2026-09-06. Centered `contain` preserves every complete reviewed teaching group, both IBS connection strands, the Huntington five-neuron network, and the major-depressive-disorder nine-neuron network. Pale vertical padding is uniform and no label, clipping, substitution, or model loss is present. These observations bind only the exact derivatives produced from the accepted hashes; public release remains subject to the complete metadata and release gates.
