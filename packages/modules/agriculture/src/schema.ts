import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * Crop catalog — the agriculture module's core entity. See plan.md "Crop
 * Intelligence System" for the full intended field set; this is the starting
 * subset. Image assets are stored in UploadThing; we keep only the file URL.
 *
 * This table is OWNED by the agriculture module. It is referenced by the central
 * drizzle.config (build-time) for migration generation, and by this module's
 * router at runtime.
 */
export const crops = sqliteTable("crops", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  /** Typical days from planting to harvest. */
  cultivationDurationDays: integer("cultivation_duration_days"),
  seedPriceMin: real("seed_price_min"),
  seedPriceMax: real("seed_price_max"),
  /** UploadThing file URL for a healthy reference image. */
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Crop = typeof crops.$inferSelect;
export type NewCrop = typeof crops.$inferInsert;
