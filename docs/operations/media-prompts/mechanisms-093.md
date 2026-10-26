# WikiBiome scientific media prompts — mechanisms Batch 093

Date: 2026-09-07  
Authorized parent: `85ae36c905cd766398c3e54ccaa37b444deb9434`

## Pre-generation authority audit

The deterministic queue contains a cytokine-family label, a context-dependent immune-cell relationship, a lifetime-exposure construct, a multi-disease thyroid umbrella, a defined epithelial junction structure, and a receptor with multiple human isoforms and ligand states. Each route was checked against current authoritative identity records and representation boundaries before any generation decision.

### Asset-free scientific holds

- `tgf-beta` does not specify transforming growth factor beta 1, 2, or 3, precursor versus mature ligand, latent versus active state, receptor complex, tissue, or assay. NCBI Gene `7040` and UniProt `P01137` define human TGFB1 specifically and distinguish precursor, latency-associated, latent-complex, mature, and active forms. The route remains asset-free until the exact family member, processed state, oligomeric or receptor-bound state, species, compartment, structure source, and claim scope are fixed.
- `th17-treg-balance` is a context-, tissue-, time-, marker-, gating-, and disease-dependent relationship between heterogeneous immune-cell populations, not a single physical structure or diagnostic ratio. PMID `38558800` explicitly describes heterogeneity in one disease context, while the route generalizes a universal “master switch” across many conditions. It remains asset-free pending a defined population, specimen, markers/gating, assay, time point, disease/model, cytokine context, comparator, endpoint, and evidence tier.
- `exposome` is a lifetime measure of all exposures and their health relationships, not one specimen, anatomy, or exposure mixture. MeSH `D000081413` defines the concept broadly. The route remains asset-free pending a bounded exposome domain, population, life stage, geography, exposure panel, matrix, measurement method, time window, endpoint, and uncertainty model.
- `thyroid-autoimmunity` merges distinct autoimmune thyroid diseases, including already-reviewed Graves disease and Hashimoto disease, with minerals, toxicants, microbiome observations, antibodies, supplementation, and multiple causal claims. MeSH `D013967` covers autoimmune thyroiditis rather than every autoimmune thyroid disease, and the literature distinguishes clinically different entities. It remains asset-free pending canonical scope or routing, exact condition, tissue/pathology state, antibody or analyte, specimen, assay, population, and evidence tier.
- `tlr4` names a human gene/protein but does not specify isoform, species, domain, membrane state, MD-2/CD14/LPS complex, ligand, activation state, or structure. NCBI Gene `7099` records multiple transcript variants, while PDB `3FXI` is one specific human TLR4–MD-2–E. coli LPS Ra complex. It remains asset-free until the exact human isoform and molecular complex or deliberately non-structural teaching boundary is fixed.

No prompt marker exists for those five routes. The built-in generator must not be called for them.

### `tight-junctions`

MeSH `D019108` defines tight junctions as cell-cell junctions sealing adjacent epithelial cells. PMID `38859584` supports a conservative architecture orientation: tight-junction strands occupy the apical contact between adjacent epithelial cells, claudins assemble laterally and across the intercellular space, and cytoplasmic zonula-occludens scaffolds associate below. The image must not identify a claudin subtype, protein copy number, molecular structure, tissue-specific permeability, intact-versus-disrupted disease state, transport rate, biomarker, or diagnosis.

<!-- PROMPT tight-junctions START -->
```text
Use case: scientific-educational. Asset type: review-only WikiBiome structural-orientation reconstruction for tight junctions, MeSH D019108. Create one isolated, large, label-free epithelial junction teaching model on a uniform pale field. Show exactly two adjacent simplified epithelial cells as two complete tall cutaway cell bodies with their apical surfaces aligned at the top. At the uppermost lateral contact between the cells, show one narrow continuous sealing band made of restrained interlocking bead-like strands crossing only the small intercellular gap. Immediately beneath that band, show a small sparse submembrane scaffold mesh on the cytoplasmic side of each cell. Keep the remaining lateral membranes visibly separate below the sealing band; do not show leakage, arrows, particles crossing the gap, inflammation, damage, or disease. This is a tissue-scale orientation only: do not depict or imply a specific claudin subtype, occludin copy number, zonula-occludens isoform, atomic protein structure, measured permeability, transport rate, biomarker, or diagnosis. Keep both complete cells, the full apical surfaces, the entire sealing band, and all scaffold mesh entirely inside a broad 1200 by 630 crop-safe band with uninterrupted pale space on every edge. Landscape 3:2 at 1536 by 1024; uniform high-key cool pale blue-white background approximately #f3f7fb; restrained translucent silver-blue membranes, soft graphite cytoplasm, and one subtle cool-copper sealing band; technically precise medical teaching-model finish; soft clinical studio illumination; minimal scene-making. No labels, letters, numbers, arrows, legend, chart, organ, lumen contents, microbiota, pathogen, immune cell, blood cell, person, glow, vignette, clipping, signature, or watermark. Educational reconstruction, not a micrograph, histology slide, molecular structure, permeability assay, disease state, or diagnostic image.
```
<!-- PROMPT tight-junctions END -->

## Authority and representation boundary

- NCBI Gene `7040` and UniProtKB `P01137` establish human TGFB1 specifically and distinguish processed and latent/active forms; they do not authorize a generic family-wide TGF-beta portrait.
- PMID `38558800` documents context-dependent heterogeneity in Th17/Treg relationships and does not establish one universal cross-disease ratio or morphology.
- MeSH `D000081413` defines the exposome as a lifetime all-source exposure measure; it does not supply one bounded visual subject.
- MeSH `D013967` defines autoimmune thyroiditis, while PMID `31434818` distinguishes Graves disease, Hashimoto thyroiditis, and other immune-associated thyroid states; the WikiBiome umbrella route is not one pathology specimen.
- MeSH `D019108` and PMID `38859584` support the limited two-cell apical tight-junction orientation frozen here. They do not establish protein subtype, copy number, molecular conformation, tissue-specific function, or disease state.
- NCBI Gene `7099` records multiple human TLR4 transcript variants; PDB `3FXI` represents one particular human TLR4–MD-2–LPS Ra complex. Neither supports an unspecified universal receptor-state image.

Scientific references:

- https://www.ncbi.nlm.nih.gov/gene/7040
- https://www.uniprot.org/uniprotkb/P01137/entry
- https://pubmed.ncbi.nlm.nih.gov/38558800/
- https://meshb.nlm.nih.gov/record/ui?ui=D000081413
- https://meshb.nlm.nih.gov/record/ui?ui=D013967
- https://pubmed.ncbi.nlm.nih.gov/31434818/
- https://meshb.nlm.nih.gov/record/ui?ui=D019108
- https://pubmed.ncbi.nlm.nih.gov/38859584/
- https://www.ncbi.nlm.nih.gov/gene/7099
- https://www.rcsb.org/structure/3FXI

Exactly one route is scientifically cleared for exactly one built-in image-generation call. No prompt may change after the prompt-freeze commit without a new audit. Returned media remains review-only until native-resolution inspection, literal cell/group/junction accounting, prohibited-content and edge-field audit, exact-hash acceptance, metadata reconciliation, and derivative crop review are complete. Prompt-requested content must never be reported as observed output.

## Frozen prompt hashes

The marker-bound Tight Junctions prompt SHA-256 is recorded in the batch manifest. Any prompt change requires a new authority audit and prompt freeze before generation.
