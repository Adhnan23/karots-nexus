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
