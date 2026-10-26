# WikiBiome scientific media authority audit — mechanisms Batch 078

Date: 2026-09-07  
Authorized parent: `56a107fc4d158fb26e112b9526ce24b8c55cf38d`

## Batch decision

The deterministic queue is `isoflavones`, `ketone-bodies`, `kynurenine-pathway`, `labile-metal-pool`, `leptin`, and `lipid-metabolism`. All six routes fail closed as temporary asset-free scientific-media holds because their current articles do not support one accurate, bounded representation. No route has a marked generation prompt, and the built-in generator receives zero calls.

| Route | Controlled identity | Decision and boundary |
|---|---|---|
| `isoflavones` | MeSH `D007529` | Hold: a broad chemical class is reduced to soy, equol-producer prevalence, and generalized disease-response claims without compound, population, dose, or evidence boundaries. |
| `ketone-bodies` | Reactome `R-HSA-74182`; three-compound physiological class | Hold: a sparse class page conflates endogenous ketone metabolism, ketogenic-diet microbiome effects, beta-hydroxybutyrate signaling, and clinical indications. |
| `kynurenine-pathway` | Reactome `R-HSA-71240`; metabolic pathway rather than one molecule | Hold: a complex compartment- and concentration-dependent pathway is split into universal neuroprotective/neurotoxic arms and tied to unsupported iron-driven activation and disease causality. |
| `labile-metal-pool` | Scientific concept; no exact MeSH descriptor | Hold: organism- and condition-specific pools are presented through a single mixed table with dimensionally suspect values, universal buffering rules, and unbounded cross-metal mechanisms. |
| `leptin` | UniProt `P41159`; MeSH `D020738` | Hold: the exact hormone is identifiable, but the article is too sparse and presents a deterministic microbiome-metal-obesity feedback loop rather than receptor-, tissue-, and evidence-bounded biology. |
| `lipid-metabolism` | MeSH `D050356` | Hold: an extremely broad physiological domain is represented by a few microbiome, TMAO, SCFA, sex, disease, and heavy-metal claims and cannot map to one scientifically honest image. |

## Route audits

### `isoflavones`

MeSH D007529 defines a chemical class of 3-phenylchromones and includes chemically and biologically distinct members. The page contains only microbiome-dependence, four disease bullets, and cross-links, while treating equol production prevalence and stronger clinical response as general properties of soy isoflavones. It attributes production primarily to “certain Clostridia and Gordonibacter” without species, substrate, assay, geography, diet, or cohort boundaries. Define class versus selected compounds, distinguish daidzein metabolism from other isoflavones, identify the actual equol-producing taxa and human evidence, and bound every disease claim by compound, dose, model, and outcome before a structure-family or metabolic plate is considered.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D007529 ; local:data/content.generated.json#/pages/isoflavones

### `ketone-bodies`

Human ketone-body metabolism includes acetoacetate, beta-hydroxybutyrate, and acetone, but these are not interchangeable signaling agents. Reactome R-HSA-74182 distinguishes hepatic synthesis and extrahepatic utilization. The article instead moves directly from ketogenic-diet microbiome associations to beta-hydroxybutyrate immune signaling and established, emerging, and investigational clinical uses. Separate the three compounds, ketogenesis from ketolysis, physiological fasting from nutritional or pathological ketosis, endogenous metabolite action from diet effects, and indication-level clinical evidence before selecting a molecular or organ-pathway representation.

Authorities: https://pubchem.ncbi.nlm.nih.gov/pathway/Reactome:R-HSA-74182 ; local:data/content.generated.json#/pages/ketone-bodies

### `kynurenine-pathway`

The pathway is spatially and temporally distributed across liver, immune cells, gut, circulation, and nervous-system compartments. The page says IDO/TDO absolutely require heme iron and therefore iron availability directly controls flux, then claims metal-driven dysbiosis supplies both substrate and signal to maximally activate a neurotoxic arm. It also treats a kynurenic-acid/quinolinic-acid ratio as a general functional readout, equates pathway diversion with serotonin depletion, and turns mixed model and disease associations into mechanistic explanations. Current reviews emphasize concentration, compartment, species, and limited clinical translatability. Correct enzyme/cofactor claims, remove the binary protective/toxic pathway model, and bind each metabolite and disease statement to compartment, concentration, specimen, species, assay, and evidence level before drawing a pathway.

Authorities: https://pubmed.ncbi.nlm.nih.gov/42315009/ ; https://pubmed.ncbi.nlm.nih.gov/34862742/ ; local:data/content.generated.json#/pages/kynurenine-pathway

### `labile-metal-pool`

Labile pools are chemically complex, rapidly exchanging mixtures whose size and composition depend on ion, organism, compartment, growth state, sensor, ligand, and measurement method. The article combines potassium, magnesium, iron, manganese, zinc, and copper totals and inferred free concentrations in one table, including a dimensionally implausible 30–40 M potassium value, then treats less-than-one-atom equivalents as literal absence. It generalizes ribosome buffering, irreversible SOD metalation, phagosomal poisoning, aerobic/anaerobic behavior, and nickel-copper synergy across cells. Helmann's review explicitly highlights major knowledge gaps. Rebuild per organism, ion, compartment, method, chemical species, and condition; distinguish thermodynamic availability from concentration and total quota before a sensor or pool diagram is considered.

Authorities: https://pubmed.ncbi.nlm.nih.gov/39755956/ ; https://pubmed.ncbi.nlm.nih.gov/33454001/ ; local:data/content.generated.json#/pages/labile-metal-pool

### `leptin`

Human leptin is the reviewed UniProt P41159 hormone acting through LEPR in multiple central and peripheral tissues. The page contains only one microbiome-leptin feedback chain and cross-links. It presents dysbiosis-to-endotoxemia-to-leptin-resistance-to-obesity as deterministic, assigns propionate a general leptin-secretory role, and connects cadmium and lead exposure to leptin signaling without population, tissue, dose, or causal boundaries. Rebuild around protein and receptor identity, adipocyte secretion, hypothalamic and peripheral actions, congenital deficiency versus common obesity-associated resistance, and evidence-bounded microbiome/exposure findings before choosing a protein structure or tissue-axis plate.

Authorities: https://www.uniprot.org/uniprotkb/P41159/entry ; local:data/content.generated.json#/pages/leptin

### `lipid-metabolism`

MeSH D050356 covers the biosynthesis and degradation of all lipids and advises using specific lipid terms where possible. The page instead consists of brief bullets on bile acids, TMAO, short-chain fatty acids, sex differences, three heavy metals, diabetic erectile dysfunction, and high-fat diet. It conflates lipid classes, digestion, transport, storage, synthesis, oxidation, signaling, microbial transformations, pathological dyslipidemia, and cardiovascular risk. TMAO association is stated as promotion of atherosclerosis and broad heavy-metal enzyme disruption is asserted without route-specific evidence. Choose a bounded lipid class, organism, tissue, compartment, process, and physiological or disease question—or convert this page into a navigational overview—before any single metabolic illustration is considered.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D050356 ; local:data/content.generated.json#/pages/lipid-metabolism

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
