import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCrops } from "@/api/client";
import type { Crop } from "@/api/types";
import { useLang } from "@/i18n/LangProvider";
import { Card, CardContent } from "@/components/ui/card";

export function CropList() {
  const { t, L } = useLang();
  const [crops, setCrops] = useState<Crop[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    listCrops().then(setCrops).catch(() => setError(true));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t("crops")}</h1>
        <p className="text-sm text-muted-foreground">{t("cropsSub")}</p>
      </div>

      {error && !crops && <p className="text-sm text-destructive">{t("offlineNote")}</p>}
      {!crops && !error && <p className="text-sm text-muted-foreground">{t("loading")}</p>}

      <div className="grid grid-cols-2 gap-3">
        {crops?.map((crop) => (
          <Link key={crop.id} to={`/crops/${crop.id}`}>
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
              {crop.imageUrl ? (
                <img src={crop.imageUrl} alt="" className="h-24 w-full object-cover" />
              ) : (
                <div className="flex h-24 items-center justify-center bg-secondary text-3xl">🌱</div>
              )}
              <CardContent className="p-3">
                <div className="font-semibold leading-tight">{L(crop.name)}</div>
                {crop.category && (
                  <div className="mt-0.5 text-xs text-muted-foreground">{L(crop.category)}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
