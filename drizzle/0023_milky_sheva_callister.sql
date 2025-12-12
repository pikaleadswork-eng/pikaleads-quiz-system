CREATE TABLE `webhookLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`webhookId` int NOT NULL,
	`event` varchar(100) NOT NULL,
	`payload` text NOT NULL,
	`response` text,
	`statusCode` int,
	`success` boolean NOT NULL,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhookLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('hubspot','salesforce','custom') NOT NULL,
	`url` varchar(500) NOT NULL,
	`headers` text,
	`events` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`apiKey` varchar(500),
	`config` text,
	`lastTriggeredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webhooks_id` PRIMARY KEY(`id`)
);
