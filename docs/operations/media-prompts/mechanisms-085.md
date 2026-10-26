# WikiBiome scientific media authority audit — mechanisms Batch 085

Date: 2026-09-07  
Authorized parent: `0c4c6af376175c8bea312c7f3cf8c502d342772b`

## Batch decision

The deterministic queue is `nickel-transporters`, `nickel-glyoxalase`, `nickel-urease`, `nife-hydrogenase`, `nitric-oxide`, and `nrf2`. All six routes fail closed as temporary asset-free scientific-media holds. The current articles either merge non-homologous systems and organisms, contain incorrect active-site chemistry, extend structural biochemistry into unsupported clinical claims, combine incompatible physiological compartments, or lack enough source-bound content to define a visual claim. No marked generation prompt exists, and the built-in generator receives zero calls.

| Route | Controlled identity | Decision and boundary |
|---|---|---|
| `nickel-transporters` | Transport-family umbrella; no single protein or complex | Hold: NixA, NikABCDE, NiuBDE, broad-specificity channels, metallophores, regulators, and host sequestration are merged across organisms and compartments. |
| `nickel-glyoxalase` | Glyoxalase I, EC `4.4.1.5`; organism/metal specific | Hold: valid *E. coli* Ni-GlxI chemistry is mixed with an incorrect reaction description and unsupported disease, dietary, zinc, and antimicrobial claims. |
| `nickel-urease` | Urease, EC `3.5.1.5`; nickel-dependent active site | Hold: the active-site ligation is incorrect and organism-specific acid survival is extended into unsupported nickel-starvation, chelation, disease, and unrelated-protein claims. |
| `nife-hydrogenase` | [NiFe]-hydrogenase family, EC class `1.12`; multiple subgroups | Hold: the nickel ligation is incorrect and structurally diverse oxygen-sensitive/tolerant enzymes are merged with broad pathogen, gut, biofilm, and therapeutic narratives. |
| `nitric-oxide` | MeSH `D009569`; CAS `10102-43-9` | Hold: eNOS, nNOS, iNOS, oral nitrate reduction, gastric chemistry, inflamed-gut respiration, metal toxicology, and disease associations are collapsed without compartment, flux, dose, or causal boundaries. |
| `nrf2` | NF-E2-related factor 2 / NFE2L2; pathway record is source-sparse | Hold: two short sections do not define KEAP1 sensing, Nrf2 turnover/translocation, DNA binding, species/cell context, exposure, assay, or source-qualified microbiome claims. |

## Route audits

### `nickel-transporters`

The page is not one molecular entity. It combines a single-component NiCoT permease, ABC import complexes, organism-specific Niu systems, broad divalent-cation transport, metallophore-mediated acquisition, the NikR transcriptional regulator, calprotectin sequestration, virulence enzymes, diet, and proposed inhibitors. Transport substrate can be free ion or ligand complex and differs by protein, organism, membrane, energy coupling, and environmental condition. Several organism–metallophore–enzyme rows need primary verification. Rebuild as separate protein/complex records with UniProt/PDB or locus identifiers, organism/strain, topology/stoichiometry, membrane compartment, substrate species, energy source, regulation, assay, and phenotype before selecting any membrane illustration.

Authorities: https://pubmed.ncbi.nlm.nih.gov/24036122/ ; local:data/content.generated.json#/pages/nickel-transporters

### `nickel-glyoxalase`

*Escherichia coli* glyoxalase I is structurally supported as a nickel-activated enzyme that converts the spontaneously formed methylglyoxal–glutathione hemithioacetal to S-D-lactoylglutathione; the active Ni site is coordinated by two histidines, two glutamates, and two waters. The page instead calls the catalytic step “transglycosylation,” describes nickel coordination to glutathione without the necessary hemithioacetal boundary, generalizes among bacteria, and asserts roles in endometriosis, inflammatory bowel disease, colorectal cancer, dietary nickel dependence, zinc antagonism, chelation, and antimicrobial targeting without direct in-vivo evidence. Rebuild around a named organism/enzyme sequence or structure, correct substrate/product chemistry, metal-activation assay, coordination geometry, growth condition, phenotype, and explicit separation of hypothesis from demonstrated disease relevance.

Authorities: https://pubmed.ncbi.nlm.nih.gov/10913283/ ; https://pubmed.ncbi.nlm.nih.gov/14641060/ ; https://pubmed.ncbi.nlm.nih.gov/18533363/ ; local:data/content.generated.json#/pages/nickel-glyoxalase

### `nickel-urease`

Urease is a dinickel hydrolase, but the page's active-site statement is chemically wrong: canonical bacterial urease nickel ions are coordinated by histidines, an aspartate, and a carbamylated lysine bridge, not cysteine residues as stated. The article then turns *Helicobacter pylori* urease-mediated acid acclimation into absolute claims that nickel starvation causes eradication, proposes gastric EDTA/dithiocarbamate chelation, calls VacA a zinc-dependent protease, and merges gastric disease, MALT lymphoma, dyspepsia, urinary pathogens, diagnostic breath testing, and dual-metal interventions. Rebuild around a defined urease/PDB and organism, correct ligands and reaction stoichiometry, oligomer/accessory-protein architecture, pH and activity conditions, genetic phenotype, and evidence-qualified clinical role before any active-site or gastric-niche image.

Authorities: https://pubmed.ncbi.nlm.nih.gov/24036122/ ; https://pubmed.ncbi.nlm.nih.gov/41724831/ ; local:data/content.generated.json#/pages/nickel-urease

### `nife-hydrogenase`

[NiFe]-hydrogenases are a family with different localization, electron-transfer chains, physiological directionality, oxygen sensitivity/tolerance, maturation systems, and catalytic states. The current page correctly recognizes a Ni–Fe center but incorrectly assigns histidine among the nickel ligands; current structural synthesis identifies four cysteine ligands around Ni, two bridging to an Fe(CN)2CO fragment. It also describes one universal catalytic/energetic pathway and combines *H. pylori*, methanogens, sulfate reducers, polymicrobial biofilms, inflammatory bowel disease, iron overload, nutritional immunity, diet, and nickel chelation. Rebuild around a named enzyme/organism/PDB, subunit and Fe–S relay, active-site state, four-cysteine ligation, directionality, electron acceptor/donor, oxygen response, assay, and demonstrated phenotype.

Authorities: https://pubmed.ncbi.nlm.nih.gov/27493211/ ; https://pubmed.ncbi.nlm.nih.gov/33753519/ ; https://pubmed.ncbi.nlm.nih.gov/40411749/ ; local:data/content.generated.json#/pages/nife-hydrogenase

### `nitric-oxide`

Nitric oxide is a short-lived free-radical gas with distinct production, diffusion, reaction, and signaling contexts. The page combines mammalian eNOS/nNOS/iNOS, oral bacterial nitrate reduction, acid gastric nitrite chemistry, inflamed-gut nitrate respiration, metal-specific toxicology, vascular signaling, neurotransmission, antimicrobial action, and four disease contexts. It does not consistently specify species, cell, compartment, oxygen, substrate/cofactors, concentration/flux, lifetime, measurement, or whether nitrate, nitrite, NO, superoxide, or peroxynitrite is the measured species. A single molecule or pathway image would erase these boundaries. Rebuild into compartment-specific modules with exact NOS isoform or microbial enzyme, reactants/products, cofactor and oxygen requirements, analytical method, concentration/time, target, and evidence tier.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D009569 ; https://meshb.nlm.nih.gov/record/ui?ui=D019001 ; https://meshb.nlm.nih.gov/record/ui?ui=D026361 ; local:data/content.generated.json#/pages/nitric-oxide

### `nrf2`

The route contains only a short list of metal, microbiome, and disease assertions plus cross-references. It does not describe the KEAP1–CUL3 turnover system, cysteine sensing, Nrf2 stabilization, nuclear translocation, small-Maf partnership, antioxidant-response-element binding, target genes, negative regulation, or the context-dependent risks of sustained activation. “Butyrate” and “sulforaphane from dietary sources” are grouped as microbial metabolites without a source-bound transformation pathway, and acute activation versus chronic depletion is asserted broadly across metals. Rebuild with human NFE2L2/KEAP1 identifiers, species/cell type, exposure identity/dose/time, protein-state assay, localization, DNA-binding/target-gene readout, microbiome metabolite provenance, and disease-specific evidence before generating a pathway image.

Authorities: https://pubmed.ncbi.nlm.nih.gov/42574364/ ; local:data/content.generated.json#/pages/nrf2

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
