ALTER TABLE `quiz_design_settings` ADD `titleColor` varchar(7) DEFAULT '#FFFFFF';--> statement-breakpoint
ALTER TABLE `quiz_design_settings` ADD `titleWeight` varchar(20) DEFAULT 'bold';--> statement-breakpoint
ALTER TABLE `quiz_design_settings` ADD `subtitleColor` varchar(7) DEFAULT '#FFFFFF';--> statement-breakpoint
ALTER TABLE `quiz_design_settings` ADD `subtitleWeight` varchar(20) DEFAULT 'normal';--> statement-breakpoint
ALTER TABLE `quiz_design_settings` ADD `buttonRadiusPx` int DEFAULT 25;--> statement-breakpoint
ALTER TABLE `quiz_design_settings` ADD `bullets` text;