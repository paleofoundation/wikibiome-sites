import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { discussionPublishingDecision, institutionEmailMatchesAuthoritativeDomains } from "../lib/research-trust-policy.mjs";
import { appendOrcidStatus, getOrcidAuthMessage } from "../lib/orcid-auth.mjs";
import {
  classifyWorkMatch,
  deliveryCopy,
  maskEmail,
  participantKey,
  recognitionMilestones,
  validateProposalInput,
} from "../lib/research-network-v2-policy.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));

function filesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

function source(path) {
  return readFileSync(join(root, path), "utf8");
}

test("applies every researcher-network migration to a clean SQLite database", () => {
  const working = mkdtempSync(join(tmpdir(), "wikibiome-research-db-"));
  const database = join(working, "research-network.sqlite");
  try {
    const migrations = readdirSync(join(root, "drizzle")).filter((name) => /^\d{4}_.+\.sql$/.test(name)).sort();
    assert.deepEqual(migrations, [
      "0000_fluffy_silver_sable.sql",
      "0001_many_zaran.sql",
      "0002_brave_zaladane.sql",
      "0003_lowly_ben_urich.sql",
      "0004_fearless_ozymandias.sql",
      "0005_eminent_skrulls.sql",
      "0006_naive_justin_hammer.sql",
      "0007_military_thanos.sql",
      "0008_tense_luminals.sql",
      "0009_massive_the_hood.sql",
      "0010_tiresome_nico_minoru.sql",
      "0011_far_freak.sql",
      "0012_sad_rage.sql",
    ]);
    for (const migration of migrations) {
      const result = spawnSync("/usr/bin/sqlite3", [database], { input: source(`drizzle/${migration}`), encoding: "utf8" });
      assert.equal(result.status, 0, `${migration} failed: ${result.stderr}`);
    }
    const schema = spawnSync("/usr/bin/sqlite3", [database, "SELECT type || ':' || name FROM sqlite_master ORDER BY type, name;"], { encoding: "utf8" });
    assert.equal(schema.status, 0, schema.stderr);
    for (const name of [
      "accounts", "account_identities", "researcher_emails", "source_claims", "author_reviews",
      "work_submissions", "submission_files", "editorial_change_packets", "discussion_threads",
      "discussion_posts", "discussion_post_revisions", "discussion_reports", "institutions",
      "institution_memberships", "institution_batches", "notification_outbox", "suppression_list",
      "outreach_contacts", "audit_events", "rate_limit_events",
      "orcid_sync_state", "researcher_works", "work_match_suggestions", "researcher_follows",
      "researcher_notifications", "content_proposals", "proposal_sources", "proposal_events",
      "message_threads", "researcher_messages", "message_reports", "roundtable_interests",
      "recognition_events", "email_webhook_events", "paper_intakes", "paper_reviewers", "paper_events", "paper_publications",
    ]) assert.match(schema.stdout, new RegExp(`table:${name}\\b`));
    for (const index of [
      "idx_source_claims_source_status", "idx_work_submissions_status", "idx_discussion_threads_target_status",
      "idx_notification_outbox_status_schedule", "idx_audit_events_target",
      "idx_work_matches_account_status", "idx_researcher_follows_target",
      "idx_researcher_notifications_account_created", "idx_content_proposals_target_status",
      "idx_message_threads_participant_key", "idx_roundtable_interests_status",
      "idx_recognition_events_account_status", "idx_email_webhook_events_provider",
    ]) assert.match(schema.stdout, new RegExp(`index:${index}\\b`));
    const eventColumns = spawnSync("/usr/bin/sqlite3", [database, "SELECT name FROM pragma_table_info('roundtable_interests') ORDER BY cid;"], { encoding: "utf8" });
    assert.equal(eventColumns.status, 0, eventColumns.stderr);
    assert.match(eventColumns.stdout, /event_types_json/);
    assert.match(eventColumns.stdout, /early_invite_consent/);
    assert.match(eventColumns.stdout, /early_invite_consented_at/);
    const profileColumns = spawnSync("/usr/bin/sqlite3", [database, "SELECT name FROM pragma_table_info('researcher_profiles') ORDER BY cid;"], { encoding: "utf8" });
    assert.match(profileColumns.stdout, /associations_json/);
    assert.match(profileColumns.stdout, /photo_r2_key/);
    assert.match(profileColumns.stdout, /photo_alt/);
    const institutionColumns = spawnSync("/usr/bin/sqlite3", [database, "SELECT name FROM pragma_table_info('institutions') ORDER BY cid;"], { encoding: "utf8" });
    assert.match(institutionColumns.stdout, /identity_status/);
    assert.match(institutionColumns.stdout, /website_url/);
  } finally {
    rmSync(working, { recursive: true, force: true });
  }
});

test("keeps researcher-network mutations fail-closed", () => {
  const routes = filesBelow(join(root, "app/api")).filter((path) => path.endsWith("route.ts"));
  const mutations = routes.filter((path) => /export async function (?:POST|PUT|PATCH|DELETE)\b/.test(readFileSync(path, "utf8")));
  const unprotected = mutations.filter((path) => {
    const body = readFileSync(path, "utf8");
    return !/assertSameOriginRequest|verifyResendWebhook|verifyUnsubscribeToken|WIKIBIOME_SCAN_WEBHOOK_SECRET|bridgeAuthorized/.test(body);
  });
  assert.deepEqual(unprotected, []);

  const network = source("lib/research-network.ts");
  const upload = source("app/api/work-submissions/[id]/manuscript/route.ts");
  assert.match(network, /WIKIBIOME_MANUSCRIPT_UPLOADS_ENABLED === "1"/);
  assert.match(network, /WIKIBIOME_OUTREACH_ENABLED === "1"/);
  assert.match(network, /configuredModerators\.includes\(input\.chatgptUserId\)/);
  assert.match(upload, /getResearchNetworkCapabilities\(\)\)\.manuscriptUploads/);
  assert.match(upload, /\/\(\?:Encrypt\|JavaScript\|JS\|Launch\|EmbeddedFile\|RichMedia\|OpenAction\|AcroForm\|XFA\)/);
});

test("pending or rejected posts cannot unlock direct discussion publishing", () => {
  assert.deepEqual(discussionPublishingDecision("researcher", ["pending", "pending", "pending", "rejected"]), { status: "pending", promoteTo: null });
  assert.deepEqual(discussionPublishingDecision("researcher", ["published", "pending", "rejected"]), { status: "pending", promoteTo: null });
  assert.deepEqual(discussionPublishingDecision("researcher", ["published", "published", "published"]), { status: "published", promoteTo: "trusted_contributor" });
  assert.deepEqual(discussionPublishingDecision("trusted_contributor", []), { status: "published", promoteTo: null });
  const network = source("lib/research-network.ts");
  assert.match(network, /eq\(discussionPosts\.status, "published"\)/);
  assert.match(network, /"trust\.promoted"/);
});

test("ORCID failures remain visible and preserve return URLs with fragments", () => {
  assert.equal(
    appendOrcidStatus("/article/example?view=full#discussion", "not_configured"),
    "/article/example?view=full&orcid=not_configured#discussion",
  );
  assert.equal(appendOrcidStatus("https://attacker.example", "token_error"), "/researcher/dashboard?orcid=token_error");
  assert.match(getOrcidAuthMessage("not_configured").title, /not active/i);
  assert.equal(getOrcidAuthMessage("unknown"), null);

  const start = source("app/api/auth/orcid/start/route.ts");
  const callback = source("app/api/auth/orcid/callback/route.ts");
  const layout = source("app/layout.tsx");
  const feedback = source("app/_components/OrcidAuthFeedback.tsx");
  assert.match(start, /!runtime\.ORCID_CLIENT_ID \|\| !runtime\.ORCID_CLIENT_SECRET/);
  assert.match(start, /appendOrcidStatus\(returnTo, "not_configured"\)/);
  assert.doesNotMatch(callback, /state\.returnTo\.includes\("\?"\)/);
  assert.match(layout, /<OrcidAuthFeedback \/>/);
  assert.match(feedback, /role=\{orcidStatus === "cancelled" \|\| emailStatus === "verified" \? "status" : "alert"\}/);
});

test("institution access uses authoritative ROR domains or a reviewed provisional identity", () => {
  const authoritativeDomains = ["research.example.edu"];
  assert.equal(institutionEmailMatchesAuthoritativeDomains("author@spoofed.example", authoritativeDomains), false);
  assert.equal(institutionEmailMatchesAuthoritativeDomains("author@research.example.edu", authoritativeDomains), true);
  assert.equal(institutionEmailMatchesAuthoritativeDomains("author@lab.research.example.edu", authoritativeDomains), true);
  const network = source("lib/research-network.ts");
  const route = source("app/api/institutions/route.ts");
  assert.match(network, /requestedRor \? "ror_api" : "website_and_manual_review"/);
  assert.match(network, /lookupRorOrganization\(requestedRor\)/);
  assert.match(network, /identityStatus: "provisional"/);
  assert.match(network, /websiteMatchesAuthoritativeDomains/);
  assert.match(network, /identityStatus: "ror_verified"/);
  assert.match(network, /Add the organization’s public website while ROR is pending/);
  assert.match(network, /Record the public evidence used for manual relationship verification/);
  assert.match(route, /name: payload\.name/);
  assert.doesNotMatch(route, /payload\.(?:domains|country)/);
});

test("preserves privacy, consent, editorial, and outreach boundaries", () => {
  const schema = source("db/schema.ts");
  const network = source("lib/research-network.ts");
  const email = source("lib/research-email.ts");
  const accountForm = source("app/_components/ResearcherAccountForm.tsx");
  const privacy = source("app/privacy/page.tsx");
  const terms = source("app/terms/page.tsx");
  const manifest = JSON.parse(source(".openai/hosting.json"));

  assert.deepEqual({ d1: manifest.d1, r2: manifest.r2 }, { d1: "DB", r2: "MANUSCRIPTS" });
  assert.match(schema, /discussionPostRevisions/);
  assert.match(schema, /suppressionList/);
  assert.match(schema, /auditEvents/);
  assert.match(network, /editorialChangePackets/);
  assert.match(network, /Number\(value\) >= 100/);
  assert.match(network, /researchNotifications: input\.researchNotifications === true/);
  assert.match(network, /communityDigest: input\.communityDigest === true/);
  assert.match(network, /fundraising: typeof input\.fundraising === "boolean"/);
  assert.match(accountForm, /Research activity/);
  assert.match(accountForm, /Community digest/);
  assert.doesNotMatch(accountForm, /name="fundraising"|Microbiome Medicine support/);
  assert.match(accountForm, /Microbiome Roundtable/);
  assert.match(accountForm, /Historical fundraising consent is preserved but is not requested/);
  assert.match(privacy, /contact email[\s\S]{0,120}stored privately and is never displayed/i);
  assert.match(terms, /editorial control/i);

  const citationTemplate = email.slice(email.indexOf('if (kind === "citation_notice")'), email.indexOf("throw new Error", email.indexOf('if (kind === "citation_notice")')));
  assert.match(citationTemplate, /one-time factual citation notice/i);
  assert.doesNotMatch(citationTemplate, /support the work|buy.{0,20}coffee|donat(?:e|ion)|microbiome medicine updates/i);
});

test("keeps private researcher surfaces out of indexes and public participation accessible", () => {
  const dashboard = source("app/researcher/dashboard/page.tsx");
  const moderation = source("app/researcher/moderation/page.tsx");
  const discussion = source("app/_components/DiscussionBoard.tsx");
  const accountForm = source("app/_components/ResearcherAccountForm.tsx");
  const submissionForm = source("app/_components/WorkSubmissionForm.tsx");
  const researcherProfile = source("app/researchers/[orcid]/page.tsx");
  const institutionProfile = source("app/institutions/[ror]/page.tsx");
  const privatePages = [
    "app/researcher/works/page.tsx",
    "app/researcher/notifications/page.tsx",
    "app/researcher/messages/page.tsx",
    "app/researcher/proposals/page.tsx",
  ].map(source);
  const accountControl = source("app/_components/ResearcherAccountControl.tsx");
  const accountRoute = source("app/api/account/route.ts");
  const header = source("app/_components/WikiArticle.tsx");
  const home = source("app/_components/WikiHome.tsx");
  const styles = source("app/globals.css");

  assert.match(dashboard, /robots: \{ index: false, follow: false \}/);
  assert.match(moderation, /robots: \{ index: false, follow: false \}/);
  assert.match(discussion, /role="status"/);
  assert.match(accountForm, /role="status"/);
  assert.match(submissionForm, /role="status"/);
  assert.match(accountForm, /<label>/);
  assert.match(submissionForm, /<label>/);
  assert.match(researcherProfile, /"@type": "Person"/);
  assert.match(institutionProfile, /"@type": "Organization"/);
  for (const page of privatePages) assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.match(header, /<ResearcherAccountControl \/>/);
  assert.match(home, /<ResearcherAccountControl \/>/);
  assert.match(accountControl, /Log in with ORCID/);
  assert.match(accountRoute, /status: 204/);
  assert.match(accountControl, /window\.location\.pathname/);
  assert.match(accountControl, /encodeURIComponent\(returnTo\)/);
  assert.match(accountControl, /Dashboard/);
  assert.match(styles, /@media \(max-width:1560px\)[\s\S]*\.header-actions \.utility-nav a:nth-child\(-n\+2\)/);
  assert.match(styles, /@media \(max-width:620px\)[\s\S]*\.orcid-account-login/);
});

test("discovers ORCID works without publishing an unconfirmed match", () => {
  assert.deepEqual(
    classifyWorkMatch({ doi: "https://doi.org/10.1000/ABC", title: "Different" }, { doi: "doi:10.1000/abc", title: "Paper" }),
    { matchType: "exact_doi", confidence: 100 },
  );
  assert.deepEqual(
    classifyWorkMatch({ title: "Metals and the gut microbiome", year: 2024, authorName: "Ada Lovelace" }, { title: "Metals and the gut microbiome.", year: 2024, authors: ["Lovelace A", "Turing A"] }),
    { matchType: "possible_title_author_year", confidence: 85 },
  );
  assert.equal(classifyWorkMatch({ title: "Metals and the gut microbiome", year: 2024, authorName: "Grace Hopper" }, { title: "Metals and the gut microbiome", year: 2024, authors: ["Lovelace A"] }), null);
  assert.equal(classifyWorkMatch({ title: "Metals and the gut microbiome", year: 2023, authorName: "Ada Lovelace" }, { title: "Metals and the gut microbiome", year: 2024, authors: ["Lovelace A"] }), null);
  const service = source("lib/research-network-v2.ts");
  assert.match(service, /match\.matchType === "exact_doi"/);
  assert.match(service, /claimStatus = exact \? "verified" : "pending"/);
  assert.match(service, /status: "confirmed"/);
  assert.match(service, /const removed = existing\.filter/);
  assert.match(service, /Manual refresh is available once per day/);
  const worksRoute = source("app/api/researcher/works/route.ts");
  const searchRoute = source("app/api/sources/search/route.ts");
  assert.match(worksRoute, /syncResearcherWorks\(account, "automatic"\)/);
  assert.match(worksRoute, /cache-control": "private, no-store"/);
  assert.match(searchRoute, /lookupResearchMetadata\(\{ type: "pmid"/);
  assert.match(searchRoute, /Preserve local corpus search when PubMed is unavailable/);
});

test("requires a microbiome or metallomics anchor and supporting evidence for proposals", () => {
  const valid = {
    proposalType: "new_page",
    primaryAnchor: "both",
    title: "A metal–microbiome bridge",
    rationale: "Connect the evidence.",
    proposedContent: "Outline",
    mechanismConnection: "Mechanism",
    causalLimitations: "Observational only",
    sources: [{ identifierType: "doi", identifierValue: "10.1000/example" }],
  };
  assert.equal(validateProposalInput(valid).primaryAnchor, "both");
  assert.throws(() => validateProposalInput({ ...valid, primaryAnchor: "genomics" }), /microbiome, metallomics, or both/);
  assert.throws(() => validateProposalInput({ ...valid, sources: [] }), /DOI or PMID/);
  const service = source("lib/research-network-v2.ts");
  const suggestionRoute = source("app/article/[id]/suggest/page.tsx");
  assert.match(service, /submissionId: `proposal:\$\{id\}`/);
  assert.match(service, /eq\(contentProposals\.status, "accepted"\)/);
  assert.match(service, /Published in/);
  assert.doesNotMatch(service, /update\([^)]*wiki|insert\([^)]*wiki/i);
  assert.match(suggestionRoute, /redirect\(`\/propose\?target=/);
  assert.doesNotMatch(suggestionRoute, /requireChatGPTUser|ContributionForm/);
  assert.match(source("lib/research-network.ts"), /db\.update\(contributions\)\.set\(\{ accountId \}\)/);
});

test("enforces mutual-consent messaging and private report review", () => {
  assert.equal(participantKey("account-b", "account-a"), "account-a:account-b");
  const schema = source("db/schema.ts");
  const service = source("lib/research-network-v2.ts");
  const messages = source("app/_components/MessageCenter.tsx");
  const discussions = source("lib/research-network.ts");
  const migration = source("drizzle/0007_military_thanos.sql");
  assert.match(schema, /messagingEnabled:[\s\S]{0,100}default\(false\)/);
  assert.match(service, /thread\.status !== "accepted"/);
  assert.match(service, /Both researchers must accept contact/);
  assert.match(service, /messagingBlocked/);
  assert.match(service, /Number\(value\) >= 30/);
  assert.match(service, /You cannot report a message outside your conversations/);
  assert.match(discussions, /thread\.status !== "published"/);
  assert.match(discussions, /thread\.category !== "question" && !sourceUrl/);
  assert.match(migration, /SELECT[\s\S]*, 0, "created_at"/);
  assert.match(messages, /not end-to-end encrypted/);
  assert.doesNotMatch(messages, /type="file"/);
});

test("recognition counts accepted quality only and remains human-gated above three stars", () => {
  const contributions = [
    { accepted: true, type: "proposal", id: "p1", recordId: "a" },
    { accepted: false, type: "proposal", id: "p2", recordId: "b" },
    { accepted: true, type: "proposal", id: "p1", recordId: "a" },
  ];
  assert.deepEqual(recognitionMilestones(contributions), [1]);
  assert.deepEqual(recognitionMilestones([
    { accepted: true, type: "proposal", id: "p1", recordId: "a" },
    { accepted: true, type: "proposal", id: "p2", recordId: "b" },
    { accepted: true, type: "author_context", id: "r1", recordId: "b" },
    { accepted: true, type: "work_submission", id: "w1", recordId: "c" },
    { accepted: true, type: "proposal", id: "p3", recordId: "d" },
  ]), [1, 2, 3]);
  const service = source("lib/research-network-v2.ts");
  assert.match(service, /eq\(authorReviews\.status, "accepted"\)/);
  assert.match(service, /db.select\(\).from\(paperPublications\)/);
  assert.match(service, /proposals.filter\(item => Boolean\(item.publishedCommit\)\)/);
  assert.match(service, /eq\(contentProposals\.status, "accepted"\)/);
  assert.match(service, /const unearned = \[1, 2, 3\]/);
  assert.match(service, /if \(!isModeratorRole\(account\.role\)\)/);
  assert.match(service, /\[4, 5\]\.includes\(level\)/);
  assert.match(service, /eq\(recognitionEvents\.level, level - 1\)/);
  assert.match(service, /Active \$\{level - 1\}-star recognition is required first/);
  assert.doesNotMatch(service, /payment|supporter/i);
});

test("keeps researcher-event consent separate and early invitations human-controlled", () => {
  const schema = source("db/schema.ts");
  const form = source("app/_components/RoundtableInterestForm.tsx");
  const page = source("app/roundtable/page.tsx");
  const service = source("lib/research-network-v2.ts");
  assert.match(schema, /updatesConsent:[\s\S]{0,100}default\(false\)/);
  assert.match(schema, /earlyInviteConsent:[\s\S]{0,100}default\(false\)/);
  assert.match(schema, /eventTypesJson:[\s\S]{0,100}roundtable/);
  assert.match(form, /name="updatesConsent"/);
  assert.match(form, /name="earlyInviteConsent"/);
  assert.match(form, /name="eventTypes"/);
  assert.match(form, /conferences and symposia/i);
  assert.match(form, /separate from research alerts, community digests, and historical fundraising consent/);
  assert.match(page, /interest and early-invitation registry.not registration for a scheduled event/i);
  assert.match(service, /status: "withdrawn", updatesConsent: false, earlyInviteConsent: false/);
  assert.match(service, /item\.earlyInviteConsent/);
  assert.match(service, /highest\.get\(item\.accountId\)[^\n]*>= 4/);
  assert.match(source("app/research-governance/page.tsx"), /organizers assess subject fit, quality, conflicts, conduct, and interdisciplinary representation/i);
});

test("automatically imports public ORCID works on the researcher dashboard", () => {
  const dashboard = source("app/researcher/dashboard/page.tsx");
  const importPanel = source("app/_components/DashboardOrcidWorks.tsx");
  assert.match(dashboard, /<DashboardOrcidWorks\s*\/>/);
  assert.match(importPanel, /fetch\("\/api\/researcher\/works"/);
  assert.match(importPanel, /Importing your public ORCID works/);
  assert.match(importPanel, /does not make an authorship claim public/);
});

test("offers moderated DOI intake for unmatched ORCID works without auto-publishing", () => {
  const service = source("lib/research-network-v2.ts");
  const route = source("app/api/researcher/orcid-works/[id]/submit/route.ts");
  const discovery = source("app/_components/WorkDiscovery.tsx");
  assert.match(service, /lookupResearchMetadata\(\{ type: "doi", value: doi \}\)/);
  assert.match(service, /createWorkSubmission\(/);
  assert.match(service, /importedFromOrcid: true/);
  assert.doesNotMatch(service.slice(service.indexOf("export async function submitSyncedOrcidWork"), service.indexOf("export async function confirmWorkMatch")), /editorialChangePackets|sourceClaims/);
  assert.match(route, /assertSameOriginRequest/);
  assert.match(discovery, /Send to editorial intake/);
  assert.match(discovery, /reviewer checks it before any source or article page becomes public/);
});

test("keeps research impact distinct from contribution recognition and avoids popularity mechanics", () => {
  const profile = source("app/researchers/[orcid]/page.tsx");
  const directory = source("app/researchers/page.tsx");
  const discovery = source("lib/researcher-discovery.ts");
  assert.match(profile, /These are evidence relationships, not popularity scores/);
  assert.match(profile, /<ContributionRecognition recognition=\{recognition\}/);
  assert.match(source("app/_components/ContributionRecognition.tsx"), /ORCID imports, authorship verification, and Keystone works are counted separately/);
  assert.match(directory, /not from popularity/);
  assert.match(discovery, /keystoneWorks/);
  assert.match(discovery, /linkedArticles/);
  assert.match(discovery, /heavy-metals-microbial-metallomics/);
});

test("publishes only validated researcher portrait formats through a dedicated public route", () => {
  const upload = source("app/api/researcher/profile-photo/route.ts");
  const publicPhoto = source("app/researchers/[orcid]/photo/route.ts");
  const form = source("app/_components/ResearcherPhotoForm.tsx");
  assert.match(upload, /5 \* 1024 \* 1024/);
  assert.match(upload, /matchesImageSignature/);
  assert.match(upload, /profile-images\/\$\{account\.accountId\}/);
  assert.doesNotMatch(upload, /image\/svg/);
  assert.match(publicPhoto, /x-content-type-options/);
  assert.match(form, /Used by screen readers/);
});
test("records delivery truth, webhook replay protection, and one-click unsubscribe", () => {
  assert.equal(maskEmail("researcher@example.edu"), "re••••••••@example.edu");
  assert.match(deliveryCopy({ sent: false, reason: "email_not_configured" }, "re•••@example.edu"), /No message was sent/i);
  assert.doesNotMatch(deliveryCopy({ sent: false, reason: "provider_error" }, "re•••@example.edu"), /check your inbox/i);
  const email = source("lib/research-email.ts");
  const webhook = source("app/api/webhooks/resend/route.ts");
  const unsubscribe = source("app/api/email/unsubscribe/route.ts");
  const migration = source("drizzle/0007_military_thanos.sql");
  assert.match(webhook, /const rawBody = await request\.text\(\)/);
  assert.match(webhook, /verifyResendWebhook\(request, rawBody\)/);
  assert.match(email, /onConflictDoNothing\(\)\.returning/);
  assert.match(migration, /CREATE UNIQUE INDEX `idx_email_webhook_events_provider`/);
  assert.match(email, /List-Unsubscribe-Post/);
  assert.match(unsubscribe, /export async function POST/);
  assert.match(source("lib/research-network.ts"), /isNull\(emailVerificationTokens\.usedAt\)/);
  assert.match(source("app/_components/OrcidAuthFeedback.tsx"), /Verification link expired/);
});

test("deduplicates notifications and separates direct replies from ordinary digests", () => {
  const service = source("lib/research-network-v2.ts");
  const email = source("lib/research-email.ts");
  const dispatcher = source("app/api/research-network/notifications/dispatch/route.ts");
  assert.match(service, /onConflictDoNothing\(\)\.returning\(\{ id: researcherNotifications\.id \}\)/);
  assert.match(service, /immediateRecipients\.has\(accountId\) \? "immediate" : "digest"/);
  assert.match(service, /research_activity_digest/);
  assert.match(service, /lt\(researcherNotifications\.createdAt, before\)/);
  assert.match(service, /eq\(contentProposals\.status, "accepted"\)/);
  assert.match(service, /eq\(discussionPosts\.status, "published"\)/);
  assert.match(email, /lte\(notificationOutbox\.scheduledAt/);
  assert.match(email, /kind === "research_activity_digest"/);
  assert.match(dispatcher, /WIKIBIOME_NOTIFICATION_DISPATCH_SECRET/);
});
