// src/components/conversations/conversation-list.tsx

import Link from "next/link";
import { EmptyState } from "@/src/components/shared/empty-state";
import { StatusBadge } from "@/src/components/shared/status-badge";
import type { ConversationListItem } from "@/src/features/conversations/types/conversations.types";

type ConversationListProps = {
  conversations: ConversationListItem[];
};

function getStatusLabel(status: ConversationListItem["status"]) {
  switch (status) {
    case "bot_active":
      return "Bot actif";
    case "human_assigned":
      return "Prise en charge humaine";
    case "waiting_customer":
      return "En attente du client";
    case "closed":
      return "Clôturée";
    default:
      return status;
  }
}

function getStatusVariant(
  status: ConversationListItem["status"]
): "success" | "warning" | "neutral" {
  switch (status) {
    case "bot_active":
      return "success";
    case "human_assigned":
      return "warning";
    case "waiting_customer":
    case "closed":
    default:
      return "neutral";
  }
}

function getPriorityLabel(priority: ConversationListItem["priority"]) {
  switch (priority) {
    case "high":
      return "Haute";
    case "medium":
      return "Moyenne";
    case "low":
      return "Basse";
    default:
      return priority;
  }
}

function getPriorityVariant(
  priority: ConversationListItem["priority"]
): "success" | "warning" | "danger" {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
    default:
      return "success";
  }
}

export function ConversationList({ conversations }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <EmptyState
        title="Aucune conversation trouvée"
        description="Essayez de modifier les filtres ou d’effectuer une nouvelle recherche."
      />
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={`/conversations/${conversation.id}`}
          className="block"
        >
          <div className="section-card transition hover:bg-muted/20">
            <div className="section-card-content">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold">
                      {conversation.contactName}
                    </h3>

                    <StatusBadge variant={getStatusVariant(conversation.status)}>
                      {getStatusLabel(conversation.status)}
                    </StatusBadge>

                    <StatusBadge
                      variant={getPriorityVariant(conversation.priority)}
                    >
                      {getPriorityLabel(conversation.priority)}
                    </StatusBadge>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {conversation.phone}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm text-foreground/90">
                    {conversation.lastMessage}
                  </p>

                  {conversation.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {conversation.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex rounded-full border bg-background px-2 py-1 text-[11px] text-muted-foreground"
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      Mis à jour le{" "}
                      {new Date(conversation.lastMessageAt).toLocaleString("fr-FR")}
                    </span>
                    <span>
                      Assigné à : {conversation.assignedAgent ?? "—"}
                    </span>
                    <span>
                      Bot : {conversation.botActive ? "Actif" : "En pause"}
                    </span>
                  </div>
                </div>

                {conversation.unreadCount > 0 && (
                  <div className="inline-flex min-w-8 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}