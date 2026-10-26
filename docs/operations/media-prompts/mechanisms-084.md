# WikiBiome scientific media authority audit — mechanisms Batch 084

Date: 2026-09-07  
Authorized parent: `631f31402cd3c2b34762898e5539982b9c11f61d`

## Batch decision

The deterministic queue is `neurodegeneration`, `neuroinflammation`, `nf-kappa-b`, `nickel-allergy`, `nickel-reproductive-toxicity`, and `nickel-neurotoxicity`. All six routes fail closed as temporary asset-free scientific-media holds. Their current articles combine distinct diseases, cell states, signaling branches, clinical presentations, exposure routes, chemical forms, species, and evidence tiers in ways that cannot be expressed as one literal scientific image without implying unsupported specificity or causation. No marked generation prompt exists, and the built-in generator receives zero calls.

| Route | Controlled identity | Decision and boundary |
|---|---|---|
| `neurodegeneration` | MeSH `D019636`; broad disease class | Hold: distinct neurodegenerative diseases and region-specific metal observations are collapsed into one causal metal–gut–brain pathway. |
| `neuroinflammation` | Process umbrella; no single controlled entity | Hold: heterogeneous glial, vascular, peripheral-immune, infectious, toxicant, and disease processes are merged, including obsolete M1/M2 microglial framing. |
| `nf-kappa-b` | MeSH `D016328` | Hold: the canonical branch is treated as the whole NF-κB system while noncanonical signaling, dimer diversity, stimulus, cell type, timing, and assay are omitted. |
| `nickel-allergy` | MeSH `D017449`; nickel-specific sensitization requires exposure evidence | Hold: localized allergic contact dermatitis, systemic contact dermatitis, proposed mucosal disease, exposure sources, diagnosis, and treatment are merged; visible eczema is not nickel-specific. |
| `nickel-reproductive-toxicity` | Toxicological endpoint umbrella; no single controlled condition | Hold: observational human pregnancy associations, placental transfer, mixed-metal exposure, animal reproductive findings, and proposed molecular mechanisms are presented as one human causal lesion. |
| `nickel-neurotoxicity` | Toxicological endpoint umbrella; no established human clinical phenotype | Hold: one intraperitoneal rat study and mechanistic claims are generalized toward environmental human neurotoxicity despite route, dose, species, and evidence limitations. |

## Route audits

### `neurodegeneration`

The controlled term is a broad class of hereditary and sporadic disorders characterized by progressive nervous-system dysfunction, with named diseases and pathologies beneath it. The page combines Alzheimer disease, Parkinson disease, Lewy body disease, manganese-induced parkinsonism, metal distributions, blood–brain-barrier injury, ferroptosis, protein aggregation, developmental exposure, gut dysbiosis, vagal propagation, and an aluminum controversy. Several bullets move from association or disease-specific observations to a universal metal-driven causal sequence. A single brain, plaque, neuron, metal map, or gut–brain composition would falsely imply that the same anatomy, metal pattern, and mechanism apply across this disease class. Rebuild by named disease, specimen/region, chemical species, analytical method, comparator, pathology, effect direction, and evidence tier before media selection.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D019636 ; https://pubmed.ncbi.nlm.nih.gov/34740866/ ; local:data/content.generated.json#/pages/neurodegeneration

### `neuroinflammation`

Neuroinflammation is a context-dependent process involving microglia, astrocytes, vascular cells, infiltrating immune cells, signaling mediators, and disease- or injury-specific time courses. The page organizes microglia as M1 versus M2, assigns persistent metal-induced M1 polarization, then joins blood–brain-barrier disruption, gut-derived lipopolysaccharide, vagal signaling, cytokine trafficking, multiple metals, four diseases, and proposed therapies into one pathway. Current microglial nomenclature rejects this dichotomy, and current reviews emphasize bidirectional, context-specific glial interactions. Rebuild around a defined species, tissue/region, insult, time point, cell-identification/state evidence, vascular or peripheral compartment, measured mediator, comparator, and functional outcome.

Authorities: https://pubmed.ncbi.nlm.nih.gov/36327895/ ; https://pubmed.ncbi.nlm.nih.gov/36453496/ ; https://pubmed.ncbi.nlm.nih.gov/37566021/ ; local:data/content.generated.json#/pages/neuroinflammation

### `nf-kappa-b`

NF-κB is a family of inducible transcription-factor dimers, not one linear pathway. The current article describes the canonical IKK–IκB–RelA/p50 sequence, but then generalizes activation by metals and disease effects while omitting noncanonical NIK/IKKα/p100 processing, overlapping dimer sets, feedback, crosstalk, cell-type specificity, stimulus duration, and direct versus ROS-mediated evidence. Current reviews explicitly describe interconnected canonical and noncanonical networks and broader dimer diversity. A generated pathway diagram would either reproduce an incomplete model or invent molecular topology and labels. Rebuild the canonical and noncanonical branches with exact receptors, proteins, dimers, species/cell type, stimulus, timing, localization, assay, and source-bound evidence.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D016328 ; https://meshb.nlm.nih.gov/record/ui?ui=D051550 ; https://pubmed.ncbi.nlm.nih.gov/38634218/ ; https://pubmed.ncbi.nlm.nih.gov/41669117/ ; local:data/content.generated.json#/pages/nf-kappa-b

### `nickel-allergy`

Nickel allergic contact dermatitis is a delayed hypersensitivity condition in a previously sensitized person, but its visible eczematous presentation is not specific to nickel. The page also includes localized and ectopic dermatitis, systemic contact dermatitis after ingestion, a proposed nickel allergic contact mucositis construct, gastrointestinal and extraintestinal symptoms, many exposure sources, regulatory release limits, patch testing, spot testing, diet, chelation, and topical treatment. A skin photograph or model could not establish nickel causation; a skin-cross-section pathway would imply fixed cell populations and timing not specified by the article. Rebuild around one presentation and exposure route, confirmed sensitization/patch-test context, acute versus chronic morphology, differential diagnosis, and evidence-qualified systemic or mucosal claims before generating media.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D017449 ; https://pubmed.ncbi.nlm.nih.gov/37283623/ ; https://pubmed.ncbi.nlm.nih.gov/38768899/ ; local:data/content.generated.json#/pages/nickel-allergy

### `nickel-reproductive-toxicity`

The page joins a Chinese case-control association with congenital heart defects, placental and cord-blood measurements in pregnancy complications, birth-size observations, endocrine targets, high-dose animal findings, biomonitoring matrices, and proposed oxidative or epigenetic mechanisms. ATSDR's current toxicological synthesis reports limited and conflicting human reproductive evidence, limited developmental epidemiology, and results that differ by nickel compound, exposure route, species, dose, and endpoint. A uterus, placenta, fetus, heart, gonad, or molecular diagram would privilege one endpoint and visually convert association into causation. Rebuild by nickel species, route, dose, timing, biomatrix, study design, species, endpoint, covariate/mixture handling, comparator, uncertainty, and causal status.

Authorities: https://www.atsdr.cdc.gov/ToxProfiles/tp15.pdf ; https://pubmed.ncbi.nlm.nih.gov/39702049/ ; https://pubmed.ncbi.nlm.nih.gov/37963536/ ; local:data/content.generated.json#/pages/nickel-reproductive-toxicity

### `nickel-neurotoxicity`

The article is anchored to an eight-week intraperitoneal nickel-chloride rat experiment and then adds oxidative-stress, neurotransmitter, NMDA-receptor, blood–brain-barrier, olfactory, endocrine, child-vulnerability, and human-community claims. Behavioral assays in rodents do not directly depict human anxiety, depression, memory impairment, or environmental exposure risk, and the page itself acknowledges the absence of confirming human clinical studies at environmental levels. The chemical form, administration route, tissue concentration, sex, dose, assay, and extrapolation boundary must remain explicit. Rebuild as a study-specific toxicology record or a rigorously synthesized endpoint page before depicting a brain, behavior, receptor, or human phenotype.

Authorities: https://www.atsdr.cdc.gov/ToxProfiles/tp15.pdf ; local:data/content.generated.json#/pages/nickel-neurotoxicity

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
