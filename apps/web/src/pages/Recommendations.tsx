import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LangProvider";
import { useDistricts } from "@/district/store";
import { getRecommendations } from "@/api/client";
import type { Recommendations as RecsData, Recommendation } from "@/api/types";
import { DistrictPicker } from "@/components/DistrictPicker";
import { Card, CardContent } from "@/components/ui/card";
import type { UIKey } from "@/i18n/strings";

export function Recommendations() {
  const { t, L } = useLang();
  const { selectedId } = useDistricts();
  const [data, setData] = useState<RecsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    setData(null);
    setError(false);
    getRecommendations(selectedId)
      .then(setData)
      .catch(() => setError(true));
  }, [selectedId]);

  const lenses: { key: UIKey; icon: string; items: Recommendation[] }[] = data
    ? [
        { key: "bestToPlantNow", icon: "🌱", items: data.bestToPlantNow },
        { key: "highProfit", icon: "💰", items: data.highProfit },
        { key: "lowRisk", icon: "🛡️", items: data.lowRisk },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t("recommendations")}</h1>
        <p className="text-sm text-muted-foreground">{t("recommendationsSub")}</p>
      </div>
      <DistrictPicker />

      {error && <p className="text-sm text-destructive">{t("offlineNote")}</p>}
      {!data && !error && <p className="text-sm text-muted-foreground">{t("loading")}</p>}

      {data &&
        lenses.map((lens) => (
          <div key={lens.key}>
            <h2 className="mb-2 font-semibold">
              {lens.icon} {t(lens.key)}
            </h2>
            {lens.items.length > 0 ? (
              <div className="space-y-2">
                {lens.items.map((r) => (
                  <Link key={r.cropId} to={`/crops/${r.cropId}`}>
                    <Card className="transition-shadow hover:shadow-md">
                      <CardContent className="pt-4">
                        <div className="font-semibold">{L(r.name)}</div>
                        <p className="text-xs text-muted-foreground">{L(r.reason)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noRecommendations")}</p>
            )}
          </div>
        ))}
    </div>
  );
}
