# WikiBiome content refresh and rollback

This runbook keeps upstream scientific content synchronization separate from production publication. It contains no credentials.

## Weekly refresh gate

The Codex automation `wikibiome-upstream-refresh-gate` runs weekly against this project.

1. It refuses to modify a dirty site worktree.
2. `npm run content:check` fetches `paleofoundation/wikibiome` and compares `origin/main` with `data/content-manifest.generated.json`.
3. If the commits match, it reports the synchronized commit and stops without changing files.
4. If the upstream commit is newer, `npm run content:refresh` rebuilds the public corpus, reapplies the public-content exclusion policy, regenerates revision history, and runs the complete build and rendered-HTML test gate.
5. The resulting diff is left for editorial review. The automation never commits, pushes, deploys, changes DNS, or modifies the rollback target.

The generated revision-history process reads the exact manifest commit from the upstream Git object database. It does not depend on the ignored reference clone's checked-out branch being current.

## Release decision

Before approving an upstream refresh, review:

- upstream commit range and changed records;
- content, source, and canonical-route counts;
- public-content exclusions;
- source-registry and DOI warnings;
- Keystone publication metadata;
- redirect and duplicate-signature behavior;
- complete build and rendered-HTML test results.

Only a reviewed, passing commit may be pushed to the Sites source repository and saved as a production Site version.

## Post-cutover rollback window

The custom-domain observation window began August 31, 2026. The previous Vercel deployment and former `www` CNAME target must remain unchanged through at least September 7, 2026.

Before retiring that rollback target, verify:

- apex and `www` canonical routing and SSL;
- representative home, category, article, source, search, and research-tool routes;
- owner sign-in and contribution moderation;
- Stripe support link and thank-you return route;
- sitemap and robots availability;
- production worker logs contain no unresolved 5xx responses or exceptions;
- search indexing has begun resolving canonical `www.wikibiome.com` URLs.

Retirement is a separate, explicit production decision. Do not delete or mutate the legacy deployment as part of ordinary WikiBiome releases.
