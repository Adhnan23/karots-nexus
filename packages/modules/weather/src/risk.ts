import type { WeatherBundle } from "./openMeteo";

/**
 * Farming risk indicators derived from the forecast (plan.md "Weather & Climate
 * Intelligence" + "Alerts"). Heuristics are intentionally simple and tunable;
 * thresholds are tropical-agriculture oriented (Sri Lanka).
 */
export interface FarmingRisks {
  heavyRain: boolean;
  heatStress: boolean;
  drySpell: boolean;
  thunderstorm: boolean;
  notes: string[];
}

const THUNDERSTORM_CODES = new Set([95, 96, 99]); // WMO weather codes

export function deriveRisks(w: WeatherBundle): FarmingRisks {
  const days = w.daily;
  const totalRain = days.reduce((sum, d) => sum + d.precipitationSumMm, 0);

  const heavyRain = days.some((d) => d.precipitationSumMm >= 50);
  const heatStress = days.some((d) => d.tMaxC >= 35);
  const drySpell = days.length > 0 && totalRain < 2 && days.every((d) => d.tMaxC >= 30);
  const thunderstorm =
    THUNDERSTORM_CODES.has(w.current.weatherCode) ||
    days.some((d) => THUNDERSTORM_CODES.has(d.weatherCode));

  const notes: string[] = [];
  if (heavyRain)
    notes.push("Heavy rainfall expected (>=50mm/day) — risk of waterlogging and flooding.");
  if (heatStress)
    notes.push("High temperatures (>=35°C) — irrigate and watch for heat stress.");
  if (drySpell) notes.push("Dry spell across the forecast window — plan irrigation.");
  if (thunderstorm)
    notes.push("Thunderstorms likely — secure young plants and structures.");

  return { heavyRain, heatStress, drySpell, thunderstorm, notes };
}
