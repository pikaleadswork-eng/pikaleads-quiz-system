CREATE TABLE `question_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`questionText` text NOT NULL,
	`questionType` varchar(20) NOT NULL DEFAULT 'single',
	`options` text NOT NULL,
	`isRequired` int NOT NULL DEFAULT 1,
	`usageCount` int NOT NULL DEFAULT 0,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `question_templates_id` PRIMARY KEY(`id`)
);
