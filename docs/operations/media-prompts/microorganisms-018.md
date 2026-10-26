# WikiBiome microorganism media batch 018

- Batch: `microorganisms-018`
- Exact control parent: `e626e67889107e6779dc10f37f0e5da7f51cb921`
- Accepted predecessor media batch: `6906bc3aa923ee5addc9de6f8f2817d2d4046222`
- Integrated taxonomy reconciliation: `8110300ce8b5313c8fb87d0603d2bfc2453fcad8`
- Upstream scientific-content source: `c6481eaf721d80b46d6f192b19d4c0b351e670d8`
- Created: 2026-09-01
- Scope: passive scientific-educational appearance reconstruction only
- Generator: OpenAI built-in image generation, exactly one initial call per cleared route
- Publication state: review-only drafts; no asset in this packet is approved for publication

## Deterministic queue selection

The exact authorized queue is, without substitution: `agathobacter-rectalis`, `firmicutes`, `flavobacterium`, `flavonifractor`, `fusarium`, and `fusicatenibacter`. These are the six entries in `data/article-media-coverage.generated.json#nextBatch` on the exact control parent.

## Identity and evidence audit

### Agathobacter rectalis

- Route: `/article/agathobacter-rectalis`
- Decision: eligible for one review-only draft
- Accepted name, rank, and identifier: *Agathobacter rectalis*, species, `NCBITaxon:39491`
- Nomenclature: NCBI Taxonomy uses *Agathobacter rectalis* and records *Eubacterium rectale* as a homotypic synonym. LPSN treats *A. rectalis* as the current correct, validly published combination. The route is the canonical replacement established by the batch-017 identity reconciliation; the retired `eubacterium-rectale` slug is not a media key.
- Morphology boundary: the primary genus proposal describes obligately anaerobic, non-spore-forming rods. The plate uses conservative straight-to-gently-curved rods with ordinary boundaries. It omits spores and appendages and is explicitly representative and non-diagnostic.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=39491&mode=Info
  - https://lpsn.dsmz.de/species/agathobacter-rectalis
  - https://doi.org/10.1099/ijsem.0.000788
  - https://pubmed.ncbi.nlm.nih.gov/26619944/

### Firmicutes (Bacillota)

- Route: `/article/firmicutes`
- Decision: eligible for one review-only draft under the current scientific taxon *Bacillota*
- Accepted name, rank, and identifier: *Bacillota*, phylum, `NCBITaxon:1239`
- Nomenclature: NCBI Taxonomy uses *Bacillota* for TaxID 1239. LPSN treats *Bacillota* Gibbons and Murray 2021 as the correct phylum name and maps the historical name “Firmicutes” to it. The WikiBiome display title `Firmicutes (Bacillota)` makes that current-name relationship explicit.
- Morphology boundary: no single morphology identifies this phylum. The asset is a selected descendant-diversity reconstruction, anchored to conservative rod and coccoid forms within the broad taxon. It does not generalize sporulation, motility, cell-wall staining, curvature, or physiology across *Bacillota* and must never be described as universal or diagnostic.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1239&mode=Info
  - https://lpsn.dsmz.de/phylum/bacillota
  - https://lpsn.dsmz.de/text/names-of-phyla
  - https://lpsn.dsmz.de/division/firmicutes

### Flavobacterium

- Route: `/article/flavobacterium`
- Decision: eligible for one review-only draft
- Accepted name, rank, and identifier: *Flavobacterium*, genus, `NCBITaxon:237`
- Nomenclature: NCBI Taxonomy and LPSN retain *Flavobacterium* Bergey et al. 1923 as the current correct genus; *F. aquatile* is its type species.
- Morphology boundary: the emended genus and authoritative genus treatment support single straight-to-slightly-curved rods with rounded or slightly tapered ends, sometimes including longer flexible rods; flagella and resting stages are absent in the cited genus treatment. The plate is type-species-anchored, representative, and non-diagnostic. It does not encode colony pigment or motion.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=237&mode=Info
  - https://lpsn.dsmz.de/genus/flavobacterium
  - https://lpsn.dsmz.de/species/flavobacterium-aquatile
  - https://doi.org/10.1099/00207713-46-1-128
  - https://doi.org/10.1002/9781118960608.gbm00312
  - https://bacdive.dsmz.de/strain/5517

### Flavonifractor

- Route: `/article/flavonifractor`
- Decision: eligible for one review-only draft
- Accepted name, rank, and identifier: *Flavonifractor*, genus, `NCBITaxon:946234`
- Nomenclature: NCBI Taxonomy and LPSN retain *Flavonifractor* Carlier et al. 2010 as a current, validly published genus. *F. plautii* is the nomenclatural type; LPSN records three current validly published species as of this audit.
- Morphology boundary: the primary type-species treatment supports straight-to-slightly-curved rods occurring singly or in pairs. Motility and endospore formation vary in the authoritative descriptions, so the genus-level plate deliberately omits flagella and visible spores rather than generalizing either state. The treatment is type-species-anchored, representative, and non-diagnostic.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=946234&mode=Info
  - https://lpsn.dsmz.de/genus/flavonifractor
  - https://lpsn.dsmz.de/species/flavonifractor-plautii
  - https://doi.org/10.1099/ijs.0.016725-0
  - https://bacdive.dsmz.de/strain/18081

### Fusarium

- Route: `/article/fusarium`
- Decision: eligible for one review-only draft
- Accepted name, rank, and identifiers: *Fusarium*, genus, `NCBITaxon:5506`; Index Fungorum `IF 8284`
- Nomenclature: NCBI Taxonomy retains *Fusarium* Link 1809 as the current genus, and Index Fungorum records the legitimate current name under record 8284. The visual scope is the broad current genus and does not claim species identification.
- Morphology boundary: authoritative clinical-mycology treatment supports hyaline septate hyphae and characteristic hyaline, canoe- or sickle-shaped multiseptate macroconidia, often with a foot-like basal cell. CDC PHIL 23081 independently documents septate hyaline hyphae and conidia in a public-domain reference micrograph. The generated plate uses those sources only as anatomy references, not as a design to copy. It is a restrained representative reconstruction, not a micrograph and not a diagnostic key.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=5506&mode=Info
  - https://www.indexfungorum.org/names/names.asp?strGenus=Fusarium
  - https://journals.asm.org/doi/full/10.1128/cmr.00159-22
  - https://phil.cdc.gov/Details.aspx?pid=23081

### Fusicatenibacter

- Route: `/article/fusicatenibacter`
- Decision: eligible for one review-only draft
- Accepted name, rank, and identifier: *Fusicatenibacter*, genus, `NCBITaxon:1407607`
- Nomenclature: NCBI Taxonomy and LPSN retain *Fusicatenibacter* Takada et al. 2013 as the current, validly published correct genus; *F. saccharivorans* is the nomenclatural type.
- Morphology boundary: the primary genus description supports non-motile, non-spore-forming spindle-shaped rods arranged in pairs and short chains. The plate is type-species-anchored, representative, and non-diagnostic; it omits spores and appendages.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1407607&mode=Info
  - https://lpsn.dsmz.de/genus/fusicatenibacter
  - https://doi.org/10.1099/ijs.0.045823-0
  - https://bacdive.dsmz.de/strain/24117

## Hold ledger before generation

All six canonical identities and conservative visual scopes cleared. Batch 018 has no scientific hold, no fallback art, and no route substitution.

## Frozen exact prompts

The text in each fenced block is the complete immutable prompt for its single built-in generation call. Prompt-requested counts are composition requests only and are never output evidence.

### `agathobacter-rectalis-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome species article
Primary request: Create a passive, static, microscopy-informed appearance reconstruction representing Agathobacter rectalis under its current accepted combination, explicitly non-diagnostic and never keyed to the retired Eubacterium rectale route.
Scene/backdrop: Pale cool near-white field with a very subtle neutral silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly eight visible rod bodies arranged as six clearly separated groupings: four isolated singles and two touching two-body pairs. Use conservative mostly straight to gently curved rods with rounded or blunt ends and restrained natural length variation. Every body must have its own crisp ordinary cell boundary.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with clear tonal separation from the background, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate, six isolated countable groupings distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No full cocci, branching, filaments, internal spores, flagella, pili, capsules, halos, shared envelopes, biofilm, labels, text, arrows, scale bar, decorative particles, glow, host tissue, culture plate, laboratory apparatus, process sequence, scenery, border, signature, or watermark.
```

### `firmicutes-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome phylum article
Primary request: Create a passive, static, microscopy-informed selected-descendant morphology-diversity reconstruction for Firmicutes under the current phylum name Bacillota. This is explicitly representative, non-exhaustive, and non-diagnostic, never a universal portrait of the phylum.
Scene/backdrop: Pale cool near-white field with a very subtle neutral silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly ten visible cellular bodies arranged as six widely separated groupings: three isolated singles, one touching two-rod pair, one touching two-coccoid pair, and one short touching three-rod chain. Across the plate use a restrained selected diversity of short and elongated rods with rounded ends plus compact spherical-to-ovoid bodies. Every body must remain individually countable with only its own ordinary boundary.
Style/medium: Serious scientific editorial diversity reconstruction, restrained matte silver-blue cellular material with clear tonal separation from the background, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 diversity plate, six separated countable groupings distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No single repeated universal morphology, no embedded labels or taxon names, no branching, filaments, internal spores, flagella, pili, capsules, halos, shared outer envelope, sheath, biofilm, labels, text, arrows, scale bar, decorative particles, glow, host tissue, culture plate, laboratory apparatus, process sequence, scenery, border, signature, or watermark.
```

### `flavobacterium-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome genus article
Primary request: Create a passive, static, microscopy-informed appearance reconstruction representing Flavobacterium, anchored to the type genus morphology and explicitly representative and non-diagnostic.
Scene/backdrop: Pale cool near-white field with a very subtle neutral silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly eight visible rod bodies arranged as six clearly separated groupings: four isolated singles and two touching two-body pairs. Use slender straight-to-gently-curved rods with rounded or subtly tapered ends and restrained length variation; one isolated rod may be longer and gently flexible-looking while remaining a static form. Every body must have its own crisp ordinary boundary.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with clear tonal separation from the background, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate, six isolated countable groupings distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No implied motion, yellow colony color, full cocci, branching, filaments, internal spores, flagella, pili, capsules, halos, shared envelopes, biofilm, labels, text, arrows, scale bar, decorative particles, glow, host tissue, culture plate, laboratory apparatus, process sequence, scenery, border, signature, or watermark.
```

### `flavonifractor-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome genus article
Primary request: Create a passive, static, microscopy-informed appearance reconstruction representing Flavonifractor, anchored to the type species rod morphology and explicitly representative and non-diagnostic for the current genus.
Scene/backdrop: Pale cool near-white field with a very subtle neutral silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly eight visible rod bodies arranged as six clearly separated groupings: four isolated singles and two touching two-body pairs. Use conservative straight-to-slightly-curved rods with rounded ends and restrained length variation, including one longer isolated rod. Every body must have its own crisp ordinary cell boundary.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with clear tonal separation from the background, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate, six isolated countable groupings distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No full cocci, branching, filaments, visible spores, flagella, pili, capsules, halos, shared envelopes, biofilm, flavonoid graphic, labels, text, arrows, scale bar, decorative particles, glow, host tissue, culture plate, laboratory apparatus, process sequence, scenery, border, signature, or watermark.
```

### `fusarium-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome fungal genus article
Primary request: Create a passive, static, microscopy-informed morphology reconstruction representing Fusarium, showing source-supported fungal anatomy while remaining explicitly representative, non-diagnostic, and not a micrograph.
Scene/backdrop: Pale cool near-white field with a very subtle neutral silver-blue falloff and generous negative space; no environment, plant, or disease scene.
Subject: One restrained isolated grouping of hyaline septate fungal hyphae with a short main filament and only a few simple branches, plus exactly four detached and widely separated hyaline macroconidia. Each macroconidium must be an anatomically credible slender canoe-to-gently-sickle form with three to five clear transverse septa and one subtly foot-like basal end. Keep all five major structures or groupings individually countable and visually distinct.
Style/medium: Serious scientific editorial reconstruction, restrained translucent silver-blue fungal material with clear tonal separation from the background, crisp technical anatomy, never decorative, botanical, cartoonish, or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 technical specimen plate, the sparse hyphal grouping offset from four isolated macroconidia, balanced generous spacing, no edge clipping.
Constraints: Static appearance only. No plant, leaf, root, fruit, lesion, host tissue, culture plate, colony, laboratory apparatus, spore cloud, dense environmental mycelium, warm neutral shift, blue-on-blue loss, glow, bioluminescence, labels, text, arrows, scale bar, decorative particles, process sequence, scenery, border, signature, or watermark.
```

### `fusicatenibacter-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome genus article
Primary request: Create a passive, static, microscopy-informed appearance reconstruction representing Fusicatenibacter, anchored to the type species spindle-shaped rod morphology and explicitly representative and non-diagnostic for the genus.
Scene/backdrop: Pale cool near-white field with a very subtle neutral silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly ten visible spindle-shaped rod bodies arranged as six clearly separated groupings: three isolated singles, two touching two-body pairs, and one short touching three-body chain. Use gently tapered poles, restrained natural length variation, and crisp ordinary individual boundaries so every cell remains countable.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with clear tonal separation from the background, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate, six isolated countable groupings distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No full cocci, club-shaped branches, filaments, internal spores, flagella, pili, capsules, halos, shared envelopes, biofilm, labels, text, arrows, scale bar, decorative particles, glow, host tissue, culture plate, laboratory apparatus, process sequence, scenery, border, signature, or watermark.
```

## Generation and native-resolution audit ledger

Each cleared route received exactly one built-in generation call using its corresponding fenced prompt without alteration. No retry or revision call was made. Every copied PNG was inspected at its native 1536 by 1024 resolution, and the prompt-requested counts were not treated as output evidence.

| Route | Prompt SHA-256 | Generation record | Review draft | Draft SHA-256 | Bytes | Human-observed output |
| --- | --- | --- | --- | --- | ---: | --- |
| `agathobacter-rectalis` | `94f06ae8c30d7940b9dbadc9a562bdc878ac189b7656e822390bbc12dcdd5883` | `exec-e1925723-6810-47ba-9a74-832f4d63bd2d.png` | `work/media-drafts/microorganisms-batch-018/agathobacter-rectalis-draft.png` | `3659945e786ad32494030a6cc15eb745ffc65d5b4d90753d116f210c68df0fcc` | 1,705,472 | 9 rods / 7 groupings: 5 singles and 2 touching pairs; prompt requested 8 / 6. |
| `firmicutes` | `fa6d18ca02c2f8dfe90f761da5f735100511ada3112985f6bbd8c6090a2b2032` | `exec-c44f426c-6f12-411d-9652-9185f220d997.png` | `work/media-drafts/microorganisms-batch-018/firmicutes-draft.png` | `8212e377fb61342dbfd993fa3dbb4ecefb5299cbe4a5963dae0bfbe051cf6582` | 1,852,052 | 11 bodies / 7 groupings: 3 rod singles, 1 coccoid single, 1 rod pair, 1 coccoid pair, and 1 three-rod chain; prompt requested 10 / 6. |
| `flavobacterium` | `536f9a1d5e85506a494f4f198f3acad46cfb61cbb94110614ea81e5d4df99569` | `exec-8b31633f-0a26-4ff0-a1fb-1068d2ede135.png` | `work/media-drafts/microorganisms-batch-018/flavobacterium-draft.png` | `c73322076ec02d76aa33a8da77d6fe8266b94c0b4dacc80c129de267864ea80a` | 1,766,237 | 8 rods / 6 groupings: 4 singles and 2 touching pairs, including 1 long gently curved single. |
| `flavonifractor` | `a89aaf4bba7c51dc2c25eb3e09a199c8e1b4050aa9097528a467de47fb9de0db` | `exec-9819b6d3-b16f-417b-88ba-f20da7d4690f.png` | `work/media-drafts/microorganisms-batch-018/flavonifractor-draft.png` | `c1192d138773251510def604f3570deb3a4515f2bc83020cc7a3117784c3794b` | 1,879,137 | 8 rods / 6 groupings: 4 singles and 2 touching pairs. |
| `fusarium` | `fb6a73d1a76db64af5e39c18ab8237456e5c9b60baa163acc7c0e5684684b798` | `exec-005b4b66-5075-4f91-a85e-e94caa0ce482.png` | `work/media-drafts/microorganisms-batch-018/fusarium-draft.png` | `57c507790948ea0618a518dc1e0d2e1120cf637cf82040fa5fef7ffadec79123` | 1,791,399 | 5 major structures/groupings: 1 connected septate hyphal grouping with 2 lateral branches plus 4 detached curved multiseptate macroconidia. The hypha intentionally continues beyond the lower specimen frame; the upper-central macroconidium may show 6 rather than the prompt-requested maximum of 5 septa. |
| `fusicatenibacter` | `41ce67fa1e7bf603d5f7ef79823121a279ecfe44d181d4a979ce0da2dfd0473a` | `exec-e81a6bbd-b13a-48db-a525-5d31bb179703.png` | `work/media-drafts/microorganisms-batch-018/fusicatenibacter-draft.png` | `a80be8bd3e076403135cb59375d8c0573a0141cfd53af31fd5c91dba97361be9` | 1,687,840 | 10 spindle-shaped rods / 6 groupings: 3 singles, 2 touching pairs, and 1 touching three-body chain. |

All six outputs retain a pale cool near-white field, clearly separated silver-blue subjects, and no visible text, label, scale bar, warm-neutral shift, blue-on-blue loss, conceptual glow, decorative particle, host tissue, culture plate, disease or laboratory scene, process sequence, signature, or watermark. The *Fusarium* frame continuation and possible sixth macroconidial septum remain explicit prompt deviations; no correction or retry was attempted.

## Control disposition and public-language boundary

WikiBiome root control inspected all six exact v1 PNGs at original 1536 by 1024 resolution and accepted every immutable draft hash unchanged on 2026-09-01. Promotion was authorized without regeneration or source-file alteration. The *Fusarium* lower-edge hypha is accepted as an intentional specimen continuation; the possible six-septum upper-central macroconidium remains disclosed and must not be generalized as a universal genus pattern.

The SHA-256 of the exact pre-promotion review manifest accepted by control is `cc049461dbd466ea0df1c4ed3bd4914b7136ca764df46b1b63ec90cefd2c25fd`. The reviewed manifest retains this value as the immutable handoff checkpoint while adding only the promotion disposition and public-record state.

Public alt text, caption, description, and provenance follow the literal observed output rather than the prompt. `Firmicutes (Bacillota)` is always identified as a selected descendant-diversity reconstruction, not a universal phylum morphology. *Fusarium* is always identified as a representative reconstruction, not a micrograph or visual diagnostic key. The retired `eubacterium-rectale` alias remains asset-free; the accepted current-route asset belongs only to `agathobacter-rectalis`, `NCBITaxon:39491`.
