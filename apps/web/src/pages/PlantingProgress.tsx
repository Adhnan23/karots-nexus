import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTimeline, getStages } from "@/api/client";
import type { GrowthTimeline } from "@/api/types";
import { buildTimeline } from "@/lib/timeline";
import { useLang } from "@/i18n/LangProvider";
import { getPlanting } from "@/plantings/store";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PlantingProgress() {
  const { id = "" } = useParams();
  const { t, L } = useLang();
  const planting = getPlanting(id);

  const [timeline, setTimeline] = useState<GrowthTimeline | null>(null);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!planting) return;
    let cancelled = false;
    (async () => {
      try {
        // Online path: server-computed timeline.
        const tl = await getTimeline(planting.cropId, planting.plantedOn);
        if (!cancelled) setTimeline(tl);
      } catch {
        // Offline fallback: recompute from cached stages (getStages serves the
        // cache when the network is down).
        try {
          const stages = await getStages(planting.cropId);
          if (cancelled) return;
          setTimeline(buildTimeline(stages, new Date(planting.plantedOn)));
          setOffline(true);
        } catch {
          if (!cancelled) setError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [planting]);

  if (!planting) {
    return (
      <div className="space-y-3">
        <Link to="/plantings" className="text-sm text-muted-foreground">
          ← {t("back")}
        </Link>
        <p className="text-sm text-muted-foreground">{t("myPlantingsEmpty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link to="/plantings" className="text-sm text-muted-foreground">
        ← {t("back")}
      </Link>

      <div>
        <h1 className="text-2xl font-bold">
          {planting.nickname ? planting.nickname : L(planting.cropName)}
        </h1>
        <p className="text-sm text-muted-foreground">
          {L(planting.cropName)} · {planting.plantedOn}
        </p>
      </div>

      {offline && <p className="text-xs text-muted-foreground">{t("offlineNote")}</p>}
      {error && <p className="text-sm text-destructive">{t("offlineNote")}</p>}
      {!timeline && !error && <p className="text-sm text-muted-foreground">{t("loading")}</p>}

      {timeline && (
        <>
          <Card>
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">{t("currentStage")}</span>
                <span className="font-semibold">
                  {timeline.currentStage ? L(timeline.currentStage) : t("harvestReady")}
                </span>
              </div>

              {timeline.progressPercent != null && (
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${timeline.progressPercent}%` }}
                  />
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>
                  {t("dayN")} {timeline.daysSincePlanting}
                </span>
                <span className="text-muted-foreground">
                  {timeline.daysToHarvest != null && timeline.daysToHarvest > 0
                    ? `${timeline.daysToHarvest} ${t("daysToHarvest")}`
                    : t("harvestReady")}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {timeline.stages.map((s, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border p-3",
                  s.status === "current" && "border-primary bg-secondary",
                  s.status === "past" && "opacity-60",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {s.status === "current" ? "▶ " : s.status === "past" ? "✓ " : "• "}
                    {L(s.name)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.startDate} → {s.endDate}
                  </span>
                </div>
                {s.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{L(s.description)}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
