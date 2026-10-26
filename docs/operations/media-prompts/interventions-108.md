# WikiBiome scientific media authority audit and prompt — interventions Batch 108

Date: 2026-09-07  
Authorized parent: `920ce932832e16029c065e42b88dbdbeb8fe01c0`

## Batch decision

The deterministic queue is `magnesium-supplementation`, `mediterranean-diet-fibromyalgia`, `mediterranean-diet-gerd`, `mediterranean-diet-ovarian-cancer`, `mediterranean-diet-t1d`, and `melatonin`. Only melatonin has one exact, source-independent physical identity that can be shown without inventing a treatment protocol or result. It is cleared for exactly one review-only chemical-identity call. The five supplement or diet-protocol routes fail closed as asset-free scientific-media holds.

| Route | Decision | Principal boundary |
|---|---|---|
| `magnesium-supplementation` | Scientific-media hold | Zero sources; elemental magnesium, magnesium deficiency, multiple salts, formulations, doses, specimens, assays, and fibromyalgia outcomes are conflated. |
| `mediterranean-diet-fibromyalgia` | Scientific-media hold | Zero sources and no operational diet score, menu, preparation, duration, population, comparator, adherence measure, or endpoint. |
| `mediterranean-diet-gerd` | Scientific-media hold | Zero sources and no operational diet score, menu, preparation, duration, GERD phenotype, medication context, comparator, assay, or endpoint. |
| `mediterranean-diet-ovarian-cancer` | Scientific-media hold | Two sources describe a human AMED adherence score and a separate mouse dietary-fat experiment, not one physical diet or intervention state. |
| `mediterranean-diet-t1d` | Scientific-media hold | Zero sources and no operational diet score, menu, carbohydrate/insulin protocol, population, comparator, adherence measure, assay, or endpoint. |
| `melatonin` | One immutable generation call | Exact neutral melatonin only: PubChem CID 896, ChEBI 16796, MeSH D008550, formula C13H16N2O2, net charge 0, and 17 heavy atoms. |

## Route audits

### `magnesium-supplementation`

NLM MeSH D008274 identifies elemental magnesium, while D019587 defines dietary supplements as oral products and directs indexing toward the specific nutrient. Neither identifier selects a supplement salt, elemental-magnesium content, hydration state, product, formulation, excipients, dose, route, or measured biological state. The local route has zero linked sources while combining citrate, glycinate and oxide, 300–600 mg/day statements, serum and red-cell assays, NMDA and calcium-channel mechanisms, ATP, sleep, fibromyalgia symptoms, bioavailability, and gastrointestinal tolerance. Elemental magnesium, a capsule, powder, bottle, ion, receptor, muscle, or pain scene would each represent a different claim and could function as unsupported treatment guidance. The route remains asset-free until one chemical form and product state, elemental dose, formulation, route, population, comparator, specimen, assay, time point, endpoint, and direct evidence are selected.

### `mediterranean-diet-fibromyalgia`

MeSH D038441 defines a broad Mediterranean dietary pattern, not a single plate, menu, adherence score, or fibromyalgia intervention. The local route has zero linked sources despite an RCT claim and does not specify its operational score, exact foods and quantities, preparation, energy balance, duration, population, comparator, adherence, specimen, assay, or endpoint. A food still life would silently choose a menu and imply treatment guidance. The route remains asset-free until one directly sourced protocol and measured state are selected.

### `mediterranean-diet-gerd`

MeSH D038441 defines a dietary pattern but not one GERD protocol. The local route has zero linked sources despite an odds-ratio claim and combines fiber, nitrite, antioxidants, melatonin-rich foods, lower-esophageal-sphincter tone, symptoms, and comparison with proton-pump inhibitors without fixing a score, menu, preparation, duration, GERD phenotype, medication context, comparator, adherence measure, reflux assay, or endpoint. A meal or esophagus image would conflate intervention and condition. The route remains asset-free until one directly sourced protocol and measured state are selected.

### `mediterranean-diet-ovarian-cancer`

MeSH D038441 identifies the broad dietary pattern. The two local sources do not define one reproducible physical intervention: Chen et al. reports pre- and post-diagnosis Alternate Mediterranean Diet adherence in a prospective human cohort, while AlHilli et al. compares dietary-fat conditions in a mouse ovarian-cancer model. The page then combines survival, diet trajectory, microbial diversity, short-chain fatty acids, inflammation, polyamines, iron and copper chelation, counseling, and disease-treatment implications. A food composition, plate, score graphic, mouse, ovary, tumour, or survival scene would collapse distinct designs and imply causal or clinical guidance. The route remains asset-free until one study-specific diet definition, scoring system or complete formulation, species/population, comparator, duration, adherence/exposure measure, specimen, assay, time point, endpoint, and claim boundary are selected.

### `mediterranean-diet-t1d`

MeSH D038441 does not define one type 1 diabetes meal plan. The local route has zero linked sources despite cohort claims and combines dietary adherence, carbohydrate counting, insulin dosing, glycemic control, cardiovascular markers, microbial taxa, butyrate, regulatory T cells, and proposed probiotic combination. A meal or pancreas image would invent the missing protocol and could be read as individualized diabetes guidance. The route remains asset-free until one directly sourced diet score or menu, carbohydrate and insulin context, duration, population, comparator, adherence measure, specimen, assay, time point, endpoint, and safety boundary are selected.

### `melatonin`

PubChem CID 896, ChEBI 16796, and MeSH D008550 agree on melatonin, with formula `C13H16N2O2`, net charge zero, InChIKey `DRLFMBDRBRZALE-UHFFFAOYSA-N`, and connectivity SMILES `CC(=O)NCCC1=CNC2=C1C=C(C=C2)OC`. The molecule has 17 heavy atoms: 13 carbon, 2 nitrogen, and 2 oxygen centers. The eight local sources mention melatonin across heterogeneous toxicology, neurological, cardiometabolic, microbiome, or intervention contexts, while the article itself has no populated evidence triangle. Exactly one label-free heavy-atom identity model is eligible. It must not depict a supplement product, dose, pineal gland, brain, sleep, circadian timing, antioxidant action, receptor binding, disease, efficacy, safety, recommendation, or any source-specific finding.

<!-- PROMPT melatonin START -->
```text
Use case: scientific-educational. Asset type: review-only WikiBiome chemical-identity reconstruction for neutral melatonin, PubChem CID 896, ChEBI 16796, and MeSH D008550. Create exactly one isolated complete heavy-atom ball-and-stick teaching model containing exactly seventeen spheres total: exactly thirteen matte-graphite carbon spheres, exactly two muted-blue nitrogen spheres, and exactly two muted-rose oxygen spheres; hydrogens are intentionally omitted and net charge is zero. Preserve the single connected constitutional graph encoded by connectivity SMILES CC(=O)NCCC1=CNC2=C1C=C(C=C2)OC: one fused indole system with eight carbon centers and one ring nitrogen center; at the 3-position, one two-carbon ethyl chain connects the ring to the second nitrogen, which connects to one carbonyl carbon bearing one oxygen and one terminal methyl carbon; at the 5-position, one oxygen connects the ring to one terminal methyl carbon. Show the complete graph in a shallow, nearly planar oblique orientation with all seventeen centers and every required connector visibly separated enough for native count and connectivity review. No overlapping center may conceal another center or required adjacency. No extra atom, detached fragment, duplicate model, aromatic-circle glyph, hydrogen sphere, pineal gland, brain, clock, moon, stars, capsule, tablet, bottle, food, plant, organ, cell, receptor, or reaction partner. Treat the object only as neutral melatonin chemical identity. Do not depict or imply a measured conformer, crystal packing, tautomeric population, purity, formulation, dose, bioavailability, metabolism, receptor activity, sleep effect, circadian timing, antioxidant action, microbiome change, disease treatment, efficacy, safety, recommendation, or diagnosis. Landscape 3:2 at 1536 by 1024; center the complete model within generous uninterrupted pale space and keep every center and connector inside broad crop-safe margins suitable for a centered 1200 by 630 contain derivative. Use a uniform high-key cool pale blue-white background approximately #f3f7fb, restrained matte graphite, muted blue, muted rose, and silver-gray materials, technically precise physical molecular-model finish, soft clinical studio illumination, and minimal scene-making. No text, labels, letters, numbers, atom symbols, charge glyphs, arrows, legend, chart, decorative particles, glow, haze, vignette, border, clipping, signature, or watermark. Educational trained-algorithmic reconstruction only; not a source structure image, crystallographic conformer, assay result, supplement endorsement, treatment recommendation, or diagnostic image.
```
<!-- PROMPT melatonin END -->

## Authorities and publication boundary

- https://meshb.nlm.nih.gov/record/ui?ui=D008274
- https://meshb.nlm.nih.gov/record/ui?ui=D019587
- https://meshb.nlm.nih.gov/record/ui?ui=D038441
- https://meshb.nlm.nih.gov/record/ui?ui=D008550
- https://pubchem.ncbi.nlm.nih.gov/compound/896
- https://www.ebi.ac.uk/chebi/CHEBI:16796
- https://doi.org/10.1186/s12967-024-05653-2
- https://doi.org/10.1186/s13048-025-01731-1
- `local:data/content.generated.json#/pages/magnesium-supplementation`
- `local:data/content.generated.json#/pages/mediterranean-diet-fibromyalgia`
- `local:data/content.generated.json#/pages/mediterranean-diet-gerd`
- `local:data/content.generated.json#/pages/mediterranean-diet-ovarian-cancer`
- `local:data/content.generated.json#/pages/mediterranean-diet-t1d`
- `local:data/content.generated.json#/pages/melatonin`

Exactly one route is scientifically cleared for exactly one built-in image-generation call. The other five routes receive no call. Returned media remains review-only until native-resolution inspection, literal atom-center/connectivity and prohibited-content review, outer-field and crop-safe audit, exact-hash acceptance, metadata reconciliation, and native 1200 by 630 derivative review are complete. Prompt-requested content must never be reported as observed output.

## Frozen prompt hash

The marker-bound prompt SHA-256 value is recorded in the batch manifest. Any prompt change requires a new authority audit and prompt freeze before generation.
