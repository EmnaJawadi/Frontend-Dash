"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePdfImports } from "@/src/features/knowledge-base/hooks/usePdfImports";
import type { PdfImportDraft } from "@/src/features/knowledge-base/types/pdf-import.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function progressOf(draft: PdfImportDraft) {
  const total = draft.articles.length;
  if (total === 0) return { done: 0, total: 0, pct: 0 };
  const done = draft.articles.filter(
    (a) => a.status === "APPROVED" || a.status === "REJECTED" || a.status === "EDITED"
  ).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

function StatusBadge({ status }: { status: PdfImportDraft["status"] }) {
  if (status === "COMPLETED")
    return (
      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
        Termine
      </Badge>
    );
  if (status === "PARTIALLY_DONE")
    return (
      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
        En cours
      </Badge>
    );
  return (
    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
      A valider
    </Badge>
  );
}

export default function PdfImportsPage() {
  const { data: imports, isLoading, error } = usePdfImports();

  const pending = imports?.filter(
    (d) => d.status === "PENDING_REVIEW" || d.status === "PARTIALLY_DONE"
  ) ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/knowledge-base"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour a la base de connaissances
        </Link>
        <h1 className="text-2xl font-semibold">Imports PDF en attente</h1>
        <p className="text-sm text-muted-foreground">
          Validez, modifiez ou rejetez les articles detectes par l'IA avant leur integration dans la KB.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement...
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Impossible de charger les imports.</p>
      ) : pending.length === 0 ? (
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="rounded-full bg-muted p-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Aucun import en attente de validation.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/knowledge-base">Retour</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pending.map((draft) => {
            const { done, total, pct } = progressOf(draft);
            return (
              <Card key={draft.id} className="rounded-3xl border-border/60 shadow-sm transition hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-muted p-2.5 text-muted-foreground">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium leading-tight">{draft.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          Importe le {formatDate(draft.createdAt)} par{" "}
                          {draft.uploader.fullName ?? draft.uploader.email}
                        </p>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={draft.status} />
                          <span className="text-xs text-muted-foreground">
                            {done} / {total} articles traites
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                      <div className="w-full sm:w-48">
                        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                          <span>Progression</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <Button asChild size="sm" className="w-full sm:w-auto">
                        <Link href={`/knowledge-base/pdf-imports/${draft.id}`}>
                          Voir les articles
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
