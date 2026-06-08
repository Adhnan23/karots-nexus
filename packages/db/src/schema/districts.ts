import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

/**
 * Core location hierarchy: country -> district -> local area.
 *
 * Every localized domain entity (prices, weather, recommendations) references a
 * district. This table is CORE — shared across all modules.
 */
export const districts = sqliteTable(
  "districts",
  {
    id: text("id").primaryKey(),
    country: text("country").notNull(),
    district: text("district").notNull(),
    localArea: text("local_area"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("districts_country_district_idx").on(t.country, t.district)],
);

export type District = typeof districts.$inferSelect;
export type NewDistrict = typeof districts.$inferInsert;
