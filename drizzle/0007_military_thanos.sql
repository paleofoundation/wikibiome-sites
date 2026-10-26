DROP INDEX `idx_email_webhook_events_provider`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_email_webhook_events_provider` ON `email_webhook_events` (`provider_id`,`event_type`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_researcher_profiles` (
	`account_id` text PRIMARY KEY NOT NULL,
	`orcid` text NOT NULL,
	`name` text NOT NULL,
	`biography` text DEFAULT '' NOT NULL,
	`affiliations_json` text DEFAULT '[]' NOT NULL,
	`expertise_self_json` text DEFAULT '[]' NOT NULL,
	`expertise_inferred_json` text DEFAULT '[]' NOT NULL,
	`messaging_enabled` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_researcher_profiles`("account_id", "orcid", "name", "biography", "affiliations_json", "expertise_self_json", "expertise_inferred_json", "messaging_enabled", "created_at", "updated_at") SELECT "account_id", "orcid", "name", "biography", "affiliations_json", "expertise_self_json", "expertise_inferred_json", 0, "created_at", "updated_at" FROM `researcher_profiles`;--> statement-breakpoint
DROP TABLE `researcher_profiles`;--> statement-breakpoint
ALTER TABLE `__new_researcher_profiles` RENAME TO `researcher_profiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_researcher_profiles_orcid` ON `researcher_profiles` (`orcid`);
--> statement-breakpoint
PRAGMA optimize;
