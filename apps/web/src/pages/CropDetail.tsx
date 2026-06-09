import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCrop, getStages, getDiseases } from "@/api/client";
import type { Crop, CropStage, Disease } from "@/api/types";
import { useLang } from "@/i18n/LangProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addPlanting } from "@/plantings/store";

const todayISO = () => new Date().toISOString().slice(0, 10);

export function CropDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { t, L } = useLang();

  const [crop, setCrop] = useState<Crop | null>(null);
  const [stages, setStages] = useState<CropStage[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);

  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    getCrop(id).then(setCrop).catch(() => setCrop(null));
    getStages(id).then(setStages).catch(() => setStages([]));
    getDiseases(id).then(setDiseases).catch(() => setDiseases([]));
  }, [id]);

  if (!crop) return <p className="text-sm text-muted-foreground">{t("loading")}</p>;

  function save() {
    if (!crop) return;
    addPlanting({ cropId: crop.id, cropName: crop.name, plantedOn: date, nickname: nickname.trim() || undefined });
    navigate("/plantings");
  }

  return (
    <div className="space-y-4">
      <Link to="/crops" className="text-sm text-muted-foreground">
        ← {t("back")}
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{L(crop.name)}</h1>
        {crop.category && <p className="text-sm text-muted-foreground">{L(crop.category)}</p>}
      </div>

      {/* quick facts */}
      <div className="flex flex-wrap gap-2 text-xs">
        {crop.seasons?.length ? (
          <span className="rounded-full bg-secondary px-2.5 py-1">
            {t("seasons")}: {crop.seasons.join(", ")}
          </span>
        ) : null}
        {crop.waterRequirement && (
          <span className="rounded-full bg-secondary px-2.5 py-1">
            {t("waterNeed")}: {crop.waterRequirement}
          </span>
        )}
      </div>

      {/* I planted this */}
      {adding ? (
        <Card>
          <CardContent className="space-y-3 pt-4">
            <label className="block text-sm font-medium">
              {t("plantingDate")}
              <input
                type="date"
                value={date}
                max={todayISO()}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium">
              {t("nicknameOptional")}
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
              />
            </label>
            <div className="flex gap-2">
              <Button onClick={save}>{t("save")}</Button>
              <Button variant="outline" onClick={() => setAdding(false)}>
                {t("cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button className="w-full" onClick={() => setAdding(true)}>
          🌱 {t("iPlantedThis")}
        </Button>
      )}

      {crop.climate && (
        <Section title={t("climate")}>{L(crop.climate)}</Section>
      )}
      {crop.soil && <Section title={t("soil")}>{L(crop.soil)}</Section>}

      {crop.guide?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("farmingGuide")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {crop.guide.map((step, i) => (
              <div key={i}>
                <div className="font-medium">
                  {i + 1}. {L(step.title)}
                </div>
                <p className="text-sm text-muted-foreground">{L(step.body)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {stages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("growthStages")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stages.map((s) => (
              <div key={s.id} className="flex justify-between text-sm">
                <span>{L(s.name)}</span>
                <span className="text-muted-foreground">
                  {t("dayN")} {s.startDay}–{s.endDay}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {diseases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("diseasesPests")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {diseases.map((d) => (
              <div key={d.id} className="text-sm">
                <span className="font-medium">{L(d.name)}</span>{" "}
                <span className="text-xs text-muted-foreground">({d.kind})</span>
                {d.symptoms && <p className="text-muted-foreground">{L(d.symptoms)}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  );
}
