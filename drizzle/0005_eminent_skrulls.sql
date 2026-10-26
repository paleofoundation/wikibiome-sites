ALTER TABLE `work_submissions` ADD `fingerprint` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_work_submissions_fingerprint` ON `work_submissions` (`fingerprint`);