import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LangProvider";
import { useDistricts } from "@/district/store";
import { getWeather } from "@/api/client";
import type { Weather as WeatherData } from "@/api/types";
import { DistrictPicker } from "@/components/DistrictPicker";
import { Card, CardContent } from "@/components/ui/card";
import { weatherEmoji } from "@/lib/weather";

function dayLabel(iso: string, locale: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(locale === "en" ? "en-GB" : locale, { weekday: "short", day: "numeric" });
}

export function Weather() {
  const { t, L, locale } = useLang();
  const { selectedId } = useDistricts();
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    setData(null);
    setError(false);
    getWeather(selectedId)
      .then(setData)
      .catch(() => setError(true));
  }, [selectedId]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("weather")}</h1>
      <DistrictPicker />

      {error && <p className="text-sm text-destructive">{t("weatherUnavailable")}</p>}
      {!data && !error && <p className="text-sm text-muted-foreground">{t("loading")}</p>}

      {data && (
        <>
          {/* Current */}
          <Card>
            <CardContent className="flex items-center justify-between pt-4">
              <div>
                <div className="text-sm text-muted-foreground">{L(data.district)}</div>
                <div className="text-4xl font-bold">{Math.round(data.current.temperatureC)}°C</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {t("humidity")} {data.current.humidity}% · {t("wind")}{" "}
                  {Math.round(data.current.windSpeedKmh)} km/h · {t("rain")} {data.current.precipitationMm}mm
                </div>
              </div>
              <div className="text-6xl">{weatherEmoji(data.current.weatherCode)}</div>
            </CardContent>
          </Card>

          {/* Farming risks */}
          <div>
            <h2 className="mb-2 font-semibold">{t("farmingRisks")}</h2>
            {data.risks.notes.length > 0 ? (
              <div className="space-y-2">
                {data.risks.notes.map((n) => (
                  <Card key={n.code} className="border-amber-300 bg-amber-50">
                    <CardContent className="pt-4 text-sm">⚠️ {L(n.message)}</CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noRisks")}</p>
            )}
          </div>

          {/* 7-day forecast */}
          <div>
            <h2 className="mb-2 font-semibold">{t("forecast")}</h2>
            <Card>
              <CardContent className="divide-y pt-2">
                {data.daily.map((d) => (
                  <div key={d.date} className="flex items-center justify-between py-2 text-sm">
                    <span className="w-20 text-muted-foreground">{dayLabel(d.date, locale)}</span>
                    <span className="text-xl">{weatherEmoji(d.weatherCode)}</span>
                    <span className="text-xs text-muted-foreground">
                      💧 {d.precipitationProbabilityMax}%
                    </span>
                    <span className="w-20 text-right font-medium">
                      {Math.round(d.tMaxC)}° / {Math.round(d.tMinC)}°
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
