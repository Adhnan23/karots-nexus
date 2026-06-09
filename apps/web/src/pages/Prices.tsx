import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LangProvider";
import { listPrices } from "@/api/client";
import type { MarketPrice } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";

function fmtDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-GB" : locale, {
    day: "numeric",
    month: "short",
  });
}

export function Prices() {
  const { t, L, locale } = useLang();
  const [prices, setPrices] = useState<MarketPrice[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    listPrices()
      .then(setPrices)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t("prices")}</h1>
        <p className="text-sm text-muted-foreground">{t("pricesSub")}</p>
      </div>

      {error && <p className="text-sm text-destructive">{t("offlineNote")}</p>}
      {!prices && !error && <p className="text-sm text-muted-foreground">{t("loading")}</p>}
      {prices && prices.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("noPrices")}</p>
      )}

      <div className="space-y-2">
        {prices?.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between pt-4">
              <div>
                <div className="font-semibold">{L(p.itemName)}</div>
                <div className="text-xs text-muted-foreground">{fmtDate(p.recordedAt, locale)}</div>
              </div>
              <div className="text-right">
                {p.retail != null && (
                  <div className="font-semibold">
                    {p.currency} {p.retail}
                    <span className="text-xs font-normal text-muted-foreground"> {t("retail")}</span>
                  </div>
                )}
                {p.wholesale != null && (
                  <div className="text-xs text-muted-foreground">
                    {p.currency} {p.wholesale} {t("wholesale")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
