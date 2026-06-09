import { useLang } from "@/i18n/LangProvider";
import { useDistricts } from "@/district/store";

/**
 * Global district selector. Every district-scoped screen (weather,
 * recommendations, prices) reads the same persisted choice, so changing it here
 * updates the whole app.
 */
export function DistrictPicker({ className }: { className?: string }) {
  const { t, L } = useLang();
  const { districts, selectedId, setSelectedId, loading } = useDistricts();

  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{t("district")}</span>
      <select
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(e.target.value)}
        disabled={loading || districts.length === 0}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm font-medium disabled:opacity-50"
        aria-label={t("selectDistrict")}
      >
        {districts.length === 0 && <option value="">{t("loading")}</option>}
        {districts.map((d) => (
          <option key={d.id} value={d.id}>
            {L(d.district)}
          </option>
        ))}
      </select>
    </label>
  );
}
