import { useLang } from "@/i18n/LangProvider";
import { LOCALES, LOCALE_LABELS } from "@/i18n/localized";
import { cn } from "@/lib/utils";

/** Compact en/si/ta toggle. Selection persists (LangProvider → localStorage). */
export function LanguageSwitcher() {
  const { locale, setLocale } = useLang();
  return (
    <div className="flex items-center gap-1 rounded-full border bg-background p-0.5">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            locale === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
          )}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
