import type { Localized } from "@karots/core";
import type { WeatherBundle } from "./openMeteo";

/**
 * Farming risk indicators derived from the forecast (plan.md "Weather & Climate
 * Intelligence" + "Alerts"). Heuristics are intentionally simple and tunable;
 * thresholds are tropical-agriculture oriented (Sri Lanka). These are surfaced
 * on view — there are no pushed notifications.
 */
export type RiskCode = "heavyRain" | "heatStress" | "drySpell" | "thunderstorm";

export interface RiskNote {
  code: RiskCode;
  message: Localized;
}

export interface FarmingRisks {
  heavyRain: boolean;
  heatStress: boolean;
  drySpell: boolean;
  thunderstorm: boolean;
  notes: RiskNote[];
}

const THUNDERSTORM_CODES = new Set([95, 96, 99]); // WMO weather codes

// Best-effort si/ta translations — review by a native speaker recommended.
const RISK_MESSAGES: Record<RiskCode, Localized> = {
  heavyRain: {
    en: "Heavy rainfall expected (>=50mm/day) — risk of waterlogging and flooding.",
    si: "අධික වර්ෂාපතනයක් අපේක්ෂා කෙරේ (දිනකට >=50mm) — ජලය බැසීම හා ගංවතුර අවදානම.",
    ta: "கனமழை எதிர்பார்க்கப்படுகிறது (>=50mm/நாள்) — நீர் தேங்குதல் மற்றும் வெள்ள அபாயம்.",
  },
  heatStress: {
    en: "High temperatures (>=35°C) — irrigate and watch for heat stress.",
    si: "අධික උෂ්ණත්වය (>=35°C) — ජලය සපයන්න, තාප පීඩනය ගැන සැලකිලිමත් වන්න.",
    ta: "அதிக வெப்பநிலை (>=35°C) — நீர்ப்பாசனம் செய்து வெப்ப அழுத்தத்தை கவனியுங்கள்.",
  },
  drySpell: {
    en: "Dry spell across the forecast window — plan irrigation.",
    si: "පුරෝකථන කාලය තුළ වියළි කාලයක් — ජලසම්පාදනය සැලසුම් කරන්න.",
    ta: "முன்னறிவிப்பு காலத்தில் வறண்ட நிலை — நீர்ப்பாசனத்தை திட்டமிடுங்கள்.",
  },
  thunderstorm: {
    en: "Thunderstorms likely — secure young plants and structures.",
    si: "ගිගුරුම් සහිත වැසි ඇතිවිය හැක — තරුණ පැළ හා ව්‍යුහ සුරක්ෂිත කරන්න.",
    ta: "இடியுடன் கூடிய மழை ஏற்படலாம் — இளம் தாவரங்களையும் கட்டமைப்புகளையும் பாதுகாக்கவும்.",
  },
};

export function deriveRisks(w: WeatherBundle): FarmingRisks {
  const days = w.daily;
  const totalRain = days.reduce((sum, d) => sum + d.precipitationSumMm, 0);

  const flags = {
    heavyRain: days.some((d) => d.precipitationSumMm >= 50),
    heatStress: days.some((d) => d.tMaxC >= 35),
    drySpell: days.length > 0 && totalRain < 2 && days.every((d) => d.tMaxC >= 30),
    thunderstorm:
      THUNDERSTORM_CODES.has(w.current.weatherCode) ||
      days.some((d) => THUNDERSTORM_CODES.has(d.weatherCode)),
  };

  const notes: RiskNote[] = (Object.keys(flags) as RiskCode[])
    .filter((code) => flags[code])
    .map((code) => ({ code, message: RISK_MESSAGES[code] }));

  return { ...flags, notes };
}
