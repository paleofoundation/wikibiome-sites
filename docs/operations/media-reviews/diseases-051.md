# Immutable native review — diseases Batch 051

Reviewed: 2026-09-06  
Authorized parent: `9da4a433b21412752e423acee10a1f8961646a58`  
Audit commit: `42dae80`  
Prompt-freeze commit: `6b86568`

Exactly one built-in image-generation call was made for each of the six frozen prompts. All six returned a 1536 × 1024 PNG. Original generation records remain preserved by the built-in generator, with byte-identical project-bound copies under `work/media-drafts/diseases-batch-051/`. This record reports literal native output rather than prompt intent. Control Tower independently matched the hashes and passed all six at native detail with the limitations below; exact-hash promotion authorization remains a separate step.

## Exact sources and native dispositions

| Route | Generation record | SHA-256 | Bytes | Models / groups | Crop |
| --- | --- | --- | ---: | ---: | --- |
| `gestational-diabetes` | `exec-52233acf-05fa-4dc1-8933-40e9400350b6.png` | `c4ecf8031a768357599ed0306e514efb320ed2c48d20c144466f029ebfa3ab54` | 1,785,873 | 3 / 3 | contain |
| `graves-disease` | `exec-d13cdad1-4055-4fbd-bc89-6b94b2eb3c44.png` | `d57ec9151e30cbf9ec026f17e824497b902b9b63ea571e5f84478d7f6d4713b8` | 2,306,597 | 3 / 3 | contain |
| `hashimotos-thyroiditis` | `exec-e72e2109-6282-46e9-a44a-25c610003720.png` | `153c202ae634251f62de434eaf1552ddfa78e97e52c782944961d2ac1bf6d589` | 2,144,076 | 2 / 2 | contain |
| `hepatitis` | `exec-2d84851d-8ff8-402a-b071-7d1591ee622f.png` | `46f53b90a65cfaeaaffb08cb6bc2974b4bddb6e64bbebfac12e7d2617d00b47a` | 2,218,529 | 2 / 2 | contain |
| `hidradenitis-suppurativa` | `exec-0d175fc5-48d2-430e-81f3-d873fe529ea9.png` | `75c335cb1f68fb6c5bd322432a097359eac51a2dcd3ec4ba503ddab0e9f94a49` | 2,597,672 | 2 / 2 | contain |
| `hiv` | `exec-87ffa70e-4d45-4b0f-81b2-9b8ffa01344f.png` | `b3ff30e631e9b575349b34e8e06c617819e4efe0e19e023f5de556ea4ff72857` | 1,795,407 | 3 / 3 | contain |

## Literal output and limitation audit

- Gestational diabetes: three groups—placenta/fetal surface with cord, pancreas with duodenal segment, and an unlabeled membrane-receptor/molecular abstraction. The molecules are not identified and the plate does not imply a single mechanism. Bounds below luma 220 are `[23,156,1494,837]`; five outer-band pixels are below luma 128, with all models visibly complete.
- Graves disease: three groups—external thyroid around laryngeal/tracheal framework, enlarged follicular cutaway, and an unlabeled membrane/Y-form abstraction. Neither receptor nor antibody identity is inferable from appearance; no eye disease is shown. Bounds `[75,133,1483,868]`; zero outer-band dark pixels.
- Hashimoto disease: two groups—external thyroid and follicular cutaway with scattered blue-purple immune-cell-like elements. This is representative orientation, not diagnostic histology, stage, or cell typing. Bounds `[65,189,1457,829]`; zero outer-band dark pixels.
- Hepatitis: two groups—whole liver with gallbladder and circular hepatic microarchitecture orientation with scattered immune-cell-like elements. It is etiology-neutral, not literal lobule histology, and supports no viral, alcohol, toxin, chronicity, or severity inference. Bounds `[61,197,1478,839]`; zero outer-band dark pixels.
- Hidradenitis suppurativa: two skin blocks—one ordinary follicular unit and one altered follicular/tunnel teaching model with a large contained follicular cavity and lateral tract. This is schematic representative architecture, not literal abscess contents, stage, severity, or diagnosis. Luma bounds `[42,91,1535,878]` reach the right edge through pale background only; the visible block is complete and zero outer-band pixels are below luma 128.
- HIV/AIDS: three groups—lymph-node-like cutaway, generic immune-cell model, and generic enveloped-particle model. Appearance does not establish exact virion ultrastructure, cell type, lymph-node pathology, HIV type, CD4 count, viral load, stage, AIDS, or prognosis. Bounds `[39,142,1460,859]`; zero outer-band dark pixels.

Across all originals, native inspection found no labels, text, arrows, patient identity, distressed pose, medication, instruments, blood, gore, decorative particles, border, signature, watermark, or visually clipped scientific model. `contain` is proposed for all later social derivatives because multiple complete teaching groups approach the horizontal bounds. Every draft remains non-public and ineligible for a registry key, master, derivative, endpoint, schema node, or sitemap entry until a separate exact-hash Control Tower acceptance authorizes promotion.
