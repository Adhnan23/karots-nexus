import { Hono } from "hono";
import { and, eq, sql, type SQL } from "drizzle-orm";
import { requireAdmin, isLocalized, type AppEnv, type Localized } from "@karots/core";
import { getDb } from "@karots/db";
import { articles, KNOWLEDGE_CATEGORIES, type KnowledgeCategory } from "./schema";
import { getUploadThing } from "./storage";

/**
 * Knowledge Base routes (plan.md #9). Mounted by the core registry under
 * "/knowledge". GET routes are public and return published articles only;
 * mutations are admin-only. All user-facing text is Localized (en/si/ta).
 */
export const knowledgeRouter = new Hono<AppEnv>();

function isCategory(v: string | undefined): v is KnowledgeCategory {
  return !!v && (KNOWLEDGE_CATEGORIES as readonly string[]).includes(v);
}

/** Validate the optional localized/category fields shared by create + update. */
function validateArticle(b: {
  title?: Localized;
  summary?: Localized;
  body?: Localized;
  category?: string;
}): string | null {
  if (b.title !== undefined && !isLocalized(b.title)) return "title must be { en, si?, ta? }";
  if (b.body !== undefined && !isLocalized(b.body)) return "body must be { en, si?, ta? }";
  if (b.summary !== undefined && !isLocalized(b.summary)) return "summary must be { en, si?, ta? }";
  if (b.category !== undefined && !isCategory(b.category)) {
    return `category must be one of ${KNOWLEDGE_CATEGORIES.join("|")}`;
  }
  return null;
}

// Public: list published articles, optionally filtered. Newest first.
knowledgeRouter.get("/articles", async (c) => {
  const db = getDb(c.env.DB);
  const category = c.req.query("category");
  const cropId = c.req.query("cropId");
  const q = c.req.query("q");

  const conditions: SQL[] = [eq(articles.published, true)];
  if (isCategory(category)) conditions.push(eq(articles.category, category));
  if (cropId) conditions.push(eq(articles.cropId, cropId));
  if (q) {
    const like = "%" + q + "%";
    conditions.push(sql`(${articles.title} LIKE ${like} OR ${articles.body} LIKE ${like})`);
  }

  const rows = await db
    .select()
    .from(articles)
    .where(and(...conditions))
    .orderBy(sql`${articles.createdAt} DESC`);

  return c.json({ articles: rows });
});

// Admin: every article including unpublished drafts (for the admin panel).
knowledgeRouter.get("/admin/articles", requireAdmin, async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db.select().from(articles).orderBy(sql`${articles.createdAt} DESC`);
  return c.json({ articles: rows });
});

// Public: a single published article.
knowledgeRouter.get("/articles/:id", async (c) => {
  const db = getDb(c.env.DB);
  const [article] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.id, c.req.param("id")), eq(articles.published, true)));
  if (!article) return c.json({ error: "article not found" }, 404);
  return c.json({ article });
});

knowledgeRouter.post("/articles", requireAdmin, async (c) => {
  const body = await c.req.json<{
    title: Localized;
    summary?: Localized;
    body: Localized;
    category: KnowledgeCategory;
    cropId?: string;
    imageUrl?: string;
    imageKey?: string;
    published?: boolean;
  }>();

  if (!isLocalized(body?.title) || !isLocalized(body?.body) || !isCategory(body?.category)) {
    return c.json(
      { error: "title and body { en, si?, ta? } and a valid category are required" },
      400,
    );
  }
  const err = validateArticle(body);
  if (err) return c.json({ error: err }, 400);

  const db = getDb(c.env.DB);
  const [created] = await db
    .insert(articles)
    .values({ id: crypto.randomUUID(), ...body })
    .returning();

  return c.json({ article: created }, 201);
});

knowledgeRouter.patch("/articles/:id", requireAdmin, async (c) => {
  const body = await c.req.json<{
    title?: Localized;
    summary?: Localized;
    body?: Localized;
    category?: KnowledgeCategory;
    cropId?: string;
    imageUrl?: string;
    imageKey?: string;
    published?: boolean;
  }>();

  const err = validateArticle(body);
  if (err) return c.json({ error: err }, 400);

  const db = getDb(c.env.DB);
  const [updated] = await db
    .update(articles)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(articles.id, c.req.param("id")))
    .returning();

  if (!updated) return c.json({ error: "article not found" }, 404);
  return c.json({ article: updated });
});

// Admin: delete an article and its UploadThing image (if any).
knowledgeRouter.delete("/articles/:id", requireAdmin, async (c) => {
  const id = c.req.param("id");
  const db = getDb(c.env.DB);

  const [article] = await db.select().from(articles).where(eq(articles.id, id));
  if (!article) return c.json({ error: "article not found" }, 404);

  if (article.imageKey) {
    await getUploadThing(c.env.UPLOADTHING_TOKEN).deleteFiles([article.imageKey]);
  }
  await db.delete(articles).where(eq(articles.id, id));

  return c.json({ deleted: id });
});
