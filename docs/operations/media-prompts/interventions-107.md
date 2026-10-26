# WikiBiome scientific media authority audit — interventions Batch 107

Date: 2026-09-07  
Authorized parent: `26d75d4775ce42512cd50d08becaffaae7887de4`

## Batch decision

The deterministic queue is `lactoferrin-supplementation`, `low-carbohydrate-diet-gerd`, `low-carbohydrate-diet`, `low-fat-diet`, `low-nickel-diet`, and `low-red-meat-diet`. All six routes fail closed as temporary, asset-free scientific-media holds. Five have zero linked sources. Low-Nickel Diet has 29 linked sources, but the evidence spans distinct populations, diagnoses, food lists, analytical methods, dose estimates, durations, co-interventions, and outcomes rather than one stable meal, formulation, or measured exposure state. No generic protein, food still life, plated meal, ingredient collage, molecule, organ, or symptom scene can honestly represent any complete intervention.

| Route | Decision | Principal boundary |
|---|---|---|
| `lactoferrin-supplementation` | Scientific-media hold | Select species/source, exact sequence or product, iron-loading and glycosylation state, formulation, dose, route, population, assay, and endpoint. |
| `low-carbohydrate-diet-gerd` | Scientific-media hold | Select operational diet composition, energy and carbohydrate definition, foods, duration, GERD population, comparator, adherence, reflux assay, time point, and endpoint. |
| `low-carbohydrate-diet` | Scientific-media hold | Select one PCOS diet protocol, carbohydrate amount and quality, energy balance, foods, duration, population, comparator, adherence, specimen, assay, and endpoint. |
| `low-fat-diet` | Scientific-media hold | Select one endometriosis diet protocol, total and saturated fat targets, substitutions, duration, population, comparator, adherence, specimen, assay, and endpoint. |
| `low-nickel-diet` | Scientific-media hold | Select jurisdictional food-composition dataset, analyzed foods and preparation, nickel threshold and units, menu and duration, sensitization phenotype, comparator, adherence, specimen, assay, and endpoint. |
| `low-red-meat-diet` | Scientific-media hold | Select red-meat definition, baseline and target intake, exact substitutions, food preparation, duration, endometriosis population, comparator, adherence, specimen, assay, and endpoint. |

## Route audits

### `lactoferrin-supplementation`

- Identity: NLM MeSH `D007781` identifies lactoferrin as an iron-binding protein found in milk, secretory fluids, and neutrophil granules. It does not define a supplement product.
- Local evidence: zero linked sources.
- Scope conflict: the page combines bovine or other source material, unspecified apo or iron-loaded state, molecular processing and glycosylation, oral products, a 200–400 mg/day statement, pregnancy, prematurity, inflammatory anemia, inflammatory bowel disease, pathogens, biofilms, immune effects, and clinical outcomes.
- Representation risk: a protein model would require exact species, sequence, structure, glycoform, iron occupancy, and ligand state. A capsule, powder, bottle, milk image, or tablet would invent a product and formulation.
- Required resolution: choose species and biological source, exact sequence or product specification, processing, purity, glycosylation and iron-loading state, formulation and excipients, route, dose and schedule, population, comparator, specimen, assay, time point, endpoint, and direct evidence.
- Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D007781 ; `local:data/content.generated.json#/pages/lactoferrin-supplementation`

### `low-carbohydrate-diet-gerd`

- Identity: NLM MeSH `D050528` defines carbohydrate-restricted diet only as a diet containing limited carbohydrates. The descriptor does not select a universal carbohydrate threshold, energy target, food pattern, fermentable-carbohydrate content, or GERD protocol.
- Local evidence: zero linked sources despite claims of randomized trials, meta-analysis, acid-exposure change, mechanism, and clinical benefit.
- Scope conflict: carbohydrate amount and type, energy balance, fiber, weight change, meal timing, Mediterranean pattern, duration, GERD phenotype, medication use, adherence, symptoms, and pH or impedance outcomes are not fixed.
- Representation risk: one meal or ingredient set would silently choose a protocol and could read as individualized treatment guidance; an esophagus or reflux image would depict the condition, not the intervention.
- Required resolution: select operational diet composition, energy and carbohydrate definition, exact foods or formulation, duration, GERD criteria and population, medication context, comparator, adherence measure, reflux specimen or instrument and assay, time point, endpoint, safety boundary, and direct evidence.
- Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D050528 ; `local:data/content.generated.json#/pages/low-carbohydrate-diet-gerd`

### `low-carbohydrate-diet`

- Identity: MeSH `D050528` controls a broad carbohydrate-restricted diet class. The local title narrows the route to PCOS, but the page additionally introduces GERD, multiple carbohydrate thresholds, weight-independent and weight-related effects, fiber supplements, probiotics, and several hormonal and inflammatory outcomes.
- Local evidence: zero linked sources.
- Representation risk: a food still life cannot encode energy balance, carbohydrate quality, PCOS population, adherence, duration, metabolic measurements, or clinical outcome. It would imply a preferred menu unsupported by the page record.
- Required resolution: select one PCOS diet protocol, carbohydrate amount and quality, energy balance, exact foods or formulation, duration, diagnostic and demographic population, comparator, adherence measure, specimen, assay, time point, endpoint, safety boundary, and direct evidence.
- Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D050528 ; `local:data/content.generated.json#/pages/low-carbohydrate-diet`

### `low-fat-diet`

- Identity: NLM MeSH `D018752` defines fat-restricted diet as less than 30% of calories from all fat and less than 10% from saturated fat, historically in a hyperlipidemia context. That controlled identity does not validate the local endometriosis-specific protocol or claims.
- Local evidence: zero linked sources.
- Scope conflict: total fat, saturated and trans fat, arachidonic acid, omega-3 substitution, energy balance, weight change, bile acids, estrogens, prostaglandins, microbiota, symptoms, duration, and supplementation are combined.
- Representation risk: a plated low-fat meal would invent food composition and substitutions; pelvic anatomy or lesions would depict a condition and could imply treatment efficacy.
- Required resolution: select one endometriosis diet protocol, total and saturated fat targets, exact foods and substitutions, energy balance, duration, population, comparator, adherence measure, specimen, assay, time point, endpoint, nutrient-safety boundary, and direct evidence.
- Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D018752 ; `local:data/content.generated.json#/pages/low-fat-diet`

### `low-nickel-diet`

- Identity: NLM MeSH `D009532` identifies elemental nickel, not a low-nickel dietary protocol. The route has no single controlled diet identifier.
- Local evidence: 29 linked sources, spanning dietary nickel analysis, dermatitis, systemic nickel allergy syndrome, nickel allergic contact mucositis, oral challenge, gastroesophageal reflux, irritable bowel syndrome, celiac disease, endometriosis, metabolic conditions, probiotics, disulfiram, and mechanistic claims.
- Scope conflict: the page combines estimated intake thresholds, multiple food lists and scoring systems, geographically and analytically variable food nickel measurements, cooking and storage effects, differing sensitization phenotypes, challenges, co-interventions, durations, and outcomes. A single menu is not universally low nickel.
- Representation risk: displaying selected “allowed” and “restricted” foods would function as prescriptive clinical guidance, may conflict across food-composition datasets, and cannot encode preparation or measured nickel content. Reusing the reviewed elemental nickel specimen would depict the analyte, not dietary restriction.
- Required resolution: choose jurisdiction and current food-composition dataset, analytical method and reporting units, exact foods, cultivars or brands and preparation/storage, intake threshold, complete menu and duration, diagnostic and sensitization phenotype, comparator, adherence measure, specimen, assay, time point, endpoint, contraindications, and evidence tier.
- Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D009532 ; `local:data/content.generated.json#/pages/low-nickel-diet`

### `low-red-meat-diet`

- Identity: MeSH `D000069466` defines red meat as beef, goat, pork, or lamb containing more myoglobin than poultry or seafood. It does not define a low-red-meat dietary intervention, substitution pattern, or endometriosis protocol.
- Local evidence: zero linked sources despite cohort-risk, substitution, heme, arachidonic-acid, estrogen, microbiome, and clinical statements.
- Scope conflict: baseline and target servings, processed versus unprocessed meat, animal species, cut, preparation, fat and heme content, exact replacement foods, energy balance, duration, endometriosis criteria, symptoms, biomarkers, and outcomes are not fixed.
- Representation risk: one meat portion, crossed-out food, or replacement meal would prescribe an invented protocol and collapse exposure, substitution, and disease outcome into a causal visual.
- Required resolution: choose red-meat definition, baseline and target intake, exact species/cuts and preparation, processed-meat boundary, substitutions and nutrient equivalence, energy balance, duration, endometriosis population, comparator, adherence measure, specimen, assay, time point, endpoint, and direct evidence.
- Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D000069466 ; `local:data/content.generated.json#/pages/low-red-meat-diet`

## Hold boundary

No text in this packet is a generation prompt. No `PROMPT ... START/END` marker is present. The six routes receive zero built-in image-generation calls and remain without public media ownership, master, derivative, endpoint, Schema.org `ImageObject`, social image, or image-sitemap entry. A route may re-enter the queue only after the named scientific and intervention state is selected and a new independent authority audit clears a narrow, non-prescriptive representation.
