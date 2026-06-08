CREATE TABLE `diseases` (
	`id` text PRIMARY KEY NOT NULL,
	`crop_id` text NOT NULL,
	`name` text NOT NULL,
	`kind` text DEFAULT 'disease' NOT NULL,
	`symptoms` text,
	`causes` text,
	`treatment` text,
	`prevention` text,
	`image_url` text,
	`image_key` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`crop_id`) REFERENCES `crops`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `diseases_crop_idx` ON `diseases` (`crop_id`);--> statement-breakpoint
CREATE TABLE `market_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`item_type` text NOT NULL,
	`item_name` text NOT NULL,
	`crop_id` text,
	`district_id` text NOT NULL,
	`wholesale` real,
	`retail` real,
	`currency` text DEFAULT 'INR' NOT NULL,
	`recorded_at` integer NOT NULL,
	FOREIGN KEY (`crop_id`) REFERENCES `crops`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `market_prices_lookup_idx` ON `market_prices` (`item_type`,`district_id`,`recorded_at`);--> statement-breakpoint
CREATE INDEX `market_prices_item_idx` ON `market_prices` (`item_name`,`recorded_at`);