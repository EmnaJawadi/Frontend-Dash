// src/components/conversations/conversation-table.tsx

import Link from "next/link";
import type { ConversationListItem } from "@/src/features/conversations/types/conversations.types";
import { cn } from "@/lib/utils";

type ConversationTableProps = {
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

function getStatusClass(status: ConversationListItem["status"]) {
  switch (status) {
    case "bot_active":
      return "status-success";
    case "human_assigned":
      return "status-warning";
    case "waiting_customer":
    case "closed":
      return "status-neutral";
    default:
      return "status-neutral";
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

function getPriorityClass(priority: ConversationListItem["priority"]) {
  switch (priority) {
    case "high":
      return "status-danger";
    case "medium":
      return "status-warning";
    case "low":
      return "status-success";
    default:
      return "status-neutral";
  }
}

export function ConversationTable({
  conversations,
}: ConversationTableProps) {
  return (
    <div className="section-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr className="border-b">
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Contact
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Dernier message
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Statut
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Priorité
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Non lus
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Assigné à
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Mise à jour
              </th>
            </tr>
          </thead>

          <tbody>
            {conversations.map((conversation) => (
              <tr
                key={conversation.id}
                className="border-b transition hover:bg-muted/30"
              >
                <td className="px-4 py-4 align-top">
                  <Link
                    href={`/conversations/${conversation.id}`}
                    className="block"
                  >
                    <div className="font-semibold">
                      {conversation.contactName}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {conversation.phone}
                    </div>
                  </Link>
                </td>

                <td className="px-4 py-4 align-top">
                  <Link
                    href={`/conversations/${conversation.id}`}
                    className="block max-w-[320px]"
                  >
                    <p className="line-clamp-2 text-sm text-foreground/90">
                      {conversation.lastMessage}
                    </p>

                    {Array.isArray(conversation.tags) &&
                      conversation.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
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
                  </Link>
                </td>

                <td className="px-4 py-4 align-top">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      getStatusClass(conversation.status)
                    )}
                  >
                    {getStatusLabel(conversation.status)}
                  </span>
                </td>

                <td className="px-4 py-4 align-top">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      getPriorityClass(conversation.priority)
                    )}
                  >
                    {getPriorityLabel(conversation.priority)}
                  </span>
                </td>

                <td className="px-4 py-4 align-top">
                  {conversation.unreadCount > 0 ? (
                    <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                      {conversation.unreadCount}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">0</span>
                  )}
                </td>

                <td className="px-4 py-4 align-top">
                  <span className="text-sm text-muted-foreground">
                    {conversation.assignedAgent ?? "—"}
                  </span>
                </td>

                <td className="px-4 py-4 align-top">
                  <span className="text-sm text-muted-foreground">
                    {new Date(conversation.lastMessageAt).toLocaleString("fr-FR")}
                  </span>
                </td>
              </tr>
            ))}

            {conversations.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  Aucune conversation trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}