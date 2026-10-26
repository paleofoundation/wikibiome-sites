# WikiBiome scientific media authority audit — mechanisms Batch 086

Date: 2026-09-07  
Authorized parent: `9430cdc4e6cbf70ee0e41e6d86ecb63c7a907707`

## Batch decision

The deterministic queue is `oral-microbiome`, `outer-membrane`, `oxalate`, `oxalates`, `oxidative-stress`, and `oxygen-state`. All six routes fail closed as temporary asset-free scientific-media holds. The current articles combine multiple anatomical niches, membrane systems, chemical records, redox compartments, or physiological states; two routes duplicate the same oxalate concept; and several claims conflict with or exceed current evidence. No marked generation prompt exists, and the built-in generator receives zero calls.

| Route | Controlled identity | Decision and boundary |
|---|---|---|
| `oral-microbiome` | MeSH `D064307`; multi-niche oral microbial ecosystem | Hold: plaque, tongue, saliva, mucosa, gingival crevice, taxa, translocation routes, metals, and systemic associations cannot be represented as one observed community. |
| `outer-membrane` | diderm/Gram-negative bacterial outer membrane; organism-specific | Hold: a valid asymmetric membrane overview is mixed with incorrectly localized transport proteins and unsupported universal metal-tolerance and disease claims. |
| `oxalate` | MeSH `D010002`; oxalate chemical class | Hold: duplicates `oxalates`, overstates organism loss as causal stone risk, and lacks chemical/speciation, host-transport, diet, assay, and outcome boundaries. |
| `oxalates` | MeSH `D010002`; duplicate plural route | Hold: overlaps `oxalate` and combines food content, host synthesis, microbial metabolism, mineral binding, disease, and intervention claims without one canonical scope. |
| `oxidative-stress` | MeSH `D018384`; context-dependent redox disruption | Hold: multiple ROS/RNS, compartments, metals, defenses, biomarkers, diseases, and interventions are merged; a single image would imply a universal mechanism and measurement. |
| `oxygen-state` | intestinal oxygen/redox-gradient concept; no single controlled state | Hold: healthy-colon gradients, inflammation, other body sites, metals, nitrate respiration, diseases, and interventions are collapsed into one deterministic cycle. |

## Route audits

### `oral-microbiome`

Current synthesis shows that the oral microbiome contains bacteria, archaea, fungi, protists, and viruses arranged in strongly site-specific communities. Supragingival plaque, subgingival plaque, tongue dorsum, saliva, gingiva, mucosa, tonsils, and other habitats differ in substrates, gradients, organization, and resident taxa. The page instead moves among a generalized mouth community, pathogen translocation, systemic disease, dental metals, and organism tables. A single specimen-like image would falsely erase site, sampling, spatial scale, and community-state boundaries. Rebuild into site-specific modules with sampled surface, spatial scale, host state, assay, taxonomic resolution, and evidence-qualified systemic association before selecting a primary image.

Authorities: https://pubmed.ncbi.nlm.nih.gov/37700024/ ; https://pubmed.ncbi.nlm.nih.gov/32791109/ ; local:data/content.generated.json#/pages/oral-microbiome

### `outer-membrane`

The asymmetric diderm envelope can be illustrated only after organism and architecture are fixed. The current page incorrectly treats NikA/NikB as nickel-specific transport “through the outer membrane”; *E. coli* NikA is a periplasmic substrate-binding component of an ABC system. It also lists CadA, a P-type ATPase associated with cytoplasmic-membrane efflux, among systems spanning the outer membrane, then generalizes LPS composition, intrinsic metal tolerance, Proteobacteria enrichment, co-resistance, vesicle transport, and therapy across diverse organisms. Rebuild around one organism/envelope model with explicit inner membrane, periplasm, peptidoglycan, outer leaflet chemistry, named protein topology, transport direction and energy coupling, and directly supported phenotype.

Authorities: https://pubmed.ncbi.nlm.nih.gov/12960164/ ; local:data/content.generated.json#/pages/outer-membrane

### `oxalate`

This singular route and `oxalates` address the same controlled chemical concept. The page presents *Oxalobacter formigenes* loss as increasing kidney-stone risk and implies direct reductions in absorption and urinary excretion without separating association, controlled colonization, hyperoxaluria, or confirmed stone recurrence. Current reviews find that human causal and therapeutic evidence remains uncertain, with other oxalate-degrading microbes and host/diet factors contributing. Reconcile the duplicate route, define oxalic acid versus oxalate species and calcium oxalate, distinguish intestinal degradation from host transport and urinary crystallization, and bind claims to assay, diet, population, and outcome.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D010002 ; https://pubmed.ncbi.nlm.nih.gov/34190610/ ; https://pubmed.ncbi.nlm.nih.gov/41409368/ ; local:data/content.generated.json#/pages/oxalate

### `oxalates`

The plural route expands the duplicate concept into food tables, endogenous production, an *O. formigenes* pathway, mineral bioavailability, several diseases, and dietary/probiotic implications. It calls microbial function “ecologically irreplaceable” despite evidence for diverse oxalate-degradation pathways and taxa, and it does not separate soluble oxalate, calcium oxalate precipitation, luminal degradation, absorption, secretion, urine supersaturation, or clinical recurrence. Merge with the canonical singular record and rebuild the scientific modules before choosing a chemical, microbial, dietary, or renal representation.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D010002 ; https://pubmed.ncbi.nlm.nih.gov/33769280/ ; https://pubmed.ncbi.nlm.nih.gov/38422861/ ; local:data/content.generated.json#/pages/oxalates

### `oxidative-stress`

Oxidative stress is not one visible molecular object. The article combines superoxide, peroxide, hydroxyl radical, peroxynitrite, lipid radicals, Fenton chemistry, organelle and extracellular compartments, mammalian and microbial enzymes, metals, antioxidant systems, damage products, diseases, and interventions. Modern redox biology also cautions that discrete redox pathways are not represented by one global oxidant/antioxidant balance, and human biomarkers differ in specificity, validation, sample, and clinical meaning. Rebuild into compartment-, species-, exposure-, time-, target-, assay-, and outcome-specific modules before any diagram is generated.

Authorities: https://pubmed.ncbi.nlm.nih.gov/16987039/ ; https://pubmed.ncbi.nlm.nih.gov/28698768/ ; https://pubmed.ncbi.nlm.nih.gov/26415143/ ; local:data/content.generated.json#/pages/oxidative-stress

### `oxygen-state`

The route is primarily an intestinal epithelial oxygen-gradient hypothesis, but it presents a universal self-sustaining cycle, adds metal injury and nitrate respiration, and extends the same framing to inflammatory bowel disease, endometriosis, colorectal cancer, and neonatal disease. Oxygen concentration, partial pressure, redox potential, nitrate availability, epithelial metabolism, luminal location, organism respiration, and measurement are not interchangeable. Rebuild around a specified intestinal segment and radial location, host state, measured oxygen/redox variable, method, time, metabolite flux, organismal respiration phenotype, and evidence tier; keep other body sites separate.

Authorities: https://pubmed.ncbi.nlm.nih.gov/23812038/ ; https://pubmed.ncbi.nlm.nih.gov/27078066/ ; local:data/content.generated.json#/pages/oxygen-state

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
