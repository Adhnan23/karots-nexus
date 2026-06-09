import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LangProvider";
import { usePlantings, removePlanting } from "@/plantings/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DAY_MS = 86_400_000;
const daysSince = (iso: string) =>
  Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS));

export function MyPlantings() {
  const { t, L } = useLang();
  const plantings = usePlantings();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("myPlantings")}</h1>

      {plantings.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("myPlantingsEmpty")}</p>
      )}

      <div className="space-y-3">
        {plantings.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between gap-3 pt-4">
              <Link to={`/plantings/${p.id}`} className="min-w-0 flex-1">
                <div className="font-semibold">
                  {p.nickname ? p.nickname : L(p.cropName)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.nickname ? L(p.cropName) + " · " : ""}
                  {t("dayN")} {daysSince(p.plantedOn)} · {p.plantedOn}
                </div>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <Link to={`/plantings/${p.id}`}>
                  <Button size="sm" variant="outline">
                    {t("viewProgress")}
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={t("remove")}
                  onClick={() => removePlanting(p.id)}
                >
                  ✕
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
