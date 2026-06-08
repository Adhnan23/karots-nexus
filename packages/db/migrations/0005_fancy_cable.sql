DROP INDEX `market_prices_item_idx`;--> statement-breakpoint
ALTER TABLE `market_prices` ADD `item_key` text NOT NULL;--> statement-breakpoint
CREATE INDEX `market_prices_item_idx` ON `market_prices` (`item_key`,`recorded_at`);