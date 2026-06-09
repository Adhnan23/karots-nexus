/**
 * Farming Decision Engine (plan.md #4) — pure, stateless scoring that ranks the
 * crop catalog for a district "right now". No I/O: the route gathers crops and
 * price trends and passes them in, exactly like the timeline/profitability
 * calculators. This keeps the engine unit-testable and, crucially, free of any
 * cross-module dependency (it never imports the weather module — see the
 * optional `risks` seam below).
 *
 * Three lenses on the same catalog:
 *  - bestToPlantNow — suited to the district and inside the sow window for now
 *  - highProfit     — suited to the district, ranked by price × expected yield
 *  - lowRisk        — suited to the district, favouring lower water dependence
 *
 * Reasons are Localized (en/si/ta) via a fixed message dictionary — same pattern
 * as the weather module's risk messages — so nothing needs runtime translation.
 */
import type { Localized, DistrictRisk } from "@karots/core";
import type { Crop } from "./schema";

/** Recent price signal for one crop in the target district (per kg). */
export interface CropPriceTrend {
  /** Newest observed price (retail, else wholesale); null if none recorded. */
  latest: number | null;
  /** The prior observation, for direction; null if only one/none recorded. */
  previous: number | null;
}

export interface RecommendationInput {
  crops: Crop[];
  /** Price trend per cropId in the target district. */
  trendByCrop: Record<string, CropPriceTrend>;
  districtId: string;
  /** Calendar month (1–12) the guest is planning for. */
  month: number;
  /**
   * Optional district weather risk flags. Supplied by the route from the core
   * `districtRisks` capability (provided by the weather module) — agriculture
   * never imports weather directly. When absent, scoring ignores weather.
   */
  risks?: DistrictRisk;
}

export interface Recommendation {
  cropId: string;
  name: Localized;
  score: number;
  reason: Localized;
}

export interface CropRecommendations {
  districtId: string;
  month: number;
  bestToPlantNow: Recommendation[];
  highProfit: Recommendation[];
  lowRisk: Recommendation[];
}

const REASON: Record<"inSeason" | "highValue" | "risingPrice" | "lowRisk", Localized> = {
  inSeason: {
    en: "In the planting window for your district right now.",
    si: "දැන් ඔබේ දිස්ත්‍රික්කයේ වැපිරීමේ කාලය තුළ පවතී.",
    ta: "இப்போது உங்கள் மாவட்டத்தில் நடவு செய்யும் காலத்தில் உள்ளது.",
  },
  highValue: {
    en: "High expected value from current prices and yield.",
    si: "වර්තමාන මිල හා අස්වැන්න අනුව ඉහළ අපේක්ෂිත වටිනාකමක්.",
    ta: "தற்போதைய விலை மற்றும் விளைச்சலின் அடிப்படையில் அதிக எதிர்பார்க்கப்படும் மதிப்பு.",
  },
  risingPrice: {
    en: "Market price has been trending upward.",
    si: "වෙළඳපොළ මිල ඉහළ යමින් පවතී.",
    ta: "சந்தை விலை மேல்நோக்கி உயர்ந்து வருகிறது.",
  },
  lowRisk: {
    en: "Reliable pick — suits the district with moderate water needs.",
    si: "විශ්වසනීය තේරීමක් — මධ්‍යස්ථ ජල අවශ්‍යතා සහිතව දිස්ත්‍රික්කයට ගැලපේ.",
    ta: "நம்பகமான தேர்வு — மிதமான நீர் தேவையுடன் மாவட்டத்திற்கு ஏற்றது.",
  },
};

const TOP_N = 5;

/** Crop suits the district if it has no district restriction, or lists it. */
function suitsDistrict(crop: Crop, districtId: string): boolean {
  const d = crop.suitableDistricts;
  return !d || d.length === 0 || d.includes(districtId);
}

/** Months adjacent to `month` (±1, wrapping Dec↔Jan) — the ±1 sow tolerance. */
function sowWindow(month: number): Set<number> {
  const wrap = (m: number) => ((m - 1 + 12) % 12) + 1;
  return new Set([wrap(month - 1), month, wrap(month + 1)]);
}

function inSeason(crop: Crop, window: Set<number>): boolean {
  return (crop.plantingMonths ?? []).some((m) => window.has(m));
}

/** Higher water dependence = more weather-exposed = lower baseline reliability. */
function waterScore(crop: Crop): number {
  switch (crop.waterRequirement) {
    case "low":
      return 20;
    case "medium":
      return 10;
    case "high":
      return 0;
    default:
      return 5;
  }
}

/** Penalty when a district's current weather conflicts with the crop's needs. */
function riskPenalty(crop: Crop, risks: DistrictRisk): number {
  let p = 0;
  if (risks.drySpell && crop.waterRequirement === "high") p += 30;
  if (risks.heavyRain && crop.waterRequirement === "low") p += 15;
  if (risks.heatStress && crop.waterRequirement === "high") p += 10;
  return p;
}

export function recommendCrops(input: RecommendationInput): CropRecommendations {
  const { crops, trendByCrop, districtId, month, risks } = input;
  const window = sowWindow(month);
  const suited = crops.filter((c) => suitsDistrict(c, districtId));

  const bestToPlantNow: Recommendation[] = [];
  const highProfit: Recommendation[] = [];
  const lowRisk: Recommendation[] = [];

  for (const crop of suited) {
    const trend = trendByCrop[crop.id] ?? { latest: null, previous: null };
    const rising =
      trend.latest != null && trend.previous != null && trend.latest > trend.previous;
    const seasonNow = inSeason(crop, window);

    // bestToPlantNow — must be in the sow window.
    if (seasonNow) {
      bestToPlantNow.push({
        cropId: crop.id,
        name: crop.name,
        score: 100 + ((crop.plantingMonths ?? []).includes(month) ? 20 : 0) + (rising ? 10 : 0),
        reason: REASON.inSeason,
      });
    }

    // highProfit — price × yield when a price is known, else yield alone (a
    // weaker proxy so the list stays useful before price data is entered).
    const yieldKg = crop.expectedYieldKgPerAcre ?? 0;
    const value = trend.latest != null ? trend.latest * yieldKg : yieldKg;
    if (value > 0) {
      highProfit.push({
        cropId: crop.id,
        name: crop.name,
        score: value + (rising ? value * 0.1 : 0),
        reason: rising ? REASON.risingPrice : REASON.highValue,
      });
    }

    // lowRisk — reliability heuristic; weather risks subtract when provided.
    const score = 50 + (seasonNow ? 20 : 0) + waterScore(crop) - (risks ? riskPenalty(crop, risks) : 0);
    if (score > 0) {
      lowRisk.push({ cropId: crop.id, name: crop.name, score, reason: REASON.lowRisk });
    }
  }

  const top = (xs: Recommendation[]) =>
    xs.sort((a, b) => b.score - a.score).slice(0, TOP_N);

  return {
    districtId,
    month,
    bestToPlantNow: top(bestToPlantNow),
    highProfit: top(highProfit),
    lowRisk: top(lowRisk),
  };
}
