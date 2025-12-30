CREATE TABLE `quiz_design_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`layoutType` varchar(20) NOT NULL DEFAULT 'split',
	`backgroundImage` text,
	`logoImage` text,
	`primaryColor` varchar(7) DEFAULT '#FACC15',
	`accentColor` varchar(7) DEFAULT '#A855F7',
	`fontFamily` varchar(100) DEFAULT 'Inter',
	`titleText` text,
	`subtitleText` text,
	`buttonText` varchar(100),
	`bonusText` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_design_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `quiz_design_settings_quizId_unique` UNIQUE(`quizId`)
);
--> statement-breakpoint
CREATE TABLE `quiz_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`niche` varchar(100) NOT NULL,
	`description` text,
	`previewImage` text,
	`quizData` text NOT NULL,
	`designPreset` text NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`usageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ab_test_variants` ADD `isWinner` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `ab_test_variants` ADD `designSettings` text;