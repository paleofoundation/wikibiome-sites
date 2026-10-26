# WikiBiome post-cutover closeout

This is the operational record for the custom-domain observation window that
began August 31, 2026. It is deliberately separate from feature development.
The WikiBiome control task is the only production integration and release
owner.

## Authority and safety boundary

- Preserve the legacy Vercel rollback target through at least September 7,
  2026.
- Do not delete, alter, deploy, push, merge, change DNS, initiate a payment,
  change account data, or retire the rollback target from this closeout task.
- A passing audit does not authorize retirement. Retirement requires a new,
  explicit user approval after the audit report is delivered.
- The earliest closeout audit time is **2026-09-07T00:00:00+03:00**
  (Asia/Nicosia; **2026-09-06T21:00:00Z**).

## Baseline: September 1, 2026

Captured read-only at **2026-09-01T12:10:32+03:00**. This is a pre-gate
baseline, not the final go/no-go audit.

### Source and production identity

| Item | Baseline evidence |
| --- | --- |
| Closeout worktree | Clean, detached at `2b6444ce10123038126954c428e6a025a32fe9e4` (`main` at task creation) |
| Sites project | `appgprj_6a952a45833881918318478cf66804f3`, active and public |
| Production release | Sites version 40, commit `bffbcf093d1c553fb33728be0d1d04fc8d717f47`, deployment `appgdep_6a9682e40a8881919aaaaf19db6b2e6c` (control-thread deployment record) |
| Newer saved version | Version 41 exists at commit `2b6444ce10123038126954c428e6a025a32fe9e4`; it was not treated as the production baseline because saved versions are not necessarily deployed and the live route shape matches version 40 |
| Custom domains | `wikibiome.com` and `www.wikibiome.com` both report domain, provider, and SSL status `active`; no provider error |

### DNS and TLS

| Check | Baseline evidence |
| --- | --- |
| Apex DNS | `wikibiome.com A 172.66.3.26`, `162.159.143.30` |
| `www` DNS | `www.wikibiome.com CNAME custom-domains.chatgpt.site.` |
| Apex HTTP behavior | `200`, serves the homepage directly, and emits canonical `https://www.wikibiome.com`; it does **not** redirect to `www` in this baseline |
| `www` HTTP behavior | `200` at `https://www.wikibiome.com/` |
| `www` certificate | Google Trust Services `WE1`; SAN `www.wikibiome.com`; valid 2026-08-31 18:24:58Z through 2026-11-29 19:24:52Z; SHA-256 `BB:E9:28:E8:85:5D:48:74:AF:1F:52:0F:95:63:23:E6:20:DF:06:74:C7:D3:42:47:82:48:C5:34:90:8F:A6:76` |
| Apex certificate | Google Trust Services `WE1`; SAN `wikibiome.com`; valid 2026-08-31 19:48:06Z through 2026-11-29 20:48:05Z; SHA-256 `C9:DC:31:39:0B:47:A1:DD:9D:E5:8F:76:FA:3D:D8:B4:07:C3:18:AC:8C:14:F9:AE:27:9F:A4:DE:33:48:D7:A7` |

### Representative route baseline

Read-only requests were captured at **2026-09-01T09:08:21Z**.

| Surface | Route | Baseline |
| --- | --- | --- |
| Home | `/` | `200`, correct title |
| Category | `/category/microbe` | `200`, Microorganisms title |
| Article | `/article/nickel` | `200`, exact article canonical |
| Source | `/source/ahmed-2025-metals-alzheimers-mechanistic-review` | `200` |
| Search | `/search?q=nickel` | `200` |
| Support | `/support` | `200`, contains the configured Stripe Payment Link |
| Thank-you | `/support/thank-you` | `200` |
| Contribution entry | `/contribute` | `200` |
| Owner contribution ledger | `/contributions` | `307` to `/signin-with-chatgpt?return_to=%2Fcontributions`; no account data changed |
| Knowledge graph | `/explore?focus=nickel` | `200` |
| Clusters | `/clusters?condition=alzheimers-disease` | `200` |
| Comparison | `/compare?a=alzheimers-disease&b=parkinsons-disease` | `200` |
| Keystone | `/keystone` | `200` |
| Sitemap | `/sitemap.xml` | `200`, XML, 2,644 `<url>` entries |
| Robots | `/robots.txt` | `200`, advertises `https://www.wikibiome.com/sitemap.xml` |

Of the 15 representative WikiBiome endpoints above, 14 public routes returned
`200`; the protected contribution ledger returned the expected `307`
authentication redirect. Owner authentication and moderation were not
exercised because this baseline must not change account data; they require an
authenticated, read-only browser check after the time gate.

Two newer researcher-network routes present in commit `2b6444c`
(`/researcher/dashboard` and `/researcher/moderation`) returned `404` on the
version-40 production baseline. They are recorded as unpublished feature state,
not as a cutover regression. The final audit must test the moderation surface
that is actually live after any control-task releases before September 7.

### Canonical baseline

- The homepage and Nickel article emitted the expected canonical URLs.
- Ten representative non-home HTML routes (category, source, search, support,
  thank-you, contribution entry, Explore, Clusters, Compare, and Keystone)
  emitted `https://www.wikibiome.com` instead of their own route canonical.
- The apex serves duplicate homepage content with a `www` canonical instead of
  redirecting.

These are search-continuity risks owned by the separate search-visibility
program. They must be rechecked in the post-gate audit; this closeout task does
not patch or publish them.

### Stripe support baseline

Read-only Stripe API inspection targeted the already specified live account,
**Microbiome Signatures LLC** (`acct_1T5vhlRiEhjlKM3G`). No Checkout Session or
payment was created.

| Item | Baseline evidence |
| --- | --- |
| Payment Link | `plink_1UAXxqRiEhjlKM3GJQ5UH0L8`, active, live |
| Public URL | `https://buy.stripe.com/bJefZjaif6IFd8Z4PL6EU03`, returns `200` |
| Model | One-time, customer-chosen USD amount |
| Amount bounds | $5 minimum, $10 preset, $2,500 maximum |
| Return routing | `https://wikibiome.com/support/thank-you` |
| Site return route | Returns `200` without initiating payment |

### Worker-log baseline

The Sites production worker was queried read-only with `errors_only=true` for
the preceding 1,440 minutes (maximum 100 events). The connector returned 17
failure-filtered events spanning **2026-09-01T08:06:48.514Z** through
**2026-09-01T08:55:53.107Z**:

- `0` 5xx responses;
- `0` logged errors;
- `0` exception/uncaught/unhandled signals;
- `17` outcome `ok`, informational `404` responses.

The 404s were favicon requests (5), two nonexistent article slugs (6), source
map probes (4), and one probe each for `/open/visitors/info/gets` and
`/.git/HEAD`. This is the available log window, not a claim of unlimited
historical coverage.

### Search-index baseline

Three public search queries were run:

- `site:www.wikibiome.com WikiBiome`
- `site:www.wikibiome.com/article/nickel`
- `site:wikibiome.com "WikiBiome — The Human Microbiome Encyclopedia"`

They returned no results. There is therefore **no public search-result evidence
yet** that canonical `www.wikibiome.com` URLs have entered the index. Search
Console or Bing Webmaster evidence, if available to the owner, remains the
preferred authenticated evidence after the gate.

### Legacy rollback baseline

| Item | Baseline evidence |
| --- | --- |
| Vercel project | `wikibiome`, `prj_SCOrInaQ6NfUPSCDAhPxWJGm62LR`, team `team_qSB41Q0YIPL29XCzvsxgu91R` |
| Retained production deployment | `dpl_5ShUos99yjK3vWMbarbfmxkDQWEH` |
| Immutable URL | `https://wikibiome-kziwi715f-karen-pendergrass-projects.vercel.app` |
| Deployment state | `Ready`, production, created 2026-08-31T23:34:13+03:00 |
| Former `www` CNAME | `7d875abacccdc8f1.vercel-dns-016.com.` |
| Former target resolution | `216.150.1.193`, `216.150.16.193` |
| Alias metadata | Deployment still lists `wikibiome.com`, `www.wikibiome.com`, and the stable Vercel project aliases |
| Direct deployment access | Immutable URL exists and redirects to Vercel SSO; rollback readiness is supported by `Ready` state, retained domain aliases, and retained former CNAME, not by anonymous direct-deployment access |

No Vercel deployment, alias, or DNS state was changed.

## Read-only audit runner

The repository includes a deterministic public-evidence runner. It performs
only GET, DNS, and TLS reads and never changes production or account state.

```sh
# Before the gate: exits 2 without making any network request.
npm run audit:post-cutover

# Optional labeled pre-gate capture; never issues a retirement decision.
npm run audit:post-cutover -- --baseline

# On or after the gate: runs the public checks and emits JSON.
npm run audit:post-cutover

# Unit coverage for the gate and evidence evaluators.
npm run audit:post-cutover:test
```

Exit `2` means the time gate has not been reached or command arguments are
invalid. After the gate, exit `1` means one or more required public checks
failed. Exit `0` means only that the public checks passed; it is **not** a
retirement approval. The authenticated browser, owner moderation, Stripe API,
worker-log, search-index, and Vercel metadata evidence must still be attached
and reviewed manually. The runner therefore always emits
`eligibleForRetirementDecision: false`.

Runner validation at **2026-09-01T09:20:29.463Z** completed all 26 public
checks: 16 passed and 10 failed. The 10 failures were exactly the already
recorded route-canonical defects (category, source, search, support, thank-you,
contribution entry, Explore, Clusters, Compare, and Keystone); there were no
additional request, DNS, TLS, redirect-loop, sitemap, robots, support-link, or
rollback-availability failures. Both HTTP origins upgraded to HTTPS with one
`302` hop. This is the exact pre-gate runner metric for the final delta.

The post-gate manual evidence sources are the read-only Sites project/version
and worker-log interfaces, a real browser with the owner's existing session,
the Stripe read API, the Vercel deployment read API, and public web search (plus
Search Console or Bing Webmaster evidence if already available to the owner).
None of those reads authorizes a production mutation.

## Post-gate audit checklist

Run on or after **2026-09-07T00:00:00+03:00** against the production release
then active. Preserve raw timestamps, status codes, final URLs, certificate
details, and account/log evidence.

Complete the companion
[`wikibiome-post-cutover-audit-report-template.md`](./wikibiome-post-cutover-audit-report-template.md)
without leaving any `[PENDING]` value or `MISSING` requirement unresolved.

- [ ] Record the exact production version, commit, and route corpus active at audit time.
- [ ] Verify apex and `www` DNS, HTTPS, certificate validity, redirect/canonical behavior, and absence of a redirect loop.
- [ ] Verify representative home, category, article, source, search, support, contribution, and research-tool routes in a real browser and by HTTP.
- [ ] Authenticate as the owner and confirm moderation availability read-only; do not submit, accept, decline, edit, or change account data.
- [ ] Confirm the live Stripe Payment Link, amount model, disclosure, and configured thank-you redirect via read-only API; do not create a Checkout Session or payment.
- [ ] Verify `/support/thank-you` directly.
- [ ] Verify sitemap content type, count, canonical-host samples, and robots sitemap declaration.
- [ ] Inspect the available recent production worker-log window for every 5xx, exception, uncaught error, or failed outcome; name unresolved events exactly.
- [ ] Capture public search results and, if owner access is available, Search Console/Bing URL or sitemap evidence for canonical `www` URLs.
- [ ] Re-inspect Vercel deployment `dpl_5ShUos99yjK3vWMbarbfmxkDQWEH` and former CNAME `7d875abacccdc8f1.vercel-dns-016.com.`.
- [ ] Produce the standardized handoff: final commit SHA(s), baseline-to-final metric delta, changed files, commands/tests, representative rendered/live checks, blockers/account gates, and rollback notes.
- [ ] Issue a go/no-go recommendation with exact blockers.
- [ ] If and only if the audit passes, request new explicit approval for retirement. Do not perform retirement in the audit turn.

## Decision rule

Recommend **NO-GO** if any required hostname or representative route fails,
owner moderation cannot be confirmed, Stripe/thank-you routing is unavailable,
sitemap or robots is invalid, an unresolved production 5xx/exception remains,
no credible indexing evidence is available, or the rollback deployment/CNAME
information is unavailable.

Recommend **GO FOR AN EXPLICIT RETIREMENT DECISION** only when every required
check is evidenced. That recommendation still performs no retirement action.
