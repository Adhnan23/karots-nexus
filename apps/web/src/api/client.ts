import type { Crop, CropStage, Disease, GrowthTimeline } from "./types";

/**
 * Typed API client. In dev, Vite proxies these prefixes to the Worker (:8787);
 * in prod the SPA is same-origin with the Worker, so relative URLs work in both.
 *
 * GET responses are cached in localStorage so previously-viewed data (crops and
 * their stages) is available offline — the My Plantings progress view can then be
 * recomputed on-device when the network is down.
 */

const CACHE_PREFIX = "karots.cache.";

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}

/** Fetch JSON, caching success; on network failure fall back to the cache. */
async function getCached<T>(path: string, cacheKey: string): Promise<T> {
  try {
    const res = await fetch(path, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    writeCache(cacheKey, data);
    return data;
  } catch (err) {
    const cached = readCache<T>(cacheKey);
    if (cached) return cached;
    throw err;
  }
}

export async function listCrops(): Promise<Crop[]> {
  const data = await getCached<{ crops: Crop[] }>("/agriculture/crops", "crops");
  return data.crops;
}

export async function getCrop(id: string): Promise<Crop> {
  const data = await getCached<{ crop: Crop }>(`/agriculture/crops/${id}`, `crop.${id}`);
  return data.crop;
}

export async function getStages(cropId: string): Promise<CropStage[]> {
  const data = await getCached<{ stages: CropStage[] }>(
    `/agriculture/crops/${cropId}/stages`,
    `stages.${cropId}`,
  );
  return data.stages;
}

export async function getDiseases(cropId: string): Promise<Disease[]> {
  const data = await getCached<{ diseases: Disease[] }>(
    `/agriculture/crops/${cropId}/diseases`,
    `diseases.${cropId}`,
  );
  return data.diseases;
}

/** Server-computed growth timeline (online path). */
export async function getTimeline(cropId: string, plantedOn: string): Promise<GrowthTimeline> {
  const res = await fetch(
    `/agriculture/crops/${cropId}/timeline?plantedOn=${encodeURIComponent(plantedOn)}`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as GrowthTimeline;
}
