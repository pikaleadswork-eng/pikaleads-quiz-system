CREATE TABLE `lead_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`userId` int NOT NULL,
	`field` varchar(100) NOT NULL,
	`oldValue` text,
	`newValue` text,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lead_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `lead_history` ADD CONSTRAINT `lead_history_leadId_leads_id_fk` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lead_history` ADD CONSTRAINT `lead_history_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;