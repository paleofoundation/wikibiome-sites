# WikiBiome microorganism media batch 012 — identity and immutable prompt record

Date: 2026-09-01

Generator: OpenAI built-in image generation. Each prompt below is immutable generation provenance. Requested counts and forms are instructions to the generator, not evidence about the raster. A human original-resolution audit must independently record every visible body, grouping, and visible spore before any control disposition.

Scope: passive scientific-educational appearance reconstruction only. The prompts describe static silhouettes and composition. They contain no culturing, growth, infection, manipulation, virulence, or laboratory procedure. No scientific reference image is supplied to the generator or copied as a design.

## Identity decisions before generation

### `clostridium-difficile` — scientific identity hold; no generation

- Canonical route title: *Clostridium difficile*
- Route rank: species
- Current accepted identity: *Clostridioides difficile* (Hall & O'Toole 1935) Lawson et al. 2016
- Controlled identifier: `NCBITaxon:1496`
- Finding: LPSN records *Clostridium difficile* as a validly published synonym that is not recommended for medical use and names *Clostridioides difficile* as the correct combination. NCBI Taxonomy uses *Clostridioides difficile* as the current name for Taxonomy ID 1496. The canonical route duplicates the already-current `clostridioides-difficile` route and cannot receive a separate raster.
- Checked sources:
  - `https://lpsn.dsmz.de/species/clostridium-difficile`
  - `https://lpsn.dsmz.de/species/clostridioides-difficile`
  - `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1496&mode=Info`
  - `https://pubmed.ncbi.nlm.nih.gov/27370902/`
  - `https://doi.org/10.1016/j.anaerobe.2016.06.008`
- Required resolution: control should retire or permanently alias `clostridium-difficile` to the current `clostridioides-difficile` route and regenerate the deterministic media queue.
- Routing impact: no generation call, draft, registry entry, master, derivative, review approval, or image-sitemap entry is created under `clostridium-difficile`; no queue substitution is made.

### `clostridium-symbiosum` — supported current nomenclatural route

- Canonical route title: *Clostridium symbiosum*
- Route rank: species
- Controlled identifier: `NCBITaxon:1512`
- Finding: LPSN continues to record *Clostridium symbiosum* as a validly published correct name and explicitly recommended name for medical use; NCBI Taxonomy retains Taxonomy ID 1512 under the current name `[Clostridium] symbiosum`, while placing it phylogenetically within Lachnospiraceae/Otoolea. The validly published genus *Enterocloster* does not include this species, so “Enterocloster symbiosus” is not an authoritative replacement. “Otoolea symbiosa” appears in GTDB-oriented usage, but its SeqCode record says it has no standing or validity and LPSN does not list it as the correct combination. The existing route is therefore eligible, with the nomenclatural/phylogenetic distinction recorded explicitly.
- Checked sources:
  - `https://lpsn.dsmz.de/species/clostridium-symbiosum`
  - `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1512&mode=Info`
  - `https://lpsn.dsmz.de/genus/enterocloster`
  - `https://registry.seqco.de/names/44846`
  - `https://bacdive.dsmz.de/strain/2721`
  - `https://doi.org/10.1099/00207713-26-2-195`

## 1. Clostridioides difficile

- Canonical route: `clostridioides-difficile`
- Current identity: *Clostridioides difficile* (Hall & O'Toole 1935) Lawson et al. 2016
- Rank: species
- Controlled identifier: `NCBITaxon:1496`
- Visual treatment: conservative isolated rod reconstruction without spores
- Evidence finding: NCBI Taxonomy and LPSN recognize *Clostridioides difficile* as the current species. The reclassification places it outside *Clostridium* sensu stricto, and referenced type-strain and microscopy records support rod-shaped vegetative cells and endospore formation. This first plate deliberately omits spores and depicts only conservative vegetative rods so that spore position, developmental state, or appearance is not overgeneralized. The reconstruction is representative and non-diagnostic.

Checked sources:

- `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1496&mode=Info`
- `https://lpsn.dsmz.de/species/clostridioides-difficile`
- `https://pubmed.ncbi.nlm.nih.gov/27370902/`
- `https://bacdive.dsmz.de/strain/2582`
- `https://pmc.ncbi.nlm.nih.gov/articles/PMC4098856/`

Immutable prompt:

```text
Use case: scientific-educational. Asset type: WikiBiome static species morphology reconstruction for Clostridioides difficile, current species NCBI Taxonomy ID 1496. This is representative, non-diagnostic, not a micrograph, and not a lifecycle or disease image. Landscape 3:2 on a seamless pale cool near-white blue-gray field. Show exactly eight elongated rod-shaped cellular bodies in exactly seven clearly separated groupings: six isolated single rods and one touching two-rod pair. Use restrained natural variation from straight to very gently curved rods, softly rounded ends, ordinary smooth individual boundaries, and enough separation to keep every body countable. Use matte translucent silver-blue cellular material, crisp technical silhouettes, restrained internal texture, generous negative space, and soft diffuse cool illumination. No visible endospore, swollen spore-bearing cell, appendage, flagellum, pilus, hair, capsule, halo, shared envelope, toxin symbolism, host cell, tissue, organ, disease scene, infection scene, colony plate, culture vessel, laboratory setting, lifecycle, process sequence, arrows, labels, text, scale bar, watermark, decorative particles, wet slime, glossy toy appearance, crowding, edge clipping, or scenery.
```

### Clostridioides difficile control review and v2 revision

- Control disposition for v1: rejected on 2026-09-01 because the otherwise clean plate contains no visible endospores and is too generic for the species page.
- Rejected v1 file: `work/media-drafts/microorganisms-batch-012/clostridioides-difficile-draft.png`
- Rejected v1 SHA-256: `619879df51d07e7927e585c0ccfc14378bc26b7f71808d3a8d2b30cdd6ee8f6c`
- Revision evidence check: BacDive's type-strain record for DSM 1296 / ATCC 9689 identifies the type strain as rod-shaped and spore-forming. The selected primary morphology study records large oval subterminal spores with only slight sporangial distension. This supports a restrained static treatment with two visibly spore-bearing rods, without treating spore appearance as visually diagnostic or depicting a lifecycle.
- Additional checked primary morphology record: `https://etheses.whiterose.ac.uk/id/eprint/972/1/uk_bl_ethos_490383.pdf`
- Input image role: rejected v1 is the edit target and visual-register reference only; it is not scientific evidence.

Immutable v2 prompt:

```text
Use case: scientific-educational. Asset type: WikiBiome static species morphology reconstruction for Clostridioides difficile, current species NCBI Taxonomy ID 1496. Input image: the supplied v1 raster is the edit target and visual-register reference only, not scientific evidence. Revise it into a representative, non-diagnostic, static plate; it is not a micrograph, lifecycle, process, or disease image. Preserve the same seamless pale cool near-white blue-gray field, isolated matte translucent silver-blue rods, crisp countable ordinary cell boundaries, restrained internal texture, soft diffuse cool illumination, and generous negative space. Show exactly eight elongated rod-shaped cellular bodies in exactly six clearly separated groupings: four isolated single rods and two touching two-rod pairs. Exactly two rods must each contain exactly one clearly visible restrained oval internal endospore in a subterminal position; the other six rods must remain vegetative with no spore. Keep spore-bearing rods only minimally or not visibly swollen. Use restrained variation from straight to very gently curved rods with softly rounded ends. The spores are representative structural context and must not imply that Clostridioides difficile can be diagnosed visually. No free spore, terminal or central spore, exaggerated swelling, appendage, flagellum, pilus, hair, capsule, halo, shared envelope, toxin symbolism, host cell, tissue, organ, disease scene, infection scene, colony plate, culture vessel, laboratory setting, lifecycle, process sequence, arrows, labels, text, scale bar, watermark, decorative particles, wet slime, glossy toy appearance, crowding, edge clipping, or scenery. Change only the subject count, grouping arrangement, and the two specified subterminal internal endospores; preserve the established visual register.
```

## 2. Clostridium

- Canonical route: `clostridium`
- Current identity: genus *Clostridium* Prazmowski 1880 (Approved Lists 1980), emended Lawson & Rainey 2016
- Rank: genus
- Controlled identifier: `NCBITaxon:1485`
- Visual treatment: selected type-species-anchored genus representative rod plate
- Evidence finding: NCBI Taxonomy and LPSN recognize *Clostridium* as a current genus, restricted to *Clostridium* sensu stricto around the type species *C. butyricum*. Because even this emended genus contains substantial phenotypic variation, the plate selects only conservative type-species-anchored straight and slightly curved rods. It does not claim a genus-wide diagnostic morphology and omits visible spores, motility structures, capsules, and toxin associations.

Checked sources:

- `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1485&mode=Info`
- `https://lpsn.dsmz.de/genus/clostridium`
- `https://pubmed.ncbi.nlm.nih.gov/26643615/`
- `https://doi.org/10.1099/ijsem.0.000824`
- `https://lpsn.dsmz.de/species/clostridium-butyricum`
- `https://bacdive.dsmz.de/strain/2563`

Immutable prompt:

```text
Use case: scientific-educational. Asset type: WikiBiome static selected genus-representative morphology reconstruction for Clostridium, current emended genus NCBI Taxonomy ID 1485. This plate is anchored only to documented type-species rod forms, is representative and non-diagnostic, is not an exhaustive genus diversity plate, and is not a micrograph. Landscape 3:2 on a seamless pale cool near-white blue-gray field. Show exactly nine rod-shaped cellular bodies in exactly six clearly separated spatial groupings: three isolated single rods, two loose two-rod arrangements whose bodies remain separated by visible gaps, and one touching two-rod pair. Use a restrained mix of straight and slightly curved rods with softly rounded ends and subtle length variation, keeping every body and grouping clearly countable. Use ordinary smooth individual boundaries, matte translucent silver-blue cellular material, crisp technical silhouettes, restrained internal texture, generous negative space, and soft diffuse cool illumination. No claim of one genus-wide morphology, no visible endospore, swollen spore-bearing form, appendage, flagellum, pilus, hair, capsule, halo, shared envelope, toxin symbolism, host material, disease context, colony plate, culture vessel, laboratory setting, process sequence, labels, text, scale bar, watermark, decorative particles, wet slime, crowding, edge clipping, or scenery.
```

## 3. Clostridium butyricum

- Canonical route: `clostridium-butyricum`
- Current identity: *Clostridium butyricum* Prazmowski 1880
- Rank: species; type species of *Clostridium*
- Controlled identifier: `NCBITaxon:1492`
- Visual treatment: conservative isolated straight-to-slightly-curved rod plate without spores
- Evidence finding: NCBI Taxonomy and LPSN recognize *C. butyricum* as the current species and type species of *Clostridium*. The referenced type-strain record and equivalent morphology evidence support straight or slightly curved rods and oval spores. The plate selects only vegetative rod forms and deliberately omits spores rather than asserting a developmental state, spore position, or strain-wide frequency. It is representative and non-diagnostic.

Checked sources:

- `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1492&mode=Info`
- `https://lpsn.dsmz.de/species/clostridium-butyricum`
- `https://bacdive.dsmz.de/strain/2563`
- `https://pmc.ncbi.nlm.nih.gov/articles/PMC12046288/`
- `https://pubmed.ncbi.nlm.nih.gov/4927234/`

Immutable prompt:

```text
Use case: scientific-educational. Asset type: WikiBiome static species morphology reconstruction for Clostridium butyricum, current species and Clostridium type species NCBI Taxonomy ID 1492. This is representative, non-diagnostic, not a micrograph, and not a developmental sequence. Landscape 3:2 on a seamless pale cool near-white blue-gray field. Show exactly seven rod-shaped cellular bodies in exactly six clearly separated groupings: five isolated single rods and one touching two-rod pair. Use a restrained mix of straight and slightly curved rods with softly rounded ends, modest length variation, ordinary smooth individual boundaries, and enough separation to keep every body countable. Use matte translucent silver-blue cellular material, crisp technical silhouettes, restrained internal texture, generous negative space, and soft diffuse cool illumination. No visible endospore, free spore, swollen spore-bearing form, appendage, flagellum, pilus, hair, capsule, halo, shared envelope, host material, disease context, colony plate, culture vessel, laboratory setting, process sequence, labels, text, scale bar, watermark, decorative particles, wet slime, glossy toy appearance, crowding, edge clipping, or scenery.
```

## 4. Clostridium perfringens

- Canonical route: `clostridium-perfringens`
- Current identity: *Clostridium perfringens* (Veillon & Zuber 1898) Hauduroy et al. 1937 (Approved Lists 1980)
- Rank: species
- Controlled identifier: `NCBITaxon:1502`
- Visual treatment: conservative large straight rectangular-rod plate without visible spores or capsules
- Evidence finding: NCBI Taxonomy and LPSN recognize *C. perfringens* as the current species. The referenced type-strain and microscopy records support large, straight, thick or rectangular rods with blunt-to-rounded ends, while visible spores are uncommon in ordinary microscopy. The plate therefore shows only conservative vegetative rods and omits spores, capsule claims, and motility structures. It is representative and non-diagnostic.

Checked sources:

- `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1502&mode=Info`
- `https://lpsn.dsmz.de/species/clostridium-perfringens`
- `https://bacdive.dsmz.de/strain/2631`
- `https://pubmed.ncbi.nlm.nih.gov/218402/`
- `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=195103&mode=Info`

Immutable prompt:

```text
Use case: scientific-educational. Asset type: WikiBiome static species morphology reconstruction for Clostridium perfringens, current species NCBI Taxonomy ID 1502. This is representative, non-diagnostic, not a micrograph, and not a disease image. Landscape 3:2 on a seamless pale cool near-white blue-gray field. Show exactly seven large straight rectangular rod-shaped cellular bodies in exactly six clearly separated groupings: five isolated single rods and one touching two-rod pair. Give each rod parallel sides, blunt-to-softly-rounded ends, restrained variation in length and width, an ordinary smooth individual boundary, and enough separation to keep every body countable. Use matte translucent silver-blue cellular material, crisp technical silhouettes, restrained internal texture, generous negative space, and soft diffuse cool illumination. No visible endospore, free spore, swollen spore-bearing form, capsule, halo, shared envelope, appendage, flagellum, pilus, hair, toxin symbolism, gas bubble, host cell, tissue, organ, wound, disease context, colony plate, culture vessel, laboratory setting, lifecycle, process sequence, arrows, labels, text, scale bar, watermark, decorative particles, wet slime, glossy toy appearance, crowding, edge clipping, or scenery.
```

## 5. Clostridium symbiosum

- Canonical route: `clostridium-symbiosum`
- Current nomenclatural identity: *Clostridium symbiosum* (Stevens 1956) Kaneuchi et al. 1976 (Approved Lists 1980)
- Rank: species
- Controlled identifier: `NCBITaxon:1512`
- Visual treatment: conservative cigar-to-lemon-shaped rod plate without external flagella or visible spores
- Evidence finding: LPSN retains *C. symbiosum* as the validly published correct and medically recommended name, while NCBI retains Taxonomy ID 1512 and flags its phylogenetic placement outside *Clostridium* sensu stricto. The original taxonomic study and later morphology records support elongated cigar- or lemon-like rods occurring in pairs or short chains, with spores uncommon. The plate omits spores and external flagella, makes no motility claim, and is representative rather than visually diagnostic.

Checked sources:

- `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1512&mode=Info`
- `https://lpsn.dsmz.de/species/clostridium-symbiosum`
- `https://bacdive.dsmz.de/strain/2721`
- `https://doi.org/10.1099/00207713-26-2-195`
- `https://pmc.ncbi.nlm.nih.gov/articles/PMC516307/`

Immutable prompt:

```text
Use case: scientific-educational. Asset type: WikiBiome static species morphology reconstruction for Clostridium symbiosum, validly published current nomenclatural species NCBI Taxonomy ID 1512. This is representative, non-diagnostic, not a micrograph, and makes no claim about phylogenetic placement from appearance. Landscape 3:2 on a seamless pale cool near-white blue-gray field. Show exactly eight elongated cigar-to-lemon-shaped rod bodies in exactly six clearly separated groupings: four isolated single bodies and two touching two-body pairs. Use gently tapered or softly rounded poles, restrained variation in length and fullness, ordinary smooth individual boundaries, and enough separation to keep every body and grouping countable. Use matte translucent silver-blue cellular material, crisp technical silhouettes, restrained internal texture, generous negative space, and soft diffuse cool illumination. No visible endospore, free spore, swollen spore-bearing form, appendage, polar flagellum, other flagellum, pilus, hair, capsule, halo, shared envelope, host material, disease context, colony plate, culture vessel, laboratory setting, process sequence, labels, text, scale bar, watermark, decorative particles, wet slime, glossy toy appearance, crowding, edge clipping, or scenery.
```

## Pre-generation disposition

- Eligible for exactly one built-in generation call each: `clostridioides-difficile`, `clostridium`, `clostridium-butyricum`, `clostridium-perfringens`, `clostridium-symbiosum`.
- Withheld without a generation call: `clostridium-difficile`.
- No queue substitution is authorized.
- Generated files remain review-only drafts until an original-resolution output audit and control disposition are recorded.

## Control-review checkpoint after the sole revision

- Accepted unchanged by control: `clostridium`, `clostridium-butyricum`, `clostridium-perfringens`, and `clostridium-symbiosum`, using their recorded original-resolution counts.
- Rejected by control: `clostridioides-difficile` v1; its file and SHA-256 remain immutable review evidence.
- Exactly one additional built-in call was made, only for `clostridioides-difficile` v2, using the immutable v2 prompt above and v1 as the edit target/visual-register reference.
- V2 generation record: `exec-80a36b53-94ac-4918-9640-62a88a7e6d7f.png`
- V2 workspace draft: `work/media-drafts/microorganisms-batch-012/clostridioides-difficile-draft-v2.png`
- V2 SHA-256: `b53e405ce495ce0873b63f477a7d21ee5ce8ef7a4e3571c142bfbce8ada42053`
- V2 observed audit at original 1536 × 1024 resolution: ten elongated rod bodies in eight separated groupings—six isolated singles and two touching two-rod pairs. This is two bodies and two groupings more than requested. Exactly two single rods each contain one clearly visible restrained oval internal body in a subterminal position; the other eight rods are vegetative. No free, central, or terminal spore; exaggerated swelling; appendage; capsule; halo; shared envelope; host material; process scene; text; label; scale bar; clipping; or watermark is visible.
- Control accepted v2 at original resolution with the observed ten-body/eight-grouping/two-spore audit above. Only v2 is approved as the source for `clostridioides-difficile-morphology-v1-master.png` and its article/social derivatives; v1 remains rejected review evidence and must never become a master.
- Control also accepted the unchanged `clostridium`, `clostridium-butyricum`, `clostridium-perfringens`, and `clostridium-symbiosum` originals with their recorded observed counts. No retry or additional generation call occurred.
- The obsolete `clostridium-difficile` route was resolved before promotion as an audited asset-free 308 alias to `clostridioides-difficile`, `NCBITaxon:1496`. No raster, registry record, master, derivative, or image-sitemap entry is keyed to the obsolete slug.
