import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import type { Localized } from "@karots/core";
import { districts } from "@karots/db/schema";

/**
 * Crop catalog — the agriculture module's core entity. See plan.md "Crop
 * Intelligence System" for the full intended field set; this is the starting
 * subset. User-facing text (`name`, `category`) is Localized (en/si/ta). Image
 * assets are stored in UploadThing; we keep only the file URL.
 *
 * This table is OWNED by the agriculture module. It is referenced by the central
 * drizzle.config (build-time) for migration generation, and by this module's
 * router at runtime.
 */
export const crops = sqliteTable("crops", {
  id: text("id").primaryKey(),
  name: text("name", { mode: "json" }).$type<Localized>().notNull(),
  category: text("category", { mode: "json" }).$type<Localized>(),
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
 * Every row is district-scoped — pricing is region-specific. `itemKey` is a
 * stable, language-neutral slug used for identity/grouping/history; `itemName`
 * is the Localized display name. A single item has many rows over time; ordering
 * by `recordedAt` yields the trend and the latest row is the current price.
 */
export const marketPrices = sqliteTable(
  "market_prices",
  {
    id: text("id").primaryKey(),
    itemType: text("item_type", { enum: ITEM_TYPES }).notNull(),
    /** Language-neutral slug, e.g. "paddy", "urea". Used for history/grouping. */
    itemKey: text("item_key").notNull(),
    itemName: text("item_name", { mode: "json" }).$type<Localized>().notNull(),
    /** Set when the priced item is a catalog crop. */
    cropId: text("crop_id").references(() => crops.id),
    /** Cross-module link to the core location hierarchy. */
    districtId: text("district_id")
      .notNull()
      .references(() => districts.id),
    wholesale: real("wholesale"),
    retail: real("retail"),
    currency: text("currency").notNull().default("LKR"),
    recordedAt: integer("recorded_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    index("market_prices_lookup_idx").on(t.itemType, t.districtId, t.recordedAt),
    index("market_prices_item_idx").on(t.itemKey, t.recordedAt),
  ],
);

export const DISEASE_KINDS = ["disease", "pest"] as const;
export type DiseaseKind = (typeof DISEASE_KINDS)[number];

/**
 * Disease & pest catalog (plan.md "Disease & Pest Intelligence System"), each
 * entry linked to a crop. All descriptive text is Localized; symptom search runs
 * a LIKE over the stored JSON so it matches in any language. `imageKey` is the
 * UploadThing file key so the asset can be deleted with the row.
 */
export const diseases = sqliteTable(
  "diseases",
  {
    id: text("id").primaryKey(),
    cropId: text("crop_id")
      .notNull()
      .references(() => crops.id),
    name: text("name", { mode: "json" }).$type<Localized>().notNull(),
    kind: text("kind", { enum: DISEASE_KINDS }).notNull().default("disease"),
    symptoms: text("symptoms", { mode: "json" }).$type<Localized>(),
    causes: text("causes", { mode: "json" }).$type<Localized>(),
    treatment: text("treatment", { mode: "json" }).$type<Localized>(),
    prevention: text("prevention", { mode: "json" }).$type<Localized>(),
    imageUrl: text("image_url"),
    imageKey: text("image_key"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("diseases_crop_idx").on(t.cropId)],
);

/**
 * Growth stages for a crop, measured in days from planting (plan.md "growth
 * timeline" / "Farm Planning"). A guest supplies their own planting date and the
 * timeline route maps these day offsets to absolute dates so they can compare
 * their real plants against where the crop *should* be.
 */
export const cropStages = sqliteTable(
  "crop_stages",
  {
    id: text("id").primaryKey(),
    cropId: text("crop_id")
      .notNull()
      .references(() => crops.id),
    name: text("name", { mode: "json" }).$type<Localized>().notNull(),
    /** Days from planting when this stage begins / ends (inclusive). */
    startDay: integer("start_day").notNull(),
    endDay: integer("end_day").notNull(),
    description: text("description", { mode: "json" }).$type<Localized>(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("crop_stages_crop_idx").on(t.cropId, t.startDay)],
);

export type Crop = typeof crops.$inferSelect;
export type NewCrop = typeof crops.$inferInsert;
export type CropStage = typeof cropStages.$inferSelect;
export type NewCropStage = typeof cropStages.$inferInsert;
export type MarketPrice = typeof marketPrices.$inferSelect;
export type NewMarketPrice = typeof marketPrices.$inferInsert;
export type Disease = typeof diseases.$inferSelect;
export type NewDisease = typeof diseases.$inferInsert;
