import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const contributions = sqliteTable("contributions", {
  id: text("id").primaryKey(),
  pageId: text("page_id").notNull(),
  pageTitle: text("page_title").notNull(),
  section: text("section").notNull(),
  contributionType: text("contribution_type").notNull(),
  originalText: text("original_text").notNull().default(""),
  proposedText: text("proposed_text").notNull(),
  rationale: text("rationale").notNull(),
  sourceUrl: text("source_url"),
  contributorUserId: text("contributor_user_id").notNull(),
  contributorEmail: text("contributor_email").notNull(),
  contributorName: text("contributor_name").notNull(),
  accountId: text("account_id"),
  status: text("status").notNull().default("pending"),
  moderatorNote: text("moderator_note"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_contributions_page_id").on(table.pageId),
  index("idx_contributions_contributor").on(table.contributorUserId, table.createdAt),
  index("idx_contributions_account").on(table.accountId, table.createdAt),
  index("idx_contributions_status_created").on(table.status, table.createdAt),
]);

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("researcher"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const accountIdentities = sqliteTable("account_identities", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  provider: text("provider").notNull(),
  providerSubject: text("provider_subject").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_account_identities_provider_subject").on(table.provider, table.providerSubject),
  index("idx_account_identities_account").on(table.accountId),
]);

export const researcherProfiles = sqliteTable("researcher_profiles", {
  accountId: text("account_id").primaryKey(),
  orcid: text("orcid").notNull(),
  name: text("name").notNull(),
  biography: text("biography").notNull().default(""),
  affiliationsJson: text("affiliations_json").notNull().default("[]"),
  associationsJson: text("associations_json").notNull().default("[]"),
  expertiseSelfJson: text("expertise_self_json").notNull().default("[]"),
  expertiseInferredJson: text("expertise_inferred_json").notNull().default("[]"),
  photoR2Key: text("photo_r2_key"),
  photoMimeType: text("photo_mime_type"),
  photoAlt: text("photo_alt").notNull().default(""),
  photoUpdatedAt: text("photo_updated_at"),
  messagingEnabled: integer("messaging_enabled", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_researcher_profiles_orcid").on(table.orcid)]);

export const researcherEmails = sqliteTable("researcher_emails", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  email: text("email").notNull(),
  verifiedAt: text("verified_at"),
  researchNotifications: integer("research_notifications", { mode: "boolean" }).notNull().default(false),
  communityDigest: integer("community_digest", { mode: "boolean" }).notNull().default(false),
  fundraising: integer("fundraising", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_researcher_emails_email").on(table.email),
  uniqueIndex("idx_researcher_emails_account").on(table.accountId),
]);

export const accountSessions = sqliteTable("account_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  accountId: text("account_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_account_sessions_account").on(table.accountId)]);

export const oauthStates = sqliteTable("oauth_states", {
  stateHash: text("state_hash").primaryKey(),
  provider: text("provider").notNull(),
  returnTo: text("return_to").notNull().default("/researcher/dashboard"),
  sourceId: text("source_id"),
  linkAccountId: text("link_account_id"),
  chatgptUserId: text("chatgpt_user_id"),
  chatgptEmail: text("chatgpt_email"),
  chatgptName: text("chatgpt_name"),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const emailVerificationTokens = sqliteTable("email_verification_tokens", {
  tokenHash: text("token_hash").primaryKey(),
  accountId: text("account_id").notNull(),
  email: text("email").notNull(),
  expiresAt: text("expires_at").notNull(),
  usedAt: text("used_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_email_verification_account").on(table.accountId)]);

export const sourceClaims = sqliteTable("source_claims", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull(),
  sourceDoi: text("source_doi"),
  accountId: text("account_id").notNull(),
  status: text("status").notNull().default("pending"),
  verificationMethod: text("verification_method").notNull().default("manual_review"),
  evidenceNote: text("evidence_note").notNull().default(""),
  reviewerNote: text("reviewer_note"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_source_claims_source_account").on(table.sourceId, table.accountId),
  index("idx_source_claims_account_status").on(table.accountId, table.status),
  index("idx_source_claims_source_status").on(table.sourceId, table.status),
]);

export const authorReviews = sqliteTable("author_reviews", {
  id: text("id").primaryKey(),
  claimId: text("claim_id").notNull(),
  sourceId: text("source_id").notNull(),
  accountId: text("account_id").notNull(),
  accuracy: text("accuracy").notNull(),
  context: text("context_text").notNull(),
  sourceUrl: text("source_url"),
  conflictDisclosure: text("conflict_disclosure").notNull().default(""),
  status: text("status").notNull().default("pending"),
  moderatorNote: text("moderator_note"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_author_reviews_source_status").on(table.sourceId, table.status),
  index("idx_author_reviews_account").on(table.accountId, table.createdAt),
]);

export const workSubmissions = sqliteTable("work_submissions", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  identifierType: text("identifier_type").notNull(),
  identifierValue: text("identifier_value").notNull(),
  fingerprint: text("fingerprint").notNull(),
  title: text("title").notNull(),
  authorsJson: text("authors_json").notNull().default("[]"),
  year: integer("year"),
  abstractText: text("abstract_text").notNull().default(""),
  metadataJson: text("metadata_json").notNull().default("{}"),
  status: text("status").notNull().default("pending_review"),
  rightsAttested: integer("rights_attested", { mode: "boolean" }).notNull().default(false),
  license: text("license"),
  editorialNote: text("editorial_note"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_work_submissions_identifier").on(table.identifierType, table.identifierValue),
  uniqueIndex("idx_work_submissions_fingerprint").on(table.fingerprint),
  index("idx_work_submissions_account").on(table.accountId, table.createdAt),
  index("idx_work_submissions_status").on(table.status, table.createdAt),
]);

export const submissionFiles = sqliteTable("submission_files", {
  id: text("id").primaryKey(),
  submissionId: text("submission_id").notNull(),
  r2Key: text("r2_key").notNull(),
  filename: text("filename").notNull(),
  byteSize: integer("byte_size").notNull(),
  mimeType: text("mime_type").notNull(),
  scanStatus: text("scan_status").notNull().default("quarantined"),
  extractionStatus: text("extraction_status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_submission_files_submission").on(table.submissionId)]);

export const editorialChangePackets = sqliteTable("editorial_change_packets", {
  id: text("id").primaryKey(),
  submissionId: text("submission_id").notNull(),
  status: text("status").notNull().default("pending_sync"),
  upstreamTarget: text("upstream_target").notNull().default("paleofoundation/wikibiome"),
  payloadJson: text("payload_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_editorial_packets_submission").on(table.submissionId),
  index("idx_editorial_packets_status").on(table.status, table.createdAt),
]);

export const discussionThreads = sqliteTable("discussion_threads", {
  id: text("id").primaryKey(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  createdByAccountId: text("created_by_account_id").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_discussion_threads_target_status").on(table.targetType, table.targetId, table.status, table.updatedAt),
  index("idx_discussion_threads_creator").on(table.createdByAccountId, table.createdAt),
]);

export const discussionPosts = sqliteTable("discussion_posts", {
  id: text("id").primaryKey(),
  threadId: text("thread_id").notNull(),
  parentPostId: text("parent_post_id"),
  accountId: text("account_id").notNull(),
  body: text("body").notNull(),
  sourceUrl: text("source_url"),
  conflictDisclosure: text("conflict_disclosure").notNull().default(""),
  revision: integer("revision").notNull().default(1),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_discussion_posts_thread_status").on(table.threadId, table.status, table.createdAt),
  index("idx_discussion_posts_account").on(table.accountId, table.createdAt),
]);

export const discussionPostRevisions = sqliteTable("discussion_post_revisions", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull(),
  revision: integer("revision").notNull(),
  body: text("body").notNull(),
  sourceUrl: text("source_url"),
  conflictDisclosure: text("conflict_disclosure").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_post_revisions_post_revision").on(table.postId, table.revision)]);

export const discussionReports = sqliteTable("discussion_reports", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull(),
  accountId: text("account_id").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_discussion_reports_post_account").on(table.postId, table.accountId),
  index("idx_discussion_reports_status").on(table.status, table.createdAt),
]);

export const researcherBlocks = sqliteTable("researcher_blocks", {
  id: text("id").primaryKey(),
  blockerAccountId: text("blocker_account_id").notNull(),
  blockedAccountId: text("blocked_account_id").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_researcher_blocks_pair").on(table.blockerAccountId, table.blockedAccountId),
  index("idx_researcher_blocks_blocker").on(table.blockerAccountId, table.createdAt),
]);

export const institutions = sqliteTable("institutions", {
  id: text("id").primaryKey(),
  ror: text("ror").notNull(),
  slug: text("slug"),
  name: text("name").notNull(),
  country: text("country"),
  domainsJson: text("domains_json").notNull().default("[]"),
  websiteUrl: text("website_url"),
  organizationType: text("organization_type").notNull().default("research_institute"),
  identityStatus: text("identity_status").notNull().default("ror_verified"),
  evidenceNote: text("evidence_note").notNull().default(""),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_institutions_ror").on(table.ror),
  uniqueIndex("idx_institutions_slug").on(table.slug),
  index("idx_institutions_status_name").on(table.status, table.name),
]);

export const institutionMemberships = sqliteTable("institution_memberships", {
  id: text("id").primaryKey(),
  institutionId: text("institution_id").notNull(),
  accountId: text("account_id").notNull(),
  role: text("role").notNull().default("member"),
  status: text("status").notNull().default("pending"),
  domainVerified: integer("domain_verified", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_institution_memberships_institution_account").on(table.institutionId, table.accountId),
  index("idx_institution_memberships_account").on(table.accountId, table.status),
]);

export const institutionBatches = sqliteTable("institution_batches", {
  id: text("id").primaryKey(),
  institutionId: text("institution_id").notNull(),
  submittedByAccountId: text("submitted_by_account_id").notNull(),
  format: text("format").notNull(),
  status: text("status").notNull().default("pending_review"),
  recordCount: integer("record_count").notNull().default(0),
  identifiersJson: text("identifiers_json").notNull().default("[]"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_institution_batches_institution").on(table.institutionId, table.createdAt)]);

export const outreachContacts = sqliteTable("outreach_contacts", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  sourceId: text("source_id").notNull(),
  provenance: text("provenance").notNull(),
  jurisdictionRule: text("jurisdiction_rule").notNull(),
  purpose: text("purpose").notNull().default("citation_notice"),
  status: text("status").notNull().default("approved"),
  claimTokenHash: text("claim_token_hash"),
  claimTokenExpiresAt: text("claim_token_expires_at"),
  claimTokenUsedAt: text("claim_token_used_at"),
  lastSentAt: text("last_sent_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_outreach_contacts_email_source").on(table.email, table.sourceId)]);

export const suppressionList = sqliteTable("suppression_list", {
  email: text("email").primaryKey(),
  reason: text("reason").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const notificationOutbox = sqliteTable("notification_outbox", {
  id: text("id").primaryKey(),
  accountId: text("account_id"),
  email: text("email").notNull(),
  kind: text("kind").notNull(),
  payloadJson: text("payload_json").notNull().default("{}"),
  status: text("status").notNull().default("pending"),
  providerId: text("provider_id"),
  attempts: integer("attempts").notNull().default(0),
  scheduledAt: text("scheduled_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  lastError: text("last_error"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_notification_outbox_status_schedule").on(table.status, table.scheduledAt),
  index("idx_notification_outbox_email_kind").on(table.email, table.kind),
]);

export const auditEvents = sqliteTable("audit_events", {
  id: text("id").primaryKey(),
  actorAccountId: text("actor_account_id"),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_audit_events_target").on(table.targetType, table.targetId, table.createdAt)]);

export const rateLimitEvents = sqliteTable("rate_limit_events", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  action: text("action").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_rate_limit_account_action").on(table.accountId, table.action, table.createdAt)]);

export const orcidSyncState = sqliteTable("orcid_sync_state", {
  accountId: text("account_id").primaryKey(),
  status: text("status").notNull().default("idle"),
  publicWorkCount: integer("public_work_count").notNull().default(0),
  lastAttemptAt: text("last_attempt_at"),
  lastSuccessAt: text("last_success_at"),
  nextAllowedAt: text("next_allowed_at"),
  errorCode: text("error_code"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const researcherWorks = sqliteTable("researcher_works", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  workKey: text("work_key").notNull(),
  putCode: text("put_code"),
  doi: text("doi"),
  title: text("title").notNull(),
  authorsJson: text("authors_json").notNull().default("[]"),
  year: integer("year"),
  journal: text("journal"),
  sourceUpdatedAt: text("source_updated_at"),
  syncedAt: text("synced_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_researcher_works_account_key").on(table.accountId, table.workKey),
  index("idx_researcher_works_account_doi").on(table.accountId, table.doi),
]);

export const workMatchSuggestions = sqliteTable("work_match_suggestions", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  researcherWorkId: text("researcher_work_id").notNull(),
  sourceId: text("source_id").notNull(),
  matchType: text("match_type").notNull(),
  confidence: integer("confidence").notNull().default(0),
  status: text("status").notNull().default("suggested"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_work_matches_account_source").on(table.accountId, table.sourceId),
  index("idx_work_matches_account_status").on(table.accountId, table.status, table.updatedAt),
]);

export const researcherFollows = sqliteTable("researcher_follows", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_researcher_follows_account_target").on(table.accountId, table.targetType, table.targetId),
  index("idx_researcher_follows_target").on(table.targetType, table.targetId, table.createdAt),
]);

export const researcherNotifications = sqliteTable("researcher_notifications", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  kind: text("kind").notNull(),
  actorAccountId: text("actor_account_id"),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  href: text("href").notNull(),
  dedupeKey: text("dedupe_key").notNull(),
  readAt: text("read_at"),
  emailedAt: text("emailed_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_researcher_notifications_dedupe").on(table.accountId, table.dedupeKey),
  index("idx_researcher_notifications_account_created").on(table.accountId, table.createdAt),
  index("idx_researcher_notifications_account_read").on(table.accountId, table.readAt, table.createdAt),
]);

export const contentProposals = sqliteTable("content_proposals", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  proposalType: text("proposal_type").notNull(),
  targetId: text("target_id"),
  title: text("title").notNull(),
  primaryAnchor: text("primary_anchor").notNull(),
  secondaryDomainsJson: text("secondary_domains_json").notNull().default("[]"),
  rationale: text("rationale").notNull(),
  proposedContent: text("proposed_content").notNull(),
  mechanismConnection: text("mechanism_connection").notNull(),
  causalLimitations: text("causal_limitations").notNull(),
  conflictDisclosure: text("conflict_disclosure").notNull().default(""),
  status: text("status").notNull().default("pending"),
  moderatorNote: text("moderator_note"),
  publicAt: text("public_at"),
  publishedCommit: text("published_commit"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_content_proposals_account_status").on(table.accountId, table.status, table.createdAt),
  index("idx_content_proposals_target_status").on(table.targetId, table.status, table.updatedAt),
]);

export const proposalSources = sqliteTable("proposal_sources", {
  id: text("id").primaryKey(),
  proposalId: text("proposal_id").notNull(),
  identifierType: text("identifier_type").notNull(),
  identifierValue: text("identifier_value").notNull(),
  position: integer("position").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_proposal_sources_identifier").on(table.proposalId, table.identifierType, table.identifierValue),
  index("idx_proposal_sources_proposal").on(table.proposalId, table.position),
]);

export const proposalEvents = sqliteTable("proposal_events", {
  id: text("id").primaryKey(),
  proposalId: text("proposal_id").notNull(),
  actorAccountId: text("actor_account_id"),
  kind: text("kind").notNull(),
  visibility: text("visibility").notNull().default("private"),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_proposal_events_proposal").on(table.proposalId, table.visibility, table.createdAt)]);

export const messageThreads = sqliteTable("message_threads", {
  id: text("id").primaryKey(),
  participantKey: text("participant_key").notNull(),
  initiatorAccountId: text("initiator_account_id").notNull(),
  recipientAccountId: text("recipient_account_id").notNull(),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("pending"),
  acceptedAt: text("accepted_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_message_threads_participant_key").on(table.participantKey),
  index("idx_message_threads_initiator").on(table.initiatorAccountId, table.status, table.updatedAt),
  index("idx_message_threads_recipient").on(table.recipientAccountId, table.status, table.updatedAt),
]);

export const researcherMessages = sqliteTable("researcher_messages", {
  id: text("id").primaryKey(),
  threadId: text("thread_id").notNull(),
  senderAccountId: text("sender_account_id").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("visible"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_researcher_messages_thread").on(table.threadId, table.createdAt),
  index("idx_researcher_messages_sender").on(table.senderAccountId, table.createdAt),
]);

export const messageReports = sqliteTable("message_reports", {
  id: text("id").primaryKey(),
  messageId: text("message_id").notNull(),
  accountId: text("account_id").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_message_reports_message_account").on(table.messageId, table.accountId),
  index("idx_message_reports_status").on(table.status, table.createdAt),
]);

export const roundtableInterests = sqliteTable("roundtable_interests", {
  accountId: text("account_id").primaryKey(),
  eventTypesJson: text("event_types_json").notNull().default('["roundtable"]'),
  rolesJson: text("roles_json").notNull().default("[]"),
  tracksJson: text("tracks_json").notNull().default("[]"),
  formatPreference: text("format_preference").notNull().default("either"),
  location: text("location").notNull().default(""),
  availability: text("availability").notNull().default(""),
  proposedQuestion: text("proposed_question").notNull().default(""),
  updatesConsent: integer("updates_consent", { mode: "boolean" }).notNull().default(false),
  consentedAt: text("consented_at"),
  earlyInviteConsent: integer("early_invite_consent", { mode: "boolean" }).notNull().default(false),
  earlyInviteConsentedAt: text("early_invite_consented_at"),
  withdrawnAt: text("withdrawn_at"),
  status: text("status").notNull().default("interested"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_roundtable_interests_status").on(table.status, table.updatedAt)]);

export const recognitionEvents = sqliteTable("recognition_events", {
  policyVersion: text("policy_version").notNull().default("legacy_acceptance"),
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  level: integer("level").notNull(),
  kind: text("kind").notNull(),
  sourceType: text("source_type").notNull(),
  sourceId: text("source_id").notNull(),
  reason: text("reason").notNull(),
  awardedByAccountId: text("awarded_by_account_id"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_recognition_events_account_level").on(table.accountId, table.level),
  index("idx_recognition_events_account_status").on(table.accountId, table.status, table.level),
]);

export const emailWebhookEvents = sqliteTable("email_webhook_events", {
  id: text("id").primaryKey(),
  providerId: text("provider_id"),
  eventType: text("event_type").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_email_webhook_events_provider").on(table.providerId, table.eventType)]);

// Paper intake is separate from legacy metadata-only submissions. The canonical
// identity and file digest are unique across users so fan-out cannot multiply credit.
export const paperIntakes = sqliteTable("paper_intakes", {
  id: text("id").primaryKey(), accountId: text("account_id").notNull(),
  identityKey: text("identity_key").notNull(), title: text("title").notNull(),
  topic: text("topic").notNull(), status: text("status").notNull().default("awaiting_file"),
  packetJson: text("packet_json").notNull().default("{}"),
  fileKey: text("file_key"), fileHash: text("file_hash"),
  revision: integer("revision").notNull().default(1),
  reviewerAccountId: text("reviewer_account_id"), editorAccountId: text("editor_account_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, t => [uniqueIndex("idx_paper_identity").on(t.identityKey), uniqueIndex("idx_paper_hash").on(t.fileHash), index("idx_paper_owner").on(t.accountId), index("idx_paper_reviewer").on(t.reviewerAccountId), index("idx_paper_status").on(t.status)]);

export const paperReviewers = sqliteTable("paper_reviewers", {
  accountId: text("account_id").notNull(), topic: text("topic").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  appointedBy: text("appointed_by").notNull(), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, t => [uniqueIndex("idx_paper_reviewer_topic").on(t.accountId, t.topic)]);

export const paperEvents = sqliteTable("paper_events", {
  id: text("id").primaryKey(), intakeId: text("intake_id").notNull(), actorId: text("actor_id"),
  kind: text("kind").notNull(), revision: integer("revision").notNull(),
  detailJson: text("detail_json").notNull().default("{}"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, t => [index("idx_paper_events_intake").on(t.intakeId, t.createdAt)]);

export const paperPublications = sqliteTable("paper_publications", {
  sourceId: text("source_id").primaryKey(), intakeId: text("intake_id").notNull(),
  accountId: text("account_id").notNull(), sourceCommit: text("source_commit").notNull(),
  targetsJson: text("targets_json").notNull(), publishedAt: text("published_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, t => [uniqueIndex("idx_paper_publication_intake").on(t.intakeId), index("idx_paper_publication_account").on(t.accountId)]);
