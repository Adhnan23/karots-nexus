import { eq } from "drizzle-orm";
import type { AppBindings, DistrictRisk } from "@karots/core";
import { getDb, coreSchema } from "@karots/db";
import { fetchWeather } from "./openMeteo";
import { deriveRisks } from "./risk";

const CACHE_TTL_SECONDS = 1800; // 30 minutes — matches the weather routes.

/**
 * Capability provider: current weather risk flags for a district, or null when
 * the district is unknown or has no coordinates. Reuses the same KV cache key
 * (`wx:<id>`) as the weather routes so a recent route call serves this for free.
 *
 * The composition root registers this as the core `districtRisks` capability so
 * the agriculture decision engine can use weather signals WITHOUT importing this
 * module (modules stay decoupled).
 */
export async function getDistrictRisks(
  env: AppBindings,
  districtId: string,
): Promise<DistrictRisk | null> {
  const cacheKey = `wx:${districtId}`;
  const cached = await env.CACHE.get<{ risks?: DistrictRisk }>(cacheKey, "json");
  if (cached?.risks) {
    const { heavyRain, heatStress, drySpell, thunderstorm } = cached.risks;
    return { heavyRain, heatStress, drySpell, thunderstorm };
  }

  const db = getDb(env.DB);
  const [district] = await db
    .select()
    .from(coreSchema.districts)
    .where(eq(coreSchema.districts.id, districtId));
  if (!district || district.latitude == null || district.longitude == null) return null;

  const weather = await fetchWeather(district.latitude, district.longitude);
  const risks = deriveRisks(weather);

  // Warm the shared cache so a later /weather call (and this provider) is fast.
  await env.CACHE.put(
    cacheKey,
    JSON.stringify({ districtId, ...weather, risks }),
    { expirationTtl: CACHE_TTL_SECONDS },
  );

  const { heavyRain, heatStress, drySpell, thunderstorm } = risks;
  return { heavyRain, heatStress, drySpell, thunderstorm };
}
