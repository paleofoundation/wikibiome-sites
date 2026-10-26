# WikiBiome scientific media authority audit and prompt — interventions Batch 111

Date: 2026-09-07  
Authorized parent: `42046a039432cedcba1bf3e5cf704e63f16265d6`

## Batch decision

The deterministic queue is `probiotics-ppd`, `probiotics-with-ppi-gerd`, `quercetin`, `resveratrol`, `selenium-supplementation`, and `selenium-supplementation-200mcg`. Only neutral quercetin has one exact, route-matching chemical identity that can be shown without visualizing a treatment claim. It is cleared for exactly one review-only call. The other five routes fail closed as asset-free scientific holds.

| Route | Decision | Principal boundary |
|---|---|---|
| `probiotics-ppd` | Scientific-media hold | Zero sources; no strain accessions, product composition, postpartum population, protocol, assay, endpoint, or non-stigmatizing visual state. |
| `probiotics-with-ppi-gerd` | Scientific-media hold | Both declared source IDs are malformed and unresolved; strain allocation, product, PPI regimen, GERD phenotype, protocol, and measured state are incomplete. |
| `quercetin` | One immutable generation call | Exact neutral quercetin only: PubChem CID 5280343, ChEBI 16243, formula C15H10O7, net charge 0, 22 heavy atoms. |
| `resveratrol` | Scientific-media hold | The route does not select cis versus trans resveratrol; MeSH D000077185 explicitly includes both narrower stereoisomers. |
| `selenium-supplementation` | Scientific-media hold | Zero sources and no chemical or biological selenium form, formulation, dose, product, protocol, or endpoint. |
| `selenium-supplementation-200mcg` | Scientific-media hold | Zero sources; 200 micrograms/day does not select selenomethionine, selenite, selenate, selenium yeast, formulation, bioavailability, protocol, or outcome. |

## Route audits

### `probiotics-ppd`

MeSH D019936 identifies probiotics as a broad class, not a product. The zero-source postpartum-depression route names only broad Bifidobacterium and Lactobacillus labels and supplies no current strain accessions, per-strain viable counts, allocation, product, lot, storage, dose, duration, postpartum timing, depression criteria, comparator, assay, endpoint, or safety exclusions. A mother, infant, brain, gut, capsule, or mixed-bacteria scene would invent both intervention and population characteristics and could stigmatize a perinatal mental-health population.

### `probiotics-with-ppi-gerd`

The two declared local source IDs retain erroneous `.md` suffixes and fail normal source resolution, although similarly named source records exist without those suffixes. The page names four broad organism labels but does not establish exact strains, viable-count allocation, product or lot, excipients, storage, PPI identity and regimen, GERD phenotype, pediatric or adult population, dose, comparator, adherence, assay, endpoint, or safety state. No product or microbiome scene is eligible.

### `quercetin`

PubChem CID 5280343 and ChEBI 16243 identify neutral quercetin, 2-(3,4-dihydroxyphenyl)-3,5,7-trihydroxychromen-4-one, with formula C15H10O7, net charge zero, InChIKey REFJWTPEDVJJIY-UHFFFAOYSA-N, and canonical connectivity `O=c1c(O)c(-c2ccc(O)c(O)c2)oc2cc(O)cc(O)c12`. The local route has zero linked sources and broad cross-condition claims, so the only eligible subject is one label-free heavy-atom identity model. It must not depict a supplement, plant source, glycoside, metal chelate, measured conformer, clinical condition, mechanism, dose, efficacy, or safety claim.

<!-- PROMPT quercetin START -->
```text
Use case: scientific-educational. Asset type: review-only WikiBiome chemical-identity reconstruction for neutral quercetin, PubChem CID 5280343 and ChEBI 16243. Create exactly one isolated complete heavy-atom ball-and-stick teaching model containing exactly twenty-two spheres total: exactly fifteen matte-graphite carbon spheres and exactly seven muted-rose oxygen spheres; hydrogens are intentionally omitted; net charge is zero. Preserve the single connected constitutional graph encoded by canonical SMILES O=c1c(O)c(-c2ccc(O)c(O)c2)oc2cc(O)cc(O)c12: one fused benzopyranone system, one attached phenyl ring, exactly five terminal hydroxyl oxygen centers, exactly one oxygen center within the heterocyclic ring, and exactly one carbonyl oxygen center. Show the complete molecule in a shallow nearly planar oblique orientation with all twenty-two centers and every connector visually separated enough for native count and connectivity review. No overlapping center may conceal another center or required adjacency; no extra atom, detached fragment, duplicate model, aromatic-circle glyph, plant, fruit, vegetable, powder, capsule, bottle, organ, cell, metal sphere, or reaction partner. Treat the object only as neutral quercetin identity. Do not depict or imply a measured conformer, crystal packing, glycoside, metabolite mixture, purity, formulation, dose, bioavailability, antioxidant action, metal chelation, microbiome change, PCOS or other condition treatment, efficacy, safety, recommendation, or diagnosis. Landscape 3:2 at 1536 by 1024; center the complete model within generous uninterrupted pale space and keep every center and connector inside broad crop-safe margins suitable for a centered 1200 by 630 contain derivative. Use a uniform fully opaque high-key cool pale blue-white background approximately #f3f7fb, restrained matte graphite, muted rose, and silver-gray materials, technically precise physical molecular-model finish, soft clinical studio illumination, and minimal scene-making. No text, labels, letters, numbers, atom symbols, charge glyphs, arrows, legend, chart, decorative particles, glow, haze, vignette, border, clipping, signature, or watermark. Educational trained-algorithmic reconstruction only; not a source structure image, crystallographic conformer, assay result, supplement endorsement, treatment recommendation, or diagnostic image.
```
<!-- PROMPT quercetin END -->

### `resveratrol`

MeSH D000077185 identifies resveratrol while explicitly listing both cis- and trans-resveratrol as narrower concepts. PubChem CID 445154 and ChEBI 45713 identify trans-resveratrol, but the WikiBiome route and its eight linked review-level sources do not select that stereoisomer or exclude cis-resveratrol. A single E-isomer model would silently narrow the page; a two-isomer plate would imply that both were present in the reviewed interventions. The route remains asset-free until the upstream page and evidence select a chemical identity or explicitly govern a two-isomer class treatment.

### `selenium-supplementation`

The zero-source route duplicates the already reviewed elemental Selenium entity at the topic level while combining selenomethionine, selenite, selenate, selenium yeast, dose ranges, biomarkers, thyroid and other populations, microbiome claims, contraindications, and outcomes. Elemental selenium is not a supplement formulation. The route remains asset-free until one exact chemical or biological selenium form, product, purity, formulation, dose, schedule, population, comparator, assay, endpoint, and evidence set are selected or a governed cross-route media-reuse rule is adopted.

### `selenium-supplementation-200mcg`

The zero-source Hashimoto route fixes only a nominal daily selenium mass. It does not identify chemical form, selenium-enriched yeast composition, product and lot, excipients, bioavailability, duration, baseline selenium status, Hashimoto disease state, comparator, assay, endpoint, or safety monitoring. A tablet, bottle, selenium atom, or thyroid montage would invent product identity or imply treatment efficacy.

## Authorities and publication boundary

- https://meshb.nlm.nih.gov/record/ui?ui=D019936
- https://pubchem.ncbi.nlm.nih.gov/compound/5280343
- https://www.ebi.ac.uk/chebi/CHEBI:16243
- https://meshb.nlm.nih.gov/record/ui?ui=D000077185
- https://pubchem.ncbi.nlm.nih.gov/compound/445154
- https://www.ebi.ac.uk/chebi/CHEBI:45713
- https://meshb.nlm.nih.gov/record/ui?ui=D019587
- `local:data/content.generated.json` entries for all six routes, the two PPI source-resolution checks, and the reviewed `selenium` entity route

Exactly one route is scientifically cleared for exactly one built-in image-generation call. The other five routes receive no call. Returned media remains review-only until native-resolution inspection, literal center/connectivity and prohibited-content review, opaque outer-field and crop-safe audit, exact-hash acceptance, metadata reconciliation, and native 1200 by 630 derivative review are complete. Prompt-requested content must never be reported as observed output.

## Frozen prompt hashes

The marker-bound prompt SHA-256 value is recorded in the batch manifest. Any prompt change requires a new authority audit and prompt freeze before generation.
