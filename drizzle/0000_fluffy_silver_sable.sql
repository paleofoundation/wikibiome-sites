CREATE TABLE `contributions` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`page_title` text NOT NULL,
	`section` text NOT NULL,
	`contribution_type` text NOT NULL,
	`original_text` text DEFAULT '' NOT NULL,
	`proposed_text` text NOT NULL,
	`rationale` text NOT NULL,
	`source_url` text,
	`contributor_user_id` text NOT NULL,
	`contributor_email` text NOT NULL,
	`contributor_name` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`moderator_note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_contributions_page_id` ON `contributions` (`page_id`);--> statement-breakpoint
CREATE INDEX `idx_contributions_contributor` ON `contributions` (`contributor_user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_contributions_status_created` ON `contributions` (`status`,`created_at`);--> statement-breakpoint
PRAGMA optimize;
