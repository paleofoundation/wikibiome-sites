# WikiBiome researcher network runbook

## Launch gates

1. Back up D1, apply researcher migrations in numerical order to a staging database, run the clean-database contract test, then apply the accepted migrations to production immediately before the matching application release. Research Network v2 begins with `0006`; never deploy v2 code against an older schema.
2. Register the exact ORCID callback at `/api/auth/orcid/callback`, beginning with the ORCID sandbox.
3. Verify `mail.wikibiome.com` in Resend with its exact SPF and DKIM records. Configure `WikiBiome <researchers@mail.wikibiome.com>` as the sender and `hello@wikibiome.com` as the reply address. Add secrets and point signed Resend webhooks to `/api/webhooks/resend`. Confirm replayed webhook IDs are idempotent before activation.
4. Connect an asynchronous R2 event/queue scanner before setting `WIKIBIOME_MANUSCRIPT_UPLOADS_ENABLED=1`. Uploads fail closed unless this flag and `WIKIBIOME_SCAN_WEBHOOK_SECRET` are both configured. The application quarantines uploads, validates the PDF signature, and rejects common active-content markers. The scanner reports to `/api/work-submissions/manuscripts/scan-result`; a clean result must be the only path out of quarantine.
5. Have counsel approve the outreach jurisdiction matrix and every cold-notice template before setting `WIKIBIOME_OUTREACH_ENABLED=1`. Outreach also fails closed unless Resend, sender identity, and unsubscribe signing are configured.
6. Set `WIKIBIOME_MODERATOR_IDS` to the existing ChatGPT contributor IDs that should become research-network moderators when they link ORCID. Direct database role changes remain an audited site-administrator operation.

## Production configuration

- Bindings: D1 as `DB`; private R2 as `MANUSCRIPTS`.
- ORCID: `ORCID_CLIENT_ID`, `ORCID_CLIENT_SECRET`, `ORCID_REDIRECT_URI`, and `ORCID_ENVIRONMENT=production` after sandbox acceptance.
- Email: `RESEND_API_KEY`, `WIKIBIOME_EMAIL_FROM`, `WIKIBIOME_EMAIL_REPLY_TO`, `WIKIBIOME_PUBLIC_ORIGIN`, `RESEND_WEBHOOK_SECRET`, `WIKIBIOME_UNSUBSCRIBE_SECRET`, and `WIKIBIOME_NOTIFICATION_DISPATCH_SECRET`.
- Safety gates: `WIKIBIOME_SCAN_WEBHOOK_SECRET`, `WIKIBIOME_MANUSCRIPT_UPLOADS_ENABLED`, and `WIKIBIOME_OUTREACH_ENABLED`.
- Administration: `WIKIBIOME_MODERATOR_IDS`. Never enable `WIKIBIOME_EMAIL_DEBUG` in production.

ORCID's current OpenID discovery document does not advertise PKCE support. WikiBiome therefore uses the confidential authorization-code flow with an expiring, hashed, single-use state record and a server-held client secret. Re-check ORCID discovery before enabling PKCE in a future integration revision.

## Security, privacy, and accessibility review

- Researcher sessions and one-time tokens are stored hashed; production cookies are HTTP-only, Secure, SameSite=Lax, and expiring.
- Browser mutations enforce same-origin requests. Resend and scanner callbacks use independently verified signatures or secrets.
- Private email is held separately from the public profile. Research activity, community digest, and Roundtable event choices are separate and unchecked by default; suppression overrides delivery. Historical fundraising consent is retained but is not requested in onboarding and is never converted into event consent.
- Claims verify identity but do not transfer copyright or editorial control. Author context and new-researcher posts remain moderated, and accepted submissions create change packets instead of changing the public corpus.
- Forms use programmatic labels, status regions, keyboard-native controls, and responsive layouts. Private dashboards and moderation pages are `noindex`; public profiles, discussions, institutions, and the research standard remain indexable.
- Legal release remains account-gated: counsel must approve the jurisdiction matrix, privacy notice, terms, and cold-notice template before outreach is enabled.

## Author outreach pilot

- Select no more than 100 high-confidence corresponding-author contacts from Keystone and heavily reused sources.
- Record address provenance, jurisdictional rule, purpose, and approval in the outreach ledger.
- Send one factual `citation_notice` only. It must identify the cited work and placements, require ORCID at claim time, provide an opt-out, and contain no marketing, donation, coffee, or fundraising request.
- Treat the signed link as navigation, never as authorship proof.
- Stop delivery immediately for suppression, bounce, complaint, or unsubscribe events.

## Editorial boundaries

- A claim is non-exclusive and verifies identity, not ownership or control.
- Author context supplements the independent synthesis and remains pending until reviewed.
- Accepted research creates an upstream change packet; it cannot write into the generated public corpus.
- Institution approval does not approve its members or batches automatically.
- Support status never changes role, moderation, citation, visibility, or Keystone eligibility.

## Research Network v2 operations

### ORCID work discovery

- Login must succeed even when the public-record API is unavailable. The site starts a non-blocking synchronization and retains the prior cache on failure.
- Cache only minimal public work metadata. Automatic refresh is stale-based; researchers may request one manual refresh per day.
- Exact normalized DOI matches remain private suggestions until the researcher confirms. Confirmed exact matches may verify automatically. Title/author/year similarities always remain possible matches and enter manual claim review.
- Never infer hidden ORCID works or use ORCID to obtain email.

### Verification delivery

- The account UI must display the masked destination and the actual outbox/provider state. Never tell a researcher to check their inbox unless the provider accepted the message.
- A resend invalidates every older unused token for that account. Expired, failed, bounced, complained, suppressed, and unconfigured states must remain distinguishable.
- Resend webhooks are verified against the unmodified body. Store their signed event IDs before applying suppression or delivery state so replay is harmless.

### Proposals and page activity

- Require a microbiome, metallomics, or combined primary anchor, plus a DOI/PMID, mechanism, causal limits, and conflict disclosure.
- Only accepted proposals are publicly attributed. Acceptance creates an editorial packet with a `proposal:` identifier. Add the upstream commit only after publication succeeds through the normal corpus pipeline.
- Public activity combines accepted author context/proposals, public discussion and revisions, and exact upstream Git commit links. Do not leak pending, declined, or withdrawn proposals.

### Notifications and messaging

- In-app notifications are authoritative for replies, mentions, decisions, contact requests, and messages. Research email requires separate verified-email consent; ordinary activity may be delayed for digest batching.
- Configure a scheduled HTTPS job to `POST /api/research-network/notifications/dispatch` with `Authorization: Bearer $WIKIBIOME_NOTIFICATION_DISPATCH_SECRET` at least hourly. The dispatcher sends only due outbox records; ordinary activity is consolidated into at most 50 items per digest, while direct replies and moderation decisions attempt immediate delivery. Keep this job disabled until Resend and suppression-webhook verification pass in staging.
- New contact requests are disabled until the researcher opts in. A pending request contains only a subject. Message bodies are accepted only after the recipient explicitly accepts.
- Messages accept no attachments and are not end-to-end encrypted. Only participants may read or report them. Moderators may inspect reported material needed for a decision. Blocking disables the relationship in both directions.

### Recognition and Roundtable

- Recalculate levels one through three only after an author review, work submission, or proposal becomes accepted. Deduplicate by contribution type and record. Claims alone, posts, reactions, pending work, rejected work, and payments never count.
- Levels four and five require a moderator with a written quality/conduct reason. Five-star recognition corresponds to human-reviewed Topic Steward status. Revocations remain in the immutable audit trail and need an appeal-visible reason.
- The research-event record is an interest registry, not registration. Researchers select conferences, workshops, or Microbiome Roundtables; early-invitation consideration and event email are separate, withdrawable consents. The shortlist is private and limited to active four- or five-star researchers with active interest and explicit early-invitation consent; organizers still make every invitation decision.

## Controlled release sequence

1. Release the migration plus honest verification status and global ORCID account control. Keep outreach and uploads disabled.
2. Verify source search, stale/manual ORCID sync, confirmation boundaries, proposals, activity, follows, and notifications with test accounts.
3. After privacy and moderation approval, enable the messaging preference surface, Roundtable registry, and recognition review tools. No external feature flag is required, but the accepted release and policy sign-off are required.
4. Resend/DNS activation, scanner/R2 activation, and counsel-approved cold outreach are independent gates. Failure of one must not delay or silently activate another.

## Expansion thresholds

Do not expand beyond the pilot unless at least 10% of delivered notices lead to verified claims, 25% of claimers make a second substantive contribution, moderation remains below a seven-day SLA, and no systemic impersonation, copyright, or deliverability problem appears.

## Rollback

- Leave `WIKIBIOME_MANUSCRIPT_UPLOADS_ENABLED` and `WIKIBIOME_OUTREACH_ENABLED` unset to disable the two externally sensitive workflows without removing public researcher pages.
- Revoke ORCID or Resend secrets to stop those integrations; existing public evidence pages fail open without the dynamic overlay.
- Roll back the application release and D1 binding together. Do not delete the new D1 tables or the private R2 quarantine bucket during rollback; they preserve claims, consent, suppression, audit, and manuscript evidence needed for incident review.
- To pause Research Network v2 without data loss, restore the prior application version while retaining `0006` and later tables. Do not down-migrate or delete messages, proposals, consent, notification, recognition, or webhook-ledger records during an incident.
- If email behaves incorrectly, remove the Resend key or sender value; verification UI will report that no message was sent. If ORCID public-record sync fails, keep login active and allow cached/manual WikiBiome source search.
- If messaging misuse becomes systemic, set researcher `messaging_enabled` values false through an audited administrator procedure and restore service only after review. Do not expose or export message bodies as part of routine rollback.
