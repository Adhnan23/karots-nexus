import { Hono } from "hono";
import type { AppEnv } from "@karots/core";
import { getDb } from "@karots/db";
import { crops } from "./schema";

/**
 * Agriculture HTTP routes. Mounted by the core registry under "/agriculture",
 * so paths here are relative to that prefix.
 */
export const agricultureRouter = new Hono<AppEnv>();

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
