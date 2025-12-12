CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`channel` varchar(50) NOT NULL,
	`externalId` varchar(255) NOT NULL,
	`lastMessageAt` timestamp NOT NULL DEFAULT (now()),
	`unreadCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inbound_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderId` varchar(255) NOT NULL,
	`senderName` varchar(255),
	`content` text NOT NULL,
	`messageType` varchar(50) NOT NULL DEFAULT 'text',
	`mediaUrl` varchar(500),
	`isRead` boolean NOT NULL DEFAULT false,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inbound_messages_id` PRIMARY KEY(`id`)
);
