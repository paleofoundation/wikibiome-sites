# WikiBiome scientific media authority audit — mechanisms Batch 076

Date: 2026-09-07  
Authorized parent: `cbd913f9ee2e5d3102d5616d264c1a4384311a55`

## Batch decision

The deterministic queue is `il-8`, `immune-balance`, `immunotherapy`, `indole`, `indoles`, and `indoxyl-sulfate`. All six routes fail closed as temporary asset-free scientific-media holds because their current articles contain material identity, scope, evidence, chemical-representation, or clinical-translation conflicts. No route has a marked generation prompt, and the built-in generator receives zero calls.

| Route | Controlled identity | Decision and boundary |
|---|---|---|
| `il-8` | MeSH `D016209`; UniProt `P10145` | Hold: the exact protein is identifiable, but the article reduces it to one gingipain narrative and lacks the evidence and representation boundary needed for a protein or tissue-context image. |
| `immune-balance` | WikiBiome concept; no exact controlled identifier | Hold: a non-canonical umbrella term presents a binary Th/Treg equilibrium and broad metal, microbiome, disease, and treatment claims as a unified mechanism. |
| `immunotherapy` | MeSH `D007167`; page scope conflicts with immune-checkpoint therapy | Hold: a broad treatment class is represented almost entirely as cancer checkpoint inhibition, while cohort associations and experimental interventions become deterministic clinical rules. |
| `indole` | PubChem `CID 798`; ChEBI `16881` for 1H-indole | Hold: an exact small molecule is mixed with a heterogeneous derivative family and receptor, concentration, disease, and organism claims that are not consistently bounded. |
| `indoles` | MeSH `D007211`; ChEBI class `24828` | Hold: the chemical class is redefined as an exclusively microbial tryptophan pathway and compounds with distinct chemistry and receptor activity are collapsed into one protective axis. |
| `indoxyl-sulfate` | PubChem `CID 10258`; ChEBI `43355` | Hold: an exact metabolite is identifiable, but its page converts model and association evidence into universal producers, causal organ damage, a cadmium mechanism, BBB passage, biomarkers, and treatment implications. |

## Route audits

### `il-8`

The title correctly joins IL-8 with human CXCL8, MeSH D016209, and reviewed UniProt P10145. The page nevertheless calls it the primary neutrophil chemokine, then makes susceptibility to *Porphyromonas gingivalis* gingipains the defining WikiBiome feature from one mixed-biofilm experiment. It says esophageal dysbiosis drives IL-8 through TLR2/TLR4 and treats a perinatal-depression biomarker association as a key interaction, without establishing tissue, cell, assay, disease direction, or causality. CXCL8 is secreted by diverse cell types, attracts more than neutrophils, binds CXCR1/CXCR2, and can be proteolytically processed. A generated globular protein would require a specified experimentally resolved structure and biological assembly; a tissue plate would represent one context rather than the molecule. Rebuild the article around human CXCL8 identity, receptors, processing, cellular sources, and evidence-bounded disease contexts before selecting a structure or tissue representation.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D016209 ; https://www.uniprot.org/uniprotkb/P10145/entry ; local:data/content.generated.json#/pages/il-8

### `immune-balance`

“Immune balance” is not one controlled biological entity or measurable equilibrium. The article divides effector Th1/Th2/Th17 from anti-inflammatory Treg/IL-10/TGF-beta, although helper and regulatory states are heterogeneous, plastic, tissue-specific, and not inherently pro- versus anti-inflammatory. It labels metals and the microbiome two of the most potent modulators, assigns universal metal effects to T-cell and macrophage polarization, calls the microbiome the largest immune organ by proxy, converts murine segmented-filamentous-bacteria and strain-specific findings into general human rules, and recommends supplementation, probiotics, chelation, and dietary avoidance. Disease tables reduce complex conditions to one immune skew, metal driver, and taxon. Define a narrower measurable construct, separate innate/adaptive compartments and human/model evidence, remove binary M1/M2 and Th/Treg causal simplifications, verify each exposure and disease claim, and remove unsourced treatment advice before any systems diagram is considered.

Authorities: https://pmc.ncbi.nlm.nih.gov/articles/PMC3494736/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3905679/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC4681807/ ; local:data/content.generated.json#/pages/immune-balance

### `immunotherapy`

MeSH D007167 includes active and passive immunization and immunosuppressive therapy, while the page is almost entirely about cancer immune-checkpoint inhibitors. It says the microbiome determines whether tumors respond; assigns fixed responder and non-responder taxa across PD-1, PD-L1, and CTLA-4 contexts; states that germ-free mice do not respond; says responder FMT converts non-responders; and calls antibiotic exposure a dramatic reducer of response and survival. Current cross-cohort work instead finds treatment- and cohort-dependent associations, modest discrimination, and no universal species. The page also presents short-chain fatty acids as uniformly beneficial although high systemic butyrate/propionate associated with resistance to CTLA-4 blockade in one human/mouse study, and promotes profiling, diet, FMT, and metal supplementation beyond clinical evidence. Narrow the route to cancer checkpoint therapy or cover the full immunotherapy class, separate association from intervention and human from mouse evidence, reconcile regimen-specific metabolite findings, and distinguish experimental trials from standard care before media is selected.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D007167 ; https://www.cancer.gov/about-cancer/treatment/types/immunotherapy ; https://www.cancer.gov/research/areas/public-health/immune-system-microbiome ; https://pubmed.ncbi.nlm.nih.gov/35228751/ ; https://pubmed.ncbi.nlm.nih.gov/42168704/ ; https://pubmed.ncbi.nlm.nih.gov/32358520/ ; local:data/content.generated.json#/pages/immunotherapy

### `indole`

The singular route has a clear chemical identity—1H-indole, PubChem CID 798 and ChEBI 16881—but its page immediately becomes a family page. It calls indole the primary endogenous AhR ligand, lists derivatives with distinct structures as though they share one receptor/function matrix, and treats indole itself as an uncomplicated barrier-promoting AhR/PXR signal. Experimental literature is context- and species-dependent: one study found human-AHR-selective agonism, another found indole antagonized AHR in Caco-2 cells, and the PXR barrier study identified indole-3-propionic acid in the context of indole rather than simple indole alone as the ligand. Disease claims also mix mouse behavior, human association, pathogen auxotrophy, and host-derived indoxyl sulfate. Separate the parent compound from derivatives, state exact structures, concentrations, receptors, species, cells, and models, and resolve the duplicate relationship with `indoles` before any exact structure or pathway image is considered.

Authorities: https://pubchem.ncbi.nlm.nih.gov/compound/798 ; https://www.ebi.ac.uk/chebi/searchId.do?chebiId=16881 ; https://pubmed.ncbi.nlm.nih.gov/26235394/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3990014/ ; https://pubmed.ncbi.nlm.nih.gov/25065623/ ; local:data/content.generated.json#/pages/indole

### `indoles`

MeSH D007211 and ChEBI 24828 define a broad chemical class, not an exclusively microbial branch of tryptophan metabolism. The page mixes indole, indole-3-propionic acid, indole-3-aldehyde, indole-3-acetic acid, tryptamine, and indoxyl sulfate despite different structures, producers, host transformations, receptors, concentrations, and effects. It calls indole a direct deamination product, assigns PXR activation to the parent, calls indole-3-propionic acid a potent AhR agonist, generalizes AhR toward IL-22/Treg benefit, and presents neurological and dietary associations as protective mechanisms. Its metal section asserts that heavy-metal dysbiosis depletes protective producers and shifts host tryptophan toward iron-requiring IDO/TDO without route-specific evidence. Define whether the page is the chemical class or microbiota-derived tryptophan metabolites, reconcile or merge the duplicate singular route, and source each compound-specific pathway and model before a family plate is considered.

Authorities: https://www.ncbi.nlm.nih.gov/mesh/68007211 ; https://www.ebi.ac.uk/chebi/CHEBI%3A24828 ; https://pubmed.ncbi.nlm.nih.gov/25065623/ ; https://pubmed.ncbi.nlm.nih.gov/26235394/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3990014/ ; local:data/content.generated.json#/pages/indoles

### `indoxyl-sulfate`

The exact metabolite is PubChem CID 10258 and ChEBI 43355. The basic sequence—microbial indole, hepatic CYP2E1 oxidation to indoxyl, SULT1A1 sulfation, and renal tubular secretion—is supportable, but the page overstates the rest. It names Proteobacteria and *Escherichia coli* as dominant producers and says dysbiosis directly increases production without quantitative, population-bounded evidence. It calls indoxyl sulfate a significant cardiovascular driver in CKD and non-CKD populations, says it crosses the blood-brain barrier, presents a five-step cadmium mechanism from a rat association, and labels it a dysbiosis biomarker and disease-progression predictor. BBB studies instead emphasize OAT3-mediated brain-to-blood efflux, and large randomized AST-120 trials did not support improved CKD progression. Preserve the exact chemical pathway while separating cell/animal mechanisms, human associations, renal clearance, protein binding, transporter direction, and clinical intervention evidence; remove the deterministic cadmium and disease chains before an exact structure or organ-pathway plate is considered.

Authorities: https://pubchem.ncbi.nlm.nih.gov/compound/Indoxyl-Sulfate ; https://www.ebi.ac.uk/chebi/CHEBI%3A43355 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC8228088/ ; https://doi.org/10.1046/j.1471-4159.2002.01108.x ; https://pubmed.ncbi.nlm.nih.gov/25349205/ ; https://pubmed.ncbi.nlm.nih.gov/26912554/ ; local:data/content.generated.json#/pages/indoxyl-sulfate

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
