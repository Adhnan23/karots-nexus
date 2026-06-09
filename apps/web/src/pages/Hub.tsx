import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LangProvider";
import { useDistricts } from "@/district/store";
import { getWeather, getRecommendations } from "@/api/client";
import type { Weather, Recommendations } from "@/api/types";
import { DistrictPicker } from "@/components/DistrictPicker";
import { Card, CardContent } from "@/components/ui/card";
import { weatherEmoji } from "@/lib/weather";

const TILES = [
  { to: "/recommendations", key: "recommendations", icon: "🧭" },
  { to: "/crops", key: "crops", icon: "🌱" },
  { to: "/prices", key: "prices", icon: "💰" },
  { to: "/knowledge", key: "knowledge", icon: "📖" },
] as const;

export function Hub() {
  const { t, L } = useLang();
  const { selectedId } = useDistricts();

  const [weather, setWeather] = useState<Weather | null>(null);
  const [recs, setRecs] = useState<Recommendations | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    setWeather(null);
    setRecs(null);
    getWeather(selectedId).then(setWeather).catch(() => setWeather(null));
    getRecommendations(selectedId).then(setRecs).catch(() => setRecs(null));
  }, [selectedId]);

  const best = recs?.bestToPlantNow.slice(0, 3) ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary">{t("appName")}</h1>
        <p className="text-sm text-muted-foreground">{t("tagline")}</p>
      </div>

      <DistrictPicker />

      {/* Weather snapshot */}
      <Link to="/weather">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center justify-between pt-4">
            <div>
              <div className="text-xs text-muted-foreground">{t("todaysWeather")}</div>
              {weather ? (
                <div className="mt-1 text-2xl font-bold">
                  {Math.round(weather.current.temperatureC)}°C
                </div>
              ) : (
                <div className="mt-1 text-sm text-muted-foreground">{t("loading")}</div>
              )}
              {weather && (
                <div className="text-xs text-muted-foreground">
                  {t("humidity")} {weather.current.humidity}% · {t("wind")}{" "}
                  {Math.round(weather.current.windSpeedKmh)} km/h
                </div>
              )}
            </div>
            <div className="text-5xl">{weather ? weatherEmoji(weather.current.weatherCode) : "🌤️"}</div>
          </CardContent>
        </Card>
      </Link>

      {/* Best to plant now */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-semibold">{t("bestToPlantNow")}</h2>
          <Link to="/recommendations" className="text-xs text-primary">
            {t("viewAll")}
          </Link>
        </div>
        {best.length > 0 ? (
          <div className="space-y-2">
            {best.map((r) => (
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
          <p className="text-sm text-muted-foreground">
            {recs ? t("noRecommendations") : t("loading")}
          </p>
        )}
      </div>

      {/* Explore tiles */}
      <div>
        <h2 className="mb-2 font-semibold">{t("explore")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {TILES.map((tile) => (
            <Link key={tile.to} to={tile.to}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-3 pt-4">
                  <span className="text-2xl">{tile.icon}</span>
                  <span className="font-medium">{t(tile.key)}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
