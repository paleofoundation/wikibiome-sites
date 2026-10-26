# Editorial batch audit: warning reconciliation and explicit status

Source authority: `paleofoundation/wikibiome` commit `62e006cf0ced1dce706a6438f6461602229a9f26`.

This batch adds no scientific wording, citation, author, DOI, quantitative result, or conclusion. It reconciles disease/signature evidence at the canonical-route boundary and gives every source-limited record an explicit, public, source-bound editorial status. Raw limitations remain visible; only warnings with an approved status are considered justified.

The same generator boundary now enforces source metadata types without guessing missing facts. Three nonnumeric upstream years are omitted and audit-recorded, nine prefixed DOI strings are normalized to their existing bare DOI values, and 217 `not yet verified` DOI placeholders are omitted and audit-recorded. In particular, `NOTE-evaluation-risk-ptes-italy-fish-products` no longer emits `year: "Unknown"` or `doi: "not yet verified"`; both raw values remain named in the manifest normalization audit.

## Before and after

| Measure | Batch 1 | After batch 2 | Delta |
|---|---:|---:|---:|
| Upstream/public records | 821 | 821 | 0 |
| Canonical routes | 714 | 714 | 0 |
| Records with raw warnings | 131 | 122 | -9 |
| Canonical routes with raw warnings | 122 | 113 | -9 |
| Records with unjustified warnings | 131 | 0 | -131 |
| Canonical routes with unjustified warnings | 122 | 0 | -122 |
| Records with explicit dispositions | 0 | 122 | +122 |
| Canonical routes with explicit dispositions | 0 | 113 | +113 |
| Empty public-section warnings | 0 routes | 0 routes | 0 |
| Missing introductions | 31 routes | 31 justified routes | 0 raw / -31 unjustified |
| Below evidence threshold | 94 routes | 89 justified routes | -5 raw / -94 unjustified |
| No generated references | 53 routes | 49 justified routes | -4 raw / -53 unjustified |
| No substantive article content | 13 routes | 13 justified routes | 0 raw / -13 unjustified |
| Blocked records | 0 | 0 | 0 |

Categories overlap. The final raw-warning totals are 98 records / 89 routes below threshold, 31 / 31 without introductions, 51 / 49 without generated references, and 13 / 13 without substantive article content. All 122 raw-warning records have an explicit disposition; the strict audit reports zero unjustified warnings and zero status-policy errors.

Relative to the original 821-record baseline, raw warning coverage fell from 664 to 122 records and from 598 to 113 routes. Unjustified warning coverage fell from 664 records / 598 routes to zero. Empty public sections fell from 360 routes to zero; missing introductions from 308 to 31 justified routes; below-threshold coverage from 94 to 89 justified routes; no-reference coverage from 53 to 49 justified routes; and no-substantive-content coverage from 14 to 13 justified routes.

## Reconciliation before waiver

Nine Batch-1 warning routes resolve through generated evidence reconciliation, not a waiver:

- Canonical disease evidence supplies references to signature records that declare none: `erectile-dysfunction` 0 → 9, `fibromyalgia` 0 → 9, `necrotizing-enterocolitis` 0 → 19, and `pmdd` 0 → 6 generated references.
- Canonical disease/signature evidence clears the 10-source signature threshold: `female-infertility` 6 → 13, `anxiety` 5 → 12, `obesity` 9 → 31, and `ovarian-cancer` 8 → 33 references.
- `gerd-signature` declares 7 sources, but the existing source-authored body resolves 11 references after inline-citation recovery, clearing its 10-source threshold without inferred evidence. Its canonical disease route resolves 16 references in total.

The audit emits separate notices for canonical reference reconciliation, canonical threshold reconciliation, and generated inline-reference threshold reconciliation. Disease pages already render as one canonical dossier and deduplicate disease/signature evidence.

## Explicit status policy

`data/editorial-statuses.json` contains 113 source-bound decisions grouped by warning signature and applies them to exactly the 122 affected records. Six duplicate IDs use occurrence-qualified keys so a clean duplicate copy is not annotated for a warning found only on the canonical first record.

| Disposition | Decisions | Meaning |
|---|---:|---|
| `evidence_insufficient` | 101 | Source evidence or source-authored prose is insufficient; no claim or lead is inferred. |
| `source_structure_deferred` | 10 | Evidence-bearing sections exist, but the source supplies no general introduction. |
| `structural_exemption` | 2 | `glossary` and `overview` are reference/navigation indexes, not claim-bearing articles. |

The registry is approved, dated, bound to the exact upstream commit, checksummed in the generated manifest, and rendered on affected article and disease templates. Every decision names the warning codes it resolves and supplies a public label and rationale. `empty_public_sections` and `orphaned_evidence` are non-waivable. Unknown warning codes, stale source commits, unknown records, duplicate groups or records, missing approval metadata, mismatched generated annotations, and resolutions that no longer match a current warning fail validation.

Representative status routes:

- Evidence insufficient with no resolvable references: `aip-diet-hashimotos`.
- Evidence insufficient below threshold on a reconciled disease route: `barretts-esophagus`.
- Source sections present but no upstream lead: `microbiome-diversity-metrics`.
- Maintenance-only source stub with references but no claim-bearing prose: `barium`.
- Structural reference index: `glossary`.
- Unaffected comparison route with no status banner: `nickel`.

## Regression gates

`npm run build` now runs the strict editorial audit after generated-content and revision-history audits. The build fails for:

- any empty public leaf section;
- any missing required introduction without an exact approved status;
- any orphaned evidence identifier (non-waivable);
- any zero-reference publication without an exact approved status;
- any other unresolved warning or status-registry drift.
- any generated source year that is not a finite integer or any emitted DOI that does not pass the DOI syntax policy;
- any TypeScript error in the generated corpus or application.

Rendered tests verify public status notices on general, source-structure, reference-index, and disease templates; absence on a ready route; readiness-ledger classification; registry checksum and source binding; and generated annotation counts.

## Verification

- `npm run editorial:audit`: 821 records, 714 routes, 122 raw-warning records / 113 raw-warning routes, 0 unjustified warnings, 122 records with explicit dispositions, 0 blocked, 0 policy errors.
- `npm run content:audit`: 821 pages, 1,891 source records, 6,424 generated references, 348 inline recoveries, 0 missing source metadata, 0 malformed DOI values.
- `npm run typecheck`: passed, including the previously failing generated source record.
- `npm test`: build and typecheck passed; 21/21 rendered tests passed.
- `npm run corpus:audit`: 5,256 routes checked (1,456 article requests, 3,782 source requests, 4,243 rendered article paragraphs); every discovered article/source link resolved.
- `npm run lint`: 0 errors; 11 unchanged `<img>` optimization warnings.

The authoritative source checkout remains clean. No source Markdown or source metadata was changed, and no push or deployment was performed.
