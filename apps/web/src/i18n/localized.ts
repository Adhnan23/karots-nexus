/**
 * Frontend locale helpers. The `Localized` shape mirrors @karots/core's, but is
 * declared locally (not imported) to keep server-only/Cloudflare-typed core code
 * out of the browser bundle and typecheck. Mirrors `localize`/`resolveLocale`/
 * `LOCALES` in packages/core/src/i18n.ts.
 */
export interface Localized {
  en: string;
  si?: string;
  ta?: string;
}

export const LOCALES = ["en", "si", "ta"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  si: "සිංහල",
  ta: "தமிழ்",
};

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/** Pick the user's locale from a Localized value, falling back to English. */
export function localize(value: Localized | undefined | null, locale: Locale): string {
  if (!value) return "";
  return value[locale] ?? value.en ?? "";
}
