CREATE TABLE `quiz_question_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`questionId` int NOT NULL,
	`eventType` enum('viewed','answered','skipped') NOT NULL,
	`answer` text,
	`timeSpent` int DEFAULT 0,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_question_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`leadId` int,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`status` enum('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
	`totalQuestions` int NOT NULL,
	`answeredQuestions` int NOT NULL DEFAULT 0,
	`timeSpent` int DEFAULT 0,
	`userAgent` text,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `quiz_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
