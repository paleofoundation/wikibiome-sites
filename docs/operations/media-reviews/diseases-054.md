# Immutable native review — diseases Batch 054

Date: 2026-09-06  
Authorized parent: `f389d503bc3383dc227ee1a9f028119b534cafbb`  
Prompt freeze: `28d9358`

Exactly six built-in generation calls were made, one per immutable prompt. Every returned PNG is 1536 × 1024 and is preserved under `work/media-drafts/diseases-batch-054/`. The observations below describe native output, not prompt intent. All six candidates are review-only and require a separate exact-hash Control Tower acceptance before promotion.

## Native findings

### Pancreatic Cancer

- Source SHA-256: `65b4843bd05fe4b33aed19cbc435d394af11efaf566694dd7d5b2f05857439ef`; 1,780,478 bytes; generation record `exec-afcf5662-1c5b-44b8-9741-9c8a7e52e50a.png`.
- Three complete separate groups: a lobulated pancreas within a duodenal curve, a second pancreas/duodenum model with visible duct and vessels, and a third similar model with one bounded irregular pink growth near the broad head region.
- No spread, blood, patient, label, signature, watermark, or visible clipping. The growth's appearance cannot establish malignancy, cell of origin, histology, grade, or stage.
- Outer 32-pixel band: zero pixels below luma 128; minimum RGB `[184,117,105]`. Foreground below luma 220 spans x `22–1489`, y `176–934`; the visible structures remain complete. Centered `contain` is mandatory.

### Pancreatitis

- Source SHA-256: `7a264446e207f11528bc1efcb9aa1e0efc5608ea842b260e510cbb98a564d15a`; 1,894,575 bytes; generation record `exec-6fb2aaf5-2dd6-410d-b310-6fe4fbdfdcd1.png`.
- Three complete separate groups: pancreas within a duodenal curve, a clean duct-bearing pancreatic cutaway, and a comparable cutaway with one broad pinker, more lobulated central region.
- No necrosis, hemorrhage, calcification, pseudocyst, gallstone, alcohol cue, label, signature, watermark, or clipping. The difference is a nonspecific tissue-change model and cannot establish inflammation, acute/chronic class, cause, or severity.
- Outer 32-pixel band: zero pixels below luma 128; minimum RGB `[234,242,251]`. Foreground spans x `57–1483`, y `63–918`. Centered `contain` is mandatory.

### Parkinson's Disease

- Source SHA-256: `11f44562318cb5527ac98d74d1479eb697d2cdd470d3725a89867ca79d6c028f`; 1,604,799 bytes; generation record `exec-6e77a626-0381-48cb-96a4-6ea3a45ec708.png`.
- Three complete groups: one lateral brain, one symmetric simplified deep-brain/brainstem orientation model, and one connected cluster of three neuron-like cells with branching processes.
- No person, tremor cue, dying-cell comparison, dopamine symbol, Lewy body, electrode, label, signature, watermark, or clipping. The central model is an orientation abstraction, not validated regional anatomy or a biomarker.
- Outer 32-pixel band: zero pixels below luma 128; minimum RGB `[220,227,237]`. Foreground spans x `39–1502`, y `240–767`. Centered `contain` is mandatory.

### Pelvic Inflammatory Disease

- Source SHA-256: `568218b6e514ab5deee6e027c70b49f739b556402349157d631eeae53e4abdbe`; 1,864,125 bytes; generation record `exec-70f898c2-bac4-4165-8b52-2700f3acd7d7.png`.
- Three complete groups: uterus/cervix with paired tubes and ovaries, a uterine-wall/tube-junction cutaway, and a patent tube-like cutaway with one bounded opposing-wall thickened region.
- No patient, stigma cue, pathogen, abscess, ectopic pregnancy, closed tube, blood, label, signature, watermark, or clipping. The paired protrusions are described as one circumferential bounded wall region, not separate lesions or a specific pathology.
- Outer 32-pixel band: zero pixels below luma 128; minimum RGB `[234,241,250]`. Foreground spans x `122–1479`, y `92–959`. Centered `contain` is mandatory.

### Periodontitis

- Source SHA-256: `b2246e37ee33c6265ecdf1b07b494d575cf1caf1a166ce4b22d149047e5525cd`; 2,147,140 bytes; generation record `exec-3a647578-ad29-4942-913c-493eb60dabf5.png`.
- Three complete tooth-support groups: an intact tooth in gingiva and porous bone, a neutral root/support cutaway, and a comparable cutaway with one deep pocket-like separation on the viewer-right and localized lower bone crest.
- No patient, blood, pus, plaque, calculus, bacteria, loose tooth, instrument, label, signature, watermark, or clipping. Appearance cannot establish periodontitis subtype, grade, stage, cause, severity, or treatment need.
- Outer 32-pixel band: zero pixels below luma 128; minimum RGB `[222,232,242]`. Foreground spans x `72–1483`, y `117–895`. Centered `contain` is mandatory.

### Pneumonia

- Source SHA-256: `4b64670bc1b01668b1277c951b3904c1d247ee18da5411361ed3bdd1ac8b66ba`; 1,739,025 bytes; generation record `exec-f9f0df53-8760-4e8d-a4a5-554a5775ae32.png`.
- Three complete groups: paired lungs with airway tree, an open alveolar-sac teaching cluster, and a comparable cluster with pale translucent blue material occupying parts of multiple spaces.
- No patient, named pathogen, pus, blood, necrosis, abscess, device, radiograph, label, signature, watermark, or clipping. The material is illustrative and cannot establish composition, infection cause, subtype, distribution, oxygenation, or severity.
- Outer 32-pixel band: zero pixels below luma 128; minimum RGB `[209,216,225]`. Foreground spans x `26–1491`, y `147–821`. Centered `contain` is mandatory.

## Disposition

All six exact sources passed native review with the stated limitations and were separately accepted at commit `78cd8ef`. They were promoted through the scoped processor to metadata-bearing lossless masters, article WebPs, and centered `contain` 1200 × 630 social WebPs. Every social derivative retained all three complete teaching groups, pale padding, and the route-specific focus without label leakage, substitution, or clipping. Registry, review-log, controlled-identifier, license, provenance, accessibility, Schema.org, image-sitemap, and canonical-filename parity are required to remain green.
