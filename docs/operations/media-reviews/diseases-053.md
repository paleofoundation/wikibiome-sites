# Immutable native review — diseases Batch 053

Reviewed: 2026-09-06  
Authorized parent: `659b2b2e251c8c6672fead2e9b0b47cab7ea251d`  
Audit and prompt-freeze commit: `171a641`

Exactly one built-in image-generation call was made for each of the six frozen prompts. All six returned a 1536 × 1024 PNG. Original generation records remain preserved by the built-in generator, with byte-identical project-bound copies under `work/media-drafts/diseases-batch-053/`. This record reports literal native output rather than prompt intent. Five candidates remain review-only and require separate exact-hash acceptance before promotion. The Multiple Sclerosis output is rejected and quarantined because a principal model is visibly severed by three source edges.

## Exact sources and native dispositions

| Route | Generation record | SHA-256 | Bytes | Models / groups | Disposition | Proposed crop |
| --- | --- | --- | ---: | ---: | --- | --- |
| `migraine` | `exec-1af10c30-4f90-41de-9d34-6c84f87353fa.png` | `4b93970384b4616d47aba03a2686ab817c7630c8d075cb4cd5a5c081cc21439b` | 2,010,888 | 3 / 3 | candidate | contain |
| `multiple-sclerosis` | `exec-482d1307-fc15-4568-bb39-e7291b58d1ca.png` | `e9feb7d5ee2e33799fa9bad319e3ca7fea484897e38ec575051fed4f90d99b18` | 1,606,422 | 3 / 3 | rejected, quarantined | none |
| `necrotizing-enterocolitis` | `exec-cb1be5f8-3737-4509-ac36-57b8895d91b1.png` | `e8869744089b78f41975873b2b568e0dc16f91e35cf45f33a53030b816c77d3a` | 1,935,460 | 3 / 3 | candidate with scale limitation | contain |
| `non-alcoholic-fatty-liver-disease` | `exec-ef8e7a4d-afa8-43f5-b00a-33a2fb5cf8f4.png` | `867b2ee82071ba0f7671f57b92277d61ddfb8126da815f4bdec08f1c20ab0365` | 1,972,876 | 3 / 3 | candidate | contain |
| `obesity` | `exec-2a4aede6-5a40-48cc-a1eb-c84b08151ffc.png` | `7e0259ace4960ca5ed50982d08363b10a5c74f07448e69a5feaf0de538a9468d` | 2,016,210 | 2 / 2 | candidate | contain |
| `ovarian-cancer` | `exec-c525f0db-3799-4fc2-95d2-bce6d6951f5e.png` | `8cdbfee038e5b8cecf238c0e68b88a5968263c9c36349188ecd032674f9339d0` | 1,781,725 | 3 / 3 | candidate with growth-size limitation | contain |

## Literal output and limitation audit

- Migraine: three complete groups—lateral brain with superficial vascular branches, a central branching ivory-and-violet nerve-like model, and a patent layered artery segment. The nerve model is generic and the plate does not establish an attack, aura, subtype, trigger, vascular change, or mechanism.
- Multiple Sclerosis: three intended groups—brain with descending spinal cord, spinal-cord cross-section, and a magnified myelinated axon with one interrupted sheath segment. The axon enters or exits the top, right, and bottom source edges. That visible truncation violates the immutable complete-model and crop-safe rules, so the exact source is rejected and must remain non-public.
- Necrotizing Enterocolitis: three complete groups—generic small-and-large-intestine orientation and two layered wall models, one with a smooth concavity and one with a bounded irregular red-pink surface defect. The generic anatomy has no observable age scale; neither alt text nor caption may claim neonatal identity is visually established. No perforation, radiographic sign, or Bell stage is shown.
- Non-alcoholic Fatty Liver Disease: three complete groups—smooth liver with gallbladder, radial lobule-like teaching model, and a cluster of eight complete hepatocyte-like cells containing pale droplet forms. No inflammation, fibrosis, cirrhosis, tumor, alcohol-use signal, or NASH/MASH stage is shown.
- Obesity: two complete groups—layered skin and subcutaneous tissue with lobulated pale adipose structures, and a separate rounded cluster of varied adipocyte-like cells. No person, body shape, BMI measure, behavior, blame cue, complication, or diagnostic sign is present.
- Ovarian Cancer: three complete groups—uterus with both tubes and ovaries, one isolated follicle-bearing ovarian cutaway, and a second cutaway with one prominent bounded irregular external growth. The growth is more prominent than the prompt's requested small focus and must remain nonspecific; appearance cannot establish benignity, malignancy, histology, origin, grade, stage, spread, or diagnosis.

Across the five candidates, native inspection found no labels, text, arrows, patient identity, facial expression, distressed pose, medication, instruments, blood, gore, decorative particles, room, border, signature, watermark, or visibly clipped complete teaching model. Every candidate requires centered `contain` for its later 1200 × 630 social derivative. The rejected Multiple Sclerosis bytes remain in the immutable review packet only and must not receive a public registry key, master, derivative, endpoint, Schema node, or sitemap entry.

## Promotion crop verification

All five deterministic 1200 × 630 social derivatives were inspected at native detail on 2026-09-06. Centered `contain` preserves every complete reviewed teaching group, the full branching migraine nerve-like model, all eight prominent NAFLD/MASLD cell bodies, the complete obesity tissue block and adipocyte cluster, and the single bounded ovarian growth. Pale vertical padding is uniform and no label, clipping, substitution, or model loss is present. The rejected Multiple Sclerosis source produced no derivative. These observations bind only the derivatives produced from the five Control-accepted hashes.

Exact social SHA-256 values: migraine `ad3a0cbb125f146d33aed865ab366a23b4bd30177b508f134d5a4efa05edaf5b`; necrotizing enterocolitis `92bcf34c14aa11c2c8093df2912341253896cf4abcff810354f190aa10460b69`; non-alcoholic fatty liver disease `22c907e26e6d77274f7bd37269c22dcb6282796ae89151e97c42b6b1537f5200`; obesity `75e5b5074b0ae8d3c38a69eb7aa97e22dbcca8b0b3143101533359143970fc35`; ovarian cancer `cccb0bffc99b76fab334e78732a7d6788895148f980f82a1d8c57bb464424c71`.
