# WikiBiome scientific media prompts — mechanisms Batch 092

Date: 2026-09-07  
Authorized parent: `bb14f66c5bdb947608bea218cd3e207cb35eabb5`

## Pre-generation authority audit

The deterministic queue contains two duplicate Synbiotics routes, two broad physiological or post-translational process routes, and two exact small molecules. Each route was checked against current authoritative identity records and evidence boundaries before any generation decision.

### Asset-free scientific holds

- `synbiotic` and `synbiotics` describe the same ISAPP concept and both use the title “Synbiotics.” The records overlap but differ in claims and source sets. ISAPP defines complementary and synergistic synbiotics at the formulation level; a defensible image therefore requires one canonical route and an exact microorganism–substrate formulation with dose, viability, selective utilization, host, outcome, and evidence tier. Both routes remain asset-free until their duplicate identity is reconciled.
- `systemic-inflammation` is a heterogeneous multi-trigger, multi-compartment phenotype rather than one anatomy, assay, or diagnostic state. The current route presents CRP, interleukin-6, TNF-alpha, metals, LPS, dysbiosis, and multiple diseases as one visually unified causal endpoint. It remains asset-free until the scope is separated by acute versus chronic state, compartment, trigger, biomarker, specimen, assay, population, disease context, and certainty.
- `tau-phosphorylation` spans multiple MAPT isoforms and more than 50 physiologic and pathologic phosphorylation sites. Current evidence emphasizes heterogeneous patterns and site-, isoform-, tissue-, assay-, and tauopathy-specific interpretation. The article additionally merges several metals, microbial products, amyloid, kinases, phosphatases, aggregation, and clinical decline into one cascade. It remains asset-free pending an exact human isoform, residue or defined site set, modification state, compartment, assay, structure source, disease, comparator, and evidence tier.
- `testosterone` has exact chemical identities in PubChem and ChEBI, but the route merges free and total hormone, metabolites, binding proteins, tissues, sexes, life stages, PCOS, multiple metals, microbiome associations, interventions, and a proposed self-reinforcing causal cycle. A generic steroid model would not uniquely identify testosterone without stereochemical fidelity, while an anatomy or pathway plate would overstate the current evidence. It remains asset-free pending exact chemical species or product, stereochemical rendering source, compartment, specimen, assay, population, exposure or intervention, comparator, endpoint, and evidence tier.

No prompt marker exists for those five routes. The built-in generator must not be called for them.

### `taurine`

PubChem CID `1123` and ChEBI `15891` identify taurine (2-aminoethanesulfonic acid). ChEBI separately records taurine, its zwitterion, and 2-aminoethanesulfonate relationships; the image must therefore orient only to heavy-atom connectivity and must not assert protonation state, charge, conformation, concentration, tissue distribution, bile-acid conjugation, microbial metabolism, supplementation effect, or clinical outcome.

<!-- PROMPT taurine START -->
```text
Use case: scientific-educational. Asset type: review-only WikiBiome chemical-identity reconstruction for taurine, 2-aminoethanesulfonic acid, PubChem CID 1123 and ChEBI 15891. Create one isolated, large, clean heavy-atom connectivity teaching model on a uniform pale field. The model must contain exactly two carbon centers connected in a short chain; exactly one nitrogen center attached only to the first terminal carbon; and exactly one sulfur center attached only to the second terminal carbon, with exactly three oxygen centers attached to that sulfur center. Keep all seven heavy-atom centers visible, separated, and connected only in this arrangement. Omit all explicit hydrogen atoms, omit charge or protonation symbols, and do not claim a measured conformation or bond geometry. The subject must remain centered and entirely inside a broad 1200 by 630 crop-safe band with uninterrupted pale space on every edge. Landscape 3:2 at 1536 by 1024; uniform high-key cool pale blue-white background approximately #f3f7fb; restrained graphite carbon, silver-blue nitrogen, cool copper oxygen, and pale violet-silver sulfur materials; soft clinical studio illumination; precise chemistry teaching-model finish; minimal scene-making. No labels, element letters, numbers, formulas, charge glyphs, arrows, icons, chart, food, supplement, capsule, bottle, bile duct, organ, cell, microbe, person, glow, vignette, clipping, signature, or watermark. Chemical identity orientation only, not a crystallographic structure, stereochemical measurement, protonation-state claim, concentration, pathway, mechanism, biomarker, treatment, or diagnosis.
```
<!-- PROMPT taurine END -->

## Authority and representation boundary

- ISAPP consensus PMID `32826966` supplies the current synbiotic definition and complementary-versus-synergistic distinction; it does not resolve WikiBiome’s duplicate canonical routes or justify a formulation-independent organism–substrate image.
- PMID `31806905` describes systemic chronic inflammation as a multi-level phenotype with diverse social, environmental, lifestyle, infectious, metabolic, and other triggers and many downstream disease associations. It does not establish a single diagnostic morphology or one exclusive biomarker.
- NCBI Gene `4137`, UniProtKB `P10636`, and PMIDs `33892381`, `38556838`, and `34090488` establish multiple human MAPT transcripts or protein isoforms and heterogeneous phosphorylation sites and patterns. They do not justify one universal “hyperphosphorylated tau” structure or a single metal–microbiome causal cascade.
- PubChem CID `1123` and ChEBI `15891` establish taurine’s identity and heavy-atom connectivity. The frozen prompt deliberately excludes explicit hydrogens, charge, protonation state, conformation, and biological effects.
- PubChem CID `6013` and ChEBI `17347` establish testosterone’s exact chemical identity. Human systematic reviews PMID `35283442` and PMID `40256744` describe associations between gut microbiota and sex hormones while retaining substantial heterogeneity and uncertainty; they do not establish the route’s universal bidirectional causal cycle.

Scientific references:

- https://pubmed.ncbi.nlm.nih.gov/32826966/
- https://pubmed.ncbi.nlm.nih.gov/31806905/
- https://www.ncbi.nlm.nih.gov/gene/4137
- https://www.uniprot.org/uniprotkb/P10636/entry
- https://pubmed.ncbi.nlm.nih.gov/33892381/
- https://pubmed.ncbi.nlm.nih.gov/38556838/
- https://pubmed.ncbi.nlm.nih.gov/34090488/
- https://pubchem.ncbi.nlm.nih.gov/compound/1123
- https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:15891
- https://pubmed.ncbi.nlm.nih.gov/35954180/
- https://pubchem.ncbi.nlm.nih.gov/compound/6013
- https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:17347
- https://pubmed.ncbi.nlm.nih.gov/35283442/
- https://pubmed.ncbi.nlm.nih.gov/40256744/

Exactly one route is scientifically cleared for exactly one built-in image-generation call. No prompt may change after the prompt-freeze commit without a new audit. Returned media remains review-only until native-resolution inspection, literal heavy-atom count and connectivity audit, exact hash acceptance, metadata reconciliation, and derivative crop review are complete. Prompt-requested content must never be reported as observed output.

## Frozen prompt hashes

The marker-bound Taurine prompt SHA-256 is recorded in the batch manifest. Any prompt change requires a new authority audit and prompt freeze before generation.
