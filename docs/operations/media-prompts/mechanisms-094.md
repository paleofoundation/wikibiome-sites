# WikiBiome scientific media prompts — mechanisms Batch 094

Date: 2026-09-07  
Authorized parent: `103c201d0b4e95a135830da3bd9e442529fedc58`

## Pre-generation authority audit

The deterministic queue contains one cytokine with multiple biologically distinct processed forms, one receptor-family umbrella, three controlled small-molecule identities, and one multi-organism metabolic-network umbrella. Current NCBI, UniProt, NLM MeSH, PubChem, and ChEBI records were checked before any generation decision. Only the three exact small-molecule identities are bounded enough for literal identity plates.

### Asset-free scientific holds

- `tnf-alpha` maps to human TNF, NCBI Gene `7124` and reviewed UniProtKB `P01375`, but the route spans the membrane precursor, cleaved soluble form, receptor interactions, cell sources, and disease contexts. The records distinguish membrane and soluble forms; the route does not choose a processed state, oligomeric state, receptor complex, structure accession, tissue, or assay. It remains asset-free until those variables or an explicitly non-structural representation boundary are fixed.
- `toll-like-receptors` maps to NLM MeSH `D051193`, which defines a receptor family and instructs indexers to prefer specific members. The route combines ten human receptors across surface and endolysosomal compartments with different ligands, partners, and active complexes. It remains asset-free pending an exact family member or a formally reviewed family-atlas specification with member, compartment, ligand, complex, and structure boundaries.
- `tryptophan-metabolism` has no single chemical or anatomical identity. The route combines host kynurenine, serotonin, and microbial indole pathways, multiple enzymes and cofactors, several compartments, different organisms, and context-dependent products. It remains asset-free pending one bounded pathway, organism and tissue, reaction sequence, metabolite panel, compartment, evidence tier, and measured-versus-orientation boundary.

No prompt marker exists for those three routes. The built-in generator must not be called for them.

## Shared cleared-asset standard

The three cleared plates are isolated chemical-connectivity teaching models. PubChem and ChEBI records constrain identity and heavy-atom connectivity only; no source image, published conformer, or composition is copied. Each model must be complete, centered, and fully contained with broad uninterrupted pale space on every edge. Landscape 3:2 at 1536 by 1024; uniform high-key cool pale blue-white field approximately `#f3f7fb`; restrained matte graphite carbon, cool blue nitrogen, muted rose oxygen, and silver-gray bonds; technically precise physical molecular-model finish; soft clinical studio illumination; minimal scene-making. Hydrogens are omitted intentionally. No text, labels, letters, numbers, atom symbols, charge symbols, arrows, legends, charts, organs, cells, microorganisms, food, pills, glassware, decorative particles, border, vignette, clipping, signature, or watermark.

### `tmao`

PubChem CID `1145` and ChEBI `15724` identify trimethylamine N-oxide, formula C3H9NO and InChIKey `UYPYRKYUKCHHIB-UHFFFAOYSA-N`. The plate may show only one connectivity model: one nitrogen bonded to three separate carbon centers and one oxygen center. It must not imply a measured conformation, charge distribution, concentration, biological source, pathway, risk, biomarker, or disease mechanism.

<!-- PROMPT tmao START -->
```text
Use case: scientific-educational. Asset type: review-only WikiBiome chemical-identity reconstruction for trimethylamine N-oxide, PubChem CID 1145 and ChEBI 15724. Create exactly one isolated complete heavy-atom ball-and-stick teaching model containing exactly five spheres: one central cool-blue nitrogen sphere bonded directly to exactly three separate matte-graphite carbon spheres and exactly one muted-rose oxygen sphere. Hydrogens are intentionally omitted. Keep the four outer heavy atoms spatially distinct around the nitrogen, with no extra atoms, fragments, duplicated model, reaction partner, arrow, or pathway context. This is connectivity orientation only; do not depict or imply a literal measured conformer, bond order measurement, formal-charge map, concentration, biological source, gut-to-liver pathway, cardiovascular risk, biomarker value, causal mechanism, treatment effect, or diagnosis. Landscape 3:2 at 1536 by 1024; center the complete model inside a broad 1200 by 630 crop-safe band with generous uninterrupted pale space on every edge; uniform high-key cool pale blue-white background approximately #f3f7fb; restrained matte graphite, cool blue, muted rose, and silver-gray materials; technically precise physical molecular-model finish; soft clinical studio illumination; minimal scene-making. No text, labels, letters, numbers, atom symbols, plus or minus signs, arrows, legend, chart, organ, cell, bacterium, food, pill, glassware, glow, vignette, clipping, signature, or watermark. Educational trained-algorithmic reconstruction, not a source structure image, crystallographic conformer, assay result, biomarker result, or diagnostic image.
```
<!-- PROMPT tmao END -->

### `tryptamine`

PubChem CID `1150` and ChEBI `16765` identify tryptamine, formula C10H12N2, neutral net charge in the ChEBI entity, and InChIKey `APJYDQYYACXCRM-UHFFFAOYSA-N`. The plate is restricted to one unlabeled heavy-atom connectivity model with ten carbon and two nitrogen centers.

<!-- PROMPT tryptamine START -->
```text
Use case: scientific-educational. Asset type: review-only WikiBiome chemical-identity reconstruction for tryptamine, PubChem CID 1150 and ChEBI 16765. Create exactly one isolated complete heavy-atom ball-and-stick teaching model of neutral tryptamine with exactly twelve spheres total: exactly ten matte-graphite carbon spheres and exactly two cool-blue nitrogen spheres; hydrogens are intentionally omitted. Preserve the recognizable connectivity of one fused bicyclic indole framework containing one ring nitrogen and one two-carbon side chain terminating in the second nitrogen. Show one model only, with every sphere and bond complete and visually separable; no extra atoms, detached fragments, duplicated model, reaction partner, arrow, or pathway context. This is connectivity orientation only; do not depict or imply a literal measured conformer, protonation equilibrium, receptor binding, microbial producer, synthesis pathway, concentration, gut motility effect, biomarker value, causal mechanism, treatment effect, or diagnosis. Landscape 3:2 at 1536 by 1024; center the complete model inside a broad 1200 by 630 crop-safe band with generous uninterrupted pale space on every edge; uniform high-key cool pale blue-white background approximately #f3f7fb; restrained matte graphite, cool blue, and silver-gray materials; technically precise physical molecular-model finish; soft clinical studio illumination; minimal scene-making. No text, labels, letters, numbers, atom symbols, plus or minus signs, arrows, legend, chart, organ, cell, bacterium, food, pill, glassware, glow, vignette, clipping, signature, or watermark. Educational trained-algorithmic reconstruction, not a source structure image, crystallographic conformer, receptor assay, biomarker result, or diagnostic image.
```
<!-- PROMPT tryptamine END -->

### `tryptophan`

The human-nutrition route is bounded to L-tryptophan. PubChem CID `6305`, ChEBI `16828`, and NLM MeSH `D014364` identify L-tryptophan, formula C11H12N2O2, and PubChem InChIKey `QIVBCDIJIAJPQS-VIFPVBQESA-N`. The plate is restricted to one unlabeled heavy-atom connectivity model with eleven carbon, two nitrogen, and two oxygen centers; it does not represent a measured conformation or metabolic fate.

<!-- PROMPT tryptophan START -->
```text
Use case: scientific-educational. Asset type: review-only WikiBiome chemical-identity reconstruction for L-tryptophan, PubChem CID 6305, ChEBI 16828, and MeSH D014364. Create exactly one isolated complete heavy-atom ball-and-stick teaching model containing exactly fifteen spheres total: exactly eleven matte-graphite carbon spheres, exactly two cool-blue nitrogen spheres, and exactly two muted-rose oxygen spheres; hydrogens are intentionally omitted. Preserve the connectivity of one fused bicyclic indole framework containing one ring nitrogen, connected through one methylene carbon to one alpha carbon that also connects to one amino nitrogen and one carboxyl carbon bearing both oxygen centers. Show one model only, with every sphere and bond complete and visually separable; no extra atoms, detached fragments, duplicated model, reaction partner, arrow, or pathway context. Treat the model as L-tryptophan identity orientation without claiming a literal measured conformer or assay-confirmed stereochemical pose. Do not depict or imply dietary amount, absorption, transporter competition, enzyme binding, serotonin or kynurenine production, microbial metabolism, concentration, biomarker value, disease mechanism, treatment effect, or diagnosis. Landscape 3:2 at 1536 by 1024; center the complete model inside a broad 1200 by 630 crop-safe band with generous uninterrupted pale space on every edge; uniform high-key cool pale blue-white background approximately #f3f7fb; restrained matte graphite, cool blue, muted rose, and silver-gray materials; technically precise physical molecular-model finish; soft clinical studio illumination; minimal scene-making. No text, labels, letters, numbers, atom symbols, plus or minus signs, arrows, legend, chart, organ, cell, bacterium, food, pill, glassware, glow, vignette, clipping, signature, or watermark. Educational trained-algorithmic reconstruction, not a source structure image, crystallographic conformer, metabolic assay, biomarker result, or diagnostic image.
```
<!-- PROMPT tryptophan END -->

## Authority and representation boundary

- NCBI Gene `7124` and reviewed UniProtKB `P01375` establish human TNF and distinguish membrane and soluble forms; they do not authorize an unspecified universal TNF-alpha structure or signaling scene.
- NLM MeSH `D051193` establishes Toll-like receptors as a family and explicitly prefers specific receptors; it does not collapse ten human members, compartments, ligands, partners, and states into one literal receptor portrait.
- PubChem CID `1145` and ChEBI `15724` establish trimethylamine N-oxide identity, formula, and connectivity.
- PubChem CID `1150` and ChEBI `16765` establish neutral tryptamine identity, formula, and connectivity.
- PubChem CID `6305`, ChEBI `16828`, and MeSH `D014364` establish L-tryptophan identity and human essential-amino-acid scope.
- The `tryptophan-metabolism` route is a network umbrella rather than one controlled molecule, structure, anatomy, reaction, organism, specimen, or disease state.

Scientific references:

- https://www.ncbi.nlm.nih.gov/gene/7124
- https://www.uniprot.org/uniprotkb/P01375/entry
- https://meshb.nlm.nih.gov/record/ui?ui=D051193
- https://pubchem.ncbi.nlm.nih.gov/compound/1145
- https://www.ebi.ac.uk/chebi/CHEBI:15724
- https://pubchem.ncbi.nlm.nih.gov/compound/1150
- https://www.ebi.ac.uk/chebi/CHEBI:16765
- https://pubchem.ncbi.nlm.nih.gov/compound/6305
- https://www.ebi.ac.uk/chebi/CHEBI:16828
- https://meshb.nlm.nih.gov/record/ui?ui=D014364

Exactly three routes are scientifically cleared for exactly one built-in image-generation call each. The other three routes receive no call. Returned media remains review-only until native-resolution inspection, literal heavy-atom and grouping counts, connectivity and prohibited-content review, outer-field and crop-safe audit, exact-hash acceptance, metadata reconciliation, and native 1200 by 630 derivative review are complete. Prompt-requested content must never be reported as observed output.

## Frozen prompt hashes

The marker-bound prompt SHA-256 values are recorded in the batch manifest. Any prompt change requires a new authority audit and prompt freeze before generation.
