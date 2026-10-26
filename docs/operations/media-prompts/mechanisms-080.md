# WikiBiome scientific media authority audit — mechanisms Batch 080

Date: 2026-09-07  
Authorized parent: `a2e7c4bc0fc604ba3f436b332578093f1968b411`

## Batch decision

The deterministic queue is `metabolic-syndrome`, `metabolomics`, `metal-carcinogenesis`, `metal-chelation-therapy`, `metal-resistance-genes`, and `metal-sensing`. All six routes fail closed as temporary asset-free scientific-media holds because their current articles contain material diagnostic, analytical, exposure, taxonomic, representation, or clinical-treatment conflicts. No route has a marked generation prompt, and the built-in generator receives zero calls.

| Route | Controlled identity | Decision and boundary |
|---|---|---|
| `metabolic-syndrome` | MeSH `D024821` | Hold: the syndrome is reduced to contradictory cross-sectional nickel studies while prevalence comparisons and oxidative-stress markers risk implying causality. |
| `metabolomics` | MeSH `D055432` | Hold: a measurement discipline is presented as a platform/biomarker catalog with incorrect analytical generalizations and no specimen, identification, QC, normalization, or validation standards. |
| `metal-carcinogenesis` | Mechanism umbrella; no single controlled entity | Hold: distinct elements, species, routes, doses, tissues, and cancer sites are compressed into three universal mechanistic paradigms and one repair-inhibition theme. |
| `metal-chelation-therapy` | MeSH `D002612` | Hold: prescription treatment is presented as a simplified chelator-by-metal protocol with approval, indication, threshold, first-line, safety, and efficacy claims that require current toxicology guidance. |
| `metal-resistance-genes` | Gene-family/ecological umbrella; no single controlled identifier | Hold: selected genes, taxa, environments, mobile elements, and co-selection examples become universal automatic AMR-selection and clinical-risk claims. |
| `metal-sensing` | Regulatory-system umbrella; no single controlled identifier | Hold: diverse organism-specific protein and RNA sensors become one compatibility/flow theory with universal virulence and therapeutic-target claims. |

## Route audits

### `metabolic-syndrome`

MeSH D024821 defines a cluster of cardiometabolic risk factors, while the route is specifically “Metabolic Syndrome and Metal Exposure” and almost entirely a nickel epidemiology summary. It compares occupational-worker diabetes prevalence with a national figure without matched inference, reports multiple contradictory NHANES dose-response shapes from the same cycle, and labels oxidative stress the primary proposed link. The article itself acknowledges cross-sectional designs, inconsistent definitions, and no relevant low-dose animal model. Define the diagnostic criteria used, specimen and nickel biomarker, exposure source, timing, kidney-function adjustment, population, covariates, multiplicity, and prospective evidence; do not infer causality or essentiality from cross-sectional concentration differences before choosing an anatomical or exposure representation.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D024821 ; local:data/content.generated.json#/pages/metabolic-syndrome

### `metabolomics`

MeSH D055432 defines systematic identification and quantitation of metabolic products under specified conditions. The page lists platforms as if each maps cleanly to one use, describes GC-MS as the most direct measure of beneficial microbiome activity, labels ICP-MS “metal speciation,” treats untargeted signals as disease biomarkers, and generalizes metabolites and producing taxa across conditions. ICP-MS measures elements/isotopes and requires separation or other methods for chemical speciation. Metabolomics Standards Initiative guidance requires sample preparation, analytical, QC, metabolite-identification, and preprocessing metadata, and metabolite identification remains a major bottleneck. Rebuild around study design, specimen, quenching, platform, chromatography, ionization, calibration, blanks/QC, normalization, annotation confidence, validation, batch effects, and data deposition before an instrument or workflow image is considered.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D055432 ; https://pubmed.ncbi.nlm.nih.gov/24039616/ ; https://pubmed.ncbi.nlm.nih.gov/34928621/ ; local:data/content.generated.json#/pages/metabolomics

### `metal-carcinogenesis`

Cancer risk depends on the exact element and chemical species, route, intensity/duration, tissue, co-exposures, and cancer site. The page compresses nickel, arsenic, and chromium into epigenetic, proliferative, and genotoxic archetypes; says arsenic forms no DNA adducts, chromium forms abundant generic Cr-DNA adducts, all three share repair inhibition and cocarcinogenicity, and low chronic doses may be fundamentally different without consistently tying claims to species or route. NCI evidence is exposure-specific—for example occupational hexavalent-chromium exposure and particular cancers—and classification does not mean every exposure causes cancer. Split the route by carcinogenic agent/species, exposure route, target site, human evidence, mechanistic model, dose, and regulatory classification before any unified mechanism plate is considered.

Authorities: https://www.cancer.gov/about-cancer/causes-prevention/risk/substances/carcinogens ; https://www.cancer.gov/about-cancer/causes-prevention/risk/substances/chromium ; https://dceg.cancer.gov/research/public-health-impact/occupation ; local:data/content.generated.json#/pages/metal-carcinogenesis

### `metal-chelation-therapy`

Chelation is prescription medical treatment with agent-, compound-, route-, exposure-, symptom-, age-, pregnancy-, renal/hepatic-function-, and jurisdiction-specific indications. The page provides “first-line” tables, fixed lead thresholds, DMPS preferences, Wilson-disease sequencing, nickel-carbonyl antidote claims, TACT implications, and detailed treatment tradeoffs without a dated jurisdictional guideline matrix. Some language is inaccurate or internally unsafe, including a blanket adult lead first-line assignment and statements that chelation is appropriate whenever symptomatic exposure and correlated levels follow source removal. FDA states all approved chelation products require prescriptions and warns of kidney failure and death from inappropriate use; CDC/ATSDR emphasizes expert management and source control. Replace the protocol table with a non-prescriptive indication overview linked to current poison-control/toxicology guidance, exact approvals, contraindications, monitoring, and emergency referral before any treatment image is considered.

Authorities: https://www.fda.gov/drugs/medication-health-fraud/questions-and-answers-unapproved-chelation-products ; https://www.fda.gov/drugs/drug-safety-and-availability/fda-warns-consumers-about-potential-health-risks-using-thorne-researchs-captomer-products ; https://wwwn.cdc.gov/TSP/MMG/MMGDetails.aspx?mmgid=1203&toxid=22 ; local:data/content.generated.json#/pages/metal-chelation-therapy

### `metal-resistance-genes`

Metal resistance is distributed across genes, operons, mobile elements, chromosomes, taxa, metal species, concentrations, environments, and phenotypes. The page asserts that physical linkage means selecting for one automatically selects for antibiotics, that hospital copper surfaces may drive VRE, and that environmental and dietary cadmium select gut organisms with specific antibiotic resistance, without consistently establishing linkage, host, expression, transfer, concentration, or clinical outcome. Recent reviews warn that molecular mechanisms are often undefined or unquantified, correlational bias is common, and clinical co-selection studies are scarce. Separate co-resistance, cross-resistance, co-regulation, tolerance, and phenotypic resistance; require host-linked genomic and functional evidence and bounded exposure conditions before a gene/mobile-element diagram is considered.

Authorities: https://pubmed.ncbi.nlm.nih.gov/38897736/ ; https://pubmed.ncbi.nlm.nih.gov/35170159/ ; local:data/content.generated.json#/pages/metal-resistance-genes

### `metal-sensing`

Metal sensing comprises diverse protein regulators and riboswitches whose ligands, oxidation states, accessory sites, regulons, and physiology vary by organism. The page says Fur derepresses an entire virulence arsenal under host restriction, host manganese flooding exploits Fur mismetallation, yybP-ykoY is uniformly manganese-sensing, all cellular sensors must be co-evolved, weak-metal sensors use kinetic while strong-metal sensors use thermodynamic discrimination, importers lack specificity, and inhibiting sensors would predictably disable pathogens. These are context-dependent examples or hypotheses, not universal rules. Rebuild by sensor family, exact organism/protein/RNA identifier, cognate species, structure, binding stoichiometry, regulon, assay, growth condition, and in-vivo evidence; distinguish reviews and models from validated therapeutic targets before drawing a sensor network.

Authorities: https://pubmed.ncbi.nlm.nih.gov/39658019/ ; https://pubmed.ncbi.nlm.nih.gov/39755956/ ; https://pubmed.ncbi.nlm.nih.gov/25160631/ ; local:data/content.generated.json#/pages/metal-sensing

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named editorial corrections are committed and independently re-audited.
