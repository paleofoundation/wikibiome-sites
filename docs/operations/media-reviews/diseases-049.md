# Immutable native review — diseases Batch 049

Reviewed: 2026-09-06  
Authorized parent: `c19fb365751e67f33304c1431fbbe7b728619de0`  
Audit commit: `74c64e1`  
Prompt-freeze commit: `9801ec0`

Exactly one built-in image-generation call was made for each of the six frozen prompts. All six returned a 1536 × 1024 PNG. The original generation records remain preserved by the built-in generator, and byte-identical project-bound copies are preserved under `work/media-drafts/diseases-batch-049/`. This review reports literal native output rather than requested prompt intent.

## Exact source hashes and dispositions

| Route | Revision | Generation record | Source SHA-256 | Bytes | Native disposition |
| --- | ---: | --- | --- | ---: | --- |
| `depression` | 1 | `exec-2bd20030-2c23-49fe-ad6a-64997fbf0b5e.png` | `cb03938a90d0f1496e8702ee3dbbf37827619f8614ecba0d86440009dfda1a94` | 2,011,917 | approve for exact-hash acceptance; `contain` required |
| `dermatitis-herpetiformis` | 1 | `exec-5fcf398a-2895-46d5-9a71-57c7e06bb470.png` | `c9eac47cd01fa9c7755353932e0b5836d4fef4cb67189c1ce7f66fc61d8c1a62` | 2,081,041 | approve for exact-hash acceptance; `contain` required |
| `diabetic-kidney-disease` | 1 | `exec-712c1ac6-8c44-43ac-933e-faf835e61c2a.png` | `be81693b3da752629287b6ce660333be3bc3a0fe42136a1db1d23d4ff0296d0c` | 2,124,081 | approve for exact-hash acceptance; `contain` required |
| `endometriosis` | 1 | `exec-b3a0a820-a877-4b6b-8a90-9cc6e9833738.png` | `16d3ef1349f5410a1cb4693b77357612f02c8d2890cf2ba29389b115542d84ed` | 1,996,343 | approve for exact-hash acceptance; `contain` required |
| `epilepsy` | 1 | `exec-5e434d6f-78da-49e1-a2bb-8e5f9e508991.png` | `770e6e2ce72a588bf0aede14a3866a4f876bf891cf87be594001bc05b2454fe6` | 2,150,091 | approve for exact-hash acceptance; `contain` required |
| `erectile-dysfunction` | 1 | `exec-8e067ceb-7e98-4dbb-b215-629acff288e3.png` | `ac31923191e63716396519116591f11ba433f4d65e926e12cdaae5225579377f` | 2,115,186 | approve for exact-hash acceptance; `contain` required |

## Literal output audit

### Depression

Two primary groups are visible: one complete intact brain teaching model and one separate network assembly containing multiple connected cortical- and limbic-like forms. The second group is explicitly an editorial network abstraction, not an anatomical dissection or asserted depression biomarker. No patient, emotional expression, damaged-brain cue, neurotransmitter claim, medication, text, or diagnostic marker is visible. Luma-below-220 bounds are `[3, 203, 1457, 821]`; the 32-pixel outer band contains zero pixels below luma 128 and no anatomical structure touches a source edge. The left brain approaches the horizontal crop limit, so centered `contain` is mandatory.

### Dermatitis Herpetiformis

Two complete teaching groups are visible: one layered skin block and one small-intestinal villus block. The skin model contains approximately eleven rounded translucent subepidermal bodies in a grouped band. The intestinal model contains seven complete dominant villi plus partial depth structures behind them. No patient, rash distribution, scratching, open sore, crust, herpes organism, food symbol, biopsy, stain, text, or diagnostic claim is visible. Luma-below-220 bounds are `[57, 214, 1535, 814]`; a pale background gradient reaches the rightmost pixel at this threshold, while the anatomy remains visibly complete and separated from the source edge. The 32-pixel outer band contains zero pixels below luma 128. Centered `contain` is mandatory.

### Diabetic Kidney Disease

Two primary groups are visible: one complete paired-kidney model with central vessels and two complete ureters, and one separate enlarged glomerular model with a dense open capillary tuft. The output does not visually establish basement-membrane thickness, diabetes, stage, laboratory values, or a diagnostic renal lesion; metadata must not claim those requested but unobservable details. No glucose symbol, injection, meter, urine, dialysis, transplant, edema, text, or stage marker is visible. Luma-below-220 bounds are `[74, 137, 1452, 901]`; the 32-pixel outer band contains zero pixels below luma 128 and no structure touches a source edge. Centered `contain` is required to preserve both ureters and the glomerular vessels.

### Endometriosis

One complete internal pelvic teaching model is visible with uterus, paired fallopian tubes and ovaries, and a broad peritoneal field. Exactly four small dark superficial foci are visible: two on the left ovarian surface and two on the right pelvic field. No external body, patient, pain pose, pregnancy, fertility symbol, blood, adhesion, cyst rupture, procedure, stage, label, or text is visible. Luma-below-220 bounds are `[35, 134, 1503, 928]`; the 32-pixel outer band contains zero pixels below luma 128 and the anatomical field remains complete. Because the peritoneal field approaches both horizontal bounds, centered `contain` is mandatory. Metadata must describe these as representative editorial foci, not observed patient lesions or a diagnostic distribution.

### Epilepsy

Two primary groups are visible: one complete intact brain teaching model and one separate circular neural-network assembly. Within the network, a localized copper-toned group is materially aligned among otherwise blue, ivory, and violet nodes. No person, seizure pose, lightning, spark, EEG trace, scar, lesion, implanted device, medication, label, or text is visible. Luma-below-220 bounds are `[43, 142, 1503, 880]`; the 32-pixel outer band contains zero pixels below luma 128 and no structure touches a source edge. The localized color group must be described only as an editorial representation of coordinated network activity, never a universal seizure focus or diagnostic finding. Centered `contain` is mandatory.

### Erectile Dysfunction

Two complete internal teaching groups are visible: one oblique erectile-tissue cross-section with two large porous dorsal bodies and one smaller ventral body containing an open urethral channel, and one separate vessel cross-section with a broad open lumen. No person, external genital surface, sexual scene, arousal state, performance symbol, device, pill, injection, implant, blockage, label, or text is visible. Luma-below-220 bounds are `[49, 156, 1482, 848]`; the 32-pixel outer band contains zero pixels below luma 128 and no structure touches a source edge. The image establishes anatomy and vessel patency only; it does not establish a cause, disease state, severity, or diagnosis. Centered `contain` is mandatory.

## Prohibited-content and publication gate

Across the six originals, native inspection found no labels, written text, arrows, icons, patient identity, distressed pose, pills, instruments, surgery, blood, gore, decorative particles, border, signature, or watermark. Every file remains non-public. Promotion is limited to these exact hashes and requires a separate Control Tower acceptance commit, metadata reconciliation, lossless master generation, article and 1200 × 630 social derivatives, and original-detail review of every social derivative.
