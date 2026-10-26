# Immutable native review — diseases Batch 048

Reviewed: 2026-09-06  
Authorized parent: `ade99a25af13fe72ef088b49148f911735018031`  
Audit commit: `79128c4`  
Prompt-freeze commit: `d6c5bfd`

Exactly one built-in image-generation call was made for each of the six frozen prompts. All six returned a 1536 × 1024 PNG. The original generation records remain preserved by the built-in generator, and byte-identical project-bound copies are preserved under `work/media-drafts/diseases-batch-048/`. This review reports literal native output rather than requested prompt intent.

## Exact source hashes and dispositions

| Route | Revision | Generation record | Source SHA-256 | Bytes | Native disposition |
| --- | ---: | --- | --- | ---: | --- |
| `chronic-kidney-disease` | 1 | `exec-fcd88070-ba80-4a85-aa1a-420c31d4d83d.png` | `db3bb36f4d0fae64ad7746f0569c7869eb218021f29fff9243a92f996f0891a6` | 2,118,050 | approve for exact-hash acceptance; `contain` required |
| `cirrhosis` | 1 | `exec-edcdc039-24a7-44f8-9720-7bf646217d15.png` | `0c427db6b6692a96c4666aaec379af0f94c37eb9a65713835fe7c85ca9b62583` | 2,290,579 | approve for exact-hash acceptance; `contain` required |
| `colorectal-cancer` | 1 | `exec-de119133-a277-40bf-8954-22b576b8bb77.png` | `1969ec8248d3d572339dade075fdf179e923d38593ecf4de9c51bd9de5edfbbe` | 1,595,769 | approve for exact-hash acceptance; `contain` required |
| `coronary-artery-disease` | 1 | `exec-ca961445-d3cb-4170-96fd-43522a86b42b.png` | `0f82b144a22965392a99d10eece8a613dd4255631a260f002505fea5d2d24542` | 1,967,989 | approve for exact-hash acceptance; `contain` required |
| `crohns-disease` | 1 | `exec-5218f5da-9ed3-4baa-b25e-d307901cee2f.png` | `af7288a8034a1c69f4bea912f8deed597b17952d4aaec90cf608e87654355959` | 1,941,627 | approve for exact-hash acceptance; `contain` required |
| `cystic-fibrosis` | 1 | `exec-0b5b872a-8970-4d28-a26b-324ac1a345ea.png` | `89b4f5b3fa22abee8544e7592fec3b933b5da67045ba57ef103410f58ebc3cdb` | 2,005,595 | approve for exact-hash acceptance; `contain` required |

## Literal output audit

### Chronic Kidney Disease

Two complete bisected kidney teaching models with ureters form the left group; one separate nephron-and-glomerulus model forms the right group. The renal models show internal collecting anatomy and vascular branches. The glomerular tuft is dense, but the image does not establish a stage, laboratory result, etiology, or universal gross kidney appearance. Luma-below-220 bounds are `[153, 69, 1408, 952]`; the 32-pixel outer band contains zero pixels below luma 128 and no structure touches a source edge. Metadata must describe renal and nephron orientation without claiming that an observed feature is diagnostic of chronic kidney disease.

### Cirrhosis

One complete liver teaching model contains one circular cutaway. The cutaway visibly contains multiple small rounded tissue groupings separated by a pale branching network. No alcohol, virus, tumor, patient, jaundice, complication, stage, cause, or text is visible. Luma-below-220 bounds are `[118, 102, 1465, 964]`; the 32-pixel outer band contains zero pixels below luma 128 and no structure touches a source edge. The liver fills much of the native field, so `cover` would clip anatomy and is forbidden.

### Colorectal Cancer

One complete large-intestine teaching model is visible from cecal region through rectum. A single open sigmoid cutaway contains one small raised irregular mucosal lesion; the lumen remains patent. No patient, stool, blood, obstruction, metastasis, lymph-node claim, stage, procedure, or text is visible. Luma-below-220 bounds are `[307, 21, 1195, 994]`; the 32-pixel outer band contains zero pixels below luma 128 and no structure touches a source edge. The superior colon and inferior rectum approach the crop limits, so publication requires centered `contain`.

### Coronary Artery Disease

Two primary groups are visible: one complete heart teaching model with surface coronary vessels, and one separate short artery cross-section with eccentric pale-gold wall material and a broad open lumen. No clot, plaque rupture, complete occlusion, infarct, patient, procedure, stage, or text is visible. Luma-below-220 bounds are `[280, 40, 1351, 978]`; the 32-pixel outer band contains zero pixels below luma 128 and no structure touches a source edge. Metadata must describe the cross-section as one representative atherosclerotic process, not the universal cause of coronary artery disease.

### Crohn Disease

Two primary groups are visible: one complete intestinal orientation model with large bowel, cecal region, and small-bowel loops, and one separate bowel-wall specimen. The wall specimen has two relatively smoother open sections separated by one thickened, irregular full-wall segment. No fistula, abscess, obstruction, perforation, bleeding, stool, patient, asserted distribution, grade, or text is visible. Luma-below-220 bounds are `[48, 148, 1507, 880]`; the 32-pixel outer band contains zero pixels below luma 128 and no structure touches a source edge. Because the two groups approach both horizontal edges, centered `contain` is mandatory.

### Cystic Fibrosis

Three primary groups are visible: one short airway cross-section with a pale translucent luminal layer, one complete pair of lungs with trachea and branching bronchi, and one pancreas-and-duct model with an adjoining bowel loop. No person, infection organism, bacteria, sweat, DNA, genotype, airway-clearance device, medication, stage, or text is visible. Luma-below-220 bounds are `[15, 99, 1516, 879]`; the 32-pixel outer band contains 41 pixels below luma 128, but no structure touches a source edge. Both outer groups approach the horizontal edges; centered `contain` is mandatory and `cover` is forbidden. Metadata must retain the multisystem orientation and must not claim a diagnostic or universal pulmonary appearance.

## Prohibited-content and publication gate

Across the six originals, native inspection found no labels, written text, arrows, icons, patient identity, distressed pose, pills, instruments, surgery, blood, gore, decorative particles, border, signature, or watermark. Every file remains non-public. Promotion is limited to these exact hashes and requires a separate Control Tower acceptance commit, metadata reconciliation, lossless master generation, article and 1200 × 630 social derivatives, and original-detail review of every social derivative.
