CREATE TABLE `account_identities` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_subject` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_account_identities_provider_subject` ON `account_identities` (`provider`,`provider_subject`);--> statement-breakpoint
CREATE INDEX `idx_account_identities_account` ON `account_identities` (`account_id`);--> statement-breakpoint
CREATE TABLE `account_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_account_sessions_account` ON `account_sessions` (`account_id`);--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`role` text DEFAULT 'researcher' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_account_id` text,
	`action` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_events_target` ON `audit_events` (`target_type`,`target_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `author_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`claim_id` text NOT NULL,
	`source_id` text NOT NULL,
	`account_id` text NOT NULL,
	`accuracy` text NOT NULL,
	`context_text` text NOT NULL,
	`source_url` text,
	`conflict_disclosure` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`moderator_note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_author_reviews_source_status` ON `author_reviews` (`source_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_author_reviews_account` ON `author_reviews` (`account_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `discussion_post_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`revision` integer NOT NULL,
	`body` text NOT NULL,
	`source_url` text,
	`conflict_disclosure` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_post_revisions_post_revision` ON `discussion_post_revisions` (`post_id`,`revision`);--> statement-breakpoint
CREATE TABLE `discussion_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`parent_post_id` text,
	`account_id` text NOT NULL,
	`body` text NOT NULL,
	`source_url` text,
	`conflict_disclosure` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_discussion_posts_thread_status` ON `discussion_posts` (`thread_id`,`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_discussion_posts_account` ON `discussion_posts` (`account_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `discussion_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`account_id` text NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_discussion_reports_post_account` ON `discussion_reports` (`post_id`,`account_id`);--> statement-breakpoint
CREATE INDEX `idx_discussion_reports_status` ON `discussion_reports` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `discussion_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`created_by_account_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_discussion_threads_target_status` ON `discussion_threads` (`target_type`,`target_id`,`status`,`updated_at`);--> statement-breakpoint
CREATE INDEX `idx_discussion_threads_creator` ON `discussion_threads` (`created_by_account_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `email_verification_tokens` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` text NOT NULL,
	`used_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_email_verification_account` ON `email_verification_tokens` (`account_id`);--> statement-breakpoint
CREATE TABLE `institution_batches` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text NOT NULL,
	`submitted_by_account_id` text NOT NULL,
	`format` text NOT NULL,
	`status` text DEFAULT 'pending_review' NOT NULL,
	`record_count` integer DEFAULT 0 NOT NULL,
	`identifiers_json` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_institution_batches_institution` ON `institution_batches` (`institution_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `institution_memberships` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text NOT NULL,
	`account_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`domain_verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_institution_memberships_institution_account` ON `institution_memberships` (`institution_id`,`account_id`);--> statement-breakpoint
CREATE INDEX `idx_institution_memberships_account` ON `institution_memberships` (`account_id`,`status`);--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`ror` text NOT NULL,
	`name` text NOT NULL,
	`country` text,
	`domains_json` text DEFAULT '[]' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_institutions_ror` ON `institutions` (`ror`);--> statement-breakpoint
CREATE TABLE `notification_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`email` text NOT NULL,
	`kind` text NOT NULL,
	`payload_json` text DEFAULT '{}' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`provider_id` text,
	`attempts` integer DEFAULT 0 NOT NULL,
	`scheduled_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_error` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_notification_outbox_status_schedule` ON `notification_outbox` (`status`,`scheduled_at`);--> statement-breakpoint
CREATE INDEX `idx_notification_outbox_email_kind` ON `notification_outbox` (`email`,`kind`);--> statement-breakpoint
CREATE TABLE `oauth_states` (
	`state_hash` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`return_to` text DEFAULT '/researcher/dashboard' NOT NULL,
	`source_id` text,
	`link_account_id` text,
	`chatgpt_user_id` text,
	`chatgpt_email` text,
	`chatgpt_name` text,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `outreach_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`source_id` text NOT NULL,
	`provenance` text NOT NULL,
	`jurisdiction_rule` text NOT NULL,
	`purpose` text DEFAULT 'citation_notice' NOT NULL,
	`status` text DEFAULT 'approved' NOT NULL,
	`last_sent_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_outreach_contacts_email_source` ON `outreach_contacts` (`email`,`source_id`);--> statement-breakpoint
CREATE TABLE `rate_limit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`action` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rate_limit_account_action` ON `rate_limit_events` (`account_id`,`action`,`created_at`);--> statement-breakpoint
CREATE TABLE `researcher_emails` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`email` text NOT NULL,
	`verified_at` text,
	`research_notifications` integer DEFAULT false NOT NULL,
	`community_digest` integer DEFAULT false NOT NULL,
	`fundraising` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_researcher_emails_email` ON `researcher_emails` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_researcher_emails_account` ON `researcher_emails` (`account_id`);--> statement-breakpoint
CREATE TABLE `researcher_profiles` (
	`account_id` text PRIMARY KEY NOT NULL,
	`orcid` text NOT NULL,
	`name` text NOT NULL,
	`biography` text DEFAULT '' NOT NULL,
	`affiliations_json` text DEFAULT '[]' NOT NULL,
	`expertise_self_json` text DEFAULT '[]' NOT NULL,
	`expertise_inferred_json` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_researcher_profiles_orcid` ON `researcher_profiles` (`orcid`);--> statement-breakpoint
CREATE TABLE `source_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`source_doi` text,
	`account_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`verification_method` text DEFAULT 'manual_review' NOT NULL,
	`evidence_note` text DEFAULT '' NOT NULL,
	`reviewer_note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_source_claims_source_account` ON `source_claims` (`source_id`,`account_id`);--> statement-breakpoint
CREATE INDEX `idx_source_claims_account_status` ON `source_claims` (`account_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_source_claims_source_status` ON `source_claims` (`source_id`,`status`);--> statement-breakpoint
CREATE TABLE `submission_files` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`r2_key` text NOT NULL,
	`filename` text NOT NULL,
	`byte_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`scan_status` text DEFAULT 'quarantined' NOT NULL,
	`extraction_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_submission_files_submission` ON `submission_files` (`submission_id`);--> statement-breakpoint
CREATE TABLE `suppression_list` (
	`email` text PRIMARY KEY NOT NULL,
	`reason` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `work_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`identifier_type` text NOT NULL,
	`identifier_value` text NOT NULL,
	`title` text NOT NULL,
	`authors_json` text DEFAULT '[]' NOT NULL,
	`year` integer,
	`abstract_text` text DEFAULT '' NOT NULL,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`status` text DEFAULT 'pending_review' NOT NULL,
	`rights_attested` integer DEFAULT false NOT NULL,
	`license` text,
	`editorial_note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_work_submissions_identifier` ON `work_submissions` (`identifier_type`,`identifier_value`);--> statement-breakpoint
CREATE INDEX `idx_work_submissions_account` ON `work_submissions` (`account_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_work_submissions_status` ON `work_submissions` (`status`,`created_at`);--> statement-breakpoint
ALTER TABLE `contributions` ADD `account_id` text;--> statement-breakpoint
CREATE INDEX `idx_contributions_account` ON `contributions` (`account_id`,`created_at`);