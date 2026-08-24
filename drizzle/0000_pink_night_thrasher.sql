CREATE TABLE `appointmentRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(160) NOT NULL,
	`age` int NOT NULL,
	`gender` varchar(32) NOT NULL,
	`phone` varchar(16) NOT NULL,
	`email` varchar(320),
	`appointmentDate` date NOT NULL,
	`timeSlot` varchar(80) NOT NULL,
	`service` varchar(160) NOT NULL,
	`doctor` varchar(160),
	`notes` text,
	`status` enum('new','contacted','confirmed','completed','cancelled') NOT NULL DEFAULT 'new',
	`deliveryStatus` enum('pending','sent','failed','not_configured') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointmentRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
