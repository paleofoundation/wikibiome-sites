# WikiBiome scientific media authority audit and prompt — interventions Batch 109

Date: 2026-09-07  
Authorized parent: `79347eee3747150ebc1fe12f9e22a4cba5b16209`

## Batch decision

The deterministic queue is `metformin-intervention`, `multi-strain-synbiotic-schizophrenia`, `nac-autism`, `nac-supplementation`, `omega-3-fatty-acids`, and `plant-based-diet-ckd`. Only the explicitly named pair of neutral all-cis eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA) has an exact source-independent identity that can represent its route without inventing a product, dose, efficacy result, or treatment scene. It is cleared for exactly one review-only chemical-identity call. The other five routes fail closed as asset-free scientific-media holds.

| Route | Decision | Principal boundary |
|---|---|---|
| `metformin-intervention` | Scientific-media hold | Duplicate of the separate canonical `metformin` route; reconcile canonical ownership or media reuse and select free base versus hydrochloride product/formulation before generation. |
| `multi-strain-synbiotic-schizophrenia` | Scientific-media hold | The linked RCT identifies a capsule protocol and twelve organism names but not twelve strain accessions or a visually verifiable strain-level composition; all three local source IDs are malformed by `.md` suffixes. |
| `nac-autism` | Scientific-media hold | Zero-source condition-specific duplicate of the canonical N-acetyl-L-cysteine identity, which already owns a reviewed chemical asset. |
| `nac-supplementation` | Scientific-media hold | Zero-source cross-condition duplicate of the canonical N-acetyl-L-cysteine identity, which already owns a reviewed chemical asset. |
| `omega-3-fatty-acids` | One immutable generation call | Exact neutral all-cis EPA and DHA pair only; no supplement product, formulation, ratio, dose, metabolism, efficacy, or disease scene. |
| `plant-based-diet-ckd` | Scientific-media hold | Zero sources and no CKD-stage-specific menu, preparation, nutrient-safety rules, duration, comparator, adherence measure, assay, or endpoint. |

## Route audits

### `metformin-intervention`

PubChem CID 4091, ChEBI 6801, and MeSH D008687 identify metformin, with neutral formula `C4H11N5`; MeSH also includes the narrower metformin-hydrochloride concept. The repository separately publishes `/article/metformin` and `/article/metformin-intervention` with the same title and overlapping sources, but no canonical merge, alias, or governed one-asset multi-route relationship exists. The intervention route does not select neutral free base, hydrochloride, hydration state, product, formulation, dose, or measured protocol. A second molecule would create duplicate media ownership, while a tablet or product scene would invent the missing state. The route remains asset-free until the page identities are reconciled and one exact chemical or product state is selected.

### `multi-strain-synbiotic-schizophrenia`

MeSH D058616 defines synbiotics as supplements combining probiotics and prebiotics. Basafa-Roodi et al. reports two capsules daily for eight weeks; each capsule is described as containing `10^9` CFU across twelve organism names plus 21 mg fructooligosaccharide, purchased from Zist Takhmir. The paper does not supply twelve strain accessions or make the twelve taxa visually distinguishable, and the phrasing does not establish a per-strain viable-count allocation. The local page appends `.md` to each of its three source IDs, leaving its present source links unresolved despite matching source records without those suffixes. A capsule, twelve generic microbial forms, brain, gut, or schizophrenia scene would invent strain identity, formulation appearance, mechanism, or efficacy. The route remains asset-free until the source links and exact composition are resolved.

### `nac-autism`

PubChem CID 12035, ChEBI 28939, and MeSH D000111 identify N-acetyl-L-cysteine. That exact identity already owns a reviewed WikiBiome chemical reconstruction at `/article/n-acetyl-cysteine`. This separate autism intervention route has zero linked sources while asserting a trial result, dose range, glutathione, glutamate, chelation, tolerability, and treatment context. A duplicate molecule would obscure canonical ownership and an autism-specific scene would imply efficacy. The route remains asset-free until its evidence is linked and the page is merged, aliased, or governed as a condition-specific use of the canonical NAC identity.

### `nac-supplementation`

This second zero-source intervention route also names N-acetyl-L-cysteine but combines multiple doses, formulations, psychiatric and post-viral populations, metal-detoxification claims, mechanisms, efficacy statements, and safety advice. The canonical NAC page already owns the reviewed exact chemical image. A second chemical portrait or generic supplement object would create duplicate ownership and conceal the clinical heterogeneity. The route remains asset-free until its evidence and canonical relationship are resolved.

### `omega-3-fatty-acids`

MeSH D015525 defines an omega-3 fatty-acid group and explicitly lists alpha-linolenic acid, DHA, and EPA beneath it. The local route narrows its title and article scope to EPA and DHA and links eight sources. ChEBI 28364 and PubChem CID 5282847 define neutral all-cis EPA as `C20H30O2`, with five cis double bonds at positions 5, 8, 11, 14, and 17. ChEBI 28125 and PubChem CID 445580 define neutral all-cis DHA as `C22H32O2`, with six cis double bonds at positions 4, 7, 10, 13, 16, and 19. Exactly one two-model heavy-atom identity reconstruction is eligible. It must not represent ALA, fish oil, ethyl esters, triglycerides, capsules, a formulation, ratio, dose, food source, metabolism, inflammation, microbiome change, disease, efficacy, safety, or recommendation.

<!-- PROMPT omega-3-fatty-acids START -->
```text
Use case: scientific-educational. Asset type: review-only WikiBiome chemical-identity reconstruction for the explicitly named neutral all-cis eicosapentaenoic acid (EPA; PubChem CID 5282847; ChEBI 28364) and neutral all-cis docosahexaenoic acid (DHA; PubChem CID 445580; ChEBI 28125) pair. Create exactly two complete and visibly separate heavy-atom ball-and-stick teaching models, one in the upper half and one in the lower half, with no labels. The upper EPA model must contain exactly twenty-two spheres total: exactly twenty matte-graphite carbon spheres and exactly two muted-rose oxygen spheres, with hydrogens intentionally omitted and net charge zero. Preserve the single connected all-cis EPA graph encoded by SMILES CC/C=C\C/C=C\C/C=C\C/C=C\C/C=C\CCCC(=O)O: one uninterrupted twenty-carbon chain, five visibly paired double-bond connectors at the 5, 8, 11, 14, and 17 positions, and one terminal carboxylic-acid carbon attached to two oxygen centers. The lower DHA model must contain exactly twenty-four spheres total: exactly twenty-two matte-graphite carbon spheres and exactly two muted-rose oxygen spheres, with hydrogens intentionally omitted and net charge zero. Preserve the single connected all-cis DHA graph encoded by SMILES CC/C=C\C/C=C\C/C=C\C/C=C\C/C=C\C/C=C\CCC(=O)O: one uninterrupted twenty-two-carbon chain, six visibly paired double-bond connectors at the 4, 7, 10, 13, 16, and 19 positions, and one terminal carboxylic-acid carbon attached to two oxygen centers. Render both complete chains as restrained shallow zigzags in nearly planar oblique orientation; keep the models parallel, clearly separated, and large enough that every center and every connector can be counted at native resolution. No center may overlap another center or conceal a required adjacency. No third molecule, detached fragment, extra or missing center, hydrogen sphere, alpha-linolenic acid, ester, triglyceride, phospholipid, fish oil, capsule, tablet, bottle, fish, seed, plant, food, membrane, cell, organ, receptor, arrow, reaction partner, or biological pathway. Treat the objects only as the neutral EPA and DHA chemical identities. Do not depict or imply measured conformations, crystal packing, purity, formulation, EPA:DHA ratio, concentration, dose, bioavailability, metabolism, specialized pro-resolving mediators, inflammation, microbiome change, disease treatment, efficacy, safety, recommendation, or diagnosis. Landscape 3:2 at 1536 by 1024; center the pair within generous uninterrupted pale space and keep every center and connector inside broad crop-safe margins suitable for a centered 1200 by 630 contain derivative. Use a uniform fully opaque high-key cool pale blue-white background approximately #f3f7fb, restrained matte graphite, muted rose, and silver-gray materials, technically precise physical molecular-model finish, soft clinical studio illumination, and minimal scene-making. No text, labels, letters, numbers, atom symbols, charge glyphs, legend, chart, decorative particles, glow, haze, vignette, border, clipping, signature, or watermark. Educational trained-algorithmic reconstruction only; not a source structure image, measured conformer, supplement endorsement, treatment recommendation, assay result, or diagnostic image.
```
<!-- PROMPT omega-3-fatty-acids END -->

### `plant-based-diet-ckd`

MeSH D000095500 defines a broad diet emphasizing plant foods while reducing animal-based foods. The local CKD route has zero linked sources despite describing kidney-stage-sensitive potassium, phosphorus, protein, and clinical outcomes. It does not select foods and quantities, preparation, protein and energy targets, potassium or phosphorus rules, CKD stage, comorbidity or medication context, duration, comparator, adherence, specimen, assay, time point, or endpoint. A plated meal or ingredient still life could be unsafe and would invent a prescriptive protocol. The route remains asset-free until one directly sourced, CKD-stage-specific intervention and measured state are selected.

## Authorities and publication boundary

- https://pubchem.ncbi.nlm.nih.gov/compound/4091
- https://www.ebi.ac.uk/chebi/CHEBI:6801
- https://meshb.nlm.nih.gov/record/ui?ui=D008687
- https://pubchem.ncbi.nlm.nih.gov/compound/12035
- https://www.ebi.ac.uk/chebi/CHEBI:28939
- https://meshb.nlm.nih.gov/record/ui?ui=D000111
- https://meshb.nlm.nih.gov/record/ui?ui=D058616
- https://doi.org/10.1186/s12888-024-06061-y
- https://meshb.nlm.nih.gov/record/ui?ui=D015525
- https://pubchem.ncbi.nlm.nih.gov/compound/5282847
- https://www.ebi.ac.uk/chebi/CHEBI:28364
- https://pubchem.ncbi.nlm.nih.gov/compound/445580
- https://www.ebi.ac.uk/chebi/CHEBI:28125
- https://meshb.nlm.nih.gov/record/ui?ui=D000095500
- `local:data/content.generated.json#/pages/metformin-intervention`
- `local:data/content.generated.json#/pages/metformin`
- `local:data/content.generated.json#/pages/multi-strain-synbiotic-schizophrenia`
- `local:data/content.generated.json#/pages/nac-autism`
- `local:data/content.generated.json#/pages/nac-supplementation`
- `local:data/content.generated.json#/pages/n-acetyl-cysteine`
- `local:data/content.generated.json#/pages/omega-3-fatty-acids`
- `local:data/content.generated.json#/pages/plant-based-diet-ckd`

Exactly one route is scientifically cleared for exactly one built-in image-generation call. The other five routes receive no call. Returned media remains review-only until native-resolution inspection, literal model and atom-center counts, connectivity and prohibited-content review, opaque outer-field and crop-safe audit, exact-hash acceptance, metadata reconciliation, and native 1200 by 630 derivative review are complete. Prompt-requested content must never be reported as observed output.

## Frozen prompt hash

The marker-bound prompt SHA-256 value will be recorded in the batch manifest after this authority packet is committed. Any prompt change requires a new authority audit and prompt freeze before generation.
