ALTER TABLE `analytics_settings` MODIFY COLUMN `apiSecret` varchar(500);--> statement-breakpoint
ALTER TABLE `analytics_settings` ADD `serverContainerUrl` varchar(500);