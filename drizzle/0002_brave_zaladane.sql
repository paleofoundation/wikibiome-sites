CREATE TABLE `researcher_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`blocker_account_id` text NOT NULL,
	`blocked_account_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_researcher_blocks_pair` ON `researcher_blocks` (`blocker_account_id`,`blocked_account_id`);--> statement-breakpoint
CREATE INDEX `idx_researcher_blocks_blocker` ON `researcher_blocks` (`blocker_account_id`,`created_at`);