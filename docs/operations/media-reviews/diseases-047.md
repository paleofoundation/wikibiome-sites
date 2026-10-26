# Immutable native review — diseases Batch 047

Reviewed: 2026-09-06  
Authorized parent: `998cbfd185f5313908656d003105e85b9ed4ba36`  
Audit commit: `1e56b08`  
Prompt-freeze commit: `d357d00`

Exactly one built-in image-generation call was made for each of the six frozen prompts. All six returned a 1536 × 1024 PNG. The original generation records remain preserved by the built-in generator, and byte-identical project-bound copies are preserved under `work/media-drafts/diseases-batch-047/`. This review reports literal native output rather than requested prompt intent.

## Exact source hashes and dispositions

| Route | Revision | Generation record | Source SHA-256 | Bytes | Native disposition |
| --- | ---: | --- | --- | ---: | --- |
| `barretts-esophagus` | 2 | `exec-8eda2023-ea15-4613-b8fd-6e4fcb15cea1.png` | `cb2b5cf6ce110f9acac23a1b7dfe31d6055237058cb0e7152d8642f56528d659` | 1,233,246 | approve for exact-hash acceptance; `contain` |
| `breast-cancer` | 2 | `exec-b6399ad7-5229-42ce-9639-d5212935e390.png` | `75c5f54002e46ba1b401a3790539f4f9c70f1d22d5c8d3af9f61edeef81d8bfc` | 1,747,761 | approve for exact-hash acceptance; `contain` |
| `celiac-disease` | 1 | `exec-bf2ee78a-ead6-4da4-9094-05e3afdba2ee.png` | `dd62b2716e0e225ed4160aec9421da3b9dcaf7fd7e2e3022e18b3f01811438b4` | 2,153,185 | approve for exact-hash acceptance; `contain` |
| `cerebral-palsy` | 1 | `exec-dd7ac0c5-18b3-431a-abb7-781c7f27e00b.png` | `86ed281d1f27acca1e51f3094bd658d026060cf274ca740ffb3746d051449ed6` | 1,649,323 | approve for exact-hash acceptance; `contain` |
| `cholestasis` | 1 | `exec-aaa84a50-2b52-4dfd-8673-02fb213c5baa.png` | `8fd1037049ec6efc7dce599c1105ba8a3a4be38cdf8bea6ae107d1afc8a5a26f` | 2,134,146 | approve for exact-hash acceptance; `contain` required |
| `chronic-fatigue-syndrome` | 1 | `exec-0fd3f93d-41c4-4e60-a7db-6b498bc22fb2.png` | `de3d2ee79a4c892890692be51212bf6d81f6d3a23efca43ce463f5cd9854ec46` | 2,212,200 | approve for exact-hash acceptance; `contain` required |

## Literal output audit

### Barrett Esophagus revision 2

One isolated cutaway model shows a straight distal esophageal segment joining a partial upper-stomach model. A pale proximal mucosa transitions to a short salmon-toned distal segment. The subject is complete within the source field and does not touch an edge. Luma-below-220 bounds are `[539, 186, 990, 855]`; the 32-pixel outer band contains zero pixels below luma 128. This resolves the Batch 046 three-edge clipping failure. It is a representative teaching model, not an endoscopic view, grade, or diagnosis.

### Breast Cancer revision 2

One branching duct-and-lobule-like teaching model contains one irregular rose lesion within an opened central branch; three separate rounded regional structures sit to the right. No external breast contour, skin, nipple, torso, patient, staging symbol, or text is visible. Luma-below-220 bounds are `[242, 73, 1331, 931]`; the 32-pixel outer band contains zero pixels below luma 128. This resolves the Batch 046 no-output moderation failure without asserting stage, subtype, receptor status, or spread.

### Celiac Disease

Two separated bowel-wall teaching models are visible. The left model has numerous tall narrow villous projections; the right has shorter, broader, irregular projections and a more textured surface. No biopsy instrument, grain, gluten symbol, grade, person, or text is visible. Luma-below-220 bounds are `[60, 172, 1483, 853]`; the 32-pixel outer band contains zero pixels below luma 128. The image is representative architecture, not a biopsy or Marsh grade.

### Cerebral Palsy

Three primary groupings are visible: a complete standalone brain, a brain-and-spinal-cord pathway model, and a pelvis-through-feet musculoskeletal model with neutral alignment. There is no person, mobility device, contracted pose, highlighted lesion, severity scale, or text. Luma-below-220 bounds are `[61, 26, 1397, 972]`; the 32-pixel outer band contains zero pixels below luma 128. Metadata must disclose the two separate brain representations and must not claim one universal cerebral-palsy anatomy.

### Cholestasis

One complete liver and biliary model shows the gallbladder, branching intrahepatic ducts, joined extrahepatic duct, and a short pale bowel segment. Amber translucent material is visible in the duct system. No stone, mass, patient, jaundice portrait, asserted cause, or text is visible. Luma-below-220 bounds are `[192, 69, 1352, 1013]`; the 32-pixel outer band contains 28 pixels below luma 128, but the subject does not touch a source edge. Because the bowel segment approaches the lower edge, publication requires a centered `contain` derivative and forbids `cover`.

### Myalgic Encephalomyelitis/Chronic Fatigue Syndrome

Five principal groupings are visible: a complete brain, an autonomic-and-visceral teaching model, a complete heart, a skeletal-muscle bundle, and a separate mitochondrion model. No patient, exhausted pose, battery, activity prescription, depletion cue, lesion, asserted biomarker, or text is visible. Luma-below-220 bounds are `[14, 179, 1524, 939]`; the 32-pixel outer band contains 13 pixels below luma 128, but no structure touches a source edge. Because the set approaches both horizontal edges, publication requires a centered `contain` derivative and forbids `cover`. Metadata must call this neutral multisystem orientation and not a disease signature or diagnostic biomarker.

## Prohibited-content and publication gate

Across the six originals, native inspection found no labels, written text, arrows, icons, patient identity, distressed pose, pills, instruments, surgery, blood, gore, decorative particles, border, signature, or watermark. Every file remains non-public. Promotion is limited to these exact hashes and requires a separate Control Tower acceptance commit, metadata reconciliation, lossless master generation, article and 1200 × 630 social derivatives, and original-detail review of every social derivative.
