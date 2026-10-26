# WikiBiome scientific media authority audit — clinical cautions Batch 115

Date: 2026-09-07  
Authorized parent: `39c7ecaa161d92432c317a07cf018f475283bb26`

## Batch decision

The second clinical-cautions queue segment is `stop-formula-feeding-without-supplementation-nec`, `stop-high-protein-keto-diet-ckd`, `stop-iodine-supplementation-graves`, `stop-iodine-supplementation-hashimotos`, `stop-iron-supplementation-ibd`, and `stop-iron-supplementation-alzheimers`. All six fail closed as asset-free scientific-media holds. No prompt marker is frozen and no generation call is authorized.

These routes are conditional clinical decisions, not stable physical entities. Generic warning signs, crossed-out bottles, foods, supplements or infusions, disease anatomy used as a proxy for treatment evidence, elemental-metal media substituted for a clinical product, and invented protocol imagery are prohibited. Such images would conceal the formulation, dose, baseline status, disease state, population, evidence tier, and exceptions that determine whether a caution is accurate and safe.

| Route | Decision | Principal boundary |
|---|---|---|
| `stop-formula-feeding-without-supplementation-nec` | Scientific-media hold | Zero linked sources; gestational age, birth weight, milk availability, formula, fortifier, probiotic, feeding protocol, growth needs, and NEC outcomes are unresolved. |
| `stop-high-protein-keto-diet-ckd` | Scientific-media hold | Ketogenic and high-protein low-carbohydrate diets are conflated; composition, CKD stage, dialysis status, nutritional state, protocol, and outcomes are unresolved. |
| `stop-iodine-supplementation-graves` | Scientific-media hold | Iodine form, product, dose, deficiency status, pregnancy, Graves state, concurrent therapy, monitoring, and outcomes are unresolved. |
| `stop-iodine-supplementation-hashimotos` | Scientific-media hold | Iodine form, product, dose, dietary exposure, deficiency status, thyroid state, pregnancy, concurrent therapy, and outcomes are unresolved. |
| `stop-iron-supplementation-ibd` | Scientific-media hold | Oral versus intravenous route, formulation, elemental dose, iron-deficiency/anemia status, IBD activity, absorption, bleeding, monitoring, and outcomes are unresolved. |
| `stop-iron-supplementation-alzheimers` | Scientific-media hold | Linked evidence is mechanistic/associative; formulation, deficiency or overload status, biomarkers, disease stage, clinical trial, monitoring, and outcomes are unresolved. |

## Route audits

### `stop-formula-feeding-without-supplementation-nec`

NLM MeSH D041943 identifies infant formula and D020345 identifies necrotizing enterocolitis, but the page has zero resolved source records and does not define a neonatal feeding protocol. The 2026 American Academy of Pediatrics clinical report associates human milk with lower NEC risk in very-low-birth-weight infants while also describing conditional transitions to preterm formula and the nutritional role of multinutrient fortification. The route does not resolve gestational age, birth weight, maternal or donor milk availability, preterm formula, human-milk fortifier, probiotic, timing, volume, growth, or NEC ascertainment. A bottle, breast, infant, bowel, formula powder, supplement, or prohibition sign would imply a universal feeding direction that the evidence does not support.

### `stop-high-protein-keto-diet-ckd`

NLM treats ketogenic diet (D055423) and high-protein low-carbohydrate diet (D000076107) as distinct concepts. The route combines them without exact macronutrient or energy composition. MeSH D051436 spans five chronic-kidney-disease stages, while NIDDK guidance individualizes protein intake and notes that people receiving dialysis may need more protein. The page does not resolve CKD stage, albuminuria, dialysis, diabetes, nutritional status, weight-loss intent, duration, population, comparator, or outcomes. Kidney anatomy, ketones, meat, a food plate, or a crossed-out meal would collapse incompatible diets and patient states into a universal instruction.

### `stop-iodine-supplementation-graves`

MeSH D006111 identifies Graves disease. NIH Office of Dietary Supplements guidance distinguishes iodine as an essential nutrient from excess exposure and notes that adverse responses vary, including among people with autoimmune thyroid disease and iodine deficiency. The page does not select an iodine compound, product, elemental dose, baseline iodine status, pregnancy state, thyroid function, antithyroid medication, radioiodine context, monitoring, or outcome. Thyroid, salt, seaweed, crystal, pill, or prohibition imagery would transform conditional risk into categorical advice and would not represent the intervention itself.

### `stop-iodine-supplementation-hashimotos`

MeSH D050031 identifies Hashimoto disease, while iodine exposure remains a family of dietary sources, compounds, products, and doses. The route does not define baseline iodine deficiency, dietary intake, supplement form, elemental dose, pregnancy, thyroid function, autoantibodies, levothyroxine use, population, monitoring, or outcome. The NIH evidence boundary is susceptibility-dependent rather than a universal visual state. A thyroid, salt, seaweed, tablet, or crossed-out supplement would be prescriptive and would duplicate disease-level anatomy without supplying product or protocol evidence.

### `stop-iron-supplementation-ibd`

MeSH D019266 covers iron and iron compounds in food and supplements, D015212 covers inflammatory bowel diseases, and D000090463 identifies iron deficiency. These do not resolve oral versus intravenous therapy, ferrous versus ferric formulation, elemental dose, absorption, tolerance, bleeding, inflammation, deficiency, or anemia. The 2024 American Gastroenterological Association clinical practice update recommends determining the cause of iron-deficiency anemia, treating active inflammation, and selecting intravenous iron when active IBD compromises absorption; it does not support a categorical STOP. A bowel, tablet, infusion, blood cell, iron atom, or prohibition scene could imply withholding needed repletion. The existing reviewed elemental Iron image is not a supplement product and is ineligible as a proxy.

### `stop-iron-supplementation-alzheimers`

MeSH D000544 identifies Alzheimer disease, while D019266 covers a broad family of dietary and supplement iron compounds. The route's four linked records describe metal associations or mechanisms rather than a controlled clinical supplementation trial. It does not define systemic deficiency, iron-deficiency anemia, overload, brain iron measurement, supplement compound, route, elemental dose, Alzheimer stage, comorbidities, population, comparator, monitoring, cognition, or safety outcomes. A brain, plaque, iron atom, pill, infusion, or crossed-out product would visually turn associative evidence into treatment advice. The already reviewed Alzheimer disease and elemental Iron assets cannot be composited as evidence of the route's recommendation.

## Authorities and publication boundary

- https://meshb.nlm.nih.gov/record/ui?ui=D041943
- https://meshb.nlm.nih.gov/record/ui?ui=D020345
- https://publications.aap.org/pediatrics/article/157/2/e2025073625/206082/Promoting-Human-Milk-and-Breastfeeding-for-the
- https://meshb.nlm.nih.gov/record/ui?ui=D051436
- https://meshb.nlm.nih.gov/record/ui?ui=D055423
- https://meshb.nlm.nih.gov/record/ui?ui=D000076107
- https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/healthy-eating-adults-chronic-kidney-disease
- https://meshb.nlm.nih.gov/record/ui?ui=D006111
- https://meshb.nlm.nih.gov/record/ui?ui=D050031
- https://ods.od.nih.gov/factsheets/Iodine-HealthProfessional/
- https://meshb.nlm.nih.gov/record/ui?ui=D019266
- https://meshb.nlm.nih.gov/record/ui?ui=D015212
- https://meshb.nlm.nih.gov/record/ui?ui=D000090463
- https://gastro.org/clinical-guidance/management-of-iron-deficiency-anemia/
- https://doi.org/10.1016/j.cgh.2024.03.046
- https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/
- https://meshb.nlm.nih.gov/record/ui?ui=D000544
- `local:data/content.generated.json#/pages/stop-formula-feeding-without-supplementation-nec`
- `local:data/content.generated.json#/pages/stop-high-protein-keto-diet-ckd`
- `local:data/content.generated.json#/pages/stop-iodine-supplementation-graves`
- `local:data/content.generated.json#/pages/stop-iodine-supplementation-hashimotos`
- `local:data/content.generated.json#/pages/stop-iron-supplementation-ibd`
- `local:data/content.generated.json#/pages/stop-iron-supplementation-alzheimers`

The complete batch receives zero built-in image-generation calls. All six routes remain uncovered and asset-free until direct evidence, exact products and formulations, protocols, patient states, monitoring, exceptions, and a genuinely non-prescriptive visual subject pass a new authority audit. Interface-level caution styling is permitted; scientific primary media is not.
