# WikiBiome scientific media authority audit — mechanisms Batch 096

Date: 2026-09-07

Authorized parent: `0e362fa54ea20ef16f361d1d2478d1c387a0c3b4`

Routes: `virulence-factors`, `vitamin-b12`, `vitamin-d`, `zinc-metalloprotease`, `zonulin`

## Gate outcome

All five routes fail the pre-generation scientific-identity or representation-verifiability gate. No immutable generation prompt is authorized, no built-in image-generation call is made, and no raster is created. A generic toxin, vitamin molecule, metalloprotease active site, or intestinal-barrier scene would silently select one member or mechanism while the route makes broader claims.

## Route audits

### `virulence-factors`

MeSH `D037521` defines a class containing different biological toxins and surface-adhesion molecules and advises coordination with specific factors. The local route is broader still, combining toxins, adhesins, invasins, capsules, biofilm matrices, metal-acquisition systems, metabolic enzymes, many organisms, and host targets. It does not select one factor, sequence, assembly, cofactor state, structure, specimen, compartment, or assay. Split by exact factor and organism before visual review.

Authority: https://meshb.nlm.nih.gov/record/ui?ui=D037521 ; local:data/content.generated.json#/pages/virulence-factors

### `vitamin-b12`

MeSH `D014805` places Vitamin B 12, cobalamin/cobalamins, and cyanocobalamin under one heading, while methylcobalamin and adenosylcobalamin are chemically and functionally distinct forms. The route discusses a generic cobalt-containing corrin cofactor, microbial synthesis, methylation, deficiency, transport overlap, and mis-metalation without choosing an exact upper axial ligand, cobalt state, chemical form, carrier-bound state, compartment, or measurement. A single molecular model would falsely collapse that family.

Authorities: https://meshb.nlm.nih.gov/record/ui?ui=D014805 ; https://meshb.nlm.nih.gov/record/ui?ui=C019476 ; https://meshb.nlm.nih.gov/record/ui?ui=C000913 ; local:data/content.generated.json#/pages/vitamin-b12

### `vitamin-d`

MeSH `D014807` explicitly includes cholecalciferols and ergocalciferols. The route additionally treats calciferol, active calcitriol, skin synthesis, circulating deficiency/status, supplementation, receptor activity, and diverse disease associations as one subject. Those are different molecules, compartments, exposures, and endpoints. Split by exact D2/D3 or metabolite identity, source and dose, specimen and assay, concentration, receptor target, population/model, and evidence tier.

Authority: https://meshb.nlm.nih.gov/record/ui?ui=D014807 ; local:data/content.generated.json#/pages/vitamin-d

### `zinc-metalloprotease`

The route merges host matrix metalloproteinases, bacterial fragilysin, Pseudomonas elastase, Vibrio enzymes, and thermolysin-like proteases. MeSH `D020782` identifies matrix metalloproteinases as a zinc-dependent family, labels the term general/unspecified, and instructs use of specific members where possible. The local page also calls BFT both a zinc metalloprotease and a zinc-dependent serine protease, an internal mechanism conflict that must not be encoded visually. Select one exact enzyme/accession, activation and zinc state, structure, ligand/substrate, organism, compartment, and corrected mechanism.

Authority: https://meshb.nlm.nih.gov/record/ui?ui=D020782 ; local:data/content.generated.json#/pages/zinc-metalloprotease

### `zonulin`

NCBI Gene `3240` identifies human haptoglobin and records multiple transcripts and processed protein products. PMID `29459849` reports that a widely used commercial zonulin ELISA did not detect pre-haptoglobin-2 and instead recognized properdin as a potential family member. The route treats pre-haptoglobin-2, physiological activity, serum measurement, and clinical biomarker claims as one analyte. A molecular portrait would not represent an assay signal, and an assay image would not establish the protein identity. Split exact protein isoform/state from exact validated assay/analyte records.

Authorities: https://www.ncbi.nlm.nih.gov/gene/3240 ; https://pubmed.ncbi.nlm.nih.gov/29459849/ ; local:data/content.generated.json#/pages/zonulin

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The five routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named scientific and editorial corrections are committed and independently re-audited.
