# Microorganisms batch 001 — image-generation prompts

Generator: OpenAI built-in image generation. All six selected lossless PNGs are retained in `media/masters`. Public scientific resources informed morphology and identity; no source image was supplied to the generator or copied as a design.

## Acidaminococcus

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for Acidaminococcus
Primary request: microscopy-informed scientific morphology reconstruction of the bacterial genus Acidaminococcus
Scene/backdrop: seamless pale cool blue-gray laboratory field, no scene or environmental props
Subject: a restrained isolated group of six small spherical Gram-negative bacterial cells arranged predominantly as diplococci, with slight natural size and spacing variation; smooth double-membrane surface cues; no flagella and no spores
Style/medium: technically serious high-resolution scientific 3D reconstruction, clearly an educational illustration rather than a micrograph
Composition/framing: landscape 3:2, centered specimen group with generous clean margins, crisp subject separation
Lighting/mood: soft diffuse cool studio illumination, neutral and clinical, restrained contrast
Color palette: muted blue-gray, silver, and desaturated slate; no saturated biological fantasy colors
Materials/textures: subtle plausible cell-envelope texture, no glassy plastic or wet slime
Constraints: morphology must read as cocci in pairs, not rods; isolated subject; minimal scene-making; no labels, no text, no scale bar, no petri dish, no tissue, no blood, no watermark; scientifically plausible but not diagnostic
Avoid: generic stock microbiome clouds, neon glow, dramatic depth tunnel, excessive surface hairs, obvious synthetic gloss, copied textbook composition
```

## Acinetobacter

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for Acinetobacter
Primary request: microscopy-informed scientific morphology reconstruction of the bacterial genus Acinetobacter
Scene/backdrop: seamless pale cool blue-gray laboratory field, no scene or environmental props
Subject: a restrained isolated group showing the genus's pleomorphic short, plump Gram-negative coccobacilli: several rounded short rods transitioning toward coccoid forms, mostly in pairs with one short chain; nonmotile, therefore absolutely no flagella; only a very subtle capsule edge on a few cells
Style/medium: technically serious high-resolution scientific 3D reconstruction, clearly an educational illustration rather than a micrograph
Composition/framing: landscape 3:2, centered specimen group with clean margins and clear individual silhouettes
Lighting/mood: soft diffuse cool studio illumination, neutral and clinical
Color palette: muted silver-blue and desaturated slate on a pale cool field
Materials/textures: restrained cell-envelope texture, matte and biologically plausible
Constraints: coccobacillary forms must be short and plump, not long bacilli; no species-specific hospital narrative; isolated subject; no labels, no text, no scale bar, no petri dish, no tissue, no watermark
Avoid: flagella, spores, bright colors, generic microbe swarm, neon glow, aggressive pathogen symbolism, glossy toy-like cells, copied public image composition
```

## Acinetobacter baumannii

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for Acinetobacter baumannii
Primary request: microscopy-informed scientific morphology reconstruction of Acinetobacter baumannii
Scene/backdrop: seamless pale cool blue-gray laboratory field, no hospital or clinical scene
Subject: three to five short plump Gram-negative coccobacilli with rounded ends, including a paired arrangement; subtle continuous capsular halo and sparse fine surface pili; nonmotile, with absolutely no flagella; plausible stationary-phase coccobacillary form
Style/medium: technically serious high-resolution scientific 3D reconstruction, clearly an educational illustration rather than a micrograph
Composition/framing: landscape 3:2, isolated centered cells with generous clean margins, one primary pair in sharp focus
Lighting/mood: soft diffuse cool studio illumination, serious and restrained
Color palette: muted silver, blue-gray, and desaturated slate; no saturated colors
Materials/textures: matte outer membrane with faint capsule boundary, no slime or plastic gloss
Constraints: keep morphology short and coccobacillary; do not depict antimicrobial resistance as armor or a hospital scene; no labels, no text, no scale bar, no petri dish, no tissue, no watermark; scientifically plausible but not diagnostic
Avoid: flagella, spores, long rods, neon glow, generic pathogen iconography, obvious synthetic rendering, copied public image composition
```

## Actinomycetota diversity

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for the phylum Actinomycetota, treated as a representative microbial-community reconstruction
Primary request: scientifically restrained morphology plate showing the genuine morphological diversity within Actinomycetota rather than pretending the phylum has one cell shape
Scene/backdrop: seamless pale cool blue-gray laboratory field with no habitat scene
Subject: four clearly separated representative groupings: a small coccoid cluster, a rod-to-coccoid pair, a short fragmenting hyphal form, and a delicate branched bacterial mycelial filament; all Gram-positive high-GC bacterial forms, with scale relationships presented as illustrative rather than literal
Style/medium: technically serious high-resolution scientific 3D reconstruction, educational illustration rather than a micrograph
Composition/framing: landscape 3:2, balanced specimen-plate arrangement with generous margins and no overlap between groupings
Lighting/mood: soft diffuse cool studio illumination, neutral and serious
Color palette: restrained related blue-gray and silver tones with only subtle tonal differentiation
Materials/textures: matte plausible cell-wall texture, bacterial filaments visibly finer than fungal hyphae
Constraints: this is a phylum-level diversity plate; no single form should dominate; no labels, no text, no scale bar, no petri dish, no soil, no human tissue, no watermark
Avoid: generic mixed microbiome cloud, fungal mushrooms or thick fungal hyphae, neon colors, decorative network lines, obvious synthetic gloss, copied textbook layout
```

## Actinomyces — initial generation and accepted edit

The initial generation requested sparse surface fibrils. Control-tower review held that draft because the fine hairs could read as pili or flagella. The accepted master is the result of this precise edit against the initial PNG:

```text
Use case: precise-object-edit
Asset type: WikiBiome primary article media for Actinomyces
Input image: Image 1 is the edit target
Primary request: remove every fine hair-like surface projection from all bacterial rods and branches
Subject: preserve the same clean segmented branching Actinomyces rods, straight and wavy branch geometry, occasional swollen or clubbed terminal ends, count, spacing, and scale
Scene/backdrop: keep the existing seamless pale cool blue-gray field unchanged
Style/medium: keep the technically serious scientific 3D reconstruction unchanged
Composition/framing: keep the landscape composition and specimen placement unchanged
Lighting/mood: keep the soft cool lighting unchanged
Constraints: change only the fine appendage-like hairs; all cell surfaces must be clean and nonmotile-looking, with absolutely no pili, flagella, cilia, spikes, fibers, or fuzz; preserve segmentation and clubbed ends; no text, labels, scale bar, watermark, tissue, or scene
Avoid: replacing the subject, adding appendages, fungal hyphae, smoothing away the segmented rod boundaries
```

## Adherent-invasive Escherichia coli

```text
Use case: scientific-educational
Asset type: WikiBiome primary article media for adherent-invasive Escherichia coli (AIEC)
Primary request: microscopy-informed morphology reconstruction of the AIEC pathotype represented by strain LF82, while making no claim that morphology alone identifies the pathotype
Scene/backdrop: seamless pale cool blue-gray laboratory field, no intestinal or clinical scene
Subject: three isolated Escherichia coli bacilli with rounded ends; the central cell is highly but plausibly piliated with numerous extremely fine short type 1 pili and several longer peritrichous flagella, based on electron-microscopy reports for LF82; companion cells show natural variation in appendage visibility
Style/medium: technically serious high-resolution scientific 3D reconstruction, educational illustration rather than a micrograph
Composition/framing: landscape 3:2, centered cells with generous clean margins and fine appendages readable against the pale field
Lighting/mood: soft diffuse cool studio illumination, neutral and restrained
Color palette: muted blue-gray, silver, and desaturated slate
Materials/textures: matte plausible outer membrane and hair-fine pili, no wet slime
Constraints: rods must remain ordinary E. coli morphology; do not visually imply that AIEC is diagnosable by shape; no host cells, no adhesion scene, no labels, no text, no scale bar, no petri dish, no watermark
Avoid: oversized spikes, armor, glowing virulence effects, generic microbe swarm, neon color, obvious synthetic gloss, copied public image composition
```
