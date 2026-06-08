import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { districts } from "@karots/db/schema";

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

export const ITEM_TYPES = ["crop", "seed", "fertilizer", "pesticide"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

/**
 * Market price observations (plan.md "Agricultural Market System").
 *
 * Every row is district-scoped — pricing is region-specific. A single item can
 * have many rows over time; querying ordered by `recordedAt` yields the
 * historical trend, and the most recent row is the current price.
 */
export const marketPrices = sqliteTable(
  "market_prices",
  {
    id: text("id").primaryKey(),
    itemType: text("item_type", { enum: ITEM_TYPES }).notNull(),
    itemName: text("item_name").notNull(),
    /** Set when the priced item is a catalog crop. */
    cropId: text("crop_id").references(() => crops.id),
    /** Cross-module link to the core location hierarchy. */
    districtId: text("district_id")
      .notNull()
      .references(() => districts.id),
    wholesale: real("wholesale"),
    retail: real("retail"),
    currency: text("currency").notNull().default("INR"),
    recordedAt: integer("recorded_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    index("market_prices_lookup_idx").on(t.itemType, t.districtId, t.recordedAt),
    index("market_prices_item_idx").on(t.itemName, t.recordedAt),
  ],
);

export const DISEASE_KINDS = ["disease", "pest"] as const;
export type DiseaseKind = (typeof DISEASE_KINDS)[number];

/**
 * Disease & pest catalog (plan.md "Disease & Pest Intelligence System"), each
 * entry linked to a crop. `symptoms` is plain text to back symptom-based search;
 * `imageKey` is the UploadThing file key so the asset can be deleted with the row.
 */
export const diseases = sqliteTable(
  "diseases",
  {
    id: text("id").primaryKey(),
    cropId: text("crop_id")
      .notNull()
      .references(() => crops.id),
    name: text("name").notNull(),
    kind: text("kind", { enum: DISEASE_KINDS }).notNull().default("disease"),
    symptoms: text("symptoms"),
    causes: text("causes"),
    treatment: text("treatment"),
    prevention: text("prevention"),
    imageUrl: text("image_url"),
    imageKey: text("image_key"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("diseases_crop_idx").on(t.cropId)],
);

export type Crop = typeof crops.$inferSelect;
export type NewCrop = typeof crops.$inferInsert;
export type MarketPrice = typeof marketPrices.$inferSelect;
export type NewMarketPrice = typeof marketPrices.$inferInsert;
export type Disease = typeof diseases.$inferSelect;
export type NewDisease = typeof diseases.$inferInsert;
