"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePdfImport,
  useReviewArticle,
} from "@/src/features/knowledge-base/hooks/usePdfImports";
import type {
  PdfDraftArticle,
  ReviewArticleDto,
} from "@/src/features/knowledge-base/types/pdf-import.types";

const CATEGORIES = [
  "Produits",
  "Tarifs",
  "FAQ",
  "Politique",
  "Livraison",
  "Services",
  "General",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function ArticleStatusBadge({ status }: { status: PdfDraftArticle["status"] }) {
  switch (status) {
    case "APPROVED":
      return (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
          Valide
        </Badge>
      );
    case "EDITED":
      return (
        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
          Modifie et valide
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
          Rejete
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
          En attente
        </Badge>
      );
  }
}

function ArticleCard({
  article,
  importId,
}: {
  article: PdfDraftArticle;
  importId: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(article.title);
  const [editCategory, setEditCategory] = React.useState(article.category);
  const [editBody, setEditBody] = React.useState(article.body);
  const [editTags, setEditTags] = React.useState(article.tags.join(", "));
  const [error, setError] = React.useState<string | null>(null);

  const { mutate: reviewArticle, isPending } = useReviewArticle(importId);

  function handleAction(dto: ReviewArticleDto) {
    setError(null);
    reviewArticle(
      { articleId: article.id, dto },
      {
        onError: () => setError("Une erreur est survenue. Veuillez reessayer."),
        onSuccess: () => setEditing(false),
      }
    );
  }

  function handleSaveEdit() {
    if (!editTitle.trim() || !editBody.trim()) {
      setError("Le titre et le corps sont obligatoires.");
      return;
    }
    handleAction({
      action: "edit",
      title: editTitle.trim(),
      category: editCategory,
      body: editBody.trim(),
      tags: editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }

  const isDone =
    article.status === "APPROVED" ||
    article.status === "REJECTED" ||
    article.status === "EDITED";

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 min-w-0">
            <ArticleStatusBadge status={article.status} />
            <div className="min-w-0">
              <p className="font-medium leading-tight truncate">{article.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{article.category}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 rounded-lg p-1 text-muted-foreground transition hover:bg-muted"
            aria-label={expanded ? "Reduire" : "Developper"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            {!editing ? (
              <>
                <div
                  className="overflow-y-auto rounded-xl bg-muted/40 p-3 text-sm leading-relaxed text-foreground"
                  style={{ maxHeight: 300 }}
                >
                  {article.body}
                </div>

                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {article.status === "APPROVED" || article.status === "EDITED" ? (
                  article.kbArticleId ? (
                    <p className="text-xs text-emerald-700">
                      Article KB cree —{" "}
                      <Link
                        href={`/knowledge-base/${article.kbArticleId}`}
                        className="underline hover:no-underline"
                      >
                        Voir l'article
                      </Link>
                    </p>
                  ) : null
                ) : article.status === "PENDING" ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => handleAction({ action: "approve" })}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      Valider
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction({ action: "reject" })}
                      disabled={isPending}
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" />
                      Rejeter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(true)}
                      disabled={isPending}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Modifier
                    </Button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`title-${article.id}`} className="text-xs font-medium">
                    Titre
                  </Label>
                  <Input
                    id={`title-${article.id}`}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-9 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`cat-${article.id}`} className="text-xs font-medium">
                    Categorie
                  </Label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger id={`cat-${article.id}`} className="h-9 rounded-lg text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`body-${article.id}`} className="text-xs font-medium">
                    Corps du texte
                  </Label>
                  <Textarea
                    id={`body-${article.id}`}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="min-h-[150px] rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`tags-${article.id}`} className="text-xs font-medium">
                    Tags (separes par des virgules)
                  </Label>
                  <Input
                    id={`tags-${article.id}`}
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="h-9 rounded-lg text-sm"
                  />
                </div>

                {error ? <p className="text-xs text-destructive">{error}</p> : null}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={handleSaveEdit}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Enregistrer et valider
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setError(null);
                      setEditTitle(article.title);
                      setEditCategory(article.category);
                      setEditBody(article.body);
                      setEditTags(article.tags.join(", "));
                    }}
                    disabled={isPending}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {error && !editing ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PdfImportDetailPage() {
  const params = useParams();
  const importId = params?.importId as string;

  const { data: importDraft, isLoading, error } = usePdfImport(importId);
  const { mutate: reviewArticle, isPending: isApprovingAll } = useReviewArticle(importId);

  const pending = importDraft?.articles.filter((a) => a.status === "PENDING") ?? [];
  const total = importDraft?.articles.length ?? 0;
  const done = total - pending.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  function handleApproveAll() {
    if (pending.length === 0) return;
    for (const article of pending) {
      reviewArticle({ articleId: article.id, dto: { action: "approve" } });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement de l'import...
      </div>
    );
  }

  if (error || !importDraft) {
    return (
      <div className="space-y-4">
        <Link
          href="/knowledge-base/pdf-imports"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
        <p className="text-sm text-destructive">Import introuvable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/knowledge-base/pdf-imports"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux imports
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">{importDraft.fileName}</h1>
            <p className="text-sm text-muted-foreground">
              Importe le {formatDate(importDraft.createdAt)} par{" "}
              {importDraft.uploader.fullName ?? importDraft.uploader.email}
            </p>
          </div>

          {pending.length > 0 && (
            <Button
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700 sm:shrink-0"
              onClick={handleApproveAll}
              disabled={isApprovingAll}
            >
              {isApprovingAll ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="mr-1.5 h-3.5 w-3.5" />
              )}
              Tout valider ({pending.length})
            </Button>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progression globale</span>
            <span>
              {done} / {total} articles — {pct}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {importDraft.articles.map((article) => (
          <ArticleCard key={article.id} article={article} importId={importId} />
        ))}
      </div>
    </div>
  );
}
