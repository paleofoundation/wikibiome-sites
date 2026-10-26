# Microorganism media batch 034 — immutable prompt and evidence record

Created: 2026-09-05  
Authorized parent: `3bfb732476b051ad5fb450b3c5f93638e386bea8`  
State: review-only; no public master, derivative, registry ownership, endpoint, or sitemap entry

## Identity and authority decisions

| Route | Decision | Current identity and scope | Controlled identifier | Exact authority audit |
| --- | --- | --- | --- | --- |
| `saccharomyces` | cleared for one call | *Saccharomyces*, current genus; type-species anchored to *S. cerevisiae* | NCBITaxon:4930 | NCBI retains genus 4930. Current fungal classification retains *Saccharomyces* with *S. cerevisiae* as type. The 2024 cellular-morphology synthesis identifies spherical/ovoid budding forms and explicitly documents extensive yeast variation; the plate is representative and non-diagnostic. |
| `saccharomyces-boulardii` | scientific identity hold; no prompt or call | “*Saccharomyces boulardii*” is an invalid name used for probiotic strains within *S. cerevisiae*, not an independent current species owner | resolves within NCBITaxon:4932; deprecated strain-level taxon 252598 must not become a canonical media ID | NCBI lists *S. boulardii* (nom. inval.) as a heterotypic synonym of current *S. cerevisiae*. PMID 12234334 / DOI 10.1046/j.1365-2672.2002.01710.x assigns product isolates to *S. cerevisiae* and places probiotic strains as a cluster within that species. PMID-linked PMCID PMC105172 likewise concludes the invalid name does not support a separate species. |
| `saccharomyces-cerevisiae` | cleared for one call | *Saccharomyces cerevisiae*, current species; culture from type material CBS 1171 = ATCC 18824 = NRRL Y-12632 | NCBITaxon:4932; Index Fungorum 163963 | NCBI and Index Fungorum retain the current name and type-material culture. The 2024 morphology synthesis depicts spherical *S. cerevisiae* budding cells and documents spherical/ovoid within-species variation. |
| `salmonella` | cleared for one call | *Salmonella*, current genus; type-species anchored to *S. enterica* | NCBITaxon:590 | NCBI and LPSN retain the genus and *S. enterica* as type species. PMID 15653930 / DOI 10.1099/ijs.0.63580-0 exactly maps to Tindall et al., “Nomenclature and taxonomy of the genus Salmonella.” Type-strain and CDC PHIL records support conservative rods; appendages are omitted rather than generalized. |
| `salmonella-typhimurium` | cleared for one call | *Salmonella enterica* subsp. *enterica* serovar Typhimurium; a serovar-level entity, not a species named “S. typhimurium” | NCBITaxon:90371 | NCBI uses the full current serovar name and records former *Salmonella typhimurium* as a synonym. The canonical page title already uses “Salmonella enterica serovar Typhimurium.” ATCC 13311/NCTC 74 and the *S. enterica* LT2 type record support a conservative rod plate. |
| `selenomonas` | cleared for one call | *Selenomonas*, conserved current genus; type-species anchored to *S. sputigena* | NCBITaxon:970 | NCBI and LPSN retain the genus and LPSN retains *S. sputigena* as lectotype species. DOI 10.1128/spectrum.00341-26 exactly maps to Hawkes et al. 2026 and documents crescent bacilli plus concave-surface flagellar bundles while exposing important strain-level taxonomic and motility variation. The plate is type-species/current-genus anchored, representative, and non-diagnostic. |

Authority URLs:

- Saccharomyces: https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=4930&mode=Info ; https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=4932&mode=Info ; https://www.indexfungorum.org/Names/NamesRecord.asp?RecordID=163963 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC10804222/
- Boulardii identity hold: https://pubmed.ncbi.nlm.nih.gov/12234334/ ; https://doi.org/10.1046/j.1365-2672.2002.01710.x ; https://pmc.ncbi.nlm.nih.gov/articles/PMC105172/
- Salmonella: https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=590&mode=Info ; https://lpsn.dsmz.de/genus/salmonella ; https://pubmed.ncbi.nlm.nih.gov/15653930/ ; https://doi.org/10.1099/ijs.0.63580-0 ; https://bacdive.dsmz.de/strain/5117 ; https://wwwn.cdc.gov/phil/Details.aspx?pid=23772
- Typhimurium: https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=90371&mode=Info ; https://genomes.atcc.org/genomes/56034f638ded4f20 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC4183876/
- Selenomonas: https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=970&mode=Info ; https://lpsn.dsmz.de/genus/selenomonas ; https://bacdive.dsmz.de/strain/17159 ; https://doi.org/10.1128/spectrum.00341-26

Scientific sources provide factual constraints only. No source image or design is copied. Every cleared prompt below is immutable before its single call. Requested counts are composition targets, never output evidence.

## Frozen prompts

### `saccharomyces-draft.png`

<!-- PROMPT saccharomyces START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome fungal-genus morphology reconstruction
Primary request: Create a conservative static representative plate for current Saccharomyces, NCBITaxon:4930, anchored to type species Saccharomyces cerevisiae; show restrained spherical-to-ovoid budding yeast forms without implying a universal genus morphology or visual diagnosis.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly ten visible yeast cellular bodies arranged as seven clearly separated groupings: four isolated single bodies and three narrow-based mother-bud pairs. Use a restrained mixture of spherical and ovoid bodies with crisp ordinary boundaries. The three buds are smaller than their attached mother cells and arise at varied positions to represent multilateral budding without a lifecycle sequence.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all seven count-bearing groupings centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every body fully inside the frame.
Constraints: Static type-species-anchored representative genus morphology only. No claim that shape or budding arrangement diagnoses Saccharomyces or is shared by every species. No pseudohypha, true hypha, ascus, ascospore, colony, appendage, capsule, halo, shared envelope, label, text, arrow, scale bar, decorative particle, glow, food, fermentation vessel, host tissue, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT saccharomyces END -->

### `saccharomyces-cerevisiae-draft.png`

<!-- PROMPT saccharomyces-cerevisiae START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome fungal-species morphology reconstruction
Primary request: Create a conservative static plate for current Saccharomyces cerevisiae, NCBITaxon:4932, anchored to culture from type material CBS 1171 / ATCC 18824; show representative spherical-to-ovoid budding yeast forms without claiming visual species diagnosis.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly nine visible cellular bodies arranged as seven clearly separated groupings: five isolated spherical-to-ovoid singles and two narrow-based mother-bud pairs. Include modest size and orientation variation; each pair has one clearly smaller bud attached to one mother at a different surface position. Keep boundaries crisp and ordinary.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all seven count-bearing groupings centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every body fully inside the frame.
Constraints: Static type-material-anchored representative species morphology only. No claim that the plate distinguishes S. cerevisiae from related budding yeasts or from a genus-level plate. No pseudohypha, true hypha, ascus, ascospore, colony, appendage, capsule, halo, shared envelope, label, text, arrow, scale bar, decorative particle, glow, bread, beverage, host tissue, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT saccharomyces-cerevisiae END -->

### `salmonella-draft.png`

<!-- PROMPT salmonella START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome bacterial-genus morphology reconstruction
Primary request: Create a conservative static plate for current Salmonella, NCBITaxon:590, anchored to type species Salmonella enterica; show representative straight short rods without implying a universal genus morphology or visual diagnosis.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly nine visible straight short rod bodies arranged as seven clearly separated groupings: five isolated singles and two touching two-rod pairs. Use gently rounded ends, ordinary crisp individual boundaries, modest length and orientation variation, and no swelling.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all seven count-bearing groupings centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every body fully inside the frame.
Constraints: Static type-species-anchored representative genus morphology only. No claim that shape or grouping diagnoses Salmonella. Flagella are deliberately omitted and their absence makes no motility claim. No flagellum, pilus, capsule, halo, sheath, shared envelope, biofilm, spore, curved rod, label, text, arrow, scale bar, decorative particle, glow, host tissue, disease scene, food, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT salmonella END -->

### `salmonella-typhimurium-draft.png`

<!-- PROMPT salmonella-typhimurium START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome bacterial-serovar morphology reconstruction
Primary request: Create a conservative static plate for Salmonella enterica subsp. enterica serovar Typhimurium, NCBITaxon:90371, anchored to reference strain ATCC 13311 / NCTC 74; show representative straight rods without implying that an illustration diagnoses the serovar.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly eight visible straight rod bodies arranged as six clearly separated groupings: four isolated singles and two touching two-rod pairs. Use softly rounded ends, ordinary crisp individual boundaries, restrained plumpness, and modest length and orientation variation.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all six count-bearing groupings centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every body fully inside the frame.
Constraints: Static serovar-level representative morphology only. No claim of visual separability from the Salmonella genus plate; serovar identity cannot be inferred from shape. Flagella are deliberately omitted and their absence makes no motility claim. No obsolete species label, flagellum, pilus, capsule, halo, sheath, shared envelope, biofilm, spore, curved rod, label, text, arrow, scale bar, decorative particle, glow, host tissue, infection or disease scene, food, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT salmonella-typhimurium END -->

### `selenomonas-draft.png`

<!-- PROMPT selenomonas START -->
```text
Use case: scientific-educational
Asset type: review-only WikiBiome bacterial-genus morphology reconstruction
Primary request: Create a conservative static representative plate for current conserved genus Selenomonas, NCBITaxon:970, anchored to lectotype species Selenomonas sputigena; show restrained kidney-to-crescent-shaped bacilli and limited concave-surface flagellar context without implying a universal morphology or visual diagnosis.
Scene/backdrop: Uniform high-key cool pale blue-white field approximately #f3f7fb from edge to edge with generous negative space; no environment or scene and no darkening at any edge.
Subject: Exactly seven isolated crescent or kidney-shaped cellular bodies in seven separated groupings, with rounded-to-subtly-tapered ends and modest curvature variation. Exactly two bodies show one restrained bundle each of four fine filaments originating near the middle of the concave surface; the remaining five bodies show no visible appendages. Boundaries remain crisp and ordinary.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with excellent tonal separation, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate at 1536 by 1024. Keep all seven bodies and both filament bundles centered inside a broad horizontal social-safe band across the middle, with generous empty pale margins above and below and every structure fully inside the frame.
Constraints: Static type-species/current-genus-anchored representative morphology only. The two appendage-bearing bodies represent supported structural context and do not imply that visible flagella or motility diagnoses the genus or that every cell expresses the same bundle. No polar flagellum, peritrichous flagella, pilus, capsule, halo, sheath, shared envelope, biofilm, spore, long spiral, label, text, arrow, scale bar, decorative particle, glow, mouth, gut, rumen, host tissue, disease scene, culture plate, process sequence, scenery, horizon, floor, border, vignette, black or dark corner, clipping, signature, or watermark.
```
<!-- PROMPT selenomonas END -->

## Hold routing impact

`saccharomyces-boulardii` receives no prompt, image-generation call, raster, public registry key, master, derivative, endpoint, sitemap entry, coverage completion, copied/aliased image, or queue substitution. Editorial resolution must establish a single current owner under *S. cerevisiae* and decide whether the legacy intervention/entity route is retired, permanently aliased, or explicitly reframed as a strain/product concept before any media is considered.

## Immutable generation and native-output audit

Exactly five built-in generation calls were made, one for each cleared route. The system interrupted the originating task only after all five outputs had been saved; no retry, replacement, or edit occurred. Control Tower recovered the exact project-bound files, verified their hashes against the generator records, inspected them at native 1536 by 1024 resolution, and completed the review-only packet locally. Prompt counts remain composition requests rather than evidence.

| Route | Generator record | Prompt SHA-256 | Exact PNG SHA-256 | Bytes | Literal native output |
| --- | --- | --- | --- | ---: | --- |
| `saccharomyces` | `exec-7484ea76-6590-48a8-8add-1a4965e5aa4e.png` | `23c57afe0f9542c09793c09b379dd1592bcbd3cdb7948f7b95a7e32366ed45cb` | `00d22676c8cc49be8478547aece169f55b6e967def982de05b194f16335641a8` | 1,444,268 | Ten bodies in seven groups: four singles and three mother-bud pairs. |
| `saccharomyces-cerevisiae` | `exec-3946d08a-31d0-4936-979b-b5f6ba6d9ed2.png` | `ae6d38cc358f506458aa9d5f5d956585ecb2457849737becc16fabaa315b60da` | `4f1199e465c5880cd5a5fa051cf13a503ea0c026f386403e3949daabd4653030` | 1,373,365 | Nine bodies in seven groups: five singles and two mother-bud pairs. |
| `salmonella` | `exec-b7339b44-67d2-4c80-b532-752f6a289d49.png` | `31b95ed4de6b4bfefa095c5d301f12c6efc07573857ff912445311270f708500` | `c2c3e98c96e1f7b8ddeda5d2474c955df2f16ca14c27f163dcb003ef9d3d973a` | 1,176,931 | Nine straight rods in seven groups: five singles and two touching pairs. |
| `salmonella-typhimurium` | `exec-ac6fae4f-9da8-4103-a6d1-de9d875d9bad.png` | `603b86c4e4dd7ee70aef57d2079812e6820ba377a7db7e4a430aa1baa92103fa` | `cb52fe38bd2b5bdb10e2bdf78faa60883560a87e3bbc36be2325f9e37b53d51f` | 1,267,871 | Eight straight rods in six groups: four singles and two touching pairs. |
| `selenomonas` | `exec-810e5ad4-1e56-40c2-b4c7-5be4c169e1d0.png` | `5050c6e0792799f3cc90382313345eeeeb59da2e5c1f073bbbde45ede0c911b2` | `c9f0d228cce8006438527b4e3ac6960883e97eef09d03d196debda927778676b` | 1,305,537 | Seven isolated crescent-to-kidney bodies. Two carry concave-surface bundles containing five and four visible filaments, respectively; the upper bundle has one output-added filament. |

All five files have zero dark pixels below luma 128 in a 32-pixel outer band. Foreground bounds at luma below 220 remain within the centered-cover source band (approximately y=109 through y=915), so each candidate is technically crop-safe.

## Control promotion and crop review

Control Tower integrated the exact review packet as commit `48a3170d2773785925269a6b2d2d4001294a9aa2`, accepted only the five immutable PNG hashes above, and promoted them without regeneration or pixel editing. It inspected all five native 1200 by 630 centered-cover social derivatives at original detail: every reviewed body, grouping, and the two Selenomonas filament bundles remain visible and unclipped. The Saccharomyces boulardii identity hold remains asset-free.
