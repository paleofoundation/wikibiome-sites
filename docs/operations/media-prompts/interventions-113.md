# WikiBiome scientific media authority audit — interventions Batch 113

Date: 2026-09-07  
Authorized parent: `9cbda24b0a503846a3129c902f8a9bf006222086`

## Batch decision

The final intervention queue segment is `vitamin-d-supplementation`, `zinc-supplementation`, and `zinc-supplementation-autism`. All three fail closed as asset-free scientific-media holds. No prompt marker is frozen and no generation call is authorized.

| Route | Decision | Principal boundary |
|---|---|---|
| `vitamin-d-supplementation` | Scientific-media hold | Zero sources; the broad Vitamin D topic includes D2 and D3 while the page mixes cholecalciferol protocols, multiple conditions, doses, biomarkers, safety thresholds, and claims without linked evidence. |
| `zinc-supplementation` | Scientific-media hold | Zero sources; the page combines elemental zinc with sulfate, gluconate, picolinate, bisglycinate, multiple doses and populations, and safety-critical copper guidance. |
| `zinc-supplementation-autism` | Scientific-media hold | Zero-source condition-specific duplicate of the broader supplementation route; compound, product, dose, population, endpoint, safety, evidence, and non-stigmatizing representation are unresolved. |

## Route audits

### `vitamin-d-supplementation`

NLM MeSH D014807 defines Vitamin D as a class including both cholecalciferols and ergocalciferols. PubChem CID 5280795 identifies cholecalciferol specifically, but the WikiBiome route title remains class-wide while its page asserts multiple disease-specific doses, serum targets, mechanisms, monitoring rules, toxicity thresholds, and combination protocols without a single linked source. Although the body says D3 is preferred, selecting a neutral cholecalciferol molecule would silently narrow the canonical topic and would not represent its formulations, dose regimens, or clinical claims. A bottle, capsule, sun, organ, receptor, or disease montage would invent a product or imply efficacy.

### `zinc-supplementation`

The exact elemental Zinc entity already owns reviewed metal media on `/article/zinc`; elemental zinc does not identify a supplement. NIH Office of Dietary Supplements notes that supplements use multiple zinc forms, including sulfate, acetate, and gluconate, without establishing one form as universally superior. The WikiBiome page additionally names picolinate, bisglycinate, and oxide, multiple doses and populations, copper co-supplementation, biomarkers, contraindications, and interactions, yet links zero sources. An elemental atom, salt crystal, tablet, bottle, food, enzyme, or clinical scene would either duplicate the canonical metal asset or invent a chemical/product/protocol state.

### `zinc-supplementation-autism`

This zero-source route is a condition-specific derivative of the broader zero-source Zinc Supplementation page. It does not select a zinc compound, elemental-zinc content, product, formulation, dose, schedule, baseline deficiency definition, pediatric population, autism phenotype, comparator, adherence, specimen, assay, endpoint, adverse-event boundary, or direct evidence. A child, brain, behavioral symbol, gut, metal-displacement diagram, supplement container, or molecular scene would be stigmatizing, mechanistically overconfident, product-inventing, or duplicative of the reviewed elemental Zinc media.

## Authorities and publication boundary

- https://meshb.nlm.nih.gov/record/ui?ui=D014807
- https://pubchem.ncbi.nlm.nih.gov/compound/5280795
- https://meshb.nlm.nih.gov/record/ui?ui=D019587
- https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/
- `local:data/content.generated.json#/pages/vitamin-d-supplementation`
- `local:data/content.generated.json#/pages/zinc-supplementation`
- `local:data/content.generated.json#/pages/zinc-supplementation-autism`
- `local:data/content.generated.json#/pages/zinc`

The complete batch receives zero built-in image-generation calls. All three routes remain uncovered and asset-free until source-backed identities, protocols, safety boundaries, canonical ownership, and a non-prescriptive or non-stigmatizing representation pass a new authority audit. Decorative stand-ins, generic pills, and reuse of elemental Zinc media are prohibited.
