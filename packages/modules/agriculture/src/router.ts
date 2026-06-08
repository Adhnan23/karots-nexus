import { Hono } from "hono";
import { and, desc, eq, sql, type SQL } from "drizzle-orm";
import { requireAdmin, isLocalized, type AppEnv, type Localized } from "@karots/core";
import { getDb } from "@karots/db";
import {
  crops,
  cropStages,
  marketPrices,
  diseases,
  ITEM_TYPES,
  DISEASE_KINDS,
  type ItemType,
  type DiseaseKind,
} from "./schema";
import { getUploadThing } from "./storage";
import { buildTimeline } from "./timeline";
import { computeProfitability } from "./profitability";

/**
 * Agriculture HTTP routes. Mounted by the core registry under "/agriculture",
 * so paths here are relative to that prefix. GET routes are public; mutating
 * routes are admin-only (requireAdmin). User-facing text is Localized (en/si/ta).
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

agricultureRouter.post("/crops", requireAdmin, async (c) => {
  const body = await c.req.json<{
    name: Localized;
    category?: Localized;
    cultivationDurationDays?: number;
    seedPriceMin?: number;
    seedPriceMax?: number;
    imageUrl?: string;
  }>();

  if (!isLocalized(body?.name)) {
    return c.json({ error: "name is required as { en, si?, ta? }" }, 400);
  }

  const db = getDb(c.env.DB);
  const [created] = await db
    .insert(crops)
    .values({ id: crypto.randomUUID(), ...body })
    .returning();

  return c.json({ crop: created }, 201);
});

/* --------------------- Crop growth stages ------------------------ */

// Admin: define a growth stage for a crop (day offsets from planting).
agricultureRouter.post("/crops/:cropId/stages", requireAdmin, async (c) => {
  const cropId = c.req.param("cropId");
  const body = await c.req.json<{
    name: Localized;
    startDay: number;
    endDay: number;
    description?: Localized;
    sortOrder?: number;
  }>();

  if (!isLocalized(body?.name) || !Number.isFinite(body.startDay) || !Number.isFinite(body.endDay)) {
    return c.json({ error: "name { en, ... }, startDay and endDay are required" }, 400);
  }
  if (body.endDay < body.startDay) {
    return c.json({ error: "endDay must be >= startDay" }, 400);
  }

  const db = getDb(c.env.DB);
  const [created] = await db
    .insert(cropStages)
    .values({ id: crypto.randomUUID(), cropId, ...body })
    .returning();

  return c.json({ stage: created }, 201);
});

// Public: ordered growth stages for a crop.
agricultureRouter.get("/crops/:cropId/stages", async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db
    .select()
    .from(cropStages)
    .where(eq(cropStages.cropId, c.req.param("cropId")))
    .orderBy(cropStages.startDay);
  return c.json({ stages: rows });
});

// Public calculator: given a planting date, project stages onto real dates and
// report where the plant should be now. Stateless — nothing is stored.
agricultureRouter.get("/crops/:cropId/timeline", async (c) => {
  const plantedOnRaw = c.req.query("plantedOn");
  if (!plantedOnRaw) return c.json({ error: "plantedOn (YYYY-MM-DD) is required" }, 400);
  const plantedOn = new Date(plantedOnRaw);
  if (Number.isNaN(plantedOn.getTime())) {
    return c.json({ error: "plantedOn must be a valid date (YYYY-MM-DD)" }, 400);
  }

  const db = getDb(c.env.DB);
  const stages = await db
    .select()
    .from(cropStages)
    .where(eq(cropStages.cropId, c.req.param("cropId")))
    .orderBy(cropStages.startDay);

  if (stages.length === 0) {
    return c.json({ error: "no growth stages defined for this crop" }, 404);
  }

  return c.json(buildTimeline(stages, plantedOn));
});

/* ------------------------- Market prices ------------------------- */

// Latest price observations, optionally filtered. Newest first.
agricultureRouter.get("/prices", async (c) => {
  const db = getDb(c.env.DB);
  const itemType = c.req.query("itemType");
  const districtId = c.req.query("districtId");
  const cropId = c.req.query("cropId");
  const itemKey = c.req.query("itemKey");
  const limit = Math.min(Number(c.req.query("limit") ?? 50) || 50, 200);

  const conditions: SQL[] = [];
  if (isItemType(itemType)) conditions.push(eq(marketPrices.itemType, itemType));
  if (districtId) conditions.push(eq(marketPrices.districtId, districtId));
  if (cropId) conditions.push(eq(marketPrices.cropId, cropId));
  if (itemKey) conditions.push(eq(marketPrices.itemKey, itemKey));

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
  const itemKey = c.req.query("itemKey");
  if (!itemKey) return c.json({ error: "itemKey is required" }, 400);

  const districtId = c.req.query("districtId");
  const conditions: SQL[] = [eq(marketPrices.itemKey, itemKey)];
  if (districtId) conditions.push(eq(marketPrices.districtId, districtId));

  const db = getDb(c.env.DB);
  const history = await db
    .select()
    .from(marketPrices)
    .where(and(...conditions))
    .orderBy(marketPrices.recordedAt);

  return c.json({ itemKey, history });
});

agricultureRouter.post("/prices", requireAdmin, async (c) => {
  const body = await c.req.json<{
    itemType: ItemType;
    itemKey: string;
    itemName: Localized;
    districtId: string;
    cropId?: string;
    wholesale?: number;
    retail?: number;
    currency?: string;
  }>();

  if (!isItemType(body?.itemType) || !body?.itemKey || !isLocalized(body?.itemName) || !body?.districtId) {
    return c.json(
      {
        error:
          "itemType (crop|seed|fertilizer|pesticide), itemKey, itemName { en, ... } and districtId are required",
      },
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

/* ----------------------- Profitability --------------------------- */

// Public calculator. Provide marketPricePerKg, or cropId+districtId to use the
// latest recorded price (retail, falling back to wholesale). Stateless.
agricultureRouter.post("/profitability", async (c) => {
  const body = await c.req.json<{
    totalCost: number;
    expectedYieldKg: number;
    marketPricePerKg?: number;
    cropId?: string;
    districtId?: string;
  }>();

  if (!Number.isFinite(body?.totalCost) || !Number.isFinite(body?.expectedYieldKg)) {
    return c.json({ error: "totalCost and expectedYieldKg (numbers) are required" }, 400);
  }

  let price = body.marketPricePerKg;
  if (!Number.isFinite(price)) {
    if (!body.cropId || !body.districtId) {
      return c.json(
        { error: "provide marketPricePerKg, or cropId + districtId to look up the latest price" },
        400,
      );
    }
    const db = getDb(c.env.DB);
    const [latest] = await db
      .select()
      .from(marketPrices)
      .where(and(eq(marketPrices.cropId, body.cropId), eq(marketPrices.districtId, body.districtId)))
      .orderBy(desc(marketPrices.recordedAt))
      .limit(1);
    const resolved = latest?.retail ?? latest?.wholesale;
    if (resolved == null) {
      return c.json({ error: "no recorded price for that crop and district" }, 404);
    }
    price = resolved;
  }

  return c.json(
    computeProfitability({
      totalCost: body.totalCost,
      expectedYieldKg: body.expectedYieldKg,
      marketPricePerKg: price as number,
    }),
  );
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

// Symptom-based diagnosis search (matches across languages via LIKE over the
// stored JSON) + optional kind filter.
agricultureRouter.get("/diseases", async (c) => {
  const symptom = c.req.query("symptom");
  const kind = c.req.query("kind");

  const conditions: SQL[] = [];
  if (symptom) conditions.push(sql`${diseases.symptoms} LIKE ${"%" + symptom + "%"}`);
  if (isDiseaseKind(kind)) conditions.push(eq(diseases.kind, kind));

  const db = getDb(c.env.DB);
  const rows = await db
    .select()
    .from(diseases)
    .where(conditions.length ? and(...conditions) : undefined);

  return c.json({ diseases: rows });
});

agricultureRouter.post("/diseases", requireAdmin, async (c) => {
  const body = await c.req.json<{
    cropId: string;
    name: Localized;
    kind?: DiseaseKind;
    symptoms?: Localized;
    causes?: Localized;
    treatment?: Localized;
    prevention?: Localized;
    imageUrl?: string;
    imageKey?: string;
  }>();

  if (!body?.cropId || !isLocalized(body?.name)) {
    return c.json({ error: "cropId and name { en, ... } are required" }, 400);
  }

  const db = getDb(c.env.DB);
  const [created] = await db
    .insert(diseases)
    .values({ id: crypto.randomUUID(), ...body })
    .returning();

  return c.json({ disease: created }, 201);
});

// Delete a catalog entry and its UploadThing image (if any) together.
agricultureRouter.delete("/diseases/:id", requireAdmin, async (c) => {
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
