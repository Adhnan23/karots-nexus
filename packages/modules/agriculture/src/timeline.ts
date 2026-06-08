import type { CropStage } from "./schema";

export interface StageView {
  name: string;
  startDay: number;
  endDay: number;
  description: string | null;
  startDate: string;
  endDate: string;
  status: "past" | "current" | "upcoming";
}

export interface GrowthTimeline {
  plantedOn: string;
  asOf: string;
  daysSincePlanting: number;
  currentStage: string | null;
  daysToHarvest: number | null;
  progressPercent: number | null;
  stages: StageView[];
}

const DAY_MS = 86_400_000;

const addDays = (base: Date, days: number) => new Date(base.getTime() + days * DAY_MS);
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Project a crop's day-offset stages onto absolute dates given a planting date,
 * and work out where the plant *should* be today. Pure function — no per-user
 * storage, so guests can use it freely.
 */
export function buildTimeline(
  stagesRaw: CropStage[],
  plantedOn: Date,
  asOf: Date = new Date(),
): GrowthTimeline {
  const stages = [...stagesRaw].sort(
    (a, b) => a.startDay - b.startDay || a.sortOrder - b.sortOrder,
  );
  const daysSince = Math.floor((asOf.getTime() - plantedOn.getTime()) / DAY_MS);
  const harvestDay = stages.length ? Math.max(...stages.map((s) => s.endDay)) : null;

  const stageViews: StageView[] = stages.map((s) => {
    const status: StageView["status"] =
      daysSince < s.startDay ? "upcoming" : daysSince > s.endDay ? "past" : "current";
    return {
      name: s.name,
      startDay: s.startDay,
      endDay: s.endDay,
      description: s.description,
      startDate: isoDate(addDays(plantedOn, s.startDay)),
      endDate: isoDate(addDays(plantedOn, s.endDay)),
      status,
    };
  });

  const current = stageViews.find((s) => s.status === "current") ?? null;
  const daysToHarvest = harvestDay == null ? null : harvestDay - daysSince;
  const progressPercent =
    harvestDay && harvestDay > 0
      ? Math.max(0, Math.min(100, Math.round((daysSince / harvestDay) * 100)))
      : null;

  return {
    plantedOn: isoDate(plantedOn),
    asOf: isoDate(asOf),
    daysSincePlanting: daysSince,
    currentStage: current?.name ?? null,
    daysToHarvest,
    progressPercent,
    stages: stageViews,
  };
}
