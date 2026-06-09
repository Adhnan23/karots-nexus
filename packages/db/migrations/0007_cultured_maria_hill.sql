CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`body` text NOT NULL,
	`category` text NOT NULL,
	`crop_id` text,
	`image_url` text,
	`image_key` text,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `articles_category_idx` ON `articles` (`category`);--> statement-breakpoint
CREATE INDEX `articles_crop_idx` ON `articles` (`crop_id`);