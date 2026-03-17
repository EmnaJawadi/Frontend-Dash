// src/app/(dashboard)/conversations/page.tsx

"use client";

import { ConversationFilters } from "@/src/components/conversations/conversation-filters";
import { ConversationList } from "@/src/components/conversations/conversation-list";
import { ConversationTable } from "@/src/components/conversations/conversation-table";
import { useConversations } from "@/src/features/conversations/hooks/use-conversations";

export default function ConversationsPage() {
  const {
    conversations,
    filters,
    setFilters,
    resetFilters,
    page,
    totalPages,
    setPage,
    isLoading,
    error,
    refetch,
    total,
  } = useConversations(10);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Boîte de réception des conversations
          </h2>
          <p className="text-sm text-muted-foreground">
            Chargement des conversations...
          </p>
        </div>

        <div className="section-card h-[130px] animate-pulse bg-muted/40" />
        <div className="section-card h-[420px] animate-pulse bg-muted/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-card">
        <div className="section-card-content flex flex-col items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              Impossible de charger les conversations
            </h2>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>

          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Boîte de réception des conversations
          </h2>
          <p className="text-sm text-muted-foreground">
            Consultez, filtrez et gérez les conversations clients.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          {total} conversation{total !== 1 ? "s" : ""} trouvée{total !== 1 ? "s" : ""}
        </div>
      </div>

      <ConversationFilters
        filters={{
          search: filters.search ?? "",
          status: filters.status ?? "all",
          priority: filters.priority ?? "all",
          assignedTo: filters.assignedTo ?? "all",
          botState: filters.botState ?? "all",
        }}
        onChange={setFilters}
        onReset={resetFilters}
      />

      <div className="hidden lg:block">
        <ConversationTable conversations={conversations} />
      </div>

      <div className="lg:hidden">
        <ConversationList conversations={conversations} />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Précédent
            </button>

            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}