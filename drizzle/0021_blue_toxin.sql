ALTER TABLE `assignment_rules` MODIFY COLUMN `managerId` int;--> statement-breakpoint
ALTER TABLE `assignment_rules` ADD `type` varchar(50) DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE `assignment_rules` ADD `conditions` text;--> statement-breakpoint
ALTER TABLE `assignment_rules` ADD `assignmentStrategy` varchar(50) DEFAULT 'specific' NOT NULL;