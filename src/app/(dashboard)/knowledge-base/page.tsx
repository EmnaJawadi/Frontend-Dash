"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  FilePenLine,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

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
import { knowledgeBaseService } from "@/src/services/knowledge-base.service";

type ArticleStatus = "published" | "draft" | "archived";
type ArticleCategory =
  | "commandes"
  | "paiements"
  | "livraison"
  | "retours"
  | "general";

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
    summary?: string | null;
    status: ArticleStatus;
    updatedAt: string;
  }>;
};

function normalizeCategory(value?: string | null): ArticleCategory {
  const lower = (value ?? "").toLowerCase().trim();
  if (lower === "commandes") return "commandes";
  if (lower === "paiements") return "paiements";
  if (lower === "livraison") return "livraison";
  if (lower === "retours") return "retours";
  return "general";
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
      return "General";
    default:
      return category;
  }
}

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
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ArticleStatus | "all">("all");
  const [category, setCategory] = React.useState<ArticleCategory | "all">("all");
  const [items, setItems] = React.useState<KnowledgeArticle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deletingArticleId, setDeletingArticleId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const loadArticles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      const response = (await knowledgeBaseService.list({
        page: 1,
        limit: 100,
      })) as ListResponse;

      setItems(
        (response.items ?? []).map((article) => ({
          id: article.id,
          title: article.title,
          category: normalizeCategory(article.summary),
          status: article.status ?? "draft",
          author: "Equipe",
          updatedAt: article.updatedAt,
        })),
      );
    } catch (e) {
      console.error("Failed to load knowledge base", e);
      setItems([]);
      setError("Impossible de charger les articles.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

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
      categories: new Set(items.map((a) => a.category)).size,
    };
  }, [items]);

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setCategory("all");
  }

  async function handleDeleteArticle(article: KnowledgeArticle) {
    const confirmed = window.confirm(`Supprimer l'article "${article.title}" ?`);
    if (!confirmed) return;

    try {
      setDeletingArticleId(article.id);
      setError(null);
      setSuccess(null);
      await knowledgeBaseService.remove(article.id);
      await loadArticles();
      setSuccess("Article supprime avec succes.");
    } catch (err) {
      console.error("Failed to delete article", err);
      setError(
        isApiError(err) && err.message
          ? err.message
          : "Impossible de supprimer l'article.",
      );
    } finally {
      setDeletingArticleId(null);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Base de connaissances
          </h1>
          <p className="text-sm text-muted-foreground">
            Articles reels charges depuis le backend.
          </p>
        </div>

        <Button asChild className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
          <Link href="/knowledge-base/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
          </Link>
        </Button>
      </div>

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
          title="Categories"
          value={stats.categories}
          subtitle="Organisation"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="w-full xl:flex-1">
              <SearchInput value={search} onChange={setSearch} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
                  <SelectItem value="published">Publie</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="archived">Archive</SelectItem>
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
                  <SelectItem value="commandes">Commandes</SelectItem>
                  <SelectItem value="paiements">Paiements</SelectItem>
                  <SelectItem value="livraison">Livraison</SelectItem>
                  <SelectItem value="retours">Retours</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={resetFilters}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        {isLoading ? "Chargement..." : `${filteredArticles.length} article(s) trouve(s)`}
      </div>

      {!isLoading && filteredArticles.length === 0 ? (
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 rounded-full bg-muted p-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">Aucun article trouve</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Categorie</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Auteur</th>
                <th className="px-4 py-3 font-medium">Mis a jour</th>
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
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link href={`/knowledge-base/${article.id}`}>Voir</Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link href={`/knowledge-base/${article.id}/edit`}>Modifier</Link>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => void handleDeleteArticle(article)}
                        disabled={deletingArticleId === article.id}
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
