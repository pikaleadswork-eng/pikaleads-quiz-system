CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`managerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`scheduledAt` timestamp NOT NULL,
	`duration` int NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'scheduled',
	`calendlyEventId` varchar(255),
	`googleEventId` varchar(255),
	`meetingLink` varchar(500),
	`reminderSent` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
