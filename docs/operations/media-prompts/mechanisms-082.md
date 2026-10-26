# WikiBiome scientific media authority audit — mechanisms Batch 082

Date: 2026-09-07  
Authorized parent: `fc112e01ebbf6ee9ac69a7b4e8f5332d440e1523`

## Batch decision

The deterministic queue is `metallothionein`, `methylation`, `microbial-biomarkers`, `metabolites`, `microbiome-diversity-metrics`, and `microbiome-derived-metabolites`. All six routes fail closed as temporary asset-free scientific-media holds because the current pages lack a single representable identity, combine distinct chemical or analytical entities, duplicate another canonical route, or convert heterogeneous associations into causal or clinical claims. No marked generation prompt exists, and the built-in generator receives zero calls.

| Route | Controlled identity | Decision and boundary |
|---|---|---|
| `metallothionein` | Protein-family umbrella; MeSH `D008676` | Hold: mammalian isoforms, species-specific proteins, metalation states, stoichiometries, tissues, and disease claims are compressed into one fixed structure and binding hierarchy. |
| `methylation` | Process umbrella; MeSH `D008745` | Hold: DNA, histone, protein, and xenobiotic methylation are conflated with one-carbon metabolism and broad microbiome/metal causality. |
| `microbial-biomarkers` | Biomarker-category umbrella; no qualified context of use | Hold: associations, pathogens, host inflammatory markers, metabolites, and experimental metallophores are presented together as diagnostic, prognostic, or monitoring tools without analytical or clinical validation. |
| `metabolites` | Chemical-class umbrella; duplicate/overlapping route | Hold: host, microbial, co-metabolic, dietary, and hepatic products are combined with categorical beneficial/toxic and causal disease labels. |
| `microbiome-diversity-metrics` | Statistical-method umbrella; no single biological entity | Hold: multiple estimators and distances with different assumptions are presented as interchangeable disease markers, and generic significance is implied without design or model conditions. |
| `microbiome-derived-metabolites` | Chemical-class umbrella; duplicate/overlapping route | Hold: microbial attribution, host co-metabolism, concentration, compartment, and causality are blurred across many molecules and diseases, with several therapeutic or toxicological claims overstated. |

## Route audits

### `metallothionein`

Metallothioneins are a protein family with isoform-, species-, tissue-, redox-, pH-, and metalation-dependent structures and functions. The page assigns one 6–7 kDa form, fixed alpha/beta-domain stoichiometries, a universal affinity hierarchy, and a single displacement story to the family, then moves from in-vitro metal binding to cadmium toxicokinetics, copper absorption, cancer progression, autism, and neurodegeneration. Reviews emphasize multiple coexisting metalated states, stepwise affinities and rate constants, and the difficulty of inferring physiological metal transfer from simplified systems. Select a named organism and isoform/accession or PDB structure, exact metalation state, pH/redox condition, stoichiometry, and experimentally supported function before generating a molecular representation.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D008676 ; https://pubmed.ncbi.nlm.nih.gov/29431781/ ; https://pubmed.ncbi.nlm.nih.gov/35327552/ ; https://pubmed.ncbi.nlm.nih.gov/32784815/ ; local:data/content.generated.json#/pages/metallothionein

### `methylation`

The route begins by combining methyl transfer to DNA, histones, proteins, and small molecules, then treats CpG methylation as a universal gene-silencing switch and asserts that microbial vitamin production directly regulates host methylation capacity. It also merges arsenic biotransformation, nickel- and cadmium-associated epigenetic changes, one-carbon metabolism, and disease observations. These processes use different enzymes, substrates, genomic contexts, tissues, exposures, and assays; methylation can be associated with repression or other regulatory states rather than acting as one deterministic mechanism. The current systematic review of microbiota–folate evidence describes the human causal evidence as predominantly associational and insufficient. Split by chemical process and specify substrate/site, enzyme, donor, organism/tissue, exposure, assay, genomic context, direction, and causal evidence before media generation.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D008745 ; https://pubmed.ncbi.nlm.nih.gov/10754536/ ; https://pubmed.ncbi.nlm.nih.gov/42278572/ ; local:data/content.generated.json#/pages/methylation

### `microbial-biomarkers`

FDA describes a biomarker through its source or matrix, measurable characteristic, analytical method, intended context of use, and reliable interpretation. The page instead groups organism enrichment/depletion, pathogen testing, fecal calprotectin (a host protein), plasma metabolites, uremic solutes, SCFAs, and experimental metallophores as diagnostic, prognostic, or monitoring tools. It calls several observations gold-standard, predictive, actionable, or capable of distinguishing infection from colonization without defining assay, threshold, population, comparator, performance, validation, or regulatory status. International consensus reports scarce evidence for clinical microbiome testing, and a 2025 Delphi consensus states that qualified microbiome-based biomarkers are not in clinical use. Rebuild each candidate around BEST category, specimen, measurand, assay, preanalytics, threshold, population, context of use, training/validation cohorts, performance, calibration, and qualification status.

Authorities: https://www.fda.gov/drugs/biomarker-qualification-program/about-biomarkers-and-qualification ; https://www.fda.gov/drugs/biomarker-qualification-program/qualifying-biomarker-through-biomarker-qualification-program ; https://pubmed.ncbi.nlm.nih.gov/39243797/ ; https://pubmed.ncbi.nlm.nih.gov/39647502/ ; local:data/content.generated.json#/pages/microbial-biomarkers

### `metabolites`

This route overlaps substantially with `microbiome-derived-metabolites` but uses a shorter catalog. It calls metabolites the functional output of the microbiome and assigns beneficial, pro-atherosclerotic, neuroactive, or toxic labels across SCFAs, TMAO, bile acids, tryptophan products, neurotransmitters, uremic solutes, gases, and siderophores. Many are produced or transformed jointly by diet, microbes, intestinal tissue, liver, and host enzymes; measured abundance does not by itself establish origin, flux, producing taxon, compartment, receptor exposure, or causal effect. Correlation-based microbiome–metabolome analysis can poorly identify true contributors even under idealized conditions. Reconcile the duplicate route and organize by named compound, chemical identifier, source/precursor, organism or enzyme evidence, host co-metabolism, matrix, assay, concentration, and validated effect.

Authorities: https://pubmed.ncbi.nlm.nih.gov/24631493/ ; https://pubmed.ncbi.nlm.nih.gov/31848305/ ; https://pubmed.ncbi.nlm.nih.gov/39702677/ ; local:data/content.generated.json#/pages/metabolites ; local:data/content.generated.json#/pages/microbiome-derived-metabolites

### `microbiome-diversity-metrics`

Alpha-diversity estimators and beta-diversity dissimilarities encode different mathematical assumptions and answer different questions. The page lists richness, evenness, entropy, dominance, phylogenetic and presence/absence measures, then says reduced alpha diversity is the most consistent finding across many diseases and that case/control groups typically show significant beta-diversity separation. It does not define sampling depth, feature construction, compositional treatment, rarefaction or normalization, phylogeny, distance choice, covariates, repeated measures, dispersion, multiple testing, effect size, or validation. Current guidance warns that inherited metric assumptions are not always meaningful for microbiome data and recommends multiple complementary dimensions. Rebuild as a methods page with formulas, assumptions, input data, preprocessing, null hypothesis, dispersion checks, effect size, uncertainty, and interpretation before drawing a diversity or ordination figure.

Authorities: https://pubmed.ncbi.nlm.nih.gov/39753610/ ; https://pubmed.ncbi.nlm.nih.gov/41326814/ ; local:data/content.generated.json#/pages/microbiome-diversity-metrics

### `microbiome-derived-metabolites`

This route duplicates the scope of `metabolites` while making stronger causal claims: it calls small molecules the primary chemical language, says they are the molecular mechanism by which dysbiosis causes disease, describes propionate as a neurotoxin in excess, calls TMAO disease-causing, and gives organism-level production assignments and metal-to-metabolite effects without consistent dose, model, matrix, assay, host co-metabolism, or human validation. Reviews distinguish individual SCFAs and emphasize analytical coverage, sample handling, host–microbe attribution, and the poor predictive value of simple taxon–metabolite correlations. Merge or clearly differentiate the two routes, then bound every compound by chemical identity, origin evidence, pathway, compartment, concentration, receptor/target, model, and human causal status before media generation.

Authorities: https://pubmed.ncbi.nlm.nih.gov/39284033/ ; https://pubmed.ncbi.nlm.nih.gov/31848305/ ; https://pubmed.ncbi.nlm.nih.gov/39702677/ ; https://pubmed.ncbi.nlm.nih.gov/42485525/ ; local:data/content.generated.json#/pages/microbiome-derived-metabolites ; local:data/content.generated.json#/pages/metabolites

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
