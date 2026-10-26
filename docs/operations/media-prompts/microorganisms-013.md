# WikiBiome microorganism media batch 013

- Batch: `microorganisms-013`
- Queue basis: control main `2ab565021ddbdd79d4f439b91f41948555f8dfa1`
- Upstream content source: `66a773667b1f6c06592eca878d5023138c602b39`
- Created: 2026-09-01
- Scope: passive scientific-educational appearance reconstruction only
- Generator: OpenAI built-in image generation, one call per eligible route
- Publication state: review-only drafts; no asset in this packet is approved for publication

## Identity and evidence audit

### Collinsella

- Route: `/article/collinsella`
- Decision: eligible for one review-only draft
- Rank and identifier: genus, `NCBITaxon:102106`
- Nomenclature: NCBI records *Collinsella* Kageyama et al. 1999 as the current genus; LPSN records it as a validly published correct name with *C. aerofaciens* as type species.
- Morphology boundary: the original genus proposal transfers *Eubacterium aerofaciens* to *Collinsella*. Type-species and family treatments support small rods or coccobacilli, commonly occurring singly, in pairs, or short chains. The plate is type-species-anchored and representative, not a diagnostic morphology for every member of the genus.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=102106&mode=Info
  - https://lpsn.dsmz.de/genus/collinsella
  - https://pubmed.ncbi.nlm.nih.gov/10319476/
  - https://doi.org/10.1099/00207713-49-2-557
  - https://bacdive.dsmz.de/strain/165615

### Coprococcus

- Route: `/article/coprococcus`
- Decision: eligible for one review-only draft
- Rank and identifier: genus, `NCBITaxon:33042`
- Nomenclature: NCBI and LPSN record *Coprococcus* Holdeman and Moore 1974 as the current, validly published correct genus; *C. eutactus* is the type species.
- Morphology boundary: the original description establishes an anaerobic-coccus genus. The type species is described as coccoid and commonly paired, while other historical members vary toward short ovoid forms and chains. The plate is type-species-anchored and representative; it avoids a generic grape-cluster treatment and does not claim visual diagnosis.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=33042&mode=Info
  - https://lpsn.dsmz.de/genus/coprococcus
  - https://doi.org/10.1099/00207713-24-2-260
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC11406416/

### Corynebacterium

- Route: `/article/corynebacterium`
- Decision: eligible for one review-only draft
- Rank and identifier: genus, `NCBITaxon:1716`
- Nomenclature: NCBI and LPSN record *Corynebacterium* Lehmann and Neumann 1896 as the current, validly published correct genus; *C. diphtheriae* is the type species.
- Morphology boundary: authoritative genus treatments support pleomorphic, often club-shaped rods in singles, pairs, angular V forms, and palisades. The static plate is type-species-anchored and representative, with no disease scene and no implication that the arrangement identifies the genus by itself.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1716&mode=Info
  - https://lpsn.dsmz.de/genus/corynebacterium
  - https://www.sciencedirect.com/science/article/pii/S0196439905000036

### Cryptococcus neoformans

- Route: `/article/cryptococcus-neoformans`
- Decision: eligible for one review-only draft
- Rank and identifiers: species, `NCBITaxon:5207`, MycoBank/Index Fungorum `119294`
- Nomenclature: NCBI records *Cryptococcus neoformans* (San Felice) Vuillemin 1901 as the current species and links to MycoBank and Index Fungorum. The current-name record is retained despite species-complex usage in some literature.
- Morphology boundary: primary light/electron microscopy supports round-to-oval budding yeast bodies surrounded by a polysaccharide capsule. Capsule breadth varies with conditions, so the plate uses restrained, individually bounded halos and is explicitly representative and non-diagnostic.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=5207&mode=Info
  - https://www.indexfungorum.org/Names/NamesRecord.asp?RecordID=119294
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC7957021/
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC251949/
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC6779390/

### Davidiella — identity correction hold

- Route: `/article/davidiella`
- Decision: withhold; no generation call and no raster
- Legacy taxonomic context: NCBI has retained historical sequence usage under *Davidiella* (`NCBITaxon:237557`), introduced for sexual morphs of *Cladosporium* sensu stricto.
- Current identity: *Cladosporium* Link 1816, genus, `NCBITaxon:5498`.
- Evidence finding: after abolition of dual nomenclature for pleomorphic fungi, the monographic treatment states that *Cladosporium* has priority over *Davidiella* and cites *Davidiella* as its synonym. The ICTF Working Group on Dothideomycetes subsequently recommended use of *Cladosporium* rather than *Davidiella*. Later genus treatment states that *Davidiella* is no longer recognized separately.
- Required editorial resolution: retire `/article/davidiella` as a canonical record and create an audited asset-free 308 alias to `/article/cladosporium`, subject to control/editorial approval. The already reviewed Cladosporium asset must not be duplicated or rekeyed to the obsolete route.
- Routing impact before resolution: `/article/davidiella` remains uncovered and excluded from the media registry and image sitemap; `/article/cladosporium` remains the current route.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=5498&mode=Info
  - https://pmc.ncbi.nlm.nih.gov/articles/3390897/
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC4681266/
  - https://pubmed.ncbi.nlm.nih.gov/26734553/
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC4774271/

### Debaryomyces

- Route: `/article/debaryomyces`
- Decision: eligible for one review-only draft
- Rank and identifiers: genus, `NCBITaxon:4958`, Index Fungorum `1432`
- Nomenclature: NCBI records *Debaryomyces* Lodder and Kreger-van Rij ex Kreger-van Rij 1984 as the current genus. Index Fungorum records the conserved name and *D. hansenii* as type species.
- Morphology boundary: authoritative genus treatment supports multilateral budding, with cells occurring singly, in pairs, short chains, or small clusters; only some species form poorly developed pseudohyphae. The plate therefore uses isolated and paired budding yeast bodies without pseudohyphae, asci, or spores and is type-species-anchored, representative, and non-diagnostic.
- Evidence:
  - https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=4958&mode=Info
  - https://www.indexfungorum.org/names/NamesRecord.asp?RecordID=1432
  - https://fungalgenera.org/genus/debaryomyces.html
  - https://doi.org/10.3767/003158508X336576

## Frozen exact prompts

The text in each fenced block is the complete immutable prompt for the single built-in generation call. Prompt-requested counts are composition requests only and are not output evidence.

### `collinsella-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome genus article
Primary request: Create a passive, static, microscopy-informed appearance reconstruction representing Collinsella, anchored to the type species morphology and explicitly not diagnostic for every member of the genus.
Scene/backdrop: Pale cool near-white field with a very subtle silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly eight visible cellular bodies arranged as six clearly separated groupings: four isolated singles and two touching two-body pairs. Use conservative small pleomorphic short rods to coccobacilli with restrained variation in length, gently rounded ends, and only mild curvature. One pair may read as a very short aligned chain. Every body must retain a crisp ordinary cell boundary.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate, isolated countable forms distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No branching, filaments, spores, flagella, pili, capsules, halos, shared envelopes, biofilm, labels, text, arrows, scale bar, decorative particles, host tissue, disease imagery, culture plate, laboratory apparatus, process sequence, scenery, border, signature, or watermark.
```

### `coprococcus-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome genus article
Primary request: Create a passive, static, microscopy-informed appearance reconstruction representing Coprococcus, anchored to the coccoid type-species morphology and explicitly not diagnostic for every member of the genus.
Scene/backdrop: Pale cool near-white field with a very subtle silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly eight visible cellular bodies arranged as four widely separated two-body pairs. Each body is coccoid to very short ovoid, with restrained natural size variation and a crisp ordinary boundary; every pair must show both bodies clearly. Do not form a grape-like cluster or a continuous long chain.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate, four countable paired groupings distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No full rods, grape clusters, long chains, spores, flagella, pili, capsules, halos, shared envelopes, biofilm, labels, text, arrows, scale bar, decorative particles, host tissue, disease imagery, culture plate, laboratory apparatus, process sequence, scenery, border, signature, or watermark.
```

### `corynebacterium-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome genus article
Primary request: Create a passive, static, microscopy-informed appearance reconstruction representing Corynebacterium, anchored to the type-species morphology and explicitly not diagnostic for every member of the genus.
Scene/backdrop: Pale cool near-white field with a very subtle silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly nine visible pleomorphic club-shaped rod bodies arranged as six clearly separated groupings: three isolated singles and three two-body pairs. Of the pairs, one forms a restrained open V, one is a near-parallel palisade pair, and one is a shallow angled pair. Use mild variation in rod length, slight curvature, and restrained clubbing or uneven end thickness; each cellular body must remain individually countable with its own ordinary boundary.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate, isolated countable groupings distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No true branching or Y-shaped cellular body, filaments, spores, flagella, pili, capsules, halos, shared envelopes, biofilm, labels, text, arrows, scale bar, decorative particles, host tissue, disease imagery, culture plate, laboratory apparatus, process sequence, scenery, border, signature, or watermark.
```

### `cryptococcus-neoformans-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome species article
Primary request: Create a passive, static, microscopy-informed appearance reconstruction representing Cryptococcus neoformans round-to-oval budding yeast morphology with restrained capsule context; explicitly non-diagnostic and not a clinical scene.
Scene/backdrop: Pale cool near-white field with a very subtle silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly eight visible round-to-oval yeast cellular bodies arranged as six clearly separated groupings: four isolated singles and two touching budding pairs. Each of the eight bodies has its own crisp matte silver-blue cell boundary and its own restrained, clearly bounded, thin translucent capsule halo. Buds remain individually countable and attached by a narrow contact. Capsule halos must be modest, never oversized, and must not enclose multiple cells together.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material with faint translucent capsule rims, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate, isolated countable forms distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No shared capsule, giant halo, pseudohypha, hypha, spore, internal organelle diagram, label, text, arrow, scale bar, decorative particle, host cell or tissue, disease imagery, culture plate, laboratory apparatus, lifecycle or process sequence, scenery, border, signature, or watermark.
```

### `debaryomyces-draft.png`

```text
Use case: scientific-educational
Asset type: review-only landscape raster for a WikiBiome genus article
Primary request: Create a passive, static, microscopy-informed appearance reconstruction representing Debaryomyces, anchored to the type species as conservative budding yeast morphology and explicitly not diagnostic for every member of the genus.
Scene/backdrop: Pale cool near-white field with a very subtle silver-blue falloff and generous negative space; no environment or scene.
Subject: Exactly eight visible round-to-oval yeast cellular bodies arranged as six clearly separated groupings: four isolated singles and two touching budding pairs. Use restrained size and oval-shape variation. In each budding pair, a smaller attached bud is individually countable at a different perimeter position. Every body has a crisp ordinary boundary and no surrounding halo.
Style/medium: Serious scientific editorial reconstruction, restrained matte silver-blue cellular material, lightly translucent depth, technically clean silhouettes, never cartoonish or fantastical, not a micrograph.
Composition/framing: Landscape 3:2 plate, isolated countable forms distributed across the field, balanced spacing, no edge clipping.
Constraints: Static appearance only. No pseudohypha, hypha, chain, ascus, ascospore, capsule, halo, shared envelope, label, text, arrow, scale bar, decorative particle, host tissue, disease imagery, culture plate, laboratory apparatus, lifecycle or process sequence, scenery, border, signature, or watermark.
```

## Generation ledger

Each supported route received exactly one built-in generation call using the corresponding fenced prompt without alteration. No retry or revision call was made. Prompt-requested counts were not treated as output evidence. Every copied original was inspected at its native 1536 by 1024 resolution.

| Route | Generation record | Copied review draft | SHA-256 | Human-observed output |
| --- | --- | --- | --- | --- |
| `collinsella` | `exec-26e4efd3-a459-4604-bf6a-dd8a92395c4d.png` | `work/media-drafts/microorganisms-batch-013/collinsella-draft.png` | `defe4488d16fb9f63a085a69ff9db506b1efaf17fd581fcaf7f6828564ed94a6` | 9 bodies / 7 groupings: 5 singles and 2 touching pairs; prompt requested 8 / 6. |
| `coprococcus` | `exec-a82e5b6a-6a32-4046-a7d0-55029466975a.png` | `work/media-drafts/microorganisms-batch-013/coprococcus-draft.png` | `46b1f421f86c1c34629d76d108858759913e62c7f00c6f9497f302cdbd0f479e` | 8 bodies / 4 groupings: 4 separated touching pairs. |
| `corynebacterium` | `exec-f254d2a8-1cf9-4304-9e33-e2ae09cbe2df.png` | `work/media-drafts/microorganisms-batch-013/corynebacterium-draft.png` | `0d23b84ec6d82a5994a25f484866a1601c4d26a390e142bd63bb1f4fb700738d` | 9 bodies / 6 groupings: 3 singles, 1 open-V pair, 1 near-parallel pair, and 1 shallow angled pair. |
| `cryptococcus-neoformans` | `exec-1037b9a2-8b4d-43d7-b429-cff92d034d6f.png` | `work/media-drafts/microorganisms-batch-013/cryptococcus-neoformans-draft.png` | `3fd06f1855e644f3624df66585834d47bab3f07075a1f1b84f585a24f5fa2781` | 10 bodies / 8 groupings: 6 singles and 2 budding pairs; prompt requested 8 / 6. Each single has its own thin halo, but each attached budding pair has one continuous lobed capsule contour around the mother and bud. This literal no-shared-capsule prompt deviation is preserved for control review and is not silently accepted. |
| `debaryomyces` | `exec-f9224f5a-d7b5-4d9c-b316-d5b54059c634.png` | `work/media-drafts/microorganisms-batch-013/debaryomyces-draft.png` | `5c6a0517e702e70e4fbd92d5737073f2e0a25b565e8799b152a90194ddc3a02e` | 8 bodies / 6 groupings: 4 singles and 2 budding pairs. |
| `davidiella` | none | none | none | Withheld on current-identity grounds; no generation call and no raster. |

All five outputs use the required pale cool field and have no visible text, labels, scale bar, host tissue, disease or laboratory scene, decorative particles, clipping, signature, or watermark. Public-facing candidate descriptions in the batch manifest follow the human-observed bodies and groupings rather than the requested prompt counts.

## Control visual disposition

WikiBiome control accepted Collinsella v1, Coprococcus v1, Corynebacterium v1, Cryptococcus neoformans v1, and Debaryomyces v1 on 2026-09-01. Control subsequently supplied exact corrected outer main `2ab565021ddbdd79d4f439b91f41948555f8dfa1`, with upstream source `66a773667b1f6c06592eca878d5023138c602b39`, authorizing promotion of only these five exact originals.

For Cryptococcus neoformans, preserve this exact observed-description and provenance boundary: encapsulated round-to-ovoid yeast with two narrow-based budding pairs; the transparent halo forms a continuous lobed contour around each attached mother-bud pair. It is a representative, non-diagnostic scientific reconstruction, not a micrograph.

Davidiella was resolved before promotion as an audited asset-free alias to the already-covered Cladosporium route. It received no generation call and has no raster, registry entry, master, derivative, or image-sitemap entry.
