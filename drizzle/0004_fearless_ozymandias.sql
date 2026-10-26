CREATE TABLE `editorial_change_packets` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`status` text DEFAULT 'pending_sync' NOT NULL,
	`upstream_target` text DEFAULT 'paleofoundation/wikibiome' NOT NULL,
	`payload_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_editorial_packets_submission` ON `editorial_change_packets` (`submission_id`);--> statement-breakpoint
CREATE INDEX `idx_editorial_packets_status` ON `editorial_change_packets` (`status`,`created_at`);