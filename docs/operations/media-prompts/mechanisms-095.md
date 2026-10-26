# WikiBiome scientific media authority audit — mechanisms Batch 095

Date: 2026-09-07

Authorized parent: `aabb5746b474723c6866881c13ff2e560b231517`

Routes: `urease`, `uremic-toxins`, `ursodeoxycholic-acid`, `vancomycin`, `viral-microbiota`, `virome`

## Gate outcome

All six routes fail the pre-generation scientific-identity or representation-verifiability gate. No immutable generation prompt is authorized, no built-in image-generation call is made, and no raster is created. A generic enzyme, toxin, chemical model, medicine container, phage, or viral community would imply a specificity that the current route and output could not support.

## Route audits

### `urease`

NLM MeSH `D014510` and EC `3.5.1.5` identify the catalytic enzyme class, not one universal molecular assembly. The page spans multiple pathogenic prokaryotes and eukaryotes, holo and apo states, nickel and non-catalytic iron-associated discussion, accessory maturation systems, active-site chemistry, and organism-specific virulence. It does not select a species, exact sequence/subunit, oligomeric state, metalation state, ligand state, or structure accession. Choose those variables or a formally bounded non-structural reaction view before generation.

Authority: https://meshb.nlm.nih.gov/record/ui?ui=D014510 ; local:data/content.generated.json#/pages/urease

### `uremic-toxins`

MeSH `D000087527` defines a class of biological solutes retained because of kidney impairment. The page combines chemically distinct indoxyl sulfate, p-cresyl sulfate, trimethylamine N-oxide, precursor pathways, producing taxa, protein-binding behavior, renal clearance, and multiple pathological effects. No single molecule, mixture, specimen, concentration, or measured panel can represent the class. Split by analyte, chemical form, precursor/pathway, specimen, concentration and units, binding fraction, renal-function stratum, assay, comparator, endpoint, and evidence tier.

Authority: https://meshb.nlm.nih.gov/record/ui?ui=D000087527 ; local:data/content.generated.json#/pages/uremic-toxins

### `ursodeoxycholic-acid`

PubChem CID `31401` and manually annotated ChEBI `9907` identify ursodeoxycholic acid, formula C24H40O4 and InChIKey `RUDATBOHQWOJDD-UZVSRGJWSA-N`. The record specifies a multi-stereocenter bile acid, including the 7-beta hydroxy orientation that distinguishes UDCA from related bile acids with the same heavy-atom connectivity. A generative ball-and-stick image could appear chemically persuasive without proving those stereochemical assignments. Media must instead be rendered deterministically from an authoritative connection table, independently licensed, and audited for atom/bond graph, every stereocenter, chemical form, and conformation boundary.

Authorities: https://pubchem.ncbi.nlm.nih.gov/compound/31401 ; https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:9907 ; local:data/content.generated.json#/pages/ursodeoxycholic-acid

### `vancomycin`

PubChem CID `14969`, ChEBI `28001`, and MeSH `D014640` identify vancomycin. PubChem records C66H75Cl2N9O24, molecular weight 1449.2, extensive stereochemistry, and no computed 3D conformer because the molecule contains too many atoms for that workflow. A one-call generated structure cannot be literally audited at this complexity, while a generic unlabeled vial, powder, or tablet cannot establish vancomycin identity or chemical form. Use a deterministic authoritative-structure rendering or an exact, licensed, form-specific product/specimen record.

Authorities: https://pubchem.ncbi.nlm.nih.gov/compound/14969 ; https://www.ebi.ac.uk/chebi/CHEBI:28001 ; https://meshb.nlm.nih.gov/record/ui?ui=D014640 ; local:data/content.generated.json#/pages/vancomycin

### `viral-microbiota`

MeSH `D000083422` lists “Viral Microbiome” as an entry term for the preferred concept “Virome.” The local page explicitly describes itself as a redirect and cross-reference to the comprehensive `virome` page, yet both remain canonical routes. A separate image would duplicate one controlled concept and preserve a routing inconsistency. Retire this page to a permanent alias, or define a genuinely narrower niche, specimen, viral fraction, method, taxonomic scope, and evidence boundary.

Authority: https://meshb.nlm.nih.gov/record/ui?ui=D000083422 ; local:data/content.generated.json#/pages/viral-microbiota

### `virome`

MeSH `D000083422` defines a virome as all viruses within a particular biological niche. The current page combines gut and brain contexts, bacteriophages, eukaryotic viruses, endogenous elements, many diseases, ecological interactions, classifiers, and therapeutic claims. It does not specify one niche, specimen, sequencing/enrichment protocol, taxonomic or vOTU composition, host assignment, population/model, comparator, or time point. A generic phage collection would visually substitute familiar morphotypes for measured community evidence. Define a measured dataset or a reviewed niche-specific atlas before generation.

Authority: https://meshb.nlm.nih.gov/record/ui?ui=D000083422 ; local:data/content.generated.json#/pages/virome

## Hold boundary

No text in this packet is a generation prompt. No prompt marker exists. The six routes receive no image call or raster and remain excluded from registry ownership, public masters and derivatives, canonical media endpoints, Schema.org `ImageObject`, social previews, and the image sitemap until the named scientific and editorial corrections are committed and independently re-audited.
