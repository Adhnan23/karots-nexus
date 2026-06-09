import type { KarotsModule } from "@karots/core";
import { weatherRouter } from "./router";

/**
 * Weather module definition. Registered by the composition root (apps/api).
 * Has no DB tables of its own — it reads district coordinates from core and
 * fetches live data from Open-Meteo, caching in KV.
 */
export const weatherModule: KarotsModule = {
  name: "weather",
  basePath: "/weather",
  router: weatherRouter,
};

export { fetchWeather } from "./openMeteo";
export type { WeatherBundle, CurrentWeather, ForecastDay } from "./openMeteo";
export { deriveRisks } from "./risk";
export type { FarmingRisks, RiskNote, RiskCode } from "./risk";
export { getDistrictRisks } from "./provider";
