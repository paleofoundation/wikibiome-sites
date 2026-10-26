# WikiBiome scientific media review — mechanisms Batch 058

Date: 2026-09-06  
Authorized parent: `6c54a1a62ce929dd1412e927f05237c1bff98092`  
Prompt freeze: `fe45de96bd0d67c5b46a1efc3b023ed087391d9a`

Exactly six built-in calls were made, one per immutable prompt. Every returned RGB PNG is 1536 × 1024 and is preserved in the generator-owned store and under `work/media-drafts/mechanisms-batch-058/`. Observations below describe native output rather than prompt intent.

| Route | Literal native observation | Exact source SHA-256 | Decision |
| --- | --- | --- | --- |
| `alpha-synuclein` | Three groups: complete synaptic-terminal cutaway with seven vesicle-like forms; one long generic chain; three separate short chains | `8f5871b34784f5b946ca69c91dc7fc0f46466a2892525e4622f63cf8b9394a6d` | Accept |
| `amyloid-beta` | Three groups: complete membrane-spanning generic protein; separate ribbon-like peptide; complete generic neuron | `dd858c210838c7698ce33930c69863ee388cc4d457176df2d68f15b25ba3ad79` | Accept |
| `amyloid-beta-aggregation` | Three groups made from the same motif: one isolated ribbon; exactly four separated ribbons; ordered bundle of five ribbons | `8d668f910adbc643f3de852b299e73c081715350ff00401b93f75759d8a2e65d` | Accept |
| `antimicrobial-resistance` | Three groups: mixed rods/cocci; dish with six unmarked discs and no interpreted zones; generic cell cutaway with closed DNA ring and membrane pump-like form | `0e77a72f9c45f7bd32162fd2ee44994f70cc91bfc22b118de6c732e6cc319ca3` | Accept |
| `arachidonic-acid` | Three groups: dominant chain with twenty dark carbon centers and two red terminal oxygen centers; intact bilayer; complete generic cell | `4c4041a4f32c7357c3ce5f7bef7c68201b5b603cab2dd5bc5327573e55c57bad` | Accept |
| `aromatase` | Three groups: generic membrane-embedded ribbon protein with a heme-like internal disc; two separate unlabeled four-ring steroid scaffolds | `35de5da31326fad4ccff2c63703b273a8db007883f8bd16a589e356e1e0cfe18` | Accept |

All sources have zero dark pixels in the outer 32-pixel band. Thresholded bounds remain inside the source canvas; the lowest arachidonic-acid cell pixels reach y=959 but remain complete. Centered `contain` is required for all six derivatives.

Protein forms are generic teaching abstractions, not measured conformations. The amyloid aggregation groupings are qualitative and non-temporal. The antimicrobial plate reports no susceptibility interpretation. The arachidonic-acid model omits hydrogens and is not a crystallographic conformation. Aromatase steroid forms are context models, not atom-complete substrate/product structures or a catalytic conversion.

All six exact sources pass native review and await separate immutable exact-hash Control Tower acceptance before promotion.
