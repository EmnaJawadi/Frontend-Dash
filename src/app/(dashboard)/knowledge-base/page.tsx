"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain,
  BookOpen,
  CheckCircle2,
  FilePenLine,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { pdfImportService } from "@/src/features/knowledge-base/services/pdf-import.service";
import { usePdfImports } from "@/src/features/knowledge-base/hooks/usePdfImports";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiError } from "@/src/lib/api-error";
import {
  knowledgeBaseService,
  type KnowledgeSuggestion,
} from "@/src/services/knowledge-base.service";
import { useToast } from "@/src/contexts/toast-context";

type ArticleStatus = "published" | "draft" | "archived";
type ArticleCategory = string;

type KnowledgeArticle = {
  id: string;
  title: string;
  category: ArticleCategory;
  status: ArticleStatus;
  author: string;
  updatedAt: string;
};

type ListResponse = {
  items: Array<{
    id: string;
    title: string;
    category?: string | null;
    summary?: string | null;
    status: ArticleStatus;
    updatedAt: string;
  }>;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function normalizeCategory(value?: string | null): ArticleCategory {
  const normalized = (value ?? "").trim();
  const lower = normalized.toLowerCase();
  if (lower === "commandes") return "commandes";
  if (lower === "paiements") return "paiements";
  if (lower === "livraison") return "livraison";
  if (lower === "retours") return "retours";
  return normalized || "general";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

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
      return "Général";
    default:
      return category;
  }
}

function statusLabel(status: ArticleStatus) {
  switch (status) {
    case "published":
      return "Publié";
    case "draft":
      return "Brouillon";
    case "archived":
      return "Archivé";
    default:
      return status;
  }
}

function StatusBadge({ status }: { status: ArticleStatus }) {
  const classes =
    status === "published"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "archived"
      ? "border-slate-300 bg-slate-100 text-slate-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <Badge variant="outline" className={`rounded-full ${classes}`}>
      {statusLabel(status)}
    </Badge>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl border-border/60 shadow-sm transition hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="rounded-2xl bg-muted p-2.5 text-muted-foreground">
            {icon}
          </div>
        </div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher par titre..."
        className="h-11 rounded-xl border-border/60 pl-10 pr-10"
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ArticleStatus | "all">("all");
  const [category, setCategory] = React.useState<ArticleCategory | "all">("all");
  const [items, setItems] = React.useState<KnowledgeArticle[]>([]);
  const [suggestions, setSuggestions] = React.useState<KnowledgeSuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deletingArticleId, setDeletingArticleId] = React.useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);
  const [selectedArticleIds, setSelectedArticleIds] = React.useState<Set<string>>(new Set());
  const [isUploadingPdf, setIsUploadingPdf] = React.useState(false);
  const [isRebuilding, setIsRebuilding] = React.useState(false);
  const { showToast } = useToast();
  const pdfInputRef = React.useRef<HTMLInputElement | null>(null);

  const { data: pendingImports } = usePdfImports("PENDING_REVIEW");
  const { data: partialImports } = usePdfImports("PARTIALLY_DONE");
  const pendingImportCount = (pendingImports?.length ?? 0) + (partialImports?.length ?? 0);

  async function handlePdfFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!pdfInputRef.current) return;
    pdfInputRef.current.value = "";
    if (!file) return;

    try {
      setIsUploadingPdf(true);
      const result = await pdfImportService.uploadPdf(file);
      router.push(`/knowledge-base/pdf-imports/${result.importId}`);
    } catch (err) {
      const message = isApiError(err)
        ? err.message
        : "Impossible d'analyser le PDF. Veuillez réessayer.";
      showToast({ message, type: "error" });
      setIsUploadingPdf(false);
    }
  }

  async function handleRebuildKnowledgeBase() {
    if (!window.confirm('Reconstruire tous les chunks et embeddings publies de cette entreprise ?')) {
      return;
    }

    try {
      setIsRebuilding(true);
      const report = await knowledgeBaseService.rebuild();
      showToast({
        message: `${report.articlesIndexed} article(s) reindexes, ${report.chunksCreated} chunk(s) crees.`,
        type: report.errors.length > 0 ? 'warning' : 'success',
      });
      await loadArticles();
    } catch (err) {
      showToast({
        message: isApiError(err) ? err.message : 'Impossible de reconstruire la base de connaissance.',
        type: 'error',
      });
    } finally {
      setIsRebuilding(false);
    }
  }

  const loadArticles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const firstResponse = (await knowledgeBaseService.list({
        page: 1,
        limit: 100,
      })) as ListResponse;
      const allItems = [...(firstResponse.items ?? [])];
      const totalPages = firstResponse.meta?.totalPages ?? 1;
      const pageLimit = firstResponse.meta?.limit ?? 100;

      if (totalPages > 1) {
        const remaining = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            knowledgeBaseService.list({ page: i + 2, limit: pageLimit }) as Promise<ListResponse>,
          ),
        );
        for (const response of remaining) {
          allItems.push(...(response.items ?? []));
        }
      }

      setItems(
        allItems.map((article) => ({
          id: article.id,
          title: article.title,
          category: normalizeCategory(article.category ?? article.summary),
          status: article.status ?? "draft",
          author: "Equipe",
          updatedAt: article.updatedAt,
        })),
      );
    } catch (e) {
      console.error("Failed to load knowledge base", e);
      setItems([]);
      showToast({ message: "Impossible de charger les articles.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSuggestions = React.useCallback(async () => {
    try {
      const pending = await knowledgeBaseService.listSuggestions({
        status: "pending",
      });
      setSuggestions(pending ?? []);
    } catch (e) {
      console.error("Failed to load knowledge suggestions", e);
      setSuggestions([]);
    }
  }, []);

  React.useEffect(() => {
    void loadArticles();
    void loadSuggestions();
  }, [loadArticles, loadSuggestions]);

  const filteredArticles = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((article) => {
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        categoryLabel(article.category).toLowerCase().includes(query);

      const matchesStatus = status === "all" || article.status === status;
      const matchesCategory = category === "all" || article.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, search, status, category]);

  const stats = React.useMemo(() => {
    return {
      total: items.length,
      published: items.filter((a) => a.status === "published").length,
      draft: items.filter((a) => a.status === "draft").length,
      pendingSuggestions: suggestions.length,
      categories: new Set(items.map((a) => a.category)).size,
    };
  }, [items, suggestions.length]);

  const categoryOptions = React.useMemo(
    () =>
      Array.from(new Set(items.map((article) => article.category)))
        .filter(Boolean)
        .sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b), "fr")),
    [items],
  );

  React.useEffect(() => {
    setSelectedArticleIds((prev) => {
      const visibleIds = new Set(filteredArticles.map((article) => article.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (visibleIds.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  }, [filteredArticles]);

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setCategory("all");
  }

  function toggleArticleSelection(articleId: string, checked: boolean) {
    setSelectedArticleIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(articleId);
      } else {
        next.delete(articleId);
      }
      return next;
    });
  }

  function toggleSelectAllVisible(checked: boolean) {
    if (checked) {
      setSelectedArticleIds(new Set(filteredArticles.map((article) => article.id)));
      return;
    }
    setSelectedArticleIds(new Set());
  }

  async function handleDeleteArticle(article: KnowledgeArticle) {
    const confirmed = window.confirm(`Supprimer l'article "${article.title}" ?`);
    if (!confirmed) return;

    try {
      setDeletingArticleId(article.id);
      await knowledgeBaseService.remove(article.id);
      await loadArticles();
      setSelectedArticleIds((prev) => {
        const next = new Set(prev);
        next.delete(article.id);
        return next;
      });
      showToast({ message: "Article supprimé avec succès.", type: "success" });
    } catch (err) {
      console.error("Failed to delete article", err);
      showToast({
        message: isApiError(err) && err.message ? err.message : "Impossible de supprimer l'article.",
        type: "error",
      });
    } finally {
      setDeletingArticleId(null);
    }
  }

  async function handleDeleteSelectedArticles() {
    if (selectedArticleIds.size === 0) return;

    const confirmed = window.confirm(
      `Supprimer ${selectedArticleIds.size} article(s) sélectionné(s) ?`,
    );
    if (!confirmed) return;

    try {
      setIsBulkDeleting(true);

      const ids = Array.from(selectedArticleIds);
      const deletions = await Promise.allSettled(
        ids.map((id) => knowledgeBaseService.remove(id)),
      );
      const deletedCount = deletions.filter((item) => item.status === "fulfilled").length;
      const failedCount = ids.length - deletedCount;

      await loadArticles();
      setSelectedArticleIds(new Set());

      if (failedCount > 0) {
        showToast({ message: `${deletedCount} article(s) supprimé(s), ${failedCount} échec(s).`, type: "warning" });
      } else {
        showToast({ message: `${deletedCount} article(s) supprimé(s) avec succès.`, type: "success" });
      }
    } catch (err) {
      console.error("Failed to delete selected articles", err);
      showToast({ message: "Impossible de supprimer la sélection.", type: "error" });
    } finally {
      setIsBulkDeleting(false);
    }
  }

  const selectedCount = selectedArticleIds.size;
  const allVisibleSelected =
    filteredArticles.length > 0 && selectedCount === filteredArticles.length;
  const partiallySelected =
    selectedCount > 0 && selectedCount < filteredArticles.length;
  const selectAllRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = partiallySelected;
  }, [partiallySelected]);

  return (
    <div className="space-y-6">
      {pendingImportCount > 0 && (
        <Link
          href="/knowledge-base/pdf-imports"
          className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 transition hover:bg-amber-100"
        >
          <span className="font-medium">
            {pendingImportCount} import{pendingImportCount > 1 ? "s" : ""} PDF en attente de validation
          </span>
          <span className="shrink-0 rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
            Voir →
          </span>
        </Link>
      )}

      {isUploadingPdf && (
        <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          <span>Analyse du PDF en cours, veuillez patienter...</span>
        </div>
      )}

      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => void handlePdfFileChange(e)}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total articles"
          value={stats.total}
          subtitle="Base de reponses"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          title="Publies"
          value={stats.published}
          subtitle="Disponibles"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <StatCard
          title="Brouillons"
          value={stats.draft}
          subtitle="En cours"
          icon={<FilePenLine className="h-4 w-4" />}
        />
        <StatCard
          title="Apprentissages"
          value={stats.pendingSuggestions}
          subtitle="Suggestions a valider"
          icon={<Brain className="h-4 w-4" />}
        />
      </div>

      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="w-full xl:flex-1">
              <SearchInput value={search} onChange={setSearch} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as ArticleStatus | "all")
                }
              >
                <SelectTrigger className="h-11 rounded-xl xl:w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(value as ArticleCategory | "all")
                }
              >
                <SelectTrigger className="h-11 rounded-xl xl:w-[180px]">
                  <SelectValue placeholder="Categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes categories</SelectItem>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {categoryLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={resetFilters}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => void handleRebuildKnowledgeBase()}
                disabled={isRebuilding}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isRebuilding ? 'animate-spin' : ''}`}
                />
                {isRebuilding ? 'Reconstruction...' : 'Reconstruire la base'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isUploadingPdf}
              >
                {isUploadingPdf ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Importer PDF
              </Button>

              <Button asChild>
                <Link href="/knowledge-base/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel article
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => void handleDeleteSelectedArticles()}
          disabled={selectedCount === 0 || isBulkDeleting}
        >
          {isBulkDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Suppression...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer la selection ({selectedCount})
            </>
          )}
        </Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        {isLoading ? "Chargement..." : `${filteredArticles.length} article(s) trouvé(s)`}
      </div>

      {!isLoading && filteredArticles.length === 0 ? (
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 rounded-full bg-muted p-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">Aucun article trouvé</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="app-table-shell">
          <table className="app-table">
            <thead>
              <tr>
                <th className="px-4 py-3 font-medium">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    aria-label="Selectionner tous les articles visibles"
                    checked={allVisibleSelected}
                    onChange={(event) => toggleSelectAllVisible(event.target.checked)}
                    className="app-checkbox"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Categorie</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Auteur</th>
                <th className="px-4 py-3 font-medium">Mis à jour</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredArticles.map((article) => (
                <tr
                  key={article.id}
                  className="border-t border-border/60 transition hover:bg-muted/20"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label="Selectionner l'article"
                      checked={selectedArticleIds.has(article.id)}
                      onChange={(event) =>
                        toggleArticleSelection(article.id, event.target.checked)
                      }
                      className="app-checkbox"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-muted p-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{article.title}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">{categoryLabel(article.category)}</td>

                  <td className="px-4 py-4">
                    <StatusBadge status={article.status} />
                  </td>

                  <td className="px-4 py-4">{article.author}</td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {formatDate(article.updatedAt)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/knowledge-base/${article.id}`}>Voir</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/knowledge-base/${article.id}/edit`}>Modifier</Link>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleDeleteArticle(article)}
                        disabled={deletingArticleId === article.id || isBulkDeleting}
                      >
                        {deletingArticleId === article.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Suppression...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </>
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
