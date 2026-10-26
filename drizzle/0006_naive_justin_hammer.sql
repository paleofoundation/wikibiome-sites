CREATE TABLE `content_proposals` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`proposal_type` text NOT NULL,
	`target_id` text,
	`title` text NOT NULL,
	`primary_anchor` text NOT NULL,
	`secondary_domains_json` text DEFAULT '[]' NOT NULL,
	`rationale` text NOT NULL,
	`proposed_content` text NOT NULL,
	`mechanism_connection` text NOT NULL,
	`causal_limitations` text NOT NULL,
	`conflict_disclosure` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`moderator_note` text,
	`public_at` text,
	`published_commit` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_content_proposals_account_status` ON `content_proposals` (`account_id`,`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_content_proposals_target_status` ON `content_proposals` (`target_id`,`status`,`updated_at`);--> statement-breakpoint
CREATE TABLE `email_webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text,
	`event_type` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_email_webhook_events_provider` ON `email_webhook_events` (`provider_id`,`event_type`);--> statement-breakpoint
CREATE TABLE `message_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`message_id` text NOT NULL,
	`account_id` text NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_message_reports_message_account` ON `message_reports` (`message_id`,`account_id`);--> statement-breakpoint
CREATE INDEX `idx_message_reports_status` ON `message_reports` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `message_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_key` text NOT NULL,
	`initiator_account_id` text NOT NULL,
	`recipient_account_id` text NOT NULL,
	`subject` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`accepted_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_message_threads_participant_key` ON `message_threads` (`participant_key`);--> statement-breakpoint
CREATE INDEX `idx_message_threads_initiator` ON `message_threads` (`initiator_account_id`,`status`,`updated_at`);--> statement-breakpoint
CREATE INDEX `idx_message_threads_recipient` ON `message_threads` (`recipient_account_id`,`status`,`updated_at`);--> statement-breakpoint
CREATE TABLE `orcid_sync_state` (
	`account_id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'idle' NOT NULL,
	`public_work_count` integer DEFAULT 0 NOT NULL,
	`last_attempt_at` text,
	`last_success_at` text,
	`next_allowed_at` text,
	`error_code` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `proposal_events` (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`actor_account_id` text,
	`kind` text NOT NULL,
	`visibility` text DEFAULT 'private' NOT NULL,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_proposal_events_proposal` ON `proposal_events` (`proposal_id`,`visibility`,`created_at`);--> statement-breakpoint
CREATE TABLE `proposal_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`identifier_type` text NOT NULL,
	`identifier_value` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_proposal_sources_identifier` ON `proposal_sources` (`proposal_id`,`identifier_type`,`identifier_value`);--> statement-breakpoint
CREATE INDEX `idx_proposal_sources_proposal` ON `proposal_sources` (`proposal_id`,`position`);--> statement-breakpoint
CREATE TABLE `recognition_events` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`level` integer NOT NULL,
	`kind` text NOT NULL,
	`source_type` text NOT NULL,
	`source_id` text NOT NULL,
	`reason` text NOT NULL,
	`awarded_by_account_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_recognition_events_account_level` ON `recognition_events` (`account_id`,`level`);--> statement-breakpoint
CREATE INDEX `idx_recognition_events_account_status` ON `recognition_events` (`account_id`,`status`,`level`);--> statement-breakpoint
CREATE TABLE `researcher_follows` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_researcher_follows_account_target` ON `researcher_follows` (`account_id`,`target_type`,`target_id`);--> statement-breakpoint
CREATE INDEX `idx_researcher_follows_target` ON `researcher_follows` (`target_type`,`target_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `researcher_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`sender_account_id` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'visible' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_researcher_messages_thread` ON `researcher_messages` (`thread_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_researcher_messages_sender` ON `researcher_messages` (`sender_account_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `researcher_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`kind` text NOT NULL,
	`actor_account_id` text,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`title` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`href` text NOT NULL,
	`dedupe_key` text NOT NULL,
	`read_at` text,
	`emailed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_researcher_notifications_dedupe` ON `researcher_notifications` (`account_id`,`dedupe_key`);--> statement-breakpoint
CREATE INDEX `idx_researcher_notifications_account_read` ON `researcher_notifications` (`account_id`,`read_at`,`created_at`);--> statement-breakpoint
CREATE TABLE `researcher_works` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`work_key` text NOT NULL,
	`put_code` text,
	`doi` text,
	`title` text NOT NULL,
	`authors_json` text DEFAULT '[]' NOT NULL,
	`year` integer,
	`journal` text,
	`source_updated_at` text,
	`synced_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_researcher_works_account_key` ON `researcher_works` (`account_id`,`work_key`);--> statement-breakpoint
CREATE INDEX `idx_researcher_works_account_doi` ON `researcher_works` (`account_id`,`doi`);--> statement-breakpoint
CREATE TABLE `roundtable_interests` (
	`account_id` text PRIMARY KEY NOT NULL,
	`roles_json` text DEFAULT '[]' NOT NULL,
	`tracks_json` text DEFAULT '[]' NOT NULL,
	`format_preference` text DEFAULT 'either' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`availability` text DEFAULT '' NOT NULL,
	`proposed_question` text DEFAULT '' NOT NULL,
	`updates_consent` integer DEFAULT false NOT NULL,
	`consented_at` text,
	`withdrawn_at` text,
	`status` text DEFAULT 'interested' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_roundtable_interests_status` ON `roundtable_interests` (`status`,`updated_at`);--> statement-breakpoint
CREATE TABLE `work_match_suggestions` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`researcher_work_id` text NOT NULL,
	`source_id` text NOT NULL,
	`match_type` text NOT NULL,
	`confidence` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'suggested' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_work_matches_account_source` ON `work_match_suggestions` (`account_id`,`source_id`);--> statement-breakpoint
CREATE INDEX `idx_work_matches_account_status` ON `work_match_suggestions` (`account_id`,`status`,`updated_at`);--> statement-breakpoint
ALTER TABLE `researcher_profiles` ADD `messaging_enabled` integer DEFAULT true NOT NULL;--> statement-breakpoint
PRAGMA optimize;
