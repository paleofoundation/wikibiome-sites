# WikiBiome scientific media authority audit — clinical cautions Batch 114

Date: 2026-09-07  
Authorized parent: `7241a6bb7c69152008de7c1a9dceb730594452f9`

## Batch decision

The first clinical-cautions queue segment is `stop-antibiotics-during-chemotherapy-ovarian-cancer`, `stop-broad-spectrum-antibiotics-crohns`, `stop-broad-spectrum-antibiotics-dysbiosis`, `stop-broad-spectrum-antibiotics-long-covid`, `stop-calcium-supplementation-cadmium-exposure`, and `stop-diagnostic-overclaiming-discovery-phase`. All six fail closed as asset-free scientific-media holds. No prompt marker is frozen and no generation call is authorized.

These routes are conditional clinical judgments rather than fixed physical entities. Generic warning signs, crossed-out pills or infusions, disease anatomy used as a proxy for a treatment claim, invented product packaging, unmeasured microbiome scenes, and diagnostic-device imagery are prohibited. Such media would look precise while suppressing the indication, agent, dose, population, evidence tier, and emergency exceptions that determine whether each caution is safe.

| Route | Decision | Principal boundary |
|---|---|---|
| `stop-antibiotics-during-chemotherapy-ovarian-cancer` | Scientific-media hold | Unspecified antibiotic, infection, chemotherapy, neutropenia, dose, and timing; two `.md`-suffixed source identifiers; treatment-withholding risk. |
| `stop-broad-spectrum-antibiotics-crohns` | Scientific-media hold | Linked evidence does not establish the route's clinical antibiotic recommendation; agent, infection, Crohn phenotype, protocol, and exception scope are unresolved. |
| `stop-broad-spectrum-antibiotics-dysbiosis` | Scientific-media hold | Multiple agents, taxa, mechanisms, resistance states, microbiome compartments, and proposed alternatives cannot be collapsed into one observed ecological state. |
| `stop-broad-spectrum-antibiotics-long-covid` | Scientific-media hold | Acute-COVID antibiotic/translocation evidence is being extended to Long COVID; infection indication, agent, phenotype, protocol, and outcome are unresolved. |
| `stop-calcium-supplementation-cadmium-exposure` | Scientific-media hold | Multiple calcium compounds and products, unmeasured contamination, exposure matrices, baseline status, and conflicting conditional toxicology boundaries. |
| `stop-diagnostic-overclaiming-discovery-phase` | Scientific-media hold | The subject is evidence maturity, not a validated assay or physical entity; any diagnostic scene would imply the very validation the page says is absent. |

## Route audits

### `stop-antibiotics-during-chemotherapy-ovarian-cancer`

NLM MeSH D000900 covers anti-bacterial agents as a broad class, while D010051 covers ovarian neoplasms of multiple tissue origins. The page does not select a drug, pathogen, documented-infection indication, route, dose, duration, chemotherapy regimen, neutropenia state, or population. Its strongest safety boundary says life-threatening infection takes priority, and NCI states that infections during cancer treatment can be life-threatening and require urgent medical attention. The two local source identifiers end in `.md` and do not resolve through the canonical source lookup; the underlying records are an editorial commentary and a preclinical combination-therapy study rather than a current clinical antibiotic-withholding protocol. No physical image can represent the route without implying that an antibiotic, infusion, or treatment should be withheld.

### `stop-broad-spectrum-antibiotics-crohns`

MeSH D003424 identifies Crohn disease, but the page does not identify a particular antibacterial agent or infection. Its two linked sources concern acute arsenic toxicity in mice and ZIP8-associated colonic metal dyshomeostasis, not a controlled clinical comparison of broad-spectrum antibiotic use in Crohn disease. The content also proposes phage therapy, probiotics, prebiotics, and tributyrin without resolving exact products or protocols. A diseased bowel, bacterium, capsule, or microbiome-loss scene would make an evidence-limited mechanistic hypothesis look like a treatment instruction.

### `stop-broad-spectrum-antibiotics-dysbiosis`

MeSH D064806 defines dysbiosis as qualitative and quantitative changes in microbiota; it is not a single morphology or universally shared community state. The route spans several pathobionts and commensals, biofilms, fungal shielding, resistance cassettes, metal exposure, autoimmunity, butyrate biology, and numerous intervention alternatives. CDC stewardship guidance supports appropriate selection, dose, and duration while preserving timely treatment when antibiotics are necessary. It does not define this page's heterogeneous state as one photographable or reconstructable subject. No generic gut, pill, or depleted-community illustration is authorized.

### `stop-broad-spectrum-antibiotics-long-covid`

NLM MeSH D000094024 identifies Post-Acute COVID-19 Syndrome. The route's only linked source, however, studied antibiotic-treated acute COVID-19 patients and associated dysbiosis with microbial translocation and bacteremia. That does not select or validate a Long COVID antibiotic-avoidance protocol. Current CDC Long COVID guidance emphasizes comprehensive, symptom-directed evaluation and individualized management; documented bacterial infection remains a separate clinical indication. A lung, virus, bacterium, drug, or microbiome scene would conflate acute infection, post-acute disease, and antibiotic use.

### `stop-calcium-supplementation-cadmium-exposure`

MeSH D002136 defines dietary calcium as multiple calcium compounds in supplements or food, and NIH ODS describes common supplement forms including calcium carbonate and citrate with product-dependent dosing and absorption. MeSH D002104 identifies elemental cadmium. The page spans compounds, foods, untested products, environmental exposure, transporters, bone and renal effects, and clinical thresholds without a selected formulation or measured lot. ATSDR notes that calcium may reduce cadmium toxicity in deficient individuals but does not recommend clinical use for people with adequate intake. A calcium crystal, cadmium atom, pill, bone, kidney, or transporter scene would invent a product, contamination measurement, exposure state, or categorical treatment conclusion.

### `stop-diagnostic-overclaiming-discovery-phase`

MeSH D010190 identifies pancreatic neoplasms and D014408 identifies tumor biomarkers, but “do not overclaim” is an evidence-quality rule rather than a biological object. The route combines oral bacterial and fungal panels, Mendelian-randomization studies, and observational findings without one assay, feature set, specimen protocol, cutoff, intended-use population, or validated performance claim. NCI states that no current screening test catches pancreatic cancer early and that candidate biomarkers require further validation. A pancreas, microbe panel, vial, ROC curve, or diagnostic device would falsely imply a defined and validated test.

## Authorities and publication boundary

- https://meshb.nlm.nih.gov/record/ui?ui=D000900
- https://meshb.nlm.nih.gov/record/ui?ui=D010051
- https://www.cancer.gov/about-cancer/treatment/side-effects/infection
- https://www.cdc.gov/antibiotic-use/hcp/core-elements/index.html
- https://meshb.nlm.nih.gov/record/ui?ui=D003424
- https://meshb.nlm.nih.gov/record/ui?ui=D064806
- https://meshb.nlm.nih.gov/record/ui?ui=D000094024
- https://www.cdc.gov/long-covid/hcp/clinical-guidance/index.html
- https://meshb.nlm.nih.gov/record/ui?ui=D002136
- https://meshb.nlm.nih.gov/record/ui?ui=D002104
- https://ods.od.nih.gov/factsheets/calcium-HealthProfessional/
- https://www.atsdr.cdc.gov/toxprofiles/tp5-c3.pdf
- https://meshb.nlm.nih.gov/record/ui?ui=D010190
- https://meshb.nlm.nih.gov/record/ui?ui=D014408
- https://www.cancer.gov/types/pancreatic/research
- `local:data/content.generated.json#/pages/stop-antibiotics-during-chemotherapy-ovarian-cancer`
- `local:data/content.generated.json#/pages/stop-broad-spectrum-antibiotics-crohns`
- `local:data/content.generated.json#/pages/stop-broad-spectrum-antibiotics-dysbiosis`
- `local:data/content.generated.json#/pages/stop-broad-spectrum-antibiotics-long-covid`
- `local:data/content.generated.json#/pages/stop-calcium-supplementation-cadmium-exposure`
- `local:data/content.generated.json#/pages/stop-diagnostic-overclaiming-discovery-phase`

The complete batch receives zero built-in image-generation calls. All six routes remain uncovered and asset-free until direct evidence, clinical scope, exact agents or products, protocols, emergency exceptions, and a genuinely non-prescriptive visual subject pass a new authority audit. Interface-level caution styling is permitted; scientific primary media is not.
