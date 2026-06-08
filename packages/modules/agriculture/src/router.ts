import { Hono } from "hono";
import { and, desc, eq, like, type SQL } from "drizzle-orm";
import type { AppEnv } from "@karots/core";
import { getDb } from "@karots/db";
import {
  crops,
  marketPrices,
  diseases,
  ITEM_TYPES,
  DISEASE_KINDS,
  type ItemType,
  type DiseaseKind,
} from "./schema";
import { getUploadThing } from "./storage";

/**
 * Agriculture HTTP routes. Mounted by the core registry under "/agriculture",
 * so paths here are relative to that prefix.
 */
export const agricultureRouter = new Hono<AppEnv>();

function isItemType(v: string | undefined): v is ItemType {
  return !!v && (ITEM_TYPES as readonly string[]).includes(v);
}
function isDiseaseKind(v: string | undefined): v is DiseaseKind {
  return !!v && (DISEASE_KINDS as readonly string[]).includes(v);
}

/* ----------------------------- Crops ----------------------------- */

agricultureRouter.get("/crops", async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db.select().from(crops);
  return c.json({ crops: rows });
});

agricultureRouter.post("/crops", async (c) => {
  const body = await c.req.json<{
    name: string;
    category?: string;
    cultivationDurationDays?: number;
    seedPriceMin?: number;
    seedPriceMax?: number;
    imageUrl?: string;
  }>();

  if (!body?.name) {
    return c.json({ error: "name is required" }, 400);
  }

  const db = getDb(c.env.DB);
  const [created] = await db
    .insert(crops)
    .values({ id: crypto.randomUUID(), ...body })
    .returning();

  return c.json({ crop: created }, 201);
});

/* ------------------------- Market prices ------------------------- */

// Latest price observations, optionally filtered. Newest first.
agricultureRouter.get("/prices", async (c) => {
  const db = getDb(c.env.DB);
  const itemType = c.req.query("itemType");
  const districtId = c.req.query("districtId");
  const cropId = c.req.query("cropId");
  const limit = Math.min(Number(c.req.query("limit") ?? 50) || 50, 200);

  const conditions: SQL[] = [];
  if (isItemType(itemType)) conditions.push(eq(marketPrices.itemType, itemType));
  if (districtId) conditions.push(eq(marketPrices.districtId, districtId));
  if (cropId) conditions.push(eq(marketPrices.cropId, cropId));

  const rows = await db
    .select()
    .from(marketPrices)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(marketPrices.recordedAt))
    .limit(limit);

  return c.json({ prices: rows });
});

// Price trend for one item over time (oldest first), optionally per district.
agricultureRouter.get("/prices/history", async (c) => {
  const itemName = c.req.query("itemName");
  if (!itemName) return c.json({ error: "itemName is required" }, 400);

  const districtId = c.req.query("districtId");
  const conditions: SQL[] = [eq(marketPrices.itemName, itemName)];
  if (districtId) conditions.push(eq(marketPrices.districtId, districtId));

  const db = getDb(c.env.DB);
  const history = await db
    .select()
    .from(marketPrices)
    .where(and(...conditions))
    .orderBy(marketPrices.recordedAt);

  return c.json({ itemName, history });
});

agricultureRouter.post("/prices", async (c) => {
  const body = await c.req.json<{
    itemType: ItemType;
    itemName: string;
    districtId: string;
    cropId?: string;
    wholesale?: number;
    retail?: number;
    currency?: string;
  }>();

  if (!body?.itemName || !body?.districtId || !isItemType(body.itemType)) {
    return c.json(
      { error: "itemType (crop|seed|fertilizer|pesticide), itemName and districtId are required" },
      400,
    );
  }

  const db = getDb(c.env.DB);
  const [created] = await db
    .insert(marketPrices)
    .values({ id: crypto.randomUUID(), ...body })
    .returning();

  return c.json({ price: created }, 201);
});

/* --------------------- Disease & pest catalog -------------------- */

agricultureRouter.get("/crops/:cropId/diseases", async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db
    .select()
    .from(diseases)
    .where(eq(diseases.cropId, c.req.param("cropId")));
  return c.json({ diseases: rows });
});

// Symptom-based diagnosis search + optional kind filter.
agricultureRouter.get("/diseases", async (c) => {
  const symptom = c.req.query("symptom");
  const kind = c.req.query("kind");

  const conditions: SQL[] = [];
  if (symptom) conditions.push(like(diseases.symptoms, `%${symptom}%`));
  if (isDiseaseKind(kind)) conditions.push(eq(diseases.kind, kind));

  const db = getDb(c.env.DB);
  const rows = await db
    .select()
    .from(diseases)
    .where(conditions.length ? and(...conditions) : undefined);

  return c.json({ diseases: rows });
});

agricultureRouter.post("/diseases", async (c) => {
  const body = await c.req.json<{
    cropId: string;
    name: string;
    kind?: DiseaseKind;
    symptoms?: string;
    causes?: string;
    treatment?: string;
    prevention?: string;
    imageUrl?: string;
    imageKey?: string;
  }>();

  if (!body?.cropId || !body?.name) {
    return c.json({ error: "cropId and name are required" }, 400);
  }

  const db = getDb(c.env.DB);
  const [created] = await db
    .insert(diseases)
    .values({ id: crypto.randomUUID(), ...body })
    .returning();

  return c.json({ disease: created }, 201);
});

// Delete a catalog entry and its UploadThing image (if any) together.
agricultureRouter.delete("/diseases/:id", async (c) => {
  const id = c.req.param("id");
  const db = getDb(c.env.DB);

  const [row] = await db.select().from(diseases).where(eq(diseases.id, id));
  if (!row) return c.json({ error: "not found" }, 404);

  if (row.imageKey) {
    await getUploadThing(c.env.UPLOADTHING_TOKEN).deleteFiles([row.imageKey]);
  }
  await db.delete(diseases).where(eq(diseases.id, id));

  return c.json({ deleted: id });
});
