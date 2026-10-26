# WikiBiome post-cutover audit report template

> **TEMPLATE — NOT AN AUDIT RESULT.** Every `[PENDING]` value must be replaced
> with timestamped evidence captured on or after 2026-09-07T00:00:00+03:00
> (2026-09-06T21:00:00Z). An incomplete row is a blocker, not a pass.

This report is operationally separate from feature development. The WikiBiome
control task remains the sole production integration and release owner.

## Audit identity and safety

| Field | Final evidence |
| --- | --- |
| Audit start (UTC and Asia/Nicosia) | `[PENDING]` |
| Audit end (UTC and Asia/Nicosia) | `[PENDING]` |
| Auditor | `[PENDING]` |
| Sites project/version/deployment | `[PENDING]` |
| Production source commit | `[PENDING]` |
| Audit-runner commit | `[PENDING]` |
| Raw public-runner JSON | `[PENDING: path or attached artifact]` |
| Browser evidence | `[PENDING: screenshot/session references]` |
| Account/platform evidence | `[PENDING: read-only result references]` |

Safety attestations, all required:

- [ ] No deployment, version save, push, merge, or production integration.
- [ ] No DNS, custom-domain, alias, environment, or access-policy change.
- [ ] No payment, Checkout Session, or payment-method submission.
- [ ] No account, contribution, moderation, or database mutation.
- [ ] No deletion, alteration, or retirement of the legacy rollback target.

## Requirement evidence matrix

Use `PASS`, `FAIL`, or `MISSING`. A `MISSING` row is an exact decision blocker.

| Requirement | Acceptance criterion | Status | Timestamped evidence | Exact blocker if not PASS |
| --- | --- | --- | --- | --- |
| Time gate | Audit started at or after `2026-09-06T21:00:00Z` | `MISSING` | `[PENDING]` | `[PENDING]` |
| Production identity | Active Sites project, deployed version, deployment ID, and source commit recorded | `MISSING` | `[PENDING]` | `[PENDING]` |
| Apex DNS | Current A/AAAA answers captured | `MISSING` | `[PENDING]` | `[PENDING]` |
| `www` DNS | Current CNAME/answers captured and consistent with the active production host | `MISSING` | `[PENDING]` | `[PENDING]` |
| HTTP→HTTPS | Apex and `www` reach HTTPS without a loop | `MISSING` | Runner: `http_apex_https_upgrade`, `http_www_https_upgrade` | `[PENDING]` |
| Apex canonical routing | Apex redirects to `www`, or its 200 response has the exact `www` homepage canonical | `MISSING` | Runner: `http_apex_canonical` | `[PENDING]` |
| `www` canonical routing | Representative pages emit their exact canonical `www` URL | `MISSING` | Runner: `http_*` | `[PENDING]` |
| Apex TLS | Valid trusted certificate for `wikibiome.com`, dates and fingerprint recorded | `MISSING` | Runner: `tls_wikibiome.com` | `[PENDING]` |
| `www` TLS | Valid trusted certificate for `www.wikibiome.com`, dates and fingerprint recorded | `MISSING` | Runner: `tls_www.wikibiome.com` | `[PENDING]` |
| Representative HTTP routes | Every required route has the expected status and canonical | `MISSING` | Public runner JSON | `[PENDING]` |
| Representative browser routes | Every required surface renders; final URL, title, console errors, and failed requests recorded | `MISSING` | Browser table below | `[PENDING]` |
| Unauthenticated ledger boundary | `/contributions` retains the expected sign-in redirect | `MISSING` | Runner: `contribution_auth_boundary` | `[PENDING]` |
| Owner authentication | Owner can authenticate using the existing account without account changes | `MISSING` | `[PENDING]` | `[PENDING]` |
| Moderation availability | Live moderation surface is accessible read-only to the owner | `MISSING` | `[PENDING]` | `[PENDING]` |
| Support disclosure/link | Support page renders the intended disclosure and configured Stripe Payment Link | `MISSING` | Runner plus browser evidence | `[PENDING]` |
| Stripe configuration | Read API confirms active live link, account, amount model/bounds, and return URL | `MISSING` | `[PENDING]` | `[PENDING]` |
| Thank-you return route | Configured return points to the intended thank-you URL and direct GET renders without payment | `MISSING` | `[PENDING]` | `[PENDING]` |
| Sitemap | 200 XML, canonical `www` hosts, representative records, and count recorded | `MISSING` | Runner: `sitemap` | `[PENDING]` |
| Robots | 200 text and exact canonical sitemap declaration | `MISSING` | Runner: `robots` | `[PENDING]` |
| Worker logs | Available recent window captured; no unresolved 5xx, exception, error, or failed outcome | `MISSING` | `[PENDING]` | `[PENDING]` |
| Search-index evidence | Credible evidence shows canonical `www` URLs entering at least one search index | `MISSING` | `[PENDING]` | `[PENDING]` |
| Retained Vercel deployment | `dpl_5ShUos99yjK3vWMbarbfmxkDQWEH` still exists, is `Ready`, and retains the rollback alias metadata | `MISSING` | `[PENDING]` | `[PENDING]` |
| Former CNAME information | `7d875abacccdc8f1.vercel-dns-016.com.` and current resolution are recorded and available for rollback | `MISSING` | `[PENDING]` | `[PENDING]` |

## Representative rendered/live checks

Do not submit forms or invoke moderation actions. Record zero as `0`, not blank.

| Surface | Route | HTTP | Final browser URL/title | Console errors | Failed requests | Status/evidence |
| --- | --- | --- | --- | ---: | ---: | --- |
| Home | `/` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Category | `/category/microbe` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Article | `/article/nickel` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Source | `/source/ahmed-2025-metals-alzheimers-mechanistic-review` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Search | `/search?q=nickel` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Support | `/support` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Thank-you | `/support/thank-you` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Contribution entry | `/contribute` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Protected ledger | `/contributions` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Knowledge graph | `/explore?focus=nickel` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Clusters | `/clusters?condition=alzheimers-disease` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Comparison | `/compare?a=alzheimers-disease&b=parkinsons-disease` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Keystone | `/keystone` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |
| Owner moderation | `[live route at audit time]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `[PENDING]` | `MISSING` |

## Exact baseline-to-final metric delta

The baseline public runner is 16/26 required checks passing with 10 route-
canonical failures. Preserve denominators; if the runner's check set changes,
report both old and new denominators and explain the change.

| Metric | September 1 baseline | Post-gate final | Exact delta |
| --- | ---: | ---: | ---: |
| Required public checks passed | 16/26 | `[PENDING]` | `[PENDING]` |
| Required public checks failed | 10/26 | `[PENDING]` | `[PENDING]` |
| Sampled route-specific canonical failures | 10 | `[PENDING]` | `[PENDING]` |
| Representative endpoint 200 responses | 14/15 | `[PENDING]` | `[PENDING]` |
| Expected protected authentication redirects | 1/15 | `[PENDING]` | `[PENDING]` |
| Sitemap URL entries | 2,644 | `[PENDING]` | `[PENDING]` |
| Unresolved worker 5xx responses | 0 | `[PENDING]` | `[PENDING]` |
| Unresolved worker exceptions/errors/failed outcomes | 0 | `[PENDING]` | `[PENDING]` |
| Public search queries with canonical-`www` evidence | 0/3 | `[PENDING]` | `[PENDING]` |
| Valid hostname TLS checks | 2/2 | `[PENDING]` | `[PENDING]` |
| Retained rollback deployment available | 1/1 | `[PENDING]` | `[PENDING]` |
| Former CNAME information available | 1/1 | `[PENDING]` | `[PENDING]` |

## Worker-log evidence

| Field | Final evidence |
| --- | --- |
| Requested window and filters | `[PENDING]` |
| Returned first/last timestamp | `[PENDING]` |
| Returned event count / limit | `[PENDING]` |
| 5xx count and event IDs | `[PENDING]` |
| Exception/error/failed count and event IDs | `[PENDING]` |
| Benign non-2xx count and classification | `[PENDING]` |
| Unresolved events | `[PENDING; must be none for GO]` |
| Coverage limitation | `[PENDING]` |

## Search-index evidence

| Source/query | Timestamp | Result | Canonical `www` URL evidence |
| --- | --- | --- | --- |
| `site:www.wikibiome.com WikiBiome` | `[PENDING]` | `[PENDING]` | `[PENDING]` |
| `site:www.wikibiome.com/article/nickel` | `[PENDING]` | `[PENDING]` | `[PENDING]` |
| `site:wikibiome.com "WikiBiome — The Human Microbiome Encyclopedia"` | `[PENDING]` | `[PENDING]` | `[PENDING]` |
| Search Console or Bing Webmaster | `[PENDING]` | `[PENDING/account unavailable]` | `[PENDING]` |

## Standardized handoff

### 1. Final commit SHA(s)

`[PENDING]`

### 2. Exact baseline-to-final metric delta

`[PENDING: copy the completed delta table above]`

### 3. Changed-file summary

| File | Change | Operational purpose |
| --- | --- | --- |
| `[PENDING]` | `[PENDING]` | `[PENDING]` |

### 4. Commands/tests and results

| Command or read-only tool call | Timestamp | Exit/result | Evidence |
| --- | --- | --- | --- |
| `npm run audit:post-cutover:test` | `[PENDING]` | `[PENDING]` | `[PENDING]` |
| `npm run audit:post-cutover` | `[PENDING]` | `[PENDING]` | `[PENDING]` |
| `[PENDING manual checks]` | `[PENDING]` | `[PENDING]` | `[PENDING]` |

### 5. Representative rendered/live checks

`[PENDING: reference the completed route table and screenshots above]`

### 6. Remaining blockers or account-gated actions

Number every blocker. For each, state the failed/missing requirement, exact
evidence, owner, and next action. Do not collapse missing access into a pass.

`[PENDING]`

### 7. Rollback notes

- Retained deployment and state: `[PENDING]`
- Immutable URL: `[PENDING]`
- Retained alias metadata: `[PENDING]`
- Former CNAME and current resolution: `[PENDING]`
- Exact rollback information available to the control task: `[PENDING]`
- Rollback target was not altered or retired: `[PENDING]`

## Decision

Select exactly one after every requirement row is resolved:

- [ ] **NO-GO** — one or more exact blockers remain.
- [ ] **GO FOR AN EXPLICIT RETIREMENT DECISION** — every required check has
      current evidence and no blocker remains.

Decision rationale and exact blockers: `[PENDING]`

Even a GO recommendation does not authorize retirement. Deletion, alias/DNS
changes, deployment changes, or rollback retirement require a new explicit user
approval after this completed report is delivered.
