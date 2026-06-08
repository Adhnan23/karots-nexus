CREATE TABLE `districts` (
	`id` text PRIMARY KEY NOT NULL,
	`country` text NOT NULL,
	`district` text NOT NULL,
	`local_area` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `districts_country_district_idx` ON `districts` (`country`,`district`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`district_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `crops` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`cultivation_duration_days` integer,
	`seed_price_min` real,
	`seed_price_max` real,
	`image_url` text,
	`created_at` integer NOT NULL
);
