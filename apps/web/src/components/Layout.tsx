import { NavLink, Outlet } from "react-router-dom";
import { useLang } from "@/i18n/LangProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

/** Mobile-first app shell: top bar with brand + language, bottom tab nav. */
export function Layout() {
  const { t } = useLang();

  const tab = (to: string, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium",
          isActive ? "text-primary" : "text-muted-foreground",
        )
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur">
        <NavLink to="/" className="text-lg font-bold text-primary">
          {t("appName")}
        </NavLink>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 px-4 py-4 pb-24">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-screen-sm border-t bg-background">
        {tab("/", t("navCrops"))}
        {tab("/plantings", t("navMyPlantings"))}
      </nav>
    </div>
  );
}
