import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { isLocale, localize, type Locale, type Localized } from "./localized";
import { t as translate, type UIKey } from "./strings";

const STORAGE_KEY = "karots.locale";

interface LangContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Resolve a UI chrome string. */
  t: (key: UIKey) => string;
  /** Resolve a Localized API value into the active language. */
  L: (value: Localized | undefined | null) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

function initialLocale(): Locale {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  if (stored && isLocale(stored)) return stored;
  return "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const value = useMemo<LangContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key: UIKey) => translate(key, locale),
      L: (v: Localized | undefined | null) => localize(v, locale),
    }),
    [locale, setLocale],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
