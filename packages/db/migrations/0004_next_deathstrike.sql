CREATE TABLE `crop_stages` (
	`id` text PRIMARY KEY NOT NULL,
	`crop_id` text NOT NULL,
	`name` text NOT NULL,
	`start_day` integer NOT NULL,
	`end_day` integer NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`crop_id`) REFERENCES `crops`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `crop_stages_crop_idx` ON `crop_stages` (`crop_id`,`start_day`);