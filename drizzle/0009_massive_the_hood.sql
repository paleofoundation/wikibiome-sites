ALTER TABLE `roundtable_interests` ADD `event_types_json` text DEFAULT '["roundtable"]' NOT NULL;--> statement-breakpoint
ALTER TABLE `roundtable_interests` ADD `early_invite_consent` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `roundtable_interests` ADD `early_invite_consented_at` text;