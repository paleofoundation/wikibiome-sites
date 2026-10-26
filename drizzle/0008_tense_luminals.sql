CREATE INDEX `idx_researcher_notifications_account_created` ON `researcher_notifications` (`account_id`,`created_at`);--> statement-breakpoint
PRAGMA optimize;
