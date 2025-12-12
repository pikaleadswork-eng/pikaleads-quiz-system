CREATE TABLE `call_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`managerId` int NOT NULL,
	`phone` varchar(50) NOT NULL,
	`provider` varchar(50) NOT NULL,
	`callId` varchar(255),
	`duration` int DEFAULT 0,
	`status` varchar(50) NOT NULL,
	`recordingUrl` varchar(500),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `call_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`managerId` int NOT NULL,
	`platform` varchar(50) NOT NULL,
	`meetingUrl` varchar(500) NOT NULL,
	`externalId` varchar(255),
	`title` varchar(255) NOT NULL,
	`description` text,
	`scheduledAt` timestamp NOT NULL,
	`duration` int DEFAULT 30,
	`status` varchar(50) NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meetings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`managerId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`scheduledAt` timestamp NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`notifyVia` varchar(50) NOT NULL DEFAULT 'crm',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`sentAt` timestamp,
	CONSTRAINT `reminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `conversations` ADD `assignedManagerId` int;