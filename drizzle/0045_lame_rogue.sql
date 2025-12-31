CREATE TABLE `events_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_type` varchar(100) NOT NULL,
	`platform` varchar(50) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'success',
	`event_data` json,
	`error_message` text,
	`user_id` varchar(255),
	`quiz_id` varchar(255),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`response_time` int,
	`ip_address` varchar(45),
	`user_agent` text,
	CONSTRAINT `events_log_id` PRIMARY KEY(`id`)
);
