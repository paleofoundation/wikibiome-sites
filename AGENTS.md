# WikiBiome cost lock — WB-COST-KILL-1

## Owner hosting lock — September 21, 2026

WikiBiome stays on **ChatGPT/Codex Sites**, project
`appgprj_6a952a45833881918318478cf66804f3`, from this checkout.
The GitHub Vite application is legacy code/content upstream, not production.
Indexing repairs do not authorize a hosting migration, Vercel deployment,
re-enabling Vercel builds, or any DNS/CDN/domain-target change. Do not switch
hosting to make an old deploy command work. A future hosting change requires
a separate, explicit instruction from Karen; an assistant's own ORDER is not
authorization. Preserve the Vercel locks and existing Sites audience.

## Release and cost controls

- Batch changes: one merged release PR, one production publish. This source is
  reviewed through the WikiBiome upstream PR with an exact source patch and SHA.
- Validate locally before publishing. Do not publish serial chrome or SEO nits,
  automatically retry a publish, or create legacy Vercel builds. Inspect an
  existing deployment if its result is uncertain.
- Keep `images.unoptimized: true`, direct original image URLs, and the worker's
  optimizer bypass until a new explicit order changes the cost policy. Never
  regenerate the image corpus, bust its URLs, or purge images on deployment.
- Search landing/vitals collection and verbose GSC request logging are off.
- No empty LIVE/heartbeat commits or build wakeups. Bridge STATUS requires a
  real ORDER and a material result or changed blocker.
- Do not change Flat Rate CDN, DNS, menus, or mint content in cost-control work.
