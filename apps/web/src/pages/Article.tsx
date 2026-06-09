import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLang } from "@/i18n/LangProvider";
import { getArticle } from "@/api/client";
import type { Article as ArticleData } from "@/api/types";
import type { UIKey } from "@/i18n/strings";

export function Article() {
  const { id = "" } = useParams();
  const { t, L } = useLang();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getArticle(id)
      .then(setArticle)
      .catch(() => setError(true));
  }, [id]);

  return (
    <div className="space-y-4">
      <Link to="/knowledge" className="text-sm text-muted-foreground">
        ← {t("back")}
      </Link>

      {error && <p className="text-sm text-destructive">{t("offlineNote")}</p>}
      {!article && !error && <p className="text-sm text-muted-foreground">{t("loading")}</p>}

      {article && (
        <article className="space-y-3">
          <div className="text-[11px] font-medium uppercase tracking-wide text-primary">
            {t(`cat.${article.category}` as UIKey)}
          </div>
          <h1 className="text-2xl font-bold">{L(article.title)}</h1>
          {article.summary && (
            <p className="text-sm text-muted-foreground">{L(article.summary)}</p>
          )}
          {article.imageUrl && (
            <img src={article.imageUrl} alt="" className="w-full rounded-lg object-cover" />
          )}
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{L(article.body)}</div>
        </article>
      )}
    </div>
  );
}
