import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LangProvider";
import { listArticles } from "@/api/client";
import type { Article, KnowledgeCategory } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UIKey } from "@/i18n/strings";

const CATEGORIES: KnowledgeCategory[] = [
  "crop-guide",
  "technique",
  "soil",
  "fertilizer",
  "irrigation",
  "seasonal",
  "pest",
];

export function Knowledge() {
  const { t, L } = useLang();
  const [category, setCategory] = useState<KnowledgeCategory | "">("");
  const [q, setQ] = useState("");
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setArticles(null);
    setError(false);
    const handle = setTimeout(() => {
      listArticles({ category: category || undefined, q: q.trim() || undefined })
        .then(setArticles)
        .catch(() => setError(true));
    }, 200);
    return () => clearTimeout(handle);
  }, [category, q]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t("knowledge")}</h1>
        <p className="text-sm text-muted-foreground">{t("knowledgeSub")}</p>
      </div>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap gap-2">
        <Chip active={category === ""} onClick={() => setCategory("")} label={t("allTopics")} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
            label={t(`cat.${c}` as UIKey)}
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{t("offlineNote")}</p>}
      {!articles && !error && <p className="text-sm text-muted-foreground">{t("loading")}</p>}
      {articles && articles.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("noArticles")}</p>
      )}

      <div className="space-y-2">
        {articles?.map((a) => (
          <Link key={a.id} to={`/knowledge/${a.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="pt-4">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-primary">
                  {t(`cat.${a.category}` as UIKey)}
                </div>
                <div className="font-semibold leading-tight">{L(a.title)}</div>
                {a.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{L(a.summary)}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
      )}
    >
      {label}
    </button>
  );
}
