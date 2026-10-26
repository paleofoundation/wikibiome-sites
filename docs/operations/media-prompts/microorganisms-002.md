# Microorganisms batch 002 — image-generation prompts

Generator: OpenAI built-in image generation. The prompt blocks below are immutable generation provenance and are not evidence that the output followed requested counts. The separately recorded human output audit is authoritative for visible subject counts, grouping, alt text, captions, and promotion. Public scientific resources informed morphology and identity; no source image was supplied to the generator or copied as a design.

## Adlercreutzia

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for the genus Adlercreutzia
Primary request: microscopy-informed scientific morphology reconstruction of representative Adlercreutzia cells, grounded in the original and emended genus descriptions
Scene/backdrop: seamless pale cool blue-gray laboratory field with no environmental scene or props
Subject: a restrained isolated grouping of six Gram-positive cells spanning short ovoid coccobacilli to slender rods with rounded ends, mostly single with one pair; plausible subtle variation around roughly 0.65 micrometres wide and 2 micrometres long; nonmotile and non-spore-forming, therefore absolutely no appendages or spores
Style/medium: technically serious high-resolution scientific 3D reconstruction, clearly an educational illustration rather than a micrograph
Composition/framing: landscape 3:2, centered specimen group with generous clean margins and readable individual silhouettes
Lighting/mood: soft diffuse cool studio illumination, neutral, clinical, restrained contrast
Color palette: muted silver-blue, slate, and pale cool gray
Materials/textures: matte plausible cell-wall texture, no wet slime or glassy plastic
Constraints: show only coccobacillary-to-rod variation supported within Adlercreutzia; no equol molecule, intestine, food, host tissue, labels, text, scale bar, petri dish, watermark, flagella, pili, spores, or scene-making; not diagnostic
Avoid: generic microbiome swarm, neon colors, dramatic pathogen symbolism, fuzzy surface hairs, obvious synthetic gloss, copied reference composition
```

## Aerococcus

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for the genus Aerococcus
Primary request: microscopy-informed scientific morphology reconstruction of Aerococcus cellular arrangements
Scene/backdrop: seamless pale cool blue-gray laboratory field with no urogenital, clinical, or culture-plate scene
Subject: Gram-positive spherical to slightly ovoid cocci about one micrometre across, arranged in one clear tetrad, one pair, and one small irregular cluster; no chains dominating the image; nonmotile, lacking spores and flagella
Style/medium: technically serious high-resolution scientific 3D reconstruction, clearly an educational illustration rather than a micrograph
Composition/framing: landscape 3:2, three separated arrangements centered with generous clean margins; tetrad geometry clearly legible
Lighting/mood: soft diffuse cool studio illumination, neutral and clinical
Color palette: muted silver-blue and desaturated slate on a pale cool field
Materials/textures: restrained matte cell-wall texture with natural minor variation
Constraints: preserve coccal form and characteristic pairs, tetrads, and clusters; no alpha-hemolysis plate, urine, host tissue, labels, text, scale bar, watermark, flagella, pili, spores, or clinical iconography; not diagnostic
Avoid: grape-like Staphylococcus-only cluster, long Streptococcus chains, generic microbe cloud, neon glow, fuzzy hairs, glossy toy cells, copied public-image composition
```

## Aeromonas — initial generation

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for the genus Aeromonas
Primary request: microscopy-informed scientific morphology reconstruction of representative mesophilic Aeromonas rods
Scene/backdrop: seamless pale cool blue-gray laboratory field with no water, wound, intestine, or culture scene
Subject: four isolated straight Gram-negative rods with rounded ends and slight natural size variation; two cells show one long unsheathed polar flagellum emerging from a single pole, one cell shows a polar flagellum plus a few fine lateral flagella to communicate conditional lateral-flagellum expression, and one cell has no visible appendage; no spores
Style/medium: technically serious high-resolution scientific 3D reconstruction, clearly an educational illustration rather than a micrograph
Composition/framing: landscape 3:2, centered separated rods with generous margins and appendages readable against the pale field
Lighting/mood: soft diffuse cool studio illumination, serious and restrained
Color palette: muted blue-gray, silver, and slate
Materials/textures: matte plausible outer membrane; flagella hair-fine and biologically scaled rather than thick cables
Constraints: genus-level representative morphology only; caption will state flagellar expression varies by species and growth condition; no disease scene, siderophore symbol, labels, text, scale bar, petri dish, tissue, blood, watermark, pili, or spores; not diagnostic
Avoid: peritrichous flagella on every cell, oversized tentacles, neon pathogen effects, generic microbe swarm, wet slime, obvious synthetic gloss, copied reference composition
```

The upper-right cell in the initial output carried a polar tuft that could overstate the canonical morphology. The candidate v2 resulted from this exact edit:

```text
Use case: precise-object-edit
Asset type: WikiBiome primary article media for Aeromonas
Input images: Image 1 is the edit target
Primary request: remove the extra flagellar strands from the upper-right bacterial rod so that it retains exactly one long, fine flagellum emerging from one pole
Subject invariants: preserve all four straight rounded rods exactly; preserve the single polar flagellum on the upper-left rod, preserve the single polar flagellum on the lower-left rod, and preserve the lower-right rod with no visible appendage
Scene/backdrop: keep the seamless pale cool blue-gray field unchanged
Style/medium: keep the technically serious scientific 3D reconstruction unchanged
Composition/framing: keep cell positions, sizes, rotations, spacing, and landscape crop unchanged
Lighting/mood: keep the soft cool illumination unchanged
Constraints: change only the upper-right polar tuft; it must become exactly one hair-fine polar flagellum with no other lateral, peritrichous, or tufted strands; no pili, labels, text, scale bar, watermark, spores, tissue, or scene elements
Avoid: moving or redesigning cells, changing surface textures, adding new appendages, thick cable-like flagella
```

## Alishewanella

Output-audit correction: although the preserved prompt requested five rods, the rendered candidate contains six. The accepted metadata records six rods, including two with one polar flagellum each, as genus-level variation; the reconstruction is not a micrograph and does not imply that every *Alishewanella* species or strain is flagellated.

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for the genus Alishewanella
Primary request: microscopy-informed scientific morphology reconstruction showing the genus's straight rod form and documented motility variation
Scene/backdrop: seamless pale cool blue-gray laboratory field with no soil, mine, fermented food, reproductive tissue, or clinical scene
Subject: five isolated Gram-negative straight rods with rounded ends, occurring singly with one loose pair; two rods have one long fine polar flagellum from a single pole, while the remaining rods have no visible appendage, reflecting that motility varies among Alishewanella species; no spores
Style/medium: technically serious high-resolution scientific 3D reconstruction, clearly an educational illustration rather than a micrograph
Composition/framing: landscape 3:2, centered specimen group with clean separation, generous margins, and polar appendages clearly traceable
Lighting/mood: soft diffuse cool studio illumination, neutral and restrained
Color palette: muted silver-blue and desaturated slate on a pale cool field
Materials/textures: matte plausible outer-membrane texture, flagella hair-fine
Constraints: rods must remain simple and non-pleomorphic; no claim that morphology identifies a lesion-associated organism; no tissue, host cells, metal particles, labels, text, scale bar, petri dish, watermark, lateral flagella, pili, or spores; not diagnostic
Avoid: flagella on every cell, peritrichous bundles, generic pathogen iconography, neon colors, slimy biofilm, fuzzy hairs, copied public-image composition
```

## Alistipes

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for the genus Alistipes
Primary request: microscopy-informed scientific morphology reconstruction of representative Alistipes cells
Scene/backdrop: seamless pale cool blue-gray laboratory field with no intestinal, tumor, diet, or culture scene
Subject: six Gram-negative cells spanning compact ovoid forms to short rods with rounded ends, mostly occurring singly with one loose pair; subtle natural size variation; obligately anaerobic, non-spore-forming, and nonmotile, therefore absolutely no appendages or spores
Style/medium: technically serious high-resolution scientific 3D reconstruction, clearly an educational illustration rather than a micrograph
Composition/framing: landscape 3:2, centered isolated cells with generous clean margins and clear silhouettes
Lighting/mood: soft diffuse cool studio illumination, neutral and serious
Color palette: muted silver-blue, pale slate, and cool gray; no saturated pigment
Materials/textures: restrained matte outer-membrane texture, no wet slime or glassy plastic
Constraints: morphology should read as coccoid-to-short rounded rods, not long bacilli; no bile acids, metabolites, host tissue, labels, text, scale bar, petri dish, watermark, flagella, pili, or spores; genus-level and not diagnostic
Avoid: generic microbiome cloud, disease symbolism, neon glow, fuzzy surface hairs, glossy toy cells, copied textbook composition
```

## Akkermansia mucinicola — no generation

No image was generated. As of 2026-09-01, neither NCBI Taxonomy nor LPSN recognizes a taxon named *Akkermansia mucinicola*. The route cannot receive morphology media until its identity is corrected or an authoritative taxonomic description and controlled identifier are supplied.

Checked authorities:

- `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=Akkermansia`
- `https://www.lpsn.dsmz.de/genus/akkermansia`
