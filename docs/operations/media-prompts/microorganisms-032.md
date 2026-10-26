# WikiBiome microorganism media batch 032: identity, evidence, and immutable prompts

Review packet date: 2026-09-05
Authorized parent: `ab2ecb0a7146e7a2e85ca491c9c88e2da9e98ef1`
Scope: review-only scientific reconstructions for six deterministic microorganism routes. No asset in this packet is approved, registered, published, or eligible for a public endpoint before independent Control Tower review of its exact immutable hash.

## Queue and identity decisions

The supplied queue was audited before prompt creation against local canonical routes, current NCBI Taxonomy and LPSN records, and the cited primary or type-anchored morphology records. DOI, title, and PMID mappings were cross-checked. Authorities provide factual constraints only; no source image, micrograph, or design is copied. Each proposed plate is an original trained-algorithmic scientific reconstruction eligible for CC BY-SA 4.0 publication only after exact-hash Control Tower acceptance.

1. `pseudomonas-aeruginosa` — **cleared.** Current correct species *Pseudomonas aeruginosa*, NCBITaxon:287; type strain ATCC 10145 / DSM 50071. LPSN retains the name as correct and explicitly recommended for medical use while recording *P. paraeruginosa* as a heterotypic synonym. The BacDive type record supports rod-shaped cells and a polar monotrichous flagellum. The proposed static species plate conservatively uses slender rods and omits the optional surface structure without making a motility claim.
2. `purpureocillium` — **cleared.** Current genus *Purpureocillium*, NCBITaxon:1052105; type species *P. lilacinum*. PMID 21631575 / DOI `10.1111/j.1574-6968.2011.02322.x`, “Purpureocillium, a new genus for the medically important Paecilomyces lilacinus,” establishes the genus and current combination. A restrained type-species-anchored plate of septate hyphae, tapering phialides, and limited chains of ellipsoidal-to-fusiform conidia is supportable as representative and non-diagnostic; no colony color or disease context is used.
3. `ralstonia` — **cleared.** Current correct genus *Ralstonia*, NCBITaxon:48736; type species *R. pickettii*. PMID 8657018 / DOI `10.1111/j.1348-0421.1995.tb03275.x`, “Transfer of two Burkholderia and an Alcaligenes species to Ralstonia gen. nov.,” establishes the genus. Type-strain records support rods and a polar flagellum for *R. pickettii*, while the genus includes motile and nonmotile species. The proposed plate therefore uses conservative rods with appendages omitted and makes no universal motility claim.
4. `rikenella` — **cleared.** Current correct genus *Rikenella*, NCBITaxon:28138; type species *R. microfusus*. DOI `10.1016/S0723-2020(85)80015-1`, “Reclassification of Bacteroides microfusus ... in a New Genus Rikenella,” establishes the genus; LPSN identifies the type-species epithet as referring to small spindle-shaped cellular morphology. The proposed plate is a restrained type-species-anchored selection of small tapered rods, representative and non-diagnostic.
5. `roseburia` — **cleared.** Current correct genus *Roseburia*, NCBITaxon:841; type species *R. cecicola*. DOI `10.1099/00207713-33-3-618`, “Roseburia cecicola gen. nov., sp. nov., a Motile, Obligately Anaerobic Bacterium from a Mouse Cecum,” establishes the genus and supports slightly curved rods. Its numerous flagella are not generalized across the current genus and are omitted from the static plate without making a motility claim.
6. `roseburia-intestinalis` — **cleared.** Current correct species *Roseburia intestinalis*, NCBITaxon:166486; type strain L1-82 / DSM 14610 / NCIMB 13810. PMID 12361264 / DOI `10.1099/00207713-52-5-1615`, “Roseburia intestinalis sp. nov., a novel saccharolytic, butyrate-producing bacterium from human faeces,” supports slightly curved rods and multiple subterminal flagella. The proposed species plate uses the supported rod geometry while omitting flagella and making no motility or diagnostic claim.

## Exact authorities

- `pseudomonas-aeruginosa`: <https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=287&mode=Info>; <https://lpsn.dsmz.de/species/pseudomonas-aeruginosa>; <https://bacdive.dsmz.de/strain/12800>.
- `purpureocillium`: <https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1052105&mode=Info>; <https://pubmed.ncbi.nlm.nih.gov/21631575/>; <https://doi.org/10.1111/j.1574-6968.2011.02322.x>.
- `ralstonia`: <https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=48736&mode=Info>; <https://lpsn.dsmz.de/genus/ralstonia>; <https://pubmed.ncbi.nlm.nih.gov/8657018/>; <https://doi.org/10.1111/j.1348-0421.1995.tb03275.x>; <https://bacdive.dsmz.de/strain/2085>.
- `rikenella`: <https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=28138&mode=Info>; <https://lpsn.dsmz.de/genus/rikenella>; <https://lpsn.dsmz.de/species/rikenella-microfusus>; <https://doi.org/10.1016/S0723-2020(85)80015-1>; <https://bacdive.dsmz.de/strain/14034>.
- `roseburia`: <https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=841&mode=Info>; <https://lpsn.dsmz.de/genus/roseburia>; <https://doi.org/10.1099/00207713-33-3-618>.
- `roseburia-intestinalis`: <https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=166486&mode=Info>; <https://lpsn.dsmz.de/species/roseburia-intestinalis>; <https://pubmed.ncbi.nlm.nih.gov/12361264/>; <https://doi.org/10.1099/00207713-52-5-1615>; <https://bacdive.dsmz.de/strain/6366>.

## Immutable generation prompts

The text between each route's prompt markers is the exact input for that route's single built-in generation call. Counts are composition targets, never output evidence. Prompt hashes are frozen before any generation call.

### `pseudomonas-aeruginosa-draft.png`

<!-- PROMPT pseudomonas-aeruginosa START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome bacterial-species morphology reconstruction
Primary request: Create a conservative static plate for current Pseudomonas aeruginosa, NCBITaxon:287, anchored to type strain ATCC 10145 / DSM 50071 and authoritative slender rod morphology; the image must remain representative and non-diagnostic, including in light of the recorded Pseudomonas paraeruginosa heterotypic synonym boundary.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly eight visible slender rod bodies arranged as six clearly separated groupings: four isolated singles and two touching two-body pairs. Use straight to very gently curved rods with rounded ends, crisp ordinary individual boundaries in pairs, and restrained variation in length and orientation.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all six count-bearing groupings centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every body fully inside the frame.
Constraints: Static type-strain-anchored representative species morphology only. No claim that shape or grouping diagnoses P. aeruginosa or visually settles current species boundaries. The type-strain polar flagellum is intentionally omitted and its absence makes no motility claim. No flagellum, pilus, fimbria, pigment or colony-color cue, capsule, halo, sheath, shared envelope, biofilm, spore, branch, label, text, arrow, scale bar, decorative particle, glow, host tissue, disease scene, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT pseudomonas-aeruginosa END -->

### `purpureocillium-draft.png`

<!-- PROMPT purpureocillium START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome fungal-genus morphology reconstruction
Primary request: Create a restrained static plate for current Purpureocillium, NCBITaxon:1052105, anchored to the type species Purpureocillium lilacinum and the primary genus description; show representative hyphal, phialide, and conidial structures without implying visual diagnosis or a universal genus morphology.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment, colony, or scene and no darkening at any edge.
Subject: Exactly two separated compact fungal groupings. Each grouping has one short pale septate hyphal base bearing two slender tapering brush-like phialides. Each phialide terminates in one short countable chain of exactly three smooth ellipsoidal-to-fusiform conidia. Keep all branches and conidial chains clearly bounded and sparse.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue fungal material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never decorative, cartoonish, or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep both complete structures and every conidium centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and nothing clipped.
Constraints: Static type-species-anchored representative morphology only. No claim that these structures diagnose Purpureocillium. No purple colony field, sprawling mycelial scene, dense conidial cloud, spherical sporangium, fruiting body, host tissue, disease scene, culture plate, label, text, arrow, scale bar, decorative particle, conceptual glow, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT purpureocillium END -->

### `ralstonia-draft.png`

<!-- PROMPT ralstonia START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome bacterial-genus morphology reconstruction
Primary request: Create a conservative static plate for current Ralstonia, NCBITaxon:48736, anchored to the type species Ralstonia pickettii and authoritative rod morphology; the image must remain representative, non-universal, and non-diagnostic across the current genus.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly nine visible short-to-moderate rod bodies arranged as seven clearly separated groupings: five isolated singles and two touching two-body pairs. Use straight to very gently curved rounded rods, crisp ordinary individual boundaries in pairs, and restrained variation in length and orientation.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all seven count-bearing groupings centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every body fully inside the frame.
Constraints: Static type-species-anchored representative morphology only. No claim that shape or grouping diagnoses Ralstonia. Surface structures are intentionally omitted because motility and flagellar arrangements are not universal across the genus; omission makes no motility claim. No flagellum, pilus, capsule, halo, sheath, shared envelope, biofilm, spore, branch, label, text, arrow, scale bar, decorative particle, glow, host tissue, disease scene, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT ralstonia END -->

### `rikenella-draft.png`

<!-- PROMPT rikenella START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome bacterial-genus morphology reconstruction
Primary request: Create a conservative static plate for current Rikenella, NCBITaxon:28138, anchored to the type species Rikenella microfusus and its documented small spindle-like cellular morphology; the image must remain representative, non-universal, and non-diagnostic.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly nine visible small slender spindle-like rod bodies arranged as seven clearly separated groupings: five isolated singles and two touching two-body pairs. Use modestly tapered poles, mostly straight bodies with only restrained gentle curvature, crisp ordinary individual boundaries in pairs, and natural orientation variation.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all seven count-bearing groupings centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every body fully inside the frame.
Constraints: Static type-species-anchored representative morphology only. No claim that spindle shape or grouping diagnoses Rikenella. No appendage, flagellum, pilus, capsule, halo, sheath, shared envelope, biofilm, spore, branch, extreme filament, label, text, arrow, scale bar, decorative particle, glow, host tissue, disease scene, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT rikenella END -->

### `roseburia-draft.png`

<!-- PROMPT roseburia START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome bacterial-genus morphology reconstruction
Primary request: Create a conservative static plate for current Roseburia, NCBITaxon:841, anchored to the type species Roseburia cecicola and its authoritative slightly curved rod morphology; the image must remain representative, non-universal, and non-diagnostic across the current genus.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly nine visible moderate-length rod bodies arranged as seven clearly separated groupings: five isolated singles and two touching two-body pairs. Use a restrained mix of straight and slightly curved rounded rods, crisp ordinary individual boundaries in pairs, and natural variation in length and orientation.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all seven count-bearing groupings centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every body fully inside the frame.
Constraints: Static type-species-anchored representative morphology only. No claim that shape or grouping diagnoses Roseburia. Type-species flagella are intentionally omitted rather than generalized across the genus; omission makes no motility claim. No flagellum, pilus, capsule, halo, sheath, shared envelope, biofilm, spore, branch, label, text, arrow, scale bar, decorative particle, glow, host tissue, intestinal or faecal scene, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT roseburia END -->

### `roseburia-intestinalis-draft.png`

<!-- PROMPT roseburia-intestinalis START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome bacterial-species morphology reconstruction
Primary request: Create a conservative static plate for current Roseburia intestinalis, NCBITaxon:166486, anchored to type strain L1-82 / DSM 14610 / NCIMB 13810 and the primary-description slightly curved rod morphology; the image must remain representative and non-diagnostic and must not invent illustration-level separability from the Roseburia genus plate.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly eight visible slightly curved moderate-length rod bodies arranged as six clearly separated groupings: four isolated singles and two touching two-body pairs. Give several rods a restrained shallow arc, with rounded ends, crisp ordinary individual boundaries in pairs, and natural variation in orientation.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all six count-bearing groupings centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every body fully inside the frame.
Constraints: Static current-species, type-strain-anchored representative morphology only. No claim that curvature, shape, or grouping diagnoses R. intestinalis. Primary-description subterminal flagella are intentionally omitted and their absence makes no motility claim. No flagellum, pilus, capsule, halo, sheath, shared envelope, biofilm, spore, branch, label, text, arrow, scale bar, decorative particle, glow, host tissue, intestinal or faecal scene, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT roseburia-intestinalis END -->

## Generation and native-resolution audit ledger

Exactly one built-in generation call was made for each cleared route. Each returned 1536 by 1024 RGB PNG was copied byte-for-byte into `work/media-drafts/microorganisms-batch-032/` and inspected directly at native resolution. No retry, revision, edit, reference image, public derivative, master, registry key, endpoint, or sitemap ownership occurred.

| Route | Prompt SHA-256 | Generation record | Draft SHA-256 | Bytes | Literal native-resolution audit | Prompt deviation | Proposed social mode |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| `pseudomonas-aeruginosa` | `048b7e1b33c82e70d5206813fae58e9e26473e6a01c86f1b41fcf13ff519d771` | `exec-2fedafee-53e6-4169-87f1-9281c605af38.png` | `182b991b4390d7829e9393e75256a5bfedcb42c7a031cc694fc4eca0e90543b9` | 1,161,914 | 8 rods / 6 groups: 4 singles and 2 touching pairs; zero appendages. | None. | Centered cover; foreground x=219–1284, y=279–705. |
| `purpureocillium` | `1b650361f9c345e7cfe82a613d6dc60d2cca9eecadcadbb51b7e54b82962fc35` | `exec-18d554ed-e5fa-47a1-9599-68947e8eb325.png` | `75df06d8b9c45726272b89bc3adc20c6a553cf0a8f170f0d7bf5146eb2c1076b` | 1,125,258 | 2 fungal groups: 2 short septate hyphal bases, 4 tapering phialides, and 12 conidia in 4 three-conidium chains. | None. | Contain proposed conservatively; foreground x=195–1334, y=228–777. |
| `ralstonia` | `54ab9d4f5a6e0ec38ad3b5bd37d9fa6c068847beafc2e3d8918da5bcec585426` | `exec-7d20d655-e092-47ec-add2-85e5e0c29857.png` | `dcba7131c29f52e8f7a9f0819219b56c936d562f53fd03c9f016cdbee6766c63` | 1,290,815 | 10 rods / 8 groups: 6 singles and 2 touching pairs; zero appendages. | One additional single and group versus 9/7. | Centered cover; foreground x=161–1376, y=230–791. |
| `rikenella` | `fd7449d895dc7d05b68401424a0198cc646cd74df4e01939496e008f62cae527` | `exec-82478aae-835c-48bb-a104-45e3daa68f37.png` | `fa982e47e9972e446e69c933a22f4e75440271c447055f932440ab9d0cc78e96` | 1,223,680 | 10 tapered rods / 8 groups: 6 singles and 2 close pairs. | One additional single and group versus 9/7. | Centered cover; foreground x=211–1333, y=142–888. |
| `roseburia` | `789bf703a8c4e709fd1f48ddd882265fb415817e9c3328150e5eb9794d19b9fc` | `exec-466d211b-3156-4211-aef3-f9bb57a0a306.png` | `cb37815856e831529554f5dfbe0a57ba265c9406ff7ebfa5cce8960b80d75876` | 1,233,956 | 10 straight-to-gently-curved rods / 8 groups: 6 singles and 2 touching pairs; zero appendages. | One additional single and group versus 9/7. | Centered cover; foreground x=167–1361, y=216–841. |
| `roseburia-intestinalis` | `0ee7ce62781e6cc786f9afd73da338d51acd45e5052d36237fec1f4166adac41` | `exec-9c2fc83b-7307-45ef-a8ca-1314e99d0e4e.png` | `e3f4bba84fedb5be866883415318df2007d1a6dbf3470ea65a7fdb2de4d05463` | 1,171,296 | 9 slightly curved rods / 7 groups: 5 singles and 2 touching pairs; zero appendages. | One additional single and group versus 8/6. | Centered cover; foreground x=143–1405, y=244–760. |

A 32-pixel outer-band audit found zero pixels below luma 128 in every file. Minimum outer-band RGB values are recorded in the manifest. All measured foreground bounds fit the source-space centered 1200 by 630 cover window, although Purpureocillium retains a conservative proposed `contain` treatment pending derivative-stage review. No text, label, scale bar, host material, culture or disease scene, border, vignette, dark corner, clipping, signature, or watermark was observed.

## Control Tower preliminary disposition

Control Tower independently inspected all six native originals and recorded a preliminary visual/scientific pass for all six exact files. It confirmed that Purpureocillium reads as two restrained conidiophore/phialide/conidial-chain structures rather than a colony scene, while all bacterial plates remain isolated, label-free, appendage-conservative, and fully within the pale crop-safe field. This is not promotion authorization; exact-hash acceptance and a new promotion parent remain required.

## Promotion and native social-crop disposition

Control Tower verified and integrated review commit `66c54c6d43190091ff1655ce23a215626d36118e`, including the exact packet and draft hashes, literal native counts, scientific review, and zero public/master leakage. It then authorized promotion of only the six immutable originals.

Control Tower subsequently inspected every native 1200 by 630 social derivative at original detail. Centered cover is accepted for Pseudomonas aeruginosa, Ralstonia, Rikenella, Roseburia, and Roseburia intestinalis: every body and grouping remains centered, unclipped, and count-preserving. Conservative contain on pale `#f3f7fb` is accepted for Purpureocillium: both conidiophore structures, all four phialides, and all twelve conidia remain visible, and the additional whitespace is scientifically preferable to clipping.

Published metadata follows literal native-output counts and limitations rather than requested counts. All prior quarantines, rejections, and seven scientific identity holds remain unchanged and asset-free. No review-draft path is public.
