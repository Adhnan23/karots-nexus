import type { Localized } from "@/i18n/localized";

/** Mirrors the agriculture module's API shapes (the fields the UI consumes). */

export interface GuideStep {
  title: Localized;
  body: Localized;
}

export interface Crop {
  id: string;
  name: Localized;
  category?: Localized | null;
  cultivationDurationDays?: number | null;
  imageUrl?: string | null;
  seasons?: string[] | null;
  plantingMonths?: number[] | null;
  waterRequirement?: "low" | "medium" | "high" | null;
  expectedYieldKgPerAcre?: number | null;
  climate?: Localized | null;
  soil?: Localized | null;
  guide?: GuideStep[] | null;
}

export interface CropStage {
  id: string;
  cropId: string;
  name: Localized;
  startDay: number;
  endDay: number;
  description?: Localized | null;
  sortOrder: number;
}

export interface Disease {
  id: string;
  cropId: string;
  name: Localized;
  kind: "disease" | "pest";
  symptoms?: Localized | null;
  treatment?: Localized | null;
  prevention?: Localized | null;
}

export interface StageView {
  name: Localized;
  startDay: number;
  endDay: number;
  description: Localized | null;
  startDate: string;
  endDate: string;
  status: "past" | "current" | "upcoming";
}

export interface GrowthTimeline {
  plantedOn: string;
  asOf: string;
  daysSincePlanting: number;
  currentStage: Localized | null;
  daysToHarvest: number | null;
  progressPercent: number | null;
  stages: StageView[];
}

export interface District {
  id: string;
  country: string;
  district: Localized;
  localArea?: Localized | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface WeatherCurrent {
  time: string;
  temperatureC: number;
  humidity: number;
  precipitationMm: number;
  windSpeedKmh: number;
  weatherCode: number;
}

export interface ForecastDay {
  date: string;
  tMaxC: number;
  tMinC: number;
  precipitationSumMm: number;
  precipitationProbabilityMax: number;
  weatherCode: number;
}

export type RiskCode = "heavyRain" | "heatStress" | "drySpell" | "thunderstorm";

export interface FarmingRisks {
  heavyRain: boolean;
  heatStress: boolean;
  drySpell: boolean;
  thunderstorm: boolean;
  notes: { code: RiskCode; message: Localized }[];
}

export interface Weather {
  districtId: string;
  district: Localized;
  fetchedAt: string;
  current: WeatherCurrent;
  daily: ForecastDay[];
  risks: FarmingRisks;
  cached?: boolean;
}

export interface Recommendation {
  cropId: string;
  name: Localized;
  score: number;
  reason: Localized;
}

export interface Recommendations {
  districtId: string;
  month: number;
  bestToPlantNow: Recommendation[];
  highProfit: Recommendation[];
  lowRisk: Recommendation[];
}

export type ItemType = "crop" | "essential";

export interface MarketPrice {
  id: string;
  itemType: ItemType;
  itemKey: string;
  itemName: Localized;
  cropId?: string | null;
  districtId?: string | null;
  wholesale?: number | null;
  retail?: number | null;
  currency: string;
  recordedAt: string;
}

export type KnowledgeCategory =
  | "crop-guide"
  | "technique"
  | "soil"
  | "fertilizer"
  | "irrigation"
  | "seasonal"
  | "pest";

export interface Article {
  id: string;
  title: Localized;
  summary?: Localized | null;
  body: Localized;
  category: KnowledgeCategory;
  cropId?: string | null;
  imageUrl?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
