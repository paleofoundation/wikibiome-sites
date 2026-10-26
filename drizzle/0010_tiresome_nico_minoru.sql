ALTER TABLE `institutions` ADD `slug` text;--> statement-breakpoint
ALTER TABLE `institutions` ADD `website_url` text;--> statement-breakpoint
ALTER TABLE `institutions` ADD `organization_type` text DEFAULT 'research_institute' NOT NULL;--> statement-breakpoint
ALTER TABLE `institutions` ADD `identity_status` text DEFAULT 'ror_verified' NOT NULL;--> statement-breakpoint
ALTER TABLE `institutions` ADD `evidence_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_institutions_slug` ON `institutions` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_institutions_status_name` ON `institutions` (`status`,`name`);--> statement-breakpoint
ALTER TABLE `researcher_profiles` ADD `photo_r2_key` text;--> statement-breakpoint
ALTER TABLE `researcher_profiles` ADD `photo_mime_type` text;--> statement-breakpoint
ALTER TABLE `researcher_profiles` ADD `photo_alt` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `researcher_profiles` ADD `photo_updated_at` text;