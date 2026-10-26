# WikiBiome scientific media authority audit and prompt — interventions Batch 112

Date: 2026-09-07  
Authorized parent: `f5ef9bcadc22505b661bbf0f0b6531ff93a32c88`

## Batch decision

The deterministic queue is `statin-simvastatin-colorectal-cancer`, `statin-therapy`, `statin`, `synbiotics-pdac`, `vitamin-d-probiotic-schizophrenia`, and `vitamin-d-probiotic-synergy`. Only the explicitly named neutral simvastatin identity can be shown without inventing a drug product, a broad class exemplar, a probiotic strain, a clinical protocol, or a treatment result. It is cleared for exactly one review-only chemical-identity call. The other five routes fail closed as asset-free scientific-media holds.

| Route | Decision | Principal boundary |
|---|---|---|
| `statin-simvastatin-colorectal-cancer` | One immutable generation call | Exact neutral simvastatin identity only; the zero-source page does not support a colorectal-cancer treatment scene, product, dose, response, or mechanism illustration. |
| `statin-therapy` | Scientific-media hold | Broad class route spanning rosuvastatin and unspecified statin therapy; overlaps two other Statins pages and does not select one compound, formulation, or protocol. |
| `statin` | Scientific-media hold | Broad multi-drug, multi-condition class page; overlaps `statin-therapy` and the separate `statins` concept route. |
| `synbiotics-pdac` | Scientific-media hold | Zero local sources and no exact strain accessions, per-strain allocation, stable product identity, prebiotic specification, or governed perioperative protocol in the page. |
| `vitamin-d-probiotic-schizophrenia` | Scientific-media hold | The trial specifies vitamin D3, four species-level labels, counts, brands, and schedule, but not strain accessions; the local source IDs are malformed by `.md` suffixes. |
| `vitamin-d-probiotic-synergy` | Scientific-media hold | One malformed local source ID is used to generalize a schizophrenia trial across conditions; exact strain identities, broader protocols, and cross-condition evidence are unresolved. |

## Route audits

### `statin-simvastatin-colorectal-cancer`

PubChem CID 54454, ChEBI 9150, and MeSH D019821 identify neutral simvastatin, formula `C25H38O5`, net charge zero, InChIKey `RYMZZMVNJRMUDD-HGQWONQESA-N`, with twenty-five carbon and five oxygen heavy atoms. ChEBI identifies the lactone drug as a distinct entity from simvastatin acid. The WikiBiome route has zero linked sources, so the only eligible subject is one exact neutral simvastatin heavy-atom identity model. It must not depict a tablet, brand, dose, colorectal anatomy, tumor, microbiome shift, mechanism, efficacy, safety, or treatment recommendation.

<!-- PROMPT statin-simvastatin-colorectal-cancer START -->
```text
Use case: scientific-educational. Asset type: review-only WikiBiome chemical-identity reconstruction for neutral simvastatin, PubChem CID 54454, ChEBI 9150, and MeSH D019821. Create exactly one isolated complete heavy-atom ball-and-stick teaching model containing exactly thirty spheres total: exactly twenty-five matte-graphite carbon spheres and exactly five muted-rose oxygen spheres; hydrogens are intentionally omitted; net charge is zero. Preserve the single connected stereochemically defined graph encoded by isomeric SMILES CCC(C)(C)C(=O)O[C@H]1C[C@H](C=C2[C@H]1[C@H]([C@H](C=C2)C)CC[C@@H]3C[C@H](CC(=O)O3)O)C: one fused decalin-like ring system, one six-membered lactone ring, one 2,2-dimethylbutanoate ester, exactly two carbonyl oxygen centers, exactly two ester or lactone ring oxygen centers, and exactly one hydroxyl oxygen center. Show the complete molecule in a restrained shallow three-dimensional oblique orientation with all thirty heavy-atom centers and every connector visually separated enough for native count and connectivity review. No overlapping center may conceal another center or required adjacency; do not open the lactone or substitute simvastatin acid. No extra atom, detached fragment, duplicate model, hydrogen sphere, active hydroxy-acid metabolite, lovastatin, rosuvastatin, atorvastatin, calcium or other counterion, tablet, capsule, bottle, product package, colon, tumor, bacterium, cell, receptor, reaction partner, or biological pathway. Treat the object only as neutral simvastatin chemical identity. Do not depict or imply a measured conformer, crystal packing, purity, formulation, concentration, dose, metabolism, HMG-CoA reductase binding, microbiome change, colorectal-cancer prevention or treatment, efficacy, safety, recommendation, or diagnosis. Landscape 3:2 at 1536 by 1024; center the complete model within generous uninterrupted pale space and keep every center and connector inside broad crop-safe margins suitable for a centered 1200 by 630 contain derivative. Use a uniform fully opaque high-key cool pale blue-white background approximately #f3f7fb, restrained matte graphite, muted rose, and silver-gray materials, technically precise physical molecular-model finish, soft clinical studio illumination, and minimal scene-making. No text, labels, letters, numbers, atom symbols, charge glyphs, arrows, legend, chart, decorative particles, glow, haze, vignette, border, clipping, signature, or watermark. Educational trained-algorithmic reconstruction only; not a source structure image, measured conformer, drug product, assay result, treatment recommendation, or diagnostic image.
```
<!-- PROMPT statin-simvastatin-colorectal-cancer END -->

### `statin-therapy`

MeSH D019161 defines HMG-CoA reductase inhibitors as a drug class. The page links evidence for rosuvastatin, a Mendelian-randomization study of LDL/HMGCR, and an observational study of statin therapy, while its overview says eighteen sources and its record exposes only three. It does not select one drug, free compound or salt, formulation, dose, route, treatment population, comparator, assay, or endpoint. The repository also carries separate `statin` and `statins` routes. A single molecule would falsely stand for the class and a pill or pathway scene would invent product and mechanism state.

### `statin`

The page combines simvastatin, rosuvastatin, and unspecified statins across vaginal ecology, Parkinson disease, cancer, preterm birth, cholesterol, and microbiome contexts. It overlaps the `statin-therapy` intervention and `statins` concept pages without a canonical merge, alias, or governed media-reuse relationship. No one molecular structure, tablet, organ, microbe, or pathway can represent this class-wide evidence without silently narrowing it.

### `synbiotics-pdac`

MeSH D058616 defines synbiotics as supplements combining probiotics and prebiotics. The WikiBiome route has zero linked sources and describes unspecified SCFA-producing probiotics with inulin, fructooligosaccharides, or resistant starch. A current PDAC randomized study reports a commercial probiotic plus inulin regimen, but the paper calls it a ten-strain product while the visible methods enumerate eight species-level labels and provide no strain accessions or per-strain allocation. That external paper is not linked in the page. A capsule, microbial community, pancreas, tumor, or immune scene would invent composition or imply efficacy.

### `vitamin-d-probiotic-schizophrenia`

The linked randomized trial specifies vitamin D3 50,000 IU every two weeks plus `8 × 10^9` CFU/day for twelve weeks, with four species-level labels at `2 × 10^9` CFU each and named manufacturers. It does not report strain accessions. Both local source identifiers retain erroneous `.md` suffixes and fail normal resolution, although corresponding source records exist without the suffix. A four-organism plate would claim strain-level specificity that morphology cannot verify; a capsule, brain, gut, or schizophrenia scene would imply product appearance, mechanism, or treatment effect.

### `vitamin-d-probiotic-synergy`

This cross-condition page links only the same Ghaderi schizophrenia trial, again through a malformed `.md` source ID, but extends the discussion to metabolic syndrome, inflammatory bowel disease, autism, and other conditions. The page adds daily-dose alternatives and target vitamin-D ranges not represented by the single linked trial. One combination image would collapse distinct products, strains, doses, populations, and evidence tiers and visually endorse a clinical protocol.

## Authorities and publication boundary

- https://pubchem.ncbi.nlm.nih.gov/compound/54454
- https://www.ebi.ac.uk/chebi/CHEBI:9150
- https://meshb.nlm.nih.gov/record/ui?ui=D019821
- https://meshb.nlm.nih.gov/record/ui?ui=D019161
- https://meshb.nlm.nih.gov/record/ui?ui=D058616
- https://meshb.nlm.nih.gov/record/ui?ui=D019936
- https://doi.org/10.1007/s00262-024-03686-6
- https://doi.org/10.1186/s12888-019-2059-x
- `local:data/content.generated.json` entries and source-resolution checks for all six routes plus the overlapping `statins` concept route

Exactly one route is scientifically cleared for exactly one built-in image-generation call. The other five routes receive no call. Returned media remains review-only until native-resolution inspection, literal model and atom-center counts, connectivity and prohibited-content review, opaque outer-field and crop-safe audit, exact-hash acceptance, metadata reconciliation, and native 1200 by 630 derivative review are complete. Prompt-requested content must never be reported as observed output.

## Frozen prompt hash

The marker-bound prompt SHA-256 value will be recorded in the batch manifest after this authority packet is committed. Any prompt change requires a new authority audit and prompt freeze before generation.
