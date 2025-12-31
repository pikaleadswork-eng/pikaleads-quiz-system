CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizName` varchar(100) NOT NULL,
	`answers` text NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`telegram` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
