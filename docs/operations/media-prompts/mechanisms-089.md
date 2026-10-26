# WikiBiome scientific media authority audit — mechanisms Batch 089

Date: 2026-09-07

Authorized parent: `ed97215fa6538711a62dc6c81168735f5b199f32`

Routes: `postbiotic`, `prebiotics`, `premenstrual-syndrome`, `prenatal-metal-exposure`, `preterm-birth`, `probiotics`

## Gate outcome

All six routes fail the pre-generation scientific-identity gate. No immutable generation prompt is authorized, no built-in image-generation call is made, and no raster is created. Each route currently combines multiple products, molecules, organisms, exposures, clinical phenotypes, or evidence tiers in a way that one primary image would falsely stabilize as a single observed entity or causal mechanism.

## Route audits

### `postbiotic`

The consensus definition requires a preparation containing inanimate microorganisms and/or their components with demonstrated host benefit. The current page also labels cell-free supernatants and purified metabolites as postbiotics without requiring retained cells/components or product-specific benefit, then assigns class-wide safety, stability, dosing, immune, antimicrobial, and barrier properties. Split by exact preparation: source strain, inactivation method, retained cellular material, metabolites, composition, dose, target host, comparator, endpoint, safety, and evidence. A metabolite-only product must not inherit the postbiotic label without an independently justified terminology record.

Authorities: https://pubmed.ncbi.nlm.nih.gov/33948025/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC10807003/ ; local:data/content.generated.json#/pages/postbiotic

### `prebiotics`

The consensus category requires a defined substrate, selective utilization by host microorganisms, and a demonstrated health benefit. The page treats broad fibres, resistant starches, oligosaccharides, and polyphenols as interchangeable; generalizes taxa and short-chain-fatty-acid directions; and mixes food occurrence, cross-feeding, branded products, disease claims, and synbiotic evidence. Split by chemically defined substrate, matrix and dose, target host/site, utilizing organism and pathway, assay, comparator, health endpoint, and certainty.

Authorities: https://pubmed.ncbi.nlm.nih.gov/28611480/ ; https://www.nature.com/articles/nrgastro.2017.75 ; local:data/content.generated.json#/pages/prebiotics

### `premenstrual-syndrome`

PMS is a prospectively characterized cyclical clinical syndrome, not a single microbiome mechanism. The page mixes PMS and PMDD, prevalence and diagnostic claims, smoking, cadmium, magnesium, estrogen metabolism, serotonin, inflammation, individual taxa, probiotics, and essential-fatty-acid intervention evidence while wording emerging associations as causal pathways. Rebuild around diagnostic criteria and prospective symptom timing, explicitly separate PMS from PMDD, then divide epidemiology, candidate mechanisms, observational microbiome evidence, exposures, and interventions by population, cycle phase, specimen, assay, comparator, endpoint, and evidence tier.

Authorities: https://www.acog.org/womens-health/faqs/premenstrual-syndrome ; https://pubmed.ncbi.nlm.nih.gov/37973069/ ; https://pubmed.ncbi.nlm.nih.gov/36948390/ ; https://pubmed.ncbi.nlm.nih.gov/35622782/ ; local:data/content.generated.json#/pages/premenstrual-syndrome

### `prenatal-metal-exposure`

The route merges essential and toxic elements, chemical species, maternal matrices, placental transfer and retention, fetal dose, gestational windows, epigenetic findings, microbiome associations, neurodevelopment, and intervention implications. It also states unverified direct selection of fetal-gut pioneer organisms through swallowed metal-bearing amniotic fluid and presents broad element-specific methylation and colonization claims without exposure measure, cohort, or causal tier. Split by exact element/species and exposure source, maternal/placental/cord matrix, gestational timing, transfer metric, dose and units, fetal or placental endpoint, cohort/model, assay, confounders, and evidence certainty.

Authorities: https://pubmed.ncbi.nlm.nih.gov/22717874/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3491942/ ; https://pubmed.ncbi.nlm.nih.gov/39863768/ ; local:data/content.generated.json#/pages/prenatal-metal-exposure

### `preterm-birth`

Preterm birth is a heterogeneous outcome before 37 completed weeks, including spontaneous and medically indicated pathways with distinct gestational subgroups. The page reduces risk to a vaginal-community sequence, combines associations with ascending infection and chorioamnionitis as a universal chain, then mixes neonatal colonization, bronchopulmonary dysplasia, formula nickel, necrotizing enterocolitis, trace elements, and statin prevention. Rebuild by phenotype and gestational age, distinguish association from prediction and causation, and define population, sampling time/site, community-state method, exposure/intervention, comparator, outcome, and evidence tier.

Authorities: https://www.cdc.gov/maternal-infant-health/preterm-birth/index.html ; https://pmc.ncbi.nlm.nih.gov/articles/PMC9106729/ ; https://pubmed.ncbi.nlm.nih.gov/39863768/ ; local:data/content.generated.json#/pages/preterm-birth

### `probiotics`

The consensus term requires live, defined microorganisms administered at an adequate amount with demonstrated host benefit; many effects are strain-, product-, dose-, population-, and endpoint-specific. The page generalizes metal binding, detoxification, antioxidant activity, barrier effects, immune effects, disease treatment, safety, and engineered strains across a class, while mixing mouse experiments, combination products, reviews, human trials, and speculative double-edged effects. Split into exact strain/product records with current taxonomy, strain identifier and genome where available, viable dose through shelf life, formulation, route, population/model, comparator, endpoint, safety, and evidence tier; do not extrapolate one strain's result to a genus or class.

Authorities: https://pubmed.ncbi.nlm.nih.gov/24912386/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC7925329/ ; local:data/content.generated.json#/pages/probiotics

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
