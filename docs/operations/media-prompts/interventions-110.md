# WikiBiome scientific media prompt freeze — interventions Batch 110

Date: 2026-09-07

Authorized parent: `9f559e3270d3ddefa9b92f7d9c8ef37fede578c3`

## Pre-generation authority boundary

The deterministic six-route queue was checked against the generated article corpus and the current NLM MeSH records for Prebiotics (D056692), Inulin (D007444), Fructans (D005630), Probiotics (D019936), Polycystic Ovary Syndrome (D011085), Renal Insufficiency, Chronic (D051436), Autism Spectrum Disorder (D000067877), and Hashimoto Disease (D050031).

The controlled descriptors identify broad ingredient, supplement, and disease classes. They do not select a reproducible inulin/FOS composition, a probiotic strain mixture, a commercial or investigational product, or a clinical protocol for any route in this batch.

Four pages have zero linked sources. `probiotics-general` has one resolved source, limited to the genomic classification of strain 35624, while the page spans many unrelated probiotic organisms and products. `probiotics-asd-dysbiosis` declares five source identifiers, but every identifier incorrectly retains a `.md` suffix and therefore fails the normal source resolver despite similarly named source records existing without that suffix.

## Frozen no-call decision

No route is cleared for an image-generation prompt. There is therefore no marker-bound prompt block and no prompt hash for Batch 110.

A generic capsule, bottle, food powder, molecule, bacterial plate, gut scene, ovary, kidney, thyroid, or brain image would invent a product or formulation, collapse incompatible taxa and strains, imply an unsupported treatment protocol, or stigmatize a condition-specific population. Such decorative stand-ins are prohibited by the scientific-media program.

The built-in image-generation tool must not be called for these six routes unless a later separately committed audit supplies the missing exact identities, composition, protocol, direct evidence, and visual claim boundary. The absence of calls is the frozen prompt decision.

## Sources checked

- https://meshb.nlm.nih.gov/record/ui?ui=D056692
- https://meshb.nlm.nih.gov/record/ui?ui=D007444
- https://meshb.nlm.nih.gov/record/ui?ui=D005630
- https://meshb.nlm.nih.gov/record/ui?ui=D019936
- https://meshb.nlm.nih.gov/record/ui?ui=D011085
- https://meshb.nlm.nih.gov/record/ui?ui=D051436
- https://meshb.nlm.nih.gov/record/ui?ui=D000067877
- https://meshb.nlm.nih.gov/record/ui?ui=D050031
- `data/content.generated.json` entries for all six routes and the five ASD source-resolution checks
