"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isApiError } from "@/src/lib/api-error";
import { knowledgeBaseService } from "@/src/services/knowledge-base.service";

type ArticleCategory = "commandes" | "paiements" | "livraison" | "retours" | "general";

type KnowledgeArticle = {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  language?: string | null;
};

function normalizeCategory(value?: string | null): ArticleCategory {
  const lower = (value ?? "").toLowerCase().trim();
  if (lower === "commandes") return "commandes";
  if (lower === "paiements") return "paiements";
  if (lower === "livraison") return "livraison";
  if (lower === "retours") return "retours";
  return "general";
}

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    if (error.details && typeof error.details === "object") {
      const details = error.details as { message?: unknown };
      if (Array.isArray(details.message)) {
        return details.message.map((item) => String(item)).join(" ");
      }
      if (typeof details.message === "string") {
        return details.message;
      }
    }

    return error.message || "Impossible de modifier l'article.";
  }

  return "Impossible de modifier l'article.";
}

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<ArticleCategory>("general");
  const [language, setLanguage] = React.useState("fr");

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

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
        setError("");

        const article = (await knowledgeBaseService.getById(articleId)) as KnowledgeArticle;

        if (!mounted) return;

        setTitle(article.title || "");
        setContent(article.content || "");
        setCategory(normalizeCategory(article.summary));
        setLanguage(article.language || "fr");
      } catch (err) {
        console.error("Failed to load article", err);
        if (mounted) {
          setError("Impossible de charger cet article.");
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

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setError("Identifiant article invalide.");
      return;
    }

    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    if (content.trim().length < 20) {
      setError("Le contenu doit contenir au moins 20 caracteres.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      await knowledgeBaseService.update(id, {
        title: title.trim(),
        content: content.trim(),
        summary: category,
        language: language.trim() || "fr",
      });

      setSuccess("Article modifie avec succes.");
      setTimeout(() => {
        router.push(`/knowledge-base/${id}`);
        router.refresh();
      }, 700);
    } catch (err) {
      console.error("Failed to update article", err);
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <Link href={`/knowledge-base/${id}`}>Voir article</Link>
          </Button>
        ) : null}
      </div>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Modifier article</h1>
        <p className="text-sm text-muted-foreground">Mettez a jour le contenu pour ameliorer les reponses du bot.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement de l'article...</p>
      ) : (
        <form onSubmit={handleSave}>
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Edition</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Titre de l'article"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Categorie</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as ArticleCategory)}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Choisir une categorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commandes">Commandes</SelectItem>
                      <SelectItem value="paiements">Paiements</SelectItem>
                      <SelectItem value="livraison">Livraison</SelectItem>
                      <SelectItem value="retours">Retours</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Input
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    placeholder="fr"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Contenu de l'article"
                  className="min-h-[260px] rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
