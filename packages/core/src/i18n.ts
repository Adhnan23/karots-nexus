/**
 * Internationalisation primitives. Sri Lanka has three official languages, so
 * user-facing content is stored as a Localized value and the API returns all
 * languages — the frontend renders whichever the user selected (instant switch,
 * offline-friendly). `localize()` exists for server-generated text and simple
 * clients that pass `?lang=`.
 */
export const LOCALES = ["en", "si", "ta"] as const;
export type Locale = (typeof LOCALES)[number];

/** A translatable string. English is required; Sinhala/Tamil are optional. */
export interface Localized {
  en: string;
  si?: string;
  ta?: string;
}

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

/** Pick a locale's string, falling back to English. */
export function localize(value: Localized | null | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale] ?? value.en ?? "";
}

/** Validate an incoming Localized payload (must at least have non-empty `en`). */
export function isLocalized(v: unknown): v is Localized {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as Record<string, unknown>).en === "string" &&
    (v as Localized).en.length > 0
  );
}

/** Resolve a locale from `?lang=` then `Accept-Language`; defaults to English. */
export function resolveLocale(lang?: string | null, acceptLanguage?: string | null): Locale {
  if (isLocale(lang)) return lang;
  const first = acceptLanguage?.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  if (isLocale(first)) return first;
  return "en";
}
