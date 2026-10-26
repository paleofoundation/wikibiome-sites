# WikiBiome program register

This is the control task's release ledger for the WikiBiome redesign and
production transition. A program is not release-ready because a task says it
is finished: the control task must reproduce its evidence, accept an exact
commit, integrate it into one release candidate, and verify the combined
result. Only the control task may publish, change DNS, or retire rollback
resources.

Last reconciled: **2026-09-09** (Asia/Nicosia)

## September 9: WB-DEPLOY-4 live correction

Karen explicitly ordered the live tip-jar removal before WB-AUTHOR-1. Sites
version **69** is now the public release, exact source
`37d2f8464785b62d6723da19df35213025573b1a`, deployment
`appgdep_6aa13294dd048191be570dd3ff3fc3bc`, environment revision **6**.
The release was built on live version 68 and changes only the support hub,
shared header/footer, obsolete thank-you route, payment-link module, and
associated rendered assertions. No media, DNS, access, database migration,
outreach flag, or email-provider changes were deployed. Version 68 remains
an immediate rollback target, but would restore the tip jar.

Live fetches on September 9 returned 200 for `https://www.wikibiome.com/`
and `https://www.wikibiome.com/support`, with **zero** coffee, Stripe payment,
“Support the work”, or promoted `/outreach` matches. Both now show
“Explore and collaborate” and the `/submit-work` route.

The already-live fix has been merged into local main to prevent regression.
The old `b2d3810` archive is superseded: any future combined media release must
include `37d2f84` and be rebuilt and validated. The extra media and mobile
first-viewport changes on local main have **not** been published in version 69.

WB-AUTHOR-1 work is isolated on `codex/wb-author-1-sites` in
`/Users/karenpendergrass/Documents/ChatGPT/Wikibiome/wb-deploy-4-sites`.
It must pass Elon review and authenticated staging/production verification
before outreach promises or production release. Bridge review:
https://github.com/paleofoundation/wikibiome/pull/6 . The legacy Vercel command
in that GitHub repository does not deploy the current Sites application.

## Release authority

- Production release controller: WikiBiome program control tower.
- Current integration branch: `main`.
- Previous evidenced production release: public Sites version 68 at exact source
  commit `8c37632b5126f594b338922389181534cc418aae`.
- Current production Sites environment revision: 6. Version 68 was published
  without DNS or access-policy changes and adds the verified mobile article-media
  placement fix.
- Current production scientific-media coverage: 377 reviewed assets.
- Current accepted local control commit:
  `f2ac7035d68edc1f4954d7f571aa37608429ea77`. It includes the complete
  29/29 metal and 66/66 disease media sets, Batch 100's accepted and promoted
  N-acetyl-L-cysteine asset, Batch 101's five zero-call host-defense holds, and
  Batches 102 and 103's ten zero-call intervention holds plus quarantined
  berberine and curcumin outputs. Batch 104 adds one reviewed E. coli Nissle
  1917 morphology asset and five evidence-insufficient intervention holds. It
  also preserves 42 previously accepted or superseded project-bound originals
  that were present only in the long-lived checkout, restoring clean-checkout
  hash and decoded-pixel reproducibility. Batch 105 adds one reviewed generic
  unoccupied monoplace hyperbaric chamber device orientation and five new
  evidence- or protocol-insufficient intervention holds. Batch 106 adds one
  reviewed neutral indole-3-carbinol heavy-atom identity model, four new
  evidence- or protocol-insufficient intervention holds, and one quarantined
  LGG output whose literal rod and grouping counts failed the frozen prompt.
  Batch 107 adds six asset-free, zero-call intervention holds after controlled
  identity, protocol, evidence, and non-prescriptive-representation review.
  Batch 108 adds five more asset-free intervention holds and preserves one
  exact-count melatonin output in non-public quarantine because its transparent
  canvas and broad glow/haze failed the frozen pale-field visual standard.
  Batch 109 adds five asset-free scientific holds and preserves one generated
  omega-3 source in non-public quarantine because its native heavy-atom and
  double-bond counts exceeded the frozen EPA/DHA identities.
  Batch 110 uses zero generation calls and adds six asset-free prebiotic or
  probiotic intervention holds because ingredient, strain, composition,
  protocol, evidence, or source-resolution requirements are incomplete.
  Batch 111 adds five further asset-free intervention holds and preserves one
  exact-count quercetin model in non-public quarantine because the generated
  source is entirely transparent or partially transparent and carries broad
  glow/haze instead of the frozen opaque pale field.
  Batch 112 adds five more asset-free intervention holds and preserves one
  generated simvastatin source in non-public quarantine because it contains
  28 carbon-colored centers instead of the exact identity's 25, has no fully
  opaque pixels, carries broad glow/haze, and enters the outer safety band.
  Batch 113 closes the intervention queue with three zero-call holds: the
  source-free Vitamin D route does not resolve D2 versus D3 and its clinical
  protocols; the source-free Zinc routes do not select a compound, product,
  dose, protocol, evidence, safety boundary, canonical-media relationship, or
  non-stigmatizing condition-specific representation.
  Batch 114 opens the clinical-cautions queue with six zero-call scientific
  holds. Each route is a conditional clinical judgment rather than a stable
  physical subject; unspecified agents, products, protocols, evidence tiers,
  populations, and emergency exceptions make generic warning, disease,
  microbiome, or treatment imagery unsafe and scientifically misleading.
  Batch 115 adds six more zero-call clinical-caution holds. The neonatal
  formula, CKD diet, iodine, and iron routes do not resolve exact products,
  formulations, doses, disease states, populations, monitoring, outcomes, or
  exceptions; current guidance also makes categorical prohibition imagery
  unsafe for formula access, dialysis-era protein needs, and iron repletion.
  Batch 116 adds six zero-call iron-supplementation holds. Cardiovascular,
  colorectal-cancer, Crohn, depression, endometriosis, and Graves routes do
  not resolve disease phenotype, deficiency or anemia, bleeding or
  inflammation, delivery route, formulation, dose, monitoring, outcomes, or
  exceptions; elemental Iron and disease anatomy remain prohibited as
  clinical-treatment proxies.
  Batch 117 adds six zero-call iron-supplementation holds. Long COVID,
  multiple sclerosis, obesity, Parkinson disease, polycystic ovary syndrome,
  and type 2 diabetes routes do not resolve phenotype, deficiency or anemia,
  bleeding or inflammation, route, formulation, dose, concurrent treatment,
  monitoring, outcomes, or exceptions. The linked sources do not establish
  clinical iron-withholding protocols, so elemental Iron, disease anatomy,
  stigmatizing patient imagery, and prohibition graphics remain excluded.
  Batch 118 adds six further zero-call clinical-caution holds. The ASD,
  schizophrenia, CKD phosphate-binder, PCOS zinc, GERD PPI, and CKD
  constipation routes do not resolve direct evidence, exact products and
  formulations, disease states, doses, populations, comparators, monitoring,
  outcomes, safety, or exceptions. Generic warning, treatment, anatomical,
  elemental-metal, and stigmatizing patient images remain prohibited.
  Batch 119 adds six further zero-call clinical-caution holds. The SNAS food,
  NSAID/CKD, probiotic/stress/ovarian-cancer, antibiotic/NEC, SCFA/MS, and
  probiotic/endometriosis routes do not resolve stable physical subjects,
  exact agents or products, formulations, doses, clinical states,
  populations, comparators, outcomes, safety, or exceptions. One route has
  zero sources and another rests on a single animal-model thesis; generic
  food, warning, treatment, neonatal, anatomical, elemental-metal,
  microorganism, and stigmatizing patient images remain prohibited.
  Batch 120 closes the clinical-cautions queue with three more zero-call
  holds. The schizophrenia probiotic route does not resolve one complete
  strain-level product or psychiatric treatment context; the two Zinc routes
  do not resolve compounds, doses, nutritional states, disease or infection
  states, treatment contexts, outcomes, safety, or exceptions. Existing
  organism, disease, and elemental-Zinc assets remain prohibited as clinical
  protocol proxies.
  Batch 121 opens the entity, analysis, and reference queue. It promotes one
  exact accepted neutral Dopamine heavy-atom identity model from PubChem CID
  681 and records five zero-call scientific holds. The two dietary synthesis
  pages have no single stable subject or validated dataset, the glossary is a
  multi-term reference index, and the source-free `hungatella` and
  `intestinibacter` routes are misclassified outside the microorganism media
  pipeline and lack reviewed type-material morphology evidence. Hungatella's
  local family placement is also stale relative to the current Lachnospiraceae
  assignment.
  Batch 122 closes six more entity, analysis, and reference routes without a
  public promotion. The Metal-Disease Matrix lacks a versioned governed
  dataset; Methanobrevibacter smithii, Neisseria meningitidis, and Oxalobacter
  are misclassified and lack reviewed type-material morphology evidence.
  Exact one-call L-kynurenine and neutral Metformin models passed literal
  heavy-atom and connectivity review but remain quarantined because both
  sources are transparent, carry broad dark or colored glow, and enter or
  approach the safety field rather than encoding the required opaque pale
  background.
  Batch 123 closes the initial entity, analysis, and reference pass with three
  asset-free holds and one quarantined Serotonin source. Parvimonas is
  source-free, misclassified, and contains a stale single-species claim; the
  shared-pathobiont analysis lacks a current versioned dataset; and the
  overview is a source-free structural record with historical corpus counts.
  The Serotonin source passes opacity, pale-field, edge, and prohibited-content
  checks but contains only nine carbon centers and a one-carbon side chain,
  rather than neutral Serotonin's required ten carbons and two-carbon
  aminoethyl side chain. The scheduler now resumes only explicit `revise`
  dispositions after the untouched route queue is exhausted, preventing 37
  correctable mechanism failures from becoming an accidental terminal stall.
  Batch 124 begins the explicit revision pass. It promotes exact reviewed
  revision-2 assets for Atherosclerosis, Bacteremia, and Beta-lactamase after
  resolving their original edge-field or vignette failures. Bacterial
  Vaginosis, BDNF, and Beta-glucuronidase revision-2 outputs remain immutable
  and non-public because they failed the frozen safe-field or exact-count
  controls; all three remain eligible for a later separately audited revision.
  Batch 125 promotes only the exact reviewed Bacterial Vaginosis revision-3
  source after it preserves the frozen tissue and microbial counts inside a
  stricter source-safe field. BDNF and Beta-glucuronidase revision 3 plus Bile
  Salt Hydrolase, Biomarkers, and Blood-Brain Barrier revision 2 remain
  immutable and non-public: four exceed the frozen source-safe field and the
  Biomarkers source has a severe full-canvas black vignette. No failed source
  was cropped, repaired, reused, or promoted.
  Batch 126 then promotes corrected Beta-glucuronidase revision 4 and Bile Salt
  Hydrolase revision 3 assets while retaining BDNF, Biomarkers,
  Blood-Brain-Barrier, and Butyrate revisions as immutable non-public failures.
  Batch 127 adds reviewed Ammonia, CagA, Catalase, Interleukin-22,
  NLRP3-inflammasome, and Urea mechanism media with exact source hashes,
  lossless metadata-bearing masters, article and social derivatives, controlled
  identifiers, strict review records, and native-detail crop acceptance.
  The current control commit also places the reviewed media card immediately
  below article controls on mobile, ahead of long leads and editorial notices.
  At 390 by 844, native browser checks place Nickel at y=329, Alzheimer's
  disease at y=342, and Akkermansia muciniphila at y=369 with no horizontal
  overflow; desktop retains the existing right-hand media card.
- Current accepted local scientific-media promotion commit:
  `b45acedf773ebc86a02255d7fc9abc32773d4168` (Batch 127).
- Current accepted local scientific-media review commit:
  `dcc73c17eadf903bc0afbee2b1c1cd910d8023e2` (Batch 127; exact-hash
  acceptance `34fc2daeb5c8bfbe9102a824b0920571cbd05182`, promotion
  `b45acedf773ebc86a02255d7fc9abc32773d4168`).
- Current synchronized upstream content commit:
  `449e8005c3156d1b7943d2cdedd5b4386b9f5703`.
- Upstream check: the only source-content delta from `c6481eaf` to `449e8005`
  was five technical-SEO log entries. The public corpus is semantically
  unchanged; commit-bound editorial, revision, manifest, and media provenance
  were re-attested and regenerated explicitly.
- Production dependency audit: 0 known vulnerabilities after updating
  `js-yaml` to `4.3.2`; parser/content/build/type/test gates remain green.
- No program task may make a further push, deployment, DNS change, payment, or
  rollback-retirement action without a new bounded release authorization from
  the user and control-register reconciliation.

## Current production evidence

- Sites version 68 is the last evidenced public artifact, from exact source
  commit `8c37632b5126f594b338922389181534cc418aae` and environment revision 6.
- Version 68 contains 377 reviewed records, including all 29 metals and all 66
  diseases. Mobile verification at 390 by 844 for Nickel and Alzheimer's disease
  confirms reviewed media appears immediately after the lead, the late sidebar
  duplicate is hidden, and no horizontal overflow occurs.
- The accepted local candidate contains 385 reviewed records. The eight-asset
  delta consists of Batch 126's two accepted revisions and Batch 127's six
  accepted mechanisms; it is validated but not yet released.
- The Sites production error log returned no events for the three-hour release
  verification window.
- The retained Vercel deployment remains the rollback target; version 41 is a
  superseded saved version and must not be deployed.
- ORCID production activation smoke test passed on 2026-09-02 after
  environment revision 3 activation: `/researcher/dashboard` returned `200`,
  `/api/auth/orcid/start` returned `303` to ORCID instead of
  `orcid=not_configured`, the ORCID authorization callback returned to
  WikiBiome, and the researcher dashboard loaded Karen Pendergrass
  (`0000-0002-2348-7259`) with email verification required. Browser UI and
  console checks found no client secret, bearer token, Sites source token, or
  `not_configured` leakage.
- A fresh saved version for local commit `aa7d438` was not created because the
  Sites source repository remained at `65b3fc3`; `save_site_version` correctly
  rejected `aa7d438` as stale source provenance. The production ORCID
  activation therefore used the already-saved v43 artifact.

## Program status

| Program | State | Accepted evidence | Remaining definition of done |
| --- | --- | --- | --- |
| Researcher collaboration | Version 3 code accepted; external services partly activated | Researcher Network v3 is integrated at `4aa2cc6` on top of the accepted v2, responsive-navigation, dashboard, and event-consent lineage. ORCID production activation was smoke-tested successfully. The combined production build and 76/76 tests pass; additive migrations 0000-0010 apply cleanly. Public researcher discovery now includes searchable evidence-derived expertise clusters and separate verified-work, Keystone, and linked-article footprint metrics without popularity ranking. Researchers can publish a validated professional portrait through dedicated private-storage/public-delivery routes, confirm ORCID DOI matches through moderated intake without automatic publication, and create human-reviewed provisional organization identities that can later upgrade to ROR without duplication. Roundtable consent, private email, mutual-consent messaging, contribution recognition, authoritative ROR, moderation, privacy, and fail-closed boundaries remain intact. | Apply production D1 migrations through 0010; provision Resend, the private `MANUSCRIPTS` R2 binding used by profile photos and the separately gated manuscript quarantine/scanner workflow, moderator IDs, and counsel-approved outreach policy. Keep manuscript uploads and outreach disabled until those gates are evidenced. The broader forum/Keystone candidate is undergoing current-lineage reconciliation and is not yet accepted. |
| Editorial completion | Complete in control main; local routing delta unreleased | The candidate contains 817 records / 710 canonical routes, 1,939 sources, 6,447 article-reference placements, 349 recovered inline citations, 696 ready records, 121 explicit dispositions, 0 review, 0 blocked, 0 missing source metadata, and 0 malformed DOI output. All 13 retired identities export permanent article/history/suggest aliases, and worker routing parity is integrated through `730615c`. | Future expansion of evidence-insufficient and source-structure-deferred records must originate from new upstream evidence or source-authored leads. Retired labels remain aliases only. Publish only as part of a provenance-matched, control-approved release. |
| Search visibility | Candidate complete; latest eight media assets and first-viewport mobile placement unreleased | The accepted candidate passes 5,381 rendered routes, 3,426/3,426 indexable self-canonicals, 2,698 ordinary sitemap URLs, 385/385 image registry/sitemap/endpoints, four representative metadata/structured-data routes, all 46 authoritative redirects, all 47 generated Gone routes, and all internal article/source-link checks. Version 68 contains 377 reviewed images, but longer leads can leave the mobile card just below the initial viewport. Candidate `f2ac703` moves reviewed media ahead of the lead on both generic and disease templates; 390 by 844 browser checks put three representative cards between y=329 and y=369 without overflow. The authenticated September 5 checkpoint records 31 indexed and 819 historically not-indexed URLs (August 28 data), successful ordinary/image sitemap reads with only 670/2 discovered pages, representative stored URL Inspection results, 583 Web impressions/2 clicks and zero Image impressions over three months, insufficient CWV field data, healthy HTTPS, and no manual or security issues. | Publish only exact accepted application commit `f2ac703` plus its control-register reconciliation after fresh authorization, then rerun the public gate with 385 images and recheck Google validation, sitemap discovery, representative selected canonicals, CWV, and Web/Image performance. Bing ownership and evidence remain account-gated. |
| Scientific media | 377 live; 385 reviewed locally; explicit revision queue active | The deterministic register covers all 715 canonical routes with 385 reviewed assets and 330 routes lacking public media. Metals are complete at 29/29, diseases at 66/66, microorganisms at 214/229, mechanisms at 70/238, host defenses at 2/29, interventions at 3/69, clinical cautions at 0/39 with every route individually dispositioned, and entity/analysis/reference routes at 1/16. The 385-entry registry, strict review log, image sitemap, canonical endpoints, masters, derivatives, embedded metadata, controlled identifiers, licensing, review state, trained-algorithmic-media disclosure, Schema linkage, accessibility text, captions, and provenance agree. Current disposition metrics are 366 rejected/failure/quarantine/hold records, 288 scientific holds, 18 revised records, and zero in-review records. Batch 126 promotes Beta-glucuronidase revision 4 and Bile Salt Hydrolase revision 3; Batch 127 promotes Ammonia, CagA, Catalase, Interleukin-22, NLRP3-inflammasome, and Urea. | The deterministic next batch is `bdnf`, `biomarkers`, `blood-brain-barrier`, `butyrate`, `comorbidities`, and `copper-dysregulation`. Use a new immutable revision prompt and one independent built-in call per route; never edit or reuse rejected sources. Continue explicit revisions while preserving all holds, permanent rejections, quarantines, and safety refusals. |
| Cutover closeout | Audit gate open; production action still authorization-gated | Baseline commits `343fbdc` and `5106b7b`; audit runner/template commits `384259d` and `16b51a9`; 9/9 evaluator tests pass; the 2026-09-07 00:00 Asia/Nicosia time gate has elapsed; Vercel rollback deployment `dpl_5ShUos99yjK3vWMbarbfmxkDQWEH` remains the retained rollback target. | Run and retain the final public plus authenticated evidence audit. Deployment, DNS change, and rollback retirement each still require their own explicit bounded approval. |
| Upstream content operations | Remote synchronized; one verified local correction awaits authorization | Generated public content remains synchronized to remote `449e8005`: 817 pages, 1,939 sources, 6,447 article-reference placements, 349 recovered inline citations, 0 missing source metadata, and 0 malformed DOI values. Local upstream commit `c12dac4eb721a4223a48365a83638aaeabcb3a2c` corrects Oscillibacter type-species provenance from “freshwater fish” to Japanese corbicula clam, adds the primary Iino et al. source (PMID 17684268; DOI `10.1099/ijs.0.64717-0`), and passes the upstream build and SEO invariants. | Obtain bounded authorization to push `c12dac4e`, then run the guarded outer content refresh, re-attest commit-bound editorial/media provenance, and reproduce combined gates before any release. Continue release-driven review of every future upstream diff; automation may regenerate and test but may not push or deploy. |

## Account- and authority-gated actions

These are not code defects and must not be represented as completed without
owner or counsel evidence.

- Resend sending-domain, API, webhook, and unsubscribe secrets.
- Private manuscript storage plus an asynchronous scanner and scanner secret.
- Production D1 migrations `0001`-`0009` and the `MANUSCRIPTS` binding must be
  applied/provisioned before releasing the researcher-network routes.
- `WIKIBIOME_MODERATOR_IDS` production assignment.
- Counsel approval for the outreach jurisdiction matrix, privacy/terms
  baseline, and citation-notice template before outreach is enabled.
- Google Search Console and Bing Webmaster ownership/submission evidence.
- Final September 7 owner/moderation, production-log, search, TLS, Stripe, and
  rollback audit.
- Any decision to retire the retained Vercel rollback deployment or former DNS
  coordinate.

## Release gate

The next production candidate may be published only after all of the following
are true:

1. Every included program provides an exact commit and standardized handoff.
2. The control task independently reproduces each program's claimed metrics and
   tests.
3. Accepted commits are integrated into one clean release candidate without
   weakening another program's invariants.
4. Content, editorial, media, search, migration, security, build, rendered-corpus,
   browser, mobile-overflow, and link/canonical gates pass on the combined commit.
5. Sensitive workflows remain disabled unless their external activation gates
   are fully evidenced.
6. A saved hosting version is created from the exact tested commit, inspected,
   and published only by the control task.
7. Production routes, logs, DNS/TLS, sitemap/robots, canonical metadata, image
   delivery, support/thank-you routing, and rollback evidence are verified after
   publication.

## Rollback invariants

- Retain Vercel deployment `dpl_5ShUos99yjK3vWMbarbfmxkDQWEH` and former `www`
  CNAME target `7d875abacccdc8f1.vercel-dns-016.com.` through the September 7
  audit and until a later explicit retirement approval.
- Leave `WIKIBIOME_MANUSCRIPT_UPLOADS_ENABLED` and
  `WIKIBIOME_OUTREACH_ENABLED` unset or `0` until their safety gates are ready.
- Researcher-network migrations are additive. Do not destructively reverse the
  new D1 tables or delete a manuscript quarantine bucket during rollback;
  preserve consent, suppression, moderation, audit, and incident evidence.
- Roll back application release and bindings together when withdrawing a
  dynamic program.
- For Batch 051 media-only withdrawal, revert promotion `2245bc1` to the exact
  accepted, asset-free parent `8d7e8be`; retain the immutable audit, review,
  acceptance, and project-bound generation evidence. Earlier reviewed batches
  remain intact.
- For Batch 066 media-only withdrawal, revert promotion `5dc90a4`; retain the
  immutable prompt, review, acceptance, rejection, and project-bound generation
  evidence. Earlier reviewed batches remain intact.
- For Batch 067 media-only withdrawal, revert promotion `34c9e3e`; retain the
  immutable prompt, review, acceptance, rejection, and project-bound generation
  evidence. Earlier reviewed batches remain intact.
- For Batch 068 media-only withdrawal, revert promotion `0a490ce`; retain the
  immutable prompt, review, acceptance, rejected-revision, and project-bound
  generation evidence. Earlier reviewed batches remain intact.
- For Batch 069 media-only withdrawal, revert promotion `cf9f165`; retain the
  immutable prompt, review, exact-hash acceptance, failure, quarantine, and
  project-bound generation evidence. Earlier reviewed batches remain intact.
- For Batch 070 media-only withdrawal, revert promotion `8e6e0e6`; retain the
  immutable prompt, review, exact-hash acceptance, quarantine, and
  project-bound generation evidence. Earlier reviewed batches remain intact.
- For Batch 106 media-only withdrawal, revert promotion `588f633`; retain the
  immutable prompt, review, exact-hash acceptance, scientific holds,
  quarantined LGG source, and project-bound generation evidence. Earlier
  reviewed batches remain intact.
- For Batch 107 reconciliation withdrawal, revert `7ec23d9`; retain audit
  `c4d2e8a` and review `fd336dd` as immutable evidence. No public assets were
  created, so rollback removes only the six hold dispositions, accepted
  zero-hash manifest state, and deterministic register reconciliation.
- For Batch 108 reconciliation withdrawal, revert `3cd8df8`; retain audit
  `497c499`, prompt freeze `2334555`, review `36b3b00`, the exact quarantined
  melatonin source, and its alpha-field audit as immutable evidence. No public
  master, derivative, registry record, endpoint, or image-sitemap entry was
  created.
- For Batch 109 reconciliation withdrawal, revert `6cde46e`; retain audit
  `a8f61fa`, prompt freeze `3b39be7`, review `ada7f8a`, the exact quarantined
  omega-3 source, and its native heavy-atom/double-bond audit as immutable
  evidence. No public master, derivative, registry record, endpoint, or
  image-sitemap entry was created.
- For Batch 110 reconciliation withdrawal, revert `406f7cc`; retain audit
  `ee7bf48`, review `dc151ca`, and the frozen zero-call prompt boundary as
  immutable evidence. No generated source, public master, derivative, registry
  record, endpoint, Schema object, social preview, or image-sitemap entry was
  created.
- For Batch 111 reconciliation withdrawal, revert `ce1d06c`; retain audit and
  prompt freeze `aba8c1a`, review `801abdb`, the exact quarantined quercetin
  source, and its literal center/connectivity and alpha-field audit as
  immutable evidence. No public master, derivative, registry record, endpoint,
  Schema object, social preview, or image-sitemap entry was created.
- For Batch 112 reconciliation withdrawal, revert zero-hash acceptance
  `b2f7bba`; retain audit `cb559ce`, prompt freeze `acd6a9b`, review `472ec2a`,
  the exact quarantined simvastatin source, and its literal heavy-atom,
  connectivity, alpha-field, and edge-field audit as immutable evidence. No
  public master, derivative, registry record, endpoint, Schema object, social
  preview, or image-sitemap entry was created.
- For Batch 113 reconciliation withdrawal, revert zero-call acceptance
  `97179b0`; retain audit `9693d44` and review `1eff245` as immutable evidence.
  No generated source, public master, derivative, registry record, endpoint,
  Schema object, social preview, or image-sitemap entry was created.
- For Batch 114 reconciliation withdrawal, revert zero-call acceptance
  `a92f9b7`; retain audit `e1198de` and review `64781af` as immutable evidence.
  No generated source, public master, derivative, registry record, endpoint,
  Schema object, social preview, or image-sitemap entry was created.
- For Batch 115 reconciliation withdrawal, revert zero-call acceptance
  `f9b7793`; retain audit `8c4d743` and review `d7962ed` as immutable evidence.
  No generated source, public master, derivative, registry record, endpoint,
  Schema object, social preview, or image-sitemap entry was created.
- For Batch 116 reconciliation withdrawal, revert zero-call acceptance
  `3dd9b34`; retain audit `0900bcf` and review `9a37ca7` as immutable evidence.
  No generated source, public master, derivative, registry record, endpoint,
  Schema object, social preview, or image-sitemap entry was created.
- For Batch 117 reconciliation withdrawal, revert zero-call acceptance
  `da49e80`; retain audit `a806fd6` and review `fddd3bc` as immutable evidence.
  No generated source, public master, derivative, registry record, endpoint,
  Schema object, social preview, or image-sitemap entry was created.
- For Batch 118 reconciliation withdrawal, revert zero-call acceptance
  `f0dc8f5`; retain audit `df05617` and review `32395d8` as immutable evidence.
  No generated source, public master, derivative, registry record, endpoint,
  Schema object, social preview, or image-sitemap entry was created.
- For Batch 119 reconciliation withdrawal, revert zero-call acceptance
  `2f2111c`; retain audit `90ca319` and review `2b6dc75` as immutable evidence.
  No generated source, public master, derivative, registry record, endpoint,
  Schema object, social preview, or image-sitemap entry was created.
- For Batch 120 reconciliation withdrawal, revert zero-call acceptance
  `f16b821`; retain audit `96d3dcd` and review `0c9b435` as immutable evidence.
  No generated source, public master, derivative, registry record, endpoint,
  Schema object, social preview, or image-sitemap entry was created.
- For Batch 121 withdrawal, revert promotion `32eb17a`; retain audit
  `da1a1d6`, prompt freeze `14efabe`, review `53ccc95`, and exact-hash
  acceptance `b1e96b0` as immutable evidence. Reversion removes only the
  Dopamine registry/review entry, lossless master, article and social WebPs,
  and regenerated coverage state; the five scientific holds remain review
  evidence unless separately superseded by authoritative source correction.
- For Batch 122 reconciliation withdrawal, revert register reconciliation
  `456575e` and zero-hash acceptance `9f3ad77`; retain audit `67a9b45`, prompt
  freeze `caa0e07`, and review `bb378b7` as immutable evidence. No public
  master, derivative, registry record, endpoint, Schema object, social
  preview, or image-sitemap entry was created; the two exact generated sources
  remain non-public quarantine evidence.
- For Batch 123 withdrawal, revert register reconciliation `664004d`, scheduler
  `7881199`, corrected acceptance `546779d`, and correction `91d9b1c`; retain
  audit `b856e40`, prompt freeze `7b81dfe`, and review `d3fe93f` as immutable
  evidence. No public master, derivative, registry record, endpoint, Schema
  object, social preview, or image-sitemap entry was created; the exact
  Serotonin source remains non-public quarantine evidence. Reverting the
  scheduler restores the prior no-fallback behavior but does not change any
  scientific disposition or public asset.
- For Batch 124 withdrawal, revert promotion `a498ad8`; retain audit `0d7690c`,
  prompt freeze `003b468`, prompt checkpoint `a7753ea`, review `b3ee9f2`, and
  exact-hash acceptance `0f63d2c` as immutable evidence. Reversion removes only
  the three revision-2 registry/review entries, three lossless masters, six
  public WebPs, and regenerated coverage state. The three rejected revision-2
  sources and every revision-1 predecessor remain immutable non-public review
  evidence.
- For Batch 125 withdrawal, revert promotion `32bad61`; retain audit `0892fc6`,
  prompt freeze `9666d54`, prompt checkpoint `dcd1928`, review `7fce7ab`, and
  exact-hash acceptance `d2864d1` as immutable evidence. Reversion removes only
  the Bacterial Vaginosis revision-3 registry/review entry, lossless master,
  article and social WebPs, and regenerated coverage state. The five rejected
  Batch 125 sources and every predecessor remain immutable non-public review
  evidence.
