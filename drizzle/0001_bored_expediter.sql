CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(220) NOT NULL,
	`slug` varchar(240) NOT NULL,
	`category` varchar(80) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`authorName` varchar(160) NOT NULL,
	`readingMinutes` int NOT NULL DEFAULT 4,
	`isFeatured` int NOT NULL DEFAULT 0,
	`isPublished` int NOT NULL DEFAULT 1,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogPosts_slug_unique` UNIQUE(`slug`)
);
