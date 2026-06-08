PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_market_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`item_type` text NOT NULL,
	`item_name` text NOT NULL,
	`crop_id` text,
	`district_id` text NOT NULL,
	`wholesale` real,
	`retail` real,
	`currency` text DEFAULT 'LKR' NOT NULL,
	`recorded_at` integer NOT NULL,
	FOREIGN KEY (`crop_id`) REFERENCES `crops`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_market_prices`("id", "item_type", "item_name", "crop_id", "district_id", "wholesale", "retail", "currency", "recorded_at") SELECT "id", "item_type", "item_name", "crop_id", "district_id", "wholesale", "retail", "currency", "recorded_at" FROM `market_prices`;--> statement-breakpoint
DROP TABLE `market_prices`;--> statement-breakpoint
ALTER TABLE `__new_market_prices` RENAME TO `market_prices`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `market_prices_lookup_idx` ON `market_prices` (`item_type`,`district_id`,`recorded_at`);--> statement-breakpoint
CREATE INDEX `market_prices_item_idx` ON `market_prices` (`item_name`,`recorded_at`);