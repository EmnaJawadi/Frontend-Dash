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
import { useToast } from "@/src/contexts/toast-context";

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
  const { showToast } = useToast();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<ArticleCategory>("general");
  const [language, setLanguage] = React.useState("fr");

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!id) {
      showToast({ message: "Identifiant article invalide.", type: "error" });
      setIsLoading(false);
      return;
    }
    const articleId = id;

    let mounted = true;

    async function loadArticle() {
      try {
        setIsLoading(true);

        const article = (await knowledgeBaseService.getById(articleId)) as KnowledgeArticle;

        if (!mounted) return;

        setTitle(article.title || "");
        setContent(article.content || "");
        setCategory(normalizeCategory(article.summary));
        setLanguage(article.language || "fr");
      } catch (err) {
        console.error("Failed to load article", err);
        if (mounted) {
          showToast({ message: "Impossible de charger cet article.", type: "error" });
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      showToast({ message: "Identifiant article invalide.", type: "error" });
      return;
    }

    if (!title.trim()) {
      showToast({ message: "Le titre est obligatoire.", type: "error" });
      return;
    }

    if (content.trim().length < 20) {
      showToast({ message: "Le contenu doit contenir au moins 20 caractères.", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);

      await knowledgeBaseService.update(id, {
        title: title.trim(),
        content: content.trim(),
        summary: category,
        language: language.trim() || "fr",
        status: "published",
      });

      showToast({ message: "Article modifié avec succès.", type: "success" });
      setTimeout(() => {
        router.push(`/knowledge-base/${id}`);
        router.refresh();
      }, 700);
    } catch (err) {
      console.error("Failed to update article", err);
      showToast({ message: getErrorMessage(err), type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/knowledge-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la base
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
        <p className="text-sm text-muted-foreground">Mettez à jour le contenu pour améliorer les réponses du bot.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement de l&apos;article...</p>
      ) : (
        <form onSubmit={handleSave}>
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Édition</CardTitle>
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
                  <Label>Catégorie</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as ArticleCategory)}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commandes">Commandes</SelectItem>
                      <SelectItem value="paiements">Paiements</SelectItem>
                      <SelectItem value="livraison">Livraison</SelectItem>
                      <SelectItem value="retours">Retours</SelectItem>
                      <SelectItem value="general">Général</SelectItem>
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
