CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`permissions` text NOT NULL,
	`isSystem` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `userInvitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`roleId` int,
	`roleName` varchar(100),
	`token` varchar(255) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`invitedBy` int NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`acceptedAt` timestamp,
	CONSTRAINT `userInvitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `userInvitations_token_unique` UNIQUE(`token`)
);
