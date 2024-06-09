CREATE TABLE `allowed_access` (
	`article_id` text NOT NULL,
	`user_id` text NOT NULL,
	PRIMARY KEY(`article_id`, `user_id`),
	FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `article` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`title` text NOT NULL,
	`category` text DEFAULT 'other' NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`author_id` text NOT NULL,
	`privacy` text DEFAULT 'private' NOT NULL,
	`search_content` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `blocked_access` (
	`article_id` text NOT NULL,
	`user_id` text NOT NULL,
	PRIMARY KEY(`article_id`, `user_id`),
	FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'awaiting-approval' NOT NULL;