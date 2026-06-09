import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import type { Localized } from "@karots/core";

/**
 * Knowledge Base categories (plan.md "Agricultural Knowledge Base"). Language-
 * neutral keys; display names are resolved on the frontend.
 */
export const KNOWLEDGE_CATEGORIES = [
  "crop-guide",
  "technique",
  "soil",
  "fertilizer",
  "irrigation",
  "seasonal",
  "pest",
] as const;
export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

/**
 * Knowledge Base articles — admin-authored, public read (plan.md #9). All
 * user-facing text is Localized (en/si/ta). `cropId` is a SOFT link to an
 * agriculture crop: a plain id with no foreign key, so this module stays
 * decoupled from agriculture (CLAUDE.md permits cross-module linking by id).
 *
 * This table is OWNED by the knowledge module. It is referenced by the central
 * drizzle.config (build-time) for migration generation only.
 */
export const articles = sqliteTable(
  "articles",
  {
    id: text("id").primaryKey(),
    title: text("title", { mode: "json" }).$type<Localized>().notNull(),
    summary: text("summary", { mode: "json" }).$type<Localized>(),
    body: text("body", { mode: "json" }).$type<Localized>().notNull(),
    category: text("category", { enum: KNOWLEDGE_CATEGORIES }).notNull(),
    /** Soft cross-module link to a crop (no FK — keeps the module decoupled). */
    cropId: text("crop_id"),
    /** UploadThing file URL + key for an illustrative image. */
    imageUrl: text("image_url"),
    imageKey: text("image_key"),
    /** Public listings show published articles only; admin sees all. */
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("articles_category_idx").on(t.category), index("articles_crop_idx").on(t.cropId)],
);

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
