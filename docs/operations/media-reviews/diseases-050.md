# Immutable native review — diseases Batch 050

Reviewed: 2026-09-06  
Authorized parent: `45ce0bf7706f4155ae56b8494d62bd213e9aced7`  
Audit commit: `b11a98b`  
Prompt-freeze commit: `a03c8e4`

Exactly one built-in image-generation call was made for each of the six frozen prompts. All six returned a 1536 × 1024 PNG. The original generation records remain preserved by the built-in generator, and byte-identical project-bound copies are preserved under `work/media-drafts/diseases-batch-050/`. This review reports literal native output rather than requested prompt intent.

## Exact source hashes and dispositions

| Route | Revision | Generation record | Source SHA-256 | Bytes | Native disposition |
| --- | ---: | --- | --- | ---: | --- |
| `female-infertility` | 1 | `exec-6422376b-2eb8-4be5-9714-992f8c549920.png` | `b2986423fc55534e131181acfc73ac25349437038aa5461a5e7e80622ab5ef34` | 2,098,229 | approve for exact-hash acceptance; `contain` required |
| `fibromyalgia` | 1 | `exec-bcfc73fd-c66d-471f-a20f-4457f4345033.png` | `3d74eac8d67059f948f84cececffbedd9c80d17d9e5232c0f28552b065fb2742` | 1,853,006 | approve for exact-hash acceptance; `contain` required |
| `gastric-adenocarcinoma` | 1 | `exec-bfe42346-712a-46a7-bab9-14d24a3da2aa.png` | `12c5ea4970391b10205877940accdcfd87918557dc8d7c500f0ccb124a7886ac` | 2,253,195 | approve for exact-hash acceptance; `contain` required |
| `gastric-cancer` | 1 | `exec-d1c068d9-539a-497f-ba3e-235a10a13603.png` | `e27e2dde1741b3286fd8d471ce06731c05301a68368a52b7d5bf7d64c9f38619` | 2,025,568 | approve for exact-hash acceptance; `contain` required |
| `gastric-ulcer` | 1 | `exec-21453237-cdb5-4b2f-8825-d9612df65868.png` | `2ddb18f7c702d6b50af6adc8a7ba7f7111d23038fc10f0f3f700cdb6e2d7938f` | 2,023,709 | approve for exact-hash acceptance; `contain` required |
| `gerd` | 1 | `exec-e3a12f84-da2a-4362-8c14-79e66e58d46e.png` | `3d3e980de5c6b9950f3c88e8b93da48a9fd79419ead79cc4ea65669e6695224b` | 2,101,335 | approve for exact-hash acceptance; `contain` required |

## Literal output audit

### Female Infertility

Two complete teaching groups are visible: one internal reproductive model with uterus, cervix, paired tubes, fimbriae, and ovaries, and one separate ovarian cutaway containing follicles at visibly varied stages. The lobulated ovarian surfaces are rendered as teaching-model texture and must not be described as cystic morphology. No person, external body, pregnancy, embryo, sperm, blocked tube, scar, lesion, procedure, label, or text is visible. Luma-below-220 bounds are `[0, 0, 1535, 870]` because the pale blue background gradient crosses that threshold at the upper and side edges; the 32-pixel outer band contains zero pixels below luma 128, and the anatomical structures remain visibly complete with pale separation from every edge. Centered `contain` is mandatory.

### Fibromyalgia

Three complete teaching groups are visible: one intact brain with upper spinal cord and branching roots, one circular connected neural-network abstraction, and one skeletal-muscle fascicle cross-section. No body silhouette, person, tender-point map, damaged muscle, inflamed joint, lesion, pain scale, label, or text is visible. Luma-below-220 bounds are `[45, 150, 1501, 907]`; the 32-pixel outer band contains zero pixels below luma 128 and no structure touches a source edge. Metadata must describe neutral systems orientation only and must not assert central sensitization, a biomarker, or universal mechanism from the image. Centered `contain` is mandatory.

### Gastric Adenocarcinoma

Two complete teaching groups are visible: one opened-stomach model with intact rugal folds and one separate layered gastric-wall block. The block contains a localized cluster of irregular circular gland-like structures within the mucosal layer; the deeper layers remain intact. These are editorial gland-forming structures, not diagnostic histology, and metadata must not claim invasion depth, subtype, stage, or a patient finding. No gross specimen, ulcer crater, metastatic organ, lymph node, blood, necrosis, instrument, label, or text is visible. Luma-below-220 bounds are `[36, 81, 1503, 901]`; the outer band contains zero pixels below luma 128 and all structures remain complete. Centered `contain` is mandatory.

### Gastric Cancer

Two complete teaching groups are visible: one external stomach model with open esophageal and duodenal ends, and one separate layered gastric-wall block bearing one rounded irregular mucosal growth. The growth has no visible glandular architecture, maintaining a deliberate distinction from the gastric-adenocarcinoma plate. No ulcer crater, diffuse rigid stomach, metastatic organ, lymph node, blood, necrosis, instrument, label, or text is visible. Luma-below-220 bounds are `[29, 100, 1535, 917]`; the threshold reaches the right edge through pale background and shadow, while the anatomy remains complete. The 32-pixel outer band contains zero pixels below luma 128. Centered `contain` is mandatory.

### Gastric Ulcer

Two complete teaching groups are visible: one opened-stomach model with rugal folds and one separate layered gastric-wall block. The block contains one clean mucosal crater that stops above the deeper muscular layers. No Helicobacter organism, medication, acid symbol, perforation, leakage, hemorrhage, blood, tumor, instrument, label, or text is visible. Luma-below-220 bounds are `[10, 94, 1456, 892]`; 728 pixels below luma 128 occur in the leftmost 32-pixel band at the complete distal opening, but the structure does not touch the source edge and remains visibly separated from it. Centered `contain` is mandatory.

### Gastroesophageal Reflux Disease

Two complete teaching groups are visible: one upper-digestive model showing the lower esophagus and intact stomach, and one enlarged gastroesophageal-junction cutaway. A short restrained amber fluid column is visible within the junction lumen above the sphincter ring. No person, pain symbol, flame, food, vomiting, hiatal hernia, eroded mucosa, ulcer, Barrett change, tumor, medication, instrument, label, arrow, or text is visible. Luma-below-220 bounds are `[73, 46, 1503, 966]`; the 32-pixel outer band contains zero pixels below luma 128 and both models remain complete. Metadata must describe representative limited retrograde luminal flow only, not a universal defect or observed patient disease. Centered `contain` is mandatory.

## Prohibited-content and publication gate

Across the six originals, native inspection found no labels, written text, arrows, icons, patient identity, distressed pose, pills, instruments, surgery, blood, gore, decorative particles, border, signature, or watermark. Every file remains non-public. Promotion is limited to these exact hashes and requires a separate Control Tower acceptance commit, metadata reconciliation, lossless master generation, article and 1200 × 630 social derivatives, and original-detail review of every social derivative.
