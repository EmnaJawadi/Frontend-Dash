"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Save, Tags, Upload, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isApiError } from "@/src/lib/api-error";
import { knowledgeBaseService } from "@/src/services/knowledge-base.service";

type ArticleCategory = "commandes" | "paiements" | "livraison" | "retours" | "general";

function categoryLabel(category: ArticleCategory) {
  switch (category) {
    case "commandes":
      return "Commandes";
    case "paiements":
      return "Paiements";
    case "livraison":
      return "Livraison";
    case "retours":
      return "Retours";
    case "general":
      return "General";
    default:
      return category;
  }
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

    return error.message || "Impossible d'enregistrer l'article.";
  }

  return "Impossible d'enregistrer l'article.";
}

export default function NewArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<ArticleCategory>("commandes");
  const [author, setAuthor] = React.useState("Emna");
  const [documentFile, setDocumentFile] = React.useState<File | null>(null);
  const [sourceConversationId, setSourceConversationId] = React.useState<string | null>(null);
  const [sourceApplied, setSourceApplied] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (sourceApplied) return;

    const sourceId = searchParams.get("sourceConversationId");
    const sourceTitle = searchParams.get("title");
    const sourceContent = searchParams.get("content");
    const sourceCategory = searchParams.get("category");

    if (sourceId) {
      setSourceConversationId(sourceId);
    }

    if (sourceTitle) {
      setTitle(sourceTitle);
    }

    if (sourceContent) {
      setContent(sourceContent);
    }

    if (
      sourceCategory === "commandes" ||
      sourceCategory === "paiements" ||
      sourceCategory === "livraison" ||
      sourceCategory === "retours" ||
      sourceCategory === "general"
    ) {
      setCategory(sourceCategory);
    }

    setSourceApplied(true);
  }, [searchParams, sourceApplied]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() && !documentFile) {
      setError("Le titre est obligatoire.");
      return;
    }

    if (!documentFile && content.trim().length < 20) {
      setError("Le contenu doit contenir au moins 20 caracteres.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      if (documentFile) {
        await knowledgeBaseService.createFromFile({
          file: documentFile,
          title: title.trim() || documentFile.name,
          summary: category,
          language: "fr",
        });
      } else {
        await knowledgeBaseService.create({
          title: title.trim(),
          content: content.trim(),
          summary: category,
          language: "fr",
        });
      }

      setSaveMessage("Article enregistre en base avec succes.");
      setTimeout(() => {
        router.push("/knowledge-base");
        router.refresh();
      }, 500);
    } catch (err) {
      console.error("Failed to create article", err);
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Button asChild variant="outline" className="w-fit rounded-xl">
          <Link href="/knowledge-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour a la base
          </Link>
        </Button>
      </div>

      {saveMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {saveMessage}
        </div>
      ) : null}

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Nouvel article</h1>
        <p className="text-sm text-muted-foreground">
          Ajoutez un contenu qui sera utilise par le bot pour repondre aux clients.
        </p>
      </div>

      {sourceConversationId ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Suggestion depuis une conversation humaine.
          {" "}
          <Link className="font-medium underline" href={`/conversations/${sourceConversationId}?suggestArticle=1`}>
            Ouvrir la conversation source
          </Link>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSave} className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Contenu de l'article</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Titre</Label>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre de l'article"
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
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
                  <Label>Auteur</Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="h-11 rounded-xl pl-10"
                      placeholder="Nom de l'auteur"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Redigez ici le contenu de l'article..."
                  disabled={Boolean(documentFile)}
                  className="min-h-[220px] rounded-xl disabled:cursor-not-allowed disabled:bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Si vous importez un fichier, le contenu sera extrait automatiquement.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kb-file-upload">Importer un fichier (PDF, Word, PowerPoint)</Label>
                <Input
                  id="kb-file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  className="h-11 rounded-xl"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setDocumentFile(file);
                    setError("");
                  }}
                />
                {documentFile ? (
                  <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
                    Fichier selectionne: {documentFile.name} ({Math.ceil(documentFile.size / 1024)} KB)
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Apercu rapide</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-semibold">{title || "Titre de l'article"}</p>
                <p className="mt-1 text-sm text-muted-foreground">Auteur: {author || "Non defini"}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {categoryLabel(category)}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  Brouillon
                </Badge>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                {documentFile
                  ? `Le contenu sera extrait automatiquement depuis ${documentFile.name}.`
                  : content
                    ? content.slice(0, 220) + (content.length > 220 ? "..." : "")
                    : "Aucun contenu saisi pour le moment."}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Tags className="h-4 w-4" />
                Conseils
              </div>
              <p className="text-sm text-muted-foreground">
                Utilisez des reponses courtes, claires et faciles a reutiliser par le bot dans les conversations clients.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Upload className="h-3.5 w-3.5" />
                Admin et agents peuvent aussi importer des fichiers PDF, Word et PowerPoint.
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

