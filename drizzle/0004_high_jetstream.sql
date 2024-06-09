ALTER TABLE `article` RENAME COLUMN `search_content` TO `search_content_pl`;--> statement-breakpoint
DROP INDEX IF EXISTS `search_contentx`;--> statement-breakpoint
ALTER TABLE `article` ADD `parsed_title` text NOT NULL;--> statement-breakpoint
ALTER TABLE `article` ADD `search_content_en` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `parsed_titlex` ON `article` (`parsed_title`);--> statement-breakpoint
CREATE INDEX `search_content_plx` ON `article` (`search_content_pl`);--> statement-breakpoint
CREATE INDEX `search_content_enx` ON `article` (`search_content_en`);