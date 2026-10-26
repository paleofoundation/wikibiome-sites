# Public page history

Apply this policy to every WikiBiome article and source page, its history view,
change counter, and public activity API. Add an entry only for a material change
published on that page. Describe the change to the page, not the work used to
produce it. Content, evidence, conclusions, and published author context qualify.
Reviews, approvals, status transitions, discussions/replies, checks, deployment
receipts, and Git commits by themselves do not qualify. Keep discussion and
private operational audit records in their existing separate systems.

The shared policy is `lib/public-page-history-policy.mjs`. Revision generation
compares the affected page before/after each commit. Internal metadata, comments,
and whitespace-only changes do not qualify. Public fields are explicitly listed;
review that list when introducing new rendered article fields. Subjects of batch
commits are retained as source provenance but never used as public change titles.
Accepted proposals need a complete recorded publication commit and published text.
Nonempty accepted author context qualifies because it is rendered on the source
page. The activity trail coalesces proposal and Git records for the same commit.

Regenerate with `npm run revisions:sync` when the synchronized upstream snapshot
is available. `node scripts/generate-revision-history.mjs --classify-existing`
classifies the existing indexed revisions without refreshing article content or
changing the synchronized source snapshot. Inaccessible commit diffs are omitted
rather than labeled material without evidence; `omittedUnavailable` records that
count. The build audit rejects histories from an older policy or unverified rows.

Generated derivative pages retain source provenance but do not inherit their
parent article’s unrelated changes as their own history. Track a derivative’s
published output before adding its material-change timeline.

History descriptions name the affected section, quote the actual added or removed
passage, show before/after wording for revisions, and list changed public fields
and references. Initial publication names the article and its sections. Derive
these descriptions from page snapshots, never batch commit subjects. Preserve
qualifiers in source excerpts; ellipses explicitly mark shortened passages. The
build audit requires policy v2 descriptions and rejects the old generic labels.
