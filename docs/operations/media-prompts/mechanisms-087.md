# WikiBiome scientific media authority audit — mechanisms Batch 087

Date: 2026-09-07  
Authorized parent: `e02b6c96dc270f2c17a3a7e40182b584af8f6eb2`

## Batch decision

The deterministic queue is `p-cresol`, `parenteral-nutrition`, `peptidoglycan`, `ph-sensing`, `phage-therapy`, and `pharmacomicrobiomics`. All six routes fail closed as temporary asset-free scientific-media holds. The articles conflate chemical species, clinical delivery and intestinal exposure, structurally diverse cell walls and receptors, cross-kingdom sensing systems, distinct phage modalities, or many unrelated drug–microbiome interactions. Several central claims exceed or contradict current evidence. No marked generation prompt exists, and the built-in generator receives zero calls.

| Route | Controlled identity | Decision and boundary |
|---|---|---|
| `p-cresol` | 4-methylphenol; MeSH Cresols / registry `1MXY2UM8NV` | Hold: unconjugated p-cresol, p-cresyl sulfate, p-cresyl glucuronide, urine assays, microbial production, CKD accumulation, and ASD/PD hypotheses are conflated. |
| `parenteral-nutrition` | MeSH parenteral nutrition; multi-component clinical intervention | Hold: PN formulations, aluminum exposure, trace elements, enteral deprivation, intestinal failure, microbiota, neonatal outcomes, and unproven iron mechanisms are merged. |
| `peptidoglycan` | bacterial peptidoglycan; organism- and chemotype-specific polymer | Hold: no structural overview is present; TLR2 is presented as a direct universal peptidoglycan receptor while NOD fragments, chemotypes, cell-wall context, and contaminants are omitted. |
| `ph-sensing` | multi-organism environmental-response umbrella | Hold: bacterial two-component systems, acid-resistance enzymes, fungal Rim101, intestinal gradients, urease, and metal speciation are merged as one sensor pathway. |
| `phage-therapy` | therapeutic bacteriophages and phage-derived products; product-specific | Hold: lytic phages, cocktails, depolymerases, endolysins, virome associations, and engineered M13 delivery vectors are treated as one therapy with universal benefits. |
| `pharmacomicrobiomics` | field-level drug–microbiome interaction umbrella | Hold: many drugs, enzymes, organisms, directions of effect, clinical stages, and speculative metal links cannot support one literal primary image. |

## Route audits

### `p-cresol`

The page moves between bacterially produced 4-methylphenol, host-conjugated p-cresyl sulfate and glucuronide, urine and fecal measurements, protein-bound uremic retention, and neurological hypotheses. It labels a pooled effect as “p = 0.46,” asserts blood–brain-barrier passage and a specific dopamine-beta-hydroxylase mechanism as established human neurotoxicity, and extends association into Parkinson disease and metals. Current ASD synthesis reports an association but explicitly requires causal and clinical validation. Rebuild with exact analyte, chemical identifier, precursor/pathway, compartment, conjugation, assay, units, population, renal function, and evidence tier before selecting a molecular or pathway image.

Authorities: https://pubmed.ncbi.nlm.nih.gov/40672444/ ; https://pubmed.ncbi.nlm.nih.gov/34744609/ ; https://pubmed.ncbi.nlm.nih.gov/40534235/ ; local:data/content.generated.json#/pages/p-cresol

### `parenteral-nutrition`

Parenteral nutrition is a clinical delivery mode with formulation-, component-, dose-, duration-, age-, renal/hepatic-, and disease-specific effects. The page correctly identifies aluminum as a regulated concern but linearly extrapolates a reported group-level developmental association into a guaranteed 14-point deficit for a 14-day course. It also claims intravenous iron reaches and feeds gut organisms through luminal diffusion, conflating parenteral exposure with literature largely concerning enteral iron, and mixes preterm infants, intestinal failure, short bowel syndrome, critical illness, pancreatitis, NEC, trace-element toxicity, enteral deprivation, and microbiota. Rebuild as separate aluminum, manganese/copper, microbiota/enteral-deprivation, and population modules with formulation, route, dose, duration, comparator, outcome, and certainty.

Authorities: https://www.fda.gov/media/163799/download ; https://pubmed.ncbi.nlm.nih.gov/32682806/ ; https://pubmed.ncbi.nlm.nih.gov/35730416/ ; local:data/content.generated.json#/pages/parenteral-nutrition

### `peptidoglycan`

Peptidoglycan varies in glycan and peptide chemistry, cross-linking, modifications, thickness, turnover fragments, and accessibility among taxa. The sparse route contains no structural foundation and reduces host recognition to “peptidoglycan–TLR2 activation,” although NOD1 and NOD2 recognize defined intracellular fragments and apparent TLR2 responses can depend on associated cell-wall ligands and preparation. It further merges mammalian PGRP killing, metal stress, esophageal signaling, and Crohn disease. Rebuild around a specified organism/chemotype and structural repeat, cross-link, wall context, released fragment, receptor, cell compartment, assay, and immune outcome.

Authorities: https://pubmed.ncbi.nlm.nih.gov/29292393/ ; https://pubmed.ncbi.nlm.nih.gov/17057187/ ; local:data/content.generated.json#/pages/peptidoglycan

### `ph-sensing`

There is no universal pH sensor represented here. The route merges bacterial PhoP/PhoQ signaling, *E. coli* amino-acid decarboxylase acid resistance, fungal Rim101 signaling, urease-mediated local alkalinization, gastrointestinal pH gradients, fermentation, and metal solubility/speciation. The claim that alkalinization “unlocks” metals conflicts with its own preceding statement that many metals become less soluble as pH rises. Rebuild by organism and named sensor/regulator, membrane/cellular compartment, calibrated pH range, signal chemistry, downstream genes, growth condition, metal species, measurement, and phenotype.

Authorities: https://pubmed.ncbi.nlm.nih.gov/40603778/ ; local:data/content.generated.json#/pages/ph-sensing

### `phage-therapy`

Therapeutic phages are product- and host-strain-specific biological agents with variable adsorption, replication, resistance, immune clearance, pharmacokinetics, biofilm access, route, dose, and manufacturing controls. The article combines whole lytic phages, cocktails, depolymerases, endolysins, compassionate-use evidence, a prostatitis case, cancer virome association, and engineered M13 photodynamic delivery, then states universal microbiome preservation, biofilm penetration, self-amplification, favorable resistance tradeoffs, and absence of metal-resistance selection. Rebuild into modality-specific records with exact phage/product, bacterial strain and receptor, genome safety screen, host range, formulation, route/dose, infection model, comparator, endpoint, resistance, and evidence tier.

Authorities: https://pubmed.ncbi.nlm.nih.gov/31724901/ ; https://pubmed.ncbi.nlm.nih.gov/35335222/ ; https://pubmed.ncbi.nlm.nih.gov/42257516/ ; local:data/content.generated.json#/pages/phage-therapy

### `pharmacomicrobiomics`

This is a field, not one mechanism. The page combines microbial drug inactivation, activation, toxicity reactivation, drug-driven community change, absorption effects, and proposed precision dosing across levodopa, digoxin, sulfasalazine, irinotecan, benzodiazepines, methotrexate, PPIs, metformin, antibiotics, statins, NSAIDs, chelators, and supplements. It incorrectly calls pyridoxal phosphate a metal-dependent cofactor and turns emerging associations into deterministic dose and efficacy claims. Rebuild as one drug–enzyme–organism–reaction record at a time with substrate/product, compartment, assay, exposure, pharmacokinetic endpoint, clinical replication, covariates, and intervention evidence.

Authorities: https://pubmed.ncbi.nlm.nih.gov/40102479/ ; local:data/content.generated.json#/pages/pharmacomicrobiomics

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
