"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarClock, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { knowledgeBaseService } from "@/src/services/knowledge-base.service";

type ArticleStatus = "published" | "draft" | "archived";

type Article = {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  status: ArticleStatus;
  language?: string | null;
  createdAt: string;
  updatedAt: string;
};

function statusLabel(status: ArticleStatus) {
  switch (status) {
    case "published":
      return "Publie";
    case "draft":
      return "Brouillon";
    case "archived":
      return "Archive";
    default:
      return status;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ArticleDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [article, setArticle] = React.useState<Article | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) {
      setError("Identifiant article invalide.");
      setIsLoading(false);
      return;
    }
    const articleId = id;

    let mounted = true;

    async function loadArticle() {
      try {
        setIsLoading(true);
        setError(null);

        const response = (await knowledgeBaseService.getById(articleId)) as Article;

        if (mounted) {
          setArticle(response);
        }
      } catch (err) {
        console.error("Failed to load article", err);
        if (mounted) {
          setError("Impossible de charger cet article.");
          setArticle(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadArticle();

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/knowledge-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour a la base
          </Link>
        </Button>

        {id ? (
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/knowledge-base/${id}/edit`}>Modifier</Link>
          </Button>
        ) : null}
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Chargement...</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!isLoading && article ? (
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {statusLabel(article.status)}
              </Badge>
              {article.summary ? (
                <Badge variant="outline" className="rounded-full">
                  {article.summary}
                </Badge>
              ) : null}
            </div>

            <CardTitle className="text-2xl">{article.title}</CardTitle>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarClock className="h-4 w-4" />
                Mis a jour: {formatDate(article.updatedAt)}
              </span>
              {article.language ? <span>Langue: {article.language}</span> : null}
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Contenu
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6">{article.content}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
