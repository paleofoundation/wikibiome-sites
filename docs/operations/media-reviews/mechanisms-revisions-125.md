# WikiBiome scientific media review — mechanism revisions Batch 125

Date: 2026-09-07  
Authorized parent: `fa96b5a1ae5f4bcf473aeb1116e94925df026330`  
Audit commit: `0892fc6d3caba0d0e195df1483412a1ed69efb82`  
Prompt freeze: `9666d54c6ca75bdd7592e8ad7d13dcbb7131c7f7`  
Prompt checkpoint: `dcd1928`  
Frozen prompt packet SHA-256: `ed0d6919bbb889bd2cf05e7ca9b04dcb55089c1f561b9bf11251f26d380daef3`

## Disposition

One exact source is eligible for a separate exact-hash Control Tower acceptance: `bacterial-vaginosis` revision 3. Five exact sources are immutable non-public quarantines: `bdnf` revision 3, `beta-glucuronidase` revision 3, `bile-salt-hydrolase` revision 2, `biomarkers` revision 2, and `blood-brain-barrier` revision 2. No rejected source was edited, cropped, repaired, composited, reused, or regenerated.

The review inspected each 1536 × 1024 source at native detail, counted literal visible structures independently of prompt intent, verified its exact hash, and measured the foreground and source-edge field from decoded pixels. Foreground bounds use a luma-below-220 detection threshold. The immutable safe field requires every structure and shadow to remain inside x=250–1285 and y=220–803.

## Eligible exact source

### `bacterial-vaginosis` revision 3

- Exact SHA-256: `1b3c417426c75eed126c3489a0a9bf489a736e3920b346a7c7dff612e400ec60`
- Native file: 1,215,116 bytes; 1536 × 1024 PNG.
- Generation record: `exec-bdd557cd-3224-45bc-bc37-5faddea6e603.png`.
- Literal output: exactly three separated complete groups—one intact neutral mucosal cutaway; four complete long violet rods; and six complete copper forms comprising three short rods, one curved rod, and two cocci. Counts are illustrative layout controls, not measured abundance.
- Pixel field: foreground x=293–1274 and y=429–664; outer 32-pixel minimum RGB `[240,246,251]`; zero outer-band pixels below luma 128. Strict safe field passes.
- Scientific boundary: generic polymicrobial community-state orientation only. The plate does not identify organisms, show a specimen or diagnostic microscopy, label either group healthy or diseased, measure abundance, or claim cause, severity, prognosis, or treatment.
- Accessibility: proposed alt text names the neutral tissue and both literal community groups without inferring health state, diagnosis, or abundance.
- Proposed social treatment: centered `contain`; native derivative inspection is still required after promotion.

## Quarantined exact sources

### `bdnf` revision 3

- Exact SHA-256: `aa8c3ac202894c39f3ec34061ef2c8fb56bf36e7f920c5a0e3af5ab49b7f387e`; 1,144,424 bytes; 1536 × 1024.
- Generation record: `exec-80d70ea6-dbf4-4c9a-88f0-cbfa969cbc19.png`.
- Literal output contains three complete groups and exactly five terminal vesicles, but foreground spans x=148–1355 and y=334–665. The left protein and right terminal violate the frozen x=250–1285 field.
- Disposition: immutable, ineligible, non-public. No resize or crop may convert it into an accepted source.

### `beta-glucuronidase` revision 3

- Exact SHA-256: `d9b51c9b5e6d12040fdbf893e33f7d8c2d120ac3c1c4794d085236b99ff8e655`; 1,192,238 bytes; 1536 × 1024.
- Generation record: `exec-2ea7a10b-226b-481e-83b3-03d9ebf3f152.png`.
- Literal output contains three complete enzyme/reaction-context groups, but foreground spans x=180–1400 and y=373–635. The enzyme and rightmost token violate the frozen horizontal field.
- Disposition: immutable, ineligible, non-public. The visual is generic context only and is not a measured enzyme or literal clinical substrate.

### `bile-salt-hydrolase` revision 2

- Exact SHA-256: `59c528c45e60ebbaddcc2167a51c3b86eea470393b0dd6953d6231525c844227`; 1,130,028 bytes; 1536 × 1024.
- Generation record: `exec-85b4faa3-e73a-40ae-8171-471d1f6ba2b9.png`.
- Literal output contains three complete enzyme/reaction-context groups, but foreground spans x=201–1363 and y=374–618. The enzyme and detached product token violate the frozen horizontal field.
- Disposition: immutable, ineligible, non-public. The forms are not asserted as literal molecular structures, a species-specific enzyme, or an observed reaction.

### `biomarkers` revision 2

- Exact SHA-256: `7bc121243232631e5612a8d6c34b6317169fff807c455017af34fac5786e7732`; 1,293,327 bytes; 1536 × 1024.
- Generation record: `exec-d21960cc-48b4-4253-97fa-a3f900d730b4.png`.
- Literal output contains one capped red-liquid tube, one capped yellow-liquid vial, and one dish with exactly three separate strands. A severe black vignette and radial shadow fill the entire canvas: foreground detection x=0–1535 and y=0–1023; outer minimum RGB `[0,0,0]`; 159,744 outer-band pixels below luma 128.
- Disposition: immutable, ineligible, non-public. The full-canvas field directly contradicts the flat pale field prohibition; the containers are not actual specimens or test results.

### `blood-brain-barrier` revision 2

- Exact SHA-256: `b7f89b3e8a337da77cf1b83d46919a8ef69f6e03381bcb9a56ce33eadc306b92`; 1,549,153 bytes; 1536 × 1024.
- Generation record: `exec-9034fe24-222b-4b15-b23a-b08e5600b779.png`.
- Literal output contains one patent capillary cross-section with four red-cell discs, a continuous endothelial ring and thin outer membrane, two orange external forms, three violet external pads, and one separate three-cell neural-context group. Foreground spans x=328–1340 and y=163–811; the top and lower pads and right neural group violate the frozen field.
- Disposition: immutable, ineligible, non-public. The generic arrangement does not assert molecular transport, permeability, leakage, disease, diagnosis, or treatment response.

## Authority review

- Bacterial vaginosis: NLM MeSH `D016585` and current CDC overview; polymicrobial imbalance with cause left unresolved.
- BDNF: reviewed human UniProtKB `P23560` and NCBI Gene `627`; generic protein and neural context only.
- Beta-glucuronidase: ExPASy ENZYME `EC 3.2.1.31` and Rhea; generic reaction context only.
- Bile salt hydrolase: ExPASy ENZYME `EC 3.5.1.24` and Rhea; generic conjugated/product context only.
- Biomarkers: NLM MeSH `D015415` and NCBI Bookshelf; containers represent specimen contexts, not validated measurements.
- Blood-brain barrier: NLM MeSH `D001812` and PMID `41503990`; generic endothelial, basement-membrane, pericyte, and astrocyte end-foot context only.

## Review conclusion

`bacterial-vaginosis` revision 3 may proceed only if a separate Control Tower commit accepts the exact hash above and binds the unchanged prompt packet. The other five sources must be recorded as quarantined and excluded from registry, public masters, article derivatives, social derivatives, `ImageObject`, image sitemap, and page metadata. Prompt intent is not evidence of observed content.
