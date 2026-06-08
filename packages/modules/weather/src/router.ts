import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { AppBindings, AppEnv } from "@karots/core";
import { getDb, coreSchema } from "@karots/db";
import { fetchWeather } from "./openMeteo";
import { deriveRisks } from "./risk";

/**
 * Weather routes (plan.md "Weather & Climate Intelligence"). Data comes from
 * Open-Meteo, keyed by a district's stored coordinates, and is cached in KV so
 * we stay well within Open-Meteo's free quota and respond fast.
 */
export const weatherRouter = new Hono<AppEnv>();

const CACHE_TTL_SECONDS = 1800; // 30 minutes

async function loadDistrict(env: AppBindings, districtId: string) {
  const db = getDb(env.DB);
  const [district] = await db
    .select()
    .from(coreSchema.districts)
    .where(eq(coreSchema.districts.id, districtId));
  return district;
}

// Current conditions + 7-day forecast + derived farming risks for a district.
weatherRouter.get("/", async (c) => {
  const districtId = c.req.query("districtId");
  if (!districtId) return c.json({ error: "districtId is required" }, 400);

  const cacheKey = `wx:${districtId}`;
  const cached = await c.env.CACHE.get<Record<string, unknown>>(cacheKey, "json");
  if (cached) return c.json({ ...cached, cached: true });

  const district = await loadDistrict(c.env, districtId);
  if (!district) return c.json({ error: "district not found" }, 404);
  if (district.latitude == null || district.longitude == null) {
    return c.json({ error: "district has no coordinates set" }, 422);
  }

  const weather = await fetchWeather(district.latitude, district.longitude);
  const payload = {
    districtId,
    district: district.district,
    fetchedAt: new Date().toISOString(),
    ...weather,
    risks: deriveRisks(weather),
  };

  // Cache write is post-response work — don't block the client on it.
  c.executionCtx.waitUntil(
    c.env.CACHE.put(cacheKey, JSON.stringify(payload), {
      expirationTtl: CACHE_TTL_SECONDS,
    }),
  );

  return c.json({ ...payload, cached: false });
});

// Ad-hoc lookup by raw coordinates (no district, no cache). Useful for testing
// and one-off queries.
weatherRouter.get("/at", async (c) => {
  const lat = Number(c.req.query("lat"));
  const lon = Number(c.req.query("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return c.json({ error: "numeric lat and lon are required" }, 400);
  }

  const weather = await fetchWeather(lat, lon);
  return c.json({ fetchedAt: new Date().toISOString(), ...weather, risks: deriveRisks(weather) });
});
