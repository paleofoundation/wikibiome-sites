# WikiBiome scientific media authority audit — mechanisms Batch 088

Date: 2026-09-07  
Authorized parent: `9d2fe7a944f1ee1e1f854291240d17f6f41fe6f1`

## Batch decision

The deterministic queue is `phenylalanine`, `phosphodiesterase`, `plant-metal-hyperaccumulation`, `polyamines`, `polyphenols`, and `polyunsaturated-fatty-acids`. All six routes fail closed as temporary asset-free scientific-media holds. They combine chemically distinct molecules, enzyme families, organisms, compartments, exposures, or disease claims, and several central statements are incorrect or overgeneralized. No marked generation prompt exists, and the built-in generator receives zero calls.

| Route | Controlled identity | Decision and boundary |
|---|---|---|
| `phenylalanine` | L-phenylalanine; MeSH `D010663` | Hold: host amino-acid metabolism, microbial phenylacetate/PAGln, tyrosine-derived p-cresol, other metabolites, diseases, and interventions are conflated; PAH is wrongly called rate-limiting for catecholamine synthesis. |
| `phosphodiesterase` | multi-superfamily enzyme umbrella | Hold: a four-link stub merges human PDE5/cGMP pharmacology with bacterial cyclic-di-GMP enzymes and unspecified zinc/metal sensing. |
| `plant-metal-hyperaccumulation` | species- and element-specific botanical phenotype | Hold: true natural hyperaccumulators, chelate-assisted phytoextraction, ordinary crop accumulation, BCF, food exposure, microbiomes, and remediation are conflated with alarmist generalizations. |
| `polyamines` | putrescine/spermidine/spermine/cadaverine and related pathways | Hold: distinct host, dietary, microbial, cellular, cancer, immune, and experimental-model processes are treated as one dose-independent class effect. |
| `polyphenols` | broad, structurally diverse chemical umbrella | Hold: thousands of compounds, foods, metabolites, metabotypes, chelation conditions, organisms, doses, and preclinical/clinical outcomes are presented as universal properties. |
| `polyunsaturated-fatty-acids` | omega-3/omega-6 families and individual fatty acids | Hold: a sparse page treats EPA, DHA, linoleic and arachidonic acids as one mechanism and assigns universal microbiome and inflammatory directions. |

## Route audits

### `phenylalanine`

The page correctly places phenylalanine upstream of tyrosine but incorrectly calls phenylalanine hydroxylase the rate-limiting step of catecholamine synthesis; tyrosine hydroxylase catalyzes that step. It also collapses microbial phenylalanine-to-phenylacetate followed by host PAGln formation with tyrosine-derived p-cresol, phenol, 4-EPS, levodopa interactions, Mendelian-randomization associations, metabolomics, and metal hypotheses. Rebuild into exact host and microbial reactions with analyte identifiers, enzymes/genes, organism, compartment, substrate/product, assay, cohort, causal tier, and clinical endpoint.

Authorities: https://pubmed.ncbi.nlm.nih.gov/17513421/ ; https://pubmed.ncbi.nlm.nih.gov/32142679/ ; https://pubmed.ncbi.nlm.nih.gov/38124458/ ; local:data/content.generated.json#/pages/phenylalanine

### `phosphodiesterase`

The route contains no structural or mechanistic article—only cross-references. “Phosphodiesterase” covers unrelated enzyme families acting on different phosphodiester substrates. Human PDE5 hydrolyses cGMP and is targeted by sildenafil/tadalafil; bacterial EAL and HD-GYP proteins hydrolyse cyclic di-GMP and have distinct folds, cofactors, regulation, and phenotypes. “Zinc cofactor for bacterial phosphodiesterases” is not a sufficient or universal identity. Split by exact enzyme/protein, organism, substrate/product, catalytic family, metal/cofactor, structure, assay, inhibitor, and phenotype before any image.

Authorities: local:data/content.generated.json#/pages/phosphodiesterase

### `plant-metal-hyperaccumulation`

Hyperaccumulation is an element- and species-specific phenotype demonstrated in above-ground tissue under natural conditions without toxicity. The page mixes recognized hyperaccumulators with chelate-assisted *Brassica juncea*, ordinary food crops, generic soil uptake, BCF, phytoremediation, and dietary-risk claims. BCF above one is not by itself proof of botanical hyperaccumulation or hazardous dietary delivery, and root contact does not imply maximal uptake of all metals. Rebuild by accepted taxon, current name, element/species, natural soil context, tissue/dry-weight threshold, voucher/locality, uptake and translocation factors, analytical method, tolerance phenotype, and food/remediation status.

Authorities: https://pubmed.ncbi.nlm.nih.gov/24938121/ ; https://pubmed.ncbi.nlm.nih.gov/33219524/ ; https://pubmed.ncbi.nlm.nih.gov/40772044/ ; local:data/content.generated.json#/pages/plant-metal-hyperaccumulation

### `polyamines`

Putrescine, spermidine, spermine, and cadaverine differ in structures, biosynthetic routes, producers, transport, catabolism, concentrations, and functions. The page merges host, dietary, microbial, tumor, cardiovascular, immune, and EAE evidence and calls PLP indirectly zinc-dependent without a defined pathway. It generalizes animal or cell findings into health effects and supplementation questions without dose, compartment, analyte, or trial boundaries. Rebuild one polyamine/pathway at a time with source, organism/cell, enzymes, substrate/product, concentration, sample, assay, exposure, outcome, and evidence tier.

Authorities: https://pubmed.ncbi.nlm.nih.gov/31355206/ ; https://pubmed.ncbi.nlm.nih.gov/30923709/ ; https://pubmed.ncbi.nlm.nih.gov/40234982/ ; local:data/content.generated.json#/pages/polyamines

### `polyphenols`

Polyphenols are a highly diverse chemical umbrella whose absorption, microbial conversion, conjugation, circulating metabolites, and effects vary by compound, dose, food matrix, organism, and metabotype. The page assigns universal 5–10% absorption, 90–95% colonic delivery, metal-chelation percentages, prebiotic/antimicrobial effects, barrier action, and disease benefits across unrelated compounds; current human synthesis shows wide compound- and person-specific bioavailability and weak or heterogeneous clinical evidence. Rebuild compound-specific records with chemical identifier, matrix/dose, parent/metabolites, organism/enzymes, ADME, metal/assay conditions, trial design, endpoint, and certainty.

Authorities: https://pubmed.ncbi.nlm.nih.gov/38428187/ ; https://pubmed.ncbi.nlm.nih.gov/39899845/ ; https://pubmed.ncbi.nlm.nih.gov/27490306/ ; local:data/content.generated.json#/pages/polyphenols

### `polyunsaturated-fatty-acids`

The page is a short umbrella over chemically and physiologically distinct omega-3 and omega-6 fatty acids. It states that omega-3 increases selected genera, omega-6 excess favors Enterobacteriaceae, and the omega-6/omega-3 ratio determines inflammatory tone without compound, formulation, diet, dose, duration, population, sample, assay, or endpoint. It also merges microbial transformation, membrane biology, lipid peroxidation, autoimmunity, and disease-specific observational/preclinical evidence. Split into EPA, DHA, alpha-linolenic, linoleic, arachidonic, and microbial-derivative records with exact intervention/exposure and evidence boundaries.

Authorities: https://pubmed.ncbi.nlm.nih.gov/42163966/ ; local:data/content.generated.json#/pages/polyunsaturated-fatty-acids

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
