import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import type { Localized } from "@karots/core";

/**
 * Core location hierarchy: country -> district -> local area.
 *
 * Every localized domain entity (prices, weather, recommendations) references a
 * district. This table is CORE — shared across all modules. The display name is
 * a Localized value (en/si/ta); `country` stays a plain key.
 */
export const districts = sqliteTable(
  "districts",
  {
    id: text("id").primaryKey(),
    country: text("country").notNull(),
    district: text("district", { mode: "json" }).$type<Localized>().notNull(),
    localArea: text("local_area", { mode: "json" }).$type<Localized>(),
    /** Centroid coordinates, used for geo lookups like weather. */
    latitude: real("latitude"),
    longitude: real("longitude"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("districts_country_district_idx").on(t.country, t.district)],
);

export type District = typeof districts.$inferSelect;
export type NewDistrict = typeof districts.$inferInsert;
