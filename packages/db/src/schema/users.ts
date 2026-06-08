import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { districts } from "./districts";

/**
 * Core user accounts. Each user is anchored to a district, which drives
 * localized recommendations, pricing and weather across all modules.
 */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  districtId: text("district_id").references(() => districts.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
