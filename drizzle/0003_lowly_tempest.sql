CREATE TABLE `ab_test_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`quizId` varchar(100) NOT NULL,
	`variantId` int NOT NULL,
	`converted` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ab_test_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ab_test_variants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` varchar(100) NOT NULL,
	`variantName` varchar(100) NOT NULL,
	`isControl` int NOT NULL DEFAULT 0,
	`trafficPercentage` int NOT NULL DEFAULT 50,
	`isActive` int NOT NULL DEFAULT 1,
	`title` text,
	`subtitle` text,
	`bonus` text,
	`questions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ab_test_variants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `incomplete_quiz_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`quizId` varchar(100) NOT NULL,
	`currentStep` int NOT NULL,
	`totalSteps` int NOT NULL,
	`answers` text,
	`name` varchar(255),
	`phone` varchar(50),
	`email` varchar(255),
	`language` varchar(10),
	`remindersSent` int NOT NULL DEFAULT 0,
	`lastReminderAt` timestamp,
	`completed` int NOT NULL DEFAULT 0,
	`unsubscribed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `incomplete_quiz_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `incomplete_quiz_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
