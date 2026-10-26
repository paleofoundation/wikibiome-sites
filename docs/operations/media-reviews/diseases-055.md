# Immutable native review — diseases Batch 055

Date: 2026-09-06  
Authorized parent: `28314e9159ed9d24deedb02e7813419f7390bd39`  
Prompt freeze: `2be25a9`

Exactly six built-in generation calls were made, one per immutable prompt. Every returned PNG is 1536 × 1024 and is preserved under `work/media-drafts/diseases-batch-055/`. These are observations of native output, not prompt intent. All candidates remain review-only pending separate exact-hash Control Tower acceptance.

## Native findings

### PCOS

- SHA-256 `7c1d3e876dea0a32846c0cae3419065d7b108e6bea8cb990c9b4488698eb5e1d`; 1,921,124 bytes; generation `exec-7de94a64-58c7-4f08-aee8-1d610a345237.png`.
- Three complete groups: uterus/cervix with paired tubes and ovaries; one cutaway with follicles at several apparent maturational forms; one cutaway with multiple folded star-like structures.
- No person, phenotype cue, label, watermark, or clipping. The prominent cavity in the first cutaway is a representative maturational follicle, not a cyst or reserve measurement. The paired cutaways cannot establish PCOS or a follicle count.
- Outer 32-pixel band has zero pixels below luma 128; minimum RGB `[237,244,249]`; foreground bounds x `64–1473`, y `64–942`. Centered `contain` required.

### Postpartum Depression

- SHA-256 `534d35a89d0926668adc52e86fa5785c4a84a31d022fe97086674a0a01d240a2`; 1,836,561 bytes; generation `exec-58d15fba-3cfd-49d4-9005-00bd2cbf722e.png`.
- Three complete groups: lateral brain, uterus/cervix with paired tubes and ovaries, and a twelve-segment ring with one copper segment.
- No patient, baby, emotion, self-harm cue, lesion, hormone symbol, text, or clipping. The reproductive model is generic rather than visibly postpartum; the ring is time orientation only and establishes no onset window.
- Outer band: zero dark pixels; minimum RGB `[187,141,131]`; bounds x `22–1488`, y `282–734`. Centered `contain` required.

### Primary Ovarian Insufficiency

- SHA-256 `c659dd26e6b978996d6275c800793d0f3f2a9daa3777c7f2174b5fb16a67aaef`; 2,214,208 bytes; generation `exec-ae3edfea-3f24-4097-8a58-ddcfefdc1703.png`.
- Three complete groups: uterus/cervix with paired tubes and ovaries and two follicle-bearing ovarian cutaways with different arrangements.
- No empty or missing ovary, age cue, menopause symbol, treatment cue, text, or clipping. The larger cavities are representative maturational follicles; neither cutaway measures reserve or represents a before/after state.
- Outer band: zero dark pixels; minimum RGB `[232,240,251]`; bounds x `63–1479`, y `59–943`. Centered `contain` required.

### PMDD

- SHA-256 `ee306a2cd1810cbdb73a47c1d6e0f13cbeb22e8296d2e31b033276d91b70f1af`; 1,711,451 bytes; generation `exec-0baa4bb5-2ae9-4ee3-a23b-cd72e9b5b57b.png`.
- Three complete groups: medial/lateral brain orientation, uterus/cervix with paired tubes and ovaries, and a ten-segment ring with one copper segment.
- No patient, emotion trope, blood, hormone or serotonin symbol, lesion, text, or clipping. The ring differs from the requested segment count, but is an unnumbered recurrence abstraction and supports no fixed timing claim.
- Outer band: zero dark pixels; minimum RGB `[226,234,245]`; bounds x `42–1497`, y `276–761`. Centered `contain` required.

### Psoriasis

- SHA-256 `18d2fff47aa32ddd56ebf6d1ddd18d85aeb8cdd4895d1d854ea94b6df6fe22c1`; 2,128,060 bytes; generation `exec-378c23d8-52c1-48e5-87c3-717cc569cb3d.png`.
- Three complete groups: one layered hair-bearing skin block, a comparable block with one bounded pale scaly surface plaque, and a small nail-unit cutaway including distal bone.
- No person, broad rash, wound, pustule, treatment, label, watermark, or clipping. The models are illustrative anatomy, not literal histology, skin-tone evidence, a subtype, or a diagnosis.
- Outer band: zero dark pixels; minimum RGB `[215,220,225]`; bounds x `37–1505`, y `269–823`. Centered `contain` required.

### Rheumatoid Arthritis

- SHA-256 `dac5a8c347a0649dd1401c346b8ad8f097328a0d81d77bb453e994896fb02f24`; 1,892,927 bytes; generation `exec-f5482ef8-2d7a-452f-98cc-5b0249e2de9b.png`.
- Three complete groups: a neutral wrist/hand skeletal model and two large comparable synovial-joint cutaways, the latter with lobulated circumferential lining thickening.
- No patient, deformity, erosion, cartilage loss, disability cue, label, watermark, or clipping. The enlarged joints are generic teaching abstractions, not a named joint, progression pair, literal histology, or disease stage.
- Outer band: zero dark pixels; minimum RGB `[236,242,250]`; bounds x `94–1451`, y `116–896`. Centered `contain` required.

## Disposition

All six exact sources passed native review with the stated limitations and were separately accepted at commit `6ccbb43`. They were promoted through the scoped processor to metadata-bearing lossless masters, article WebPs, and centered `contain` 1200 × 630 social WebPs. Native-detail review confirmed that every derivative retains all three complete teaching groups, pale padding, and route-specific orientation without clipping or label leakage. Registry, review-log, controlled-identifier, license, provenance, accessibility, Schema.org, image-sitemap, and canonical-filename parity must remain green. No regeneration was performed.
