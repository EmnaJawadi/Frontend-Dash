// src/components/conversations/conversation-table.tsx

import Link from "next/link";
import {
  ArrowUpDown,
  CircleDashed,
  Clock3,
  Flag,
  MailOpen,
  MessageSquareText,
  Square,
  User,
  UserRound,
} from "lucide-react";
import { DataTable } from "@/src/components/shared/data-table";
import { StatusBadge } from "@/src/components/shared/status-badge";
import type { ConversationListItem } from "@/src/features/conversations/types/conversations.types";

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
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <span>{label}</span>
      {sortable ? (
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      ) : null}
    </div>
  );
}

export function ConversationTable({ conversations }: ConversationTableProps) {
  return (
    <DataTable<ConversationListItem>
      data={conversations}
      rowKey={(item) => item.id}
      emptyMessage="Aucune conversation trouvée."
      columns={[
        {
          key: "select",
          header: <Square className="h-4 w-4 text-muted-foreground" />,
          className: "w-[52px]",
          render: () => (
            <button
              type="button"
              aria-label="Sélectionner"
              className="inline-flex h-4 w-4 rounded border border-border bg-background"
            />
          ),
        },
        {
          key: "contact",
          header: (
            <HeaderCell
              icon={<User className="h-4 w-4" />}
              label="Contact"
              sortable
            />
          ),
          render: (item) => (
            <Link href={`/conversations/${item.id}`} className="block">
              <div className="font-semibold">{item.contactName}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {item.phone}
              </div>
            </Link>
          ),
        },
        {
          key: "message",
          header: (
            <HeaderCell
              icon={<MessageSquareText className="h-4 w-4" />}
              label="Dernier message"
            />
          ),
          render: (item) => (
            <Link
              href={`/conversations/${item.id}`}
              className="block max-w-[320px]"
            >
              <p className="line-clamp-2 text-sm text-foreground/90">
                {item.lastMessage}
              </p>

              {item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
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
          ),
        },
        {
          key: "status",
          header: (
            <HeaderCell
              icon={<CircleDashed className="h-4 w-4" />}
              label="Statut"
            />
          ),
          render: (item) => (
            <StatusBadge variant={getStatusVariant(item.status)}>
              {getStatusLabel(item.status)}
            </StatusBadge>
          ),
        },
        {
          key: "priority",
          header: (
            <HeaderCell icon={<Flag className="h-4 w-4" />} label="Priorité" />
          ),
          render: (item) => (
            <StatusBadge variant={getPriorityVariant(item.priority)}>
              {getPriorityLabel(item.priority)}
            </StatusBadge>
          ),
        },
        {
          key: "unread",
          header: (
            <HeaderCell
              icon={<MailOpen className="h-4 w-4" />}
              label="Non lus"
            />
          ),
          render: (item) =>
            item.unreadCount > 0 ? (
              <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                {item.unreadCount}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">0</span>
            ),
        },
        {
          key: "assigned",
          header: (
            <HeaderCell
              icon={<UserRound className="h-4 w-4" />}
              label="Assigné à"
            />
          ),
          render: (item) => (
            <span className="text-sm text-muted-foreground">
              {item.assignedAgent ?? "—"}
            </span>
          ),
        },
        {
          key: "updated",
          header: (
            <HeaderCell
              icon={<Clock3 className="h-4 w-4" />}
              label="Mise à jour"
            />
          ),
          render: (item) => (
            <span className="text-sm text-muted-foreground">
              {new Date(item.lastMessageAt).toLocaleString("fr-FR")}
            </span>
          ),
        },
      ]}
    />
  );
}