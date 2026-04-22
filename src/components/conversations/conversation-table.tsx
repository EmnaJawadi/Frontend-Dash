"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  CircleDashed,
  Clock3,
  Eye,
  Flag,
  Loader2,
  MailOpen,
  MessageSquareText,
  Trash2,
  User,
  UserRound,
} from "lucide-react";

import { DataTable } from "@/src/components/shared/data-table";
import { StatusBadge } from "@/src/components/shared/status-badge";
import type { ConversationListItem } from "@/src/features/conversations/types/conversations.types";

type ConversationTableProps = {
  conversations: ConversationListItem[];
  onDeleteConversation?: (conversationId: string) => Promise<void>;
  onRefresh?: () => void | Promise<void>;
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
      return "Cloturee";
    default:
      return status;
  }
}

function getStatusVariant(
  status: ConversationListItem["status"],
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
  priority: ConversationListItem["priority"],
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

function formatDate(date: string) {
  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HeaderCell({
  icon,
  label,
  sortable = false,
}: {
  icon: React.ReactNode;
  label: string;
  sortable?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      {icon}
      <span>{label}</span>
      {sortable ? <ArrowUpDown className="h-4 w-4 opacity-60" /> : null}
    </div>
  );
}

export function ConversationTable({
  conversations,
  onDeleteConversation,
  onRefresh,
}: ConversationTableProps) {
  const [deletingConversationId, setDeletingConversationId] = React.useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);
  const [selectedConversationIds, setSelectedConversationIds] = React.useState<Set<string>>(new Set());
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelectedConversationIds((prev) => {
      const visibleIds = new Set(conversations.map((item) => item.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (visibleIds.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  }, [conversations]);

  function toggleConversationSelection(conversationId: string, checked: boolean) {
    setSelectedConversationIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(conversationId);
      } else {
        next.delete(conversationId);
      }
      return next;
    });
  }

  function toggleSelectAllVisible(checked: boolean) {
    if (checked) {
      setSelectedConversationIds(new Set(conversations.map((item) => item.id)));
      return;
    }
    setSelectedConversationIds(new Set());
  }

  async function handleDelete(conversationId: string, contactName: string) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la conversation de ${contactName} ?`,
    );

    if (!confirmed) return;

    try {
      setDeletingConversationId(conversationId);
      setDeleteError(null);
      setDeleteSuccess(null);
      await onDeleteConversation?.(conversationId);
      await onRefresh?.();
      setSelectedConversationIds((prev) => {
        const next = new Set(prev);
        next.delete(conversationId);
        return next;
      });
      setDeleteSuccess("Conversation supprimee avec succes.");
    } catch (error) {
      console.error("Failed to delete conversation", error);
      setDeleteError("Impossible de supprimer la conversation.");
    } finally {
      setDeletingConversationId(null);
    }
  }

  async function handleDeleteSelectedConversations() {
    if (selectedConversationIds.size === 0 || !onDeleteConversation) return;

    const confirmed = window.confirm(
      `Supprimer ${selectedConversationIds.size} conversation(s) selectionnee(s) ?`,
    );
    if (!confirmed) return;

    try {
      setIsBulkDeleting(true);
      setDeleteError(null);
      setDeleteSuccess(null);

      const ids = Array.from(selectedConversationIds);
      const deletions = await Promise.allSettled(
        ids.map((id) => onDeleteConversation(id)),
      );

      const deletedCount = deletions.filter((item) => item.status === "fulfilled").length;
      const failedCount = ids.length - deletedCount;

      await onRefresh?.();
      setSelectedConversationIds(new Set());

      if (failedCount > 0) {
        setDeleteError(
          `${deletedCount} conversation(s) supprimee(s), ${failedCount} echec(s).`,
        );
      } else {
        setDeleteSuccess(`${deletedCount} conversation(s) supprimee(s) avec succes.`);
      }
    } catch (error) {
      console.error("Failed to delete selected conversations", error);
      setDeleteError("Impossible de supprimer les conversations selectionnees.");
    } finally {
      setIsBulkDeleting(false);
    }
  }

  const selectedCount = selectedConversationIds.size;
  const allVisibleSelected =
    conversations.length > 0 && selectedCount === conversations.length;
  const partiallySelected =
    selectedCount > 0 && selectedCount < conversations.length;
  const selectAllRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = partiallySelected;
  }, [partiallySelected]);

  return (
    <div className="space-y-3">
      {deleteError ? <p className="text-sm text-destructive">{deleteError}</p> : null}
      {deleteSuccess ? <p className="text-sm text-emerald-700">{deleteSuccess}</p> : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void handleDeleteSelectedConversations()}
          disabled={selectedCount === 0 || isBulkDeleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isBulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Supprimer la selection ({selectedCount})
        </button>
      </div>

      <DataTable
        data={conversations}
        rowKey={(item) => item.id}
        emptyMessage="Aucune conversation trouvee."
        columns={[
          {
            key: "select",
            header: (
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allVisibleSelected}
                onChange={(event) => toggleSelectAllVisible(event.target.checked)}
                aria-label="Selectionner toutes les conversations"
                className="h-4 w-4 rounded border border-border"
              />
            ),
            className: "w-[52px]",
            render: (item) => (
              <input
                type="checkbox"
                aria-label="Selectionner la conversation"
                className="h-4 w-4 rounded border border-border"
                checked={selectedConversationIds.has(item.id)}
                onChange={(event) =>
                  toggleConversationSelection(item.id, event.target.checked)
                }
              />
            ),
          },
          {
            key: "contact",
            header: <HeaderCell icon={<User className="h-4 w-4" />} label="Contact" sortable />,
            className: "min-w-[190px]",
            render: (item) => (
              <div className="space-y-1">
                <p className="font-medium text-foreground">{item.contactName}</p>
                <p className="text-sm text-muted-foreground">{item.phone}</p>
              </div>
            ),
          },
          {
            key: "message",
            header: <HeaderCell icon={<MessageSquareText className="h-4 w-4" />} label="Dernier message" />,
            className: "min-w-[320px]",
            render: (item) => (
              <div className="space-y-2">
                <p className="line-clamp-2 text-sm leading-6 text-foreground">{item.lastMessage}</p>

                {item.tags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ),
          },
          {
            key: "status",
            header: <HeaderCell icon={<CircleDashed className="h-4 w-4" />} label="Statut" />,
            className: "min-w-[180px]",
            render: (item) => (
              <StatusBadge variant={getStatusVariant(item.status)}>{getStatusLabel(item.status)}</StatusBadge>
            ),
          },
          {
            key: "priority",
            header: <HeaderCell icon={<Flag className="h-4 w-4" />} label="Priorite" />,
            className: "min-w-[130px]",
            render: (item) => (
              <StatusBadge variant={getPriorityVariant(item.priority)}>{getPriorityLabel(item.priority)}</StatusBadge>
            ),
          },
          {
            key: "unread",
            header: <HeaderCell icon={<MailOpen className="h-4 w-4" />} label="Non lus" />,
            className: "min-w-[90px]",
            render: (item) => <span className="text-sm font-medium text-foreground">{item.unreadCount}</span>,
          },
          {
            key: "assigned",
            header: <HeaderCell icon={<UserRound className="h-4 w-4" />} label="Assigne a" />,
            className: "min-w-[140px]",
            render: (item) => <span className="text-sm text-foreground">{item.assignedAgent ?? "-"}</span>,
          },
          {
            key: "updated",
            header: <HeaderCell icon={<Clock3 className="h-4 w-4" />} label="Mise a jour" />,
            className: "min-w-[160px]",
            render: (item) => <span className="text-sm text-foreground">{formatDate(item.lastMessageAt)}</span>,
          },
          {
            key: "actions",
            header: <span className="text-sm font-medium">Actions</span>,
            className: "min-w-[250px]",
            render: (item) => (
              <div className="flex items-center gap-2">
                <Link
                  href={`/conversations/${item.id}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                  Voir details
                </Link>

                <button
                  type="button"
                  onClick={() => void handleDelete(item.id, item.contactName)}
                  disabled={deletingConversationId === item.id || isBulkDeleting}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingConversationId === item.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
