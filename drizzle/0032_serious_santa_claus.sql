ALTER TABLE `quiz_questions` RENAME COLUMN `order` TO `orderIndex`;--> statement-breakpoint
ALTER TABLE `quiz_questions` RENAME COLUMN `config` TO `settings`;--> statement-breakpoint
ALTER TABLE `quiz_questions` MODIFY COLUMN `questionType` enum('text_options','image_options','emoji','custom_input','dropdown','date','slider','file_upload','page','rating','question_group','address') NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_questions` MODIFY COLUMN `orderIndex` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quiz_design_settings` ADD `bonusEnabled` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_design_settings` ADD `companyName` varchar(255);--> statement-breakpoint
ALTER TABLE `quiz_design_settings` ADD `phoneNumber` varchar(50);--> statement-breakpoint
ALTER TABLE `quiz_questions` ADD `answerOptions` text;--> statement-breakpoint
ALTER TABLE `quiz_questions` DROP COLUMN `conditionalLogic`;