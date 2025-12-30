CREATE TABLE `lead_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`userId` int NOT NULL,
	`activityType` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`metadata` text,
	`fileUrl` varchar(500),
	`fileName` varchar(255),
	`fileSize` int,
	`fileMimeType` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lead_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `lead_activities` ADD CONSTRAINT `lead_activities_leadId_leads_id_fk` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lead_activities` ADD CONSTRAINT `lead_activities_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;