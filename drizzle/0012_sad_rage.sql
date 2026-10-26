CREATE TABLE `paper_events` (
	`id` text PRIMARY KEY NOT NULL,
	`intake_id` text NOT NULL,
	`actor_id` text,
	`kind` text NOT NULL,
	`revision` integer NOT NULL,
	`detail_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_paper_events_intake` ON `paper_events` (`intake_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `paper_intakes` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`identity_key` text NOT NULL,
	`title` text NOT NULL,
	`topic` text NOT NULL,
	`status` text DEFAULT 'awaiting_file' NOT NULL,
	`packet_json` text DEFAULT '{}' NOT NULL,
	`file_key` text,
	`file_hash` text,
	`revision` integer DEFAULT 1 NOT NULL,
	`reviewer_account_id` text,
	`editor_account_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_paper_identity` ON `paper_intakes` (`identity_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_paper_hash` ON `paper_intakes` (`file_hash`);--> statement-breakpoint
CREATE INDEX `idx_paper_owner` ON `paper_intakes` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_paper_reviewer` ON `paper_intakes` (`reviewer_account_id`);--> statement-breakpoint
CREATE INDEX `idx_paper_status` ON `paper_intakes` (`status`);--> statement-breakpoint
CREATE TABLE `paper_publications` (
	`source_id` text PRIMARY KEY NOT NULL,
	`intake_id` text NOT NULL,
	`account_id` text NOT NULL,
	`source_commit` text NOT NULL,
	`targets_json` text NOT NULL,
	`published_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_paper_publication_intake` ON `paper_publications` (`intake_id`);--> statement-breakpoint
CREATE INDEX `idx_paper_publication_account` ON `paper_publications` (`account_id`);--> statement-breakpoint
CREATE TABLE `paper_reviewers` (
	`account_id` text NOT NULL,
	`topic` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`appointed_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_paper_reviewer_topic` ON `paper_reviewers` (`account_id`,`topic`);--> statement-breakpoint
ALTER TABLE `recognition_events` ADD `policy_version` text DEFAULT 'legacy_acceptance' NOT NULL;