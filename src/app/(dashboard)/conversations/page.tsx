"use client";

import { ConversationFilters } from "@/src/components/conversations/conversation-filters";
import { ConversationList } from "@/src/components/conversations/conversation-list";
import { ConversationTable } from "@/src/components/conversations/conversation-table";
import { LoadingSpinner } from "@/src/components/shared/loading-spinner";
import { SectionCard } from "@/src/components/shared/section-card";
import { useConversations } from "@/src/features/conversations/hooks/use-conversations";
import { conversationsService } from "@/src/features/conversations/services/conversations.service";

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
      <div className="space-y-8">
        <SectionCard contentClassName="py-14">
          <LoadingSpinner size="lg" label="Chargement des conversations..." />
        </SectionCard>
      </div>
    );
  }

  if (error) {
    return (
      <SectionCard contentClassName="flex flex-col items-start gap-4">
        <div>
          <h2 className="text-xl font-semibold">Impossible de charger les conversations</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Reessayer
        </button>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border/75 bg-card/72 px-4 py-3 text-sm font-medium text-muted-foreground shadow-sm fade-up">
        {total} conversation{total !== 1 ? "s" : ""} trouvee{total !== 1 ? "s" : ""}
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

      <div className="hidden lg:block fade-up-delay-1">
        <ConversationTable
          conversations={conversations}
          onDeleteConversation={async (conversationId) => {
            await conversationsService.deleteConversation(conversationId);
          }}
          onRefresh={refetch}
        />
      </div>

      <div className="lg:hidden fade-up-delay-1">
        <ConversationList conversations={conversations} />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-5 py-4">
          <p className="text-sm text-muted-foreground">Page {page} sur {totalPages}</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center rounded-xl border border-border/70 px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Precedent
            </button>

            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center justify-center rounded-xl border border-border/70 px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
