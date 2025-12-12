CREATE TABLE `quiz_answer_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionId` int NOT NULL,
	`optionText` varchar(500) NOT NULL,
	`imageUrl` varchar(500),
	`order` int NOT NULL,
	`score` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_answer_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`questionText` text NOT NULL,
	`questionType` enum('single_choice','multiple_choice','image_choice','text_input','textarea','slider','rating','file_upload','email','phone') NOT NULL,
	`order` int NOT NULL,
	`isRequired` boolean NOT NULL DEFAULT true,
	`config` text,
	`conditionalLogic` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`),
	CONSTRAINT `quizzes_slug_unique` UNIQUE(`slug`)
);
