"use client";

import * as React from "react";
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
}: ConversationTableProps) {
  return (
    <DataTable
      data={conversations}
      rowKey={(item) => item.id}
      emptyMessage="Aucune conversation trouvée."
      columns={[
        {
          key: "select",
          header: <Square className="h-4 w-4" />,
          className: "w-[52px]",
          render: () => (
            <input
              type="checkbox"
              aria-label="Sélectionner la conversation"
              className="h-4 w-4 rounded border border-border"
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
          header: (
            <HeaderCell
              icon={<MessageSquareText className="h-4 w-4" />}
              label="Dernier message"
            />
          ),
          className: "min-w-[320px]",
          render: (item) => (
            <div className="space-y-2">
              <p className="line-clamp-2 text-sm leading-6 text-foreground">
                {item.lastMessage}
              </p>

              {item.tags && item.tags.length > 0 ? (
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
          header: (
            <HeaderCell
              icon={<CircleDashed className="h-4 w-4" />}
              label="Statut"
            />
          ),
          className: "min-w-[180px]",
          render: (item) => (
            <StatusBadge variant={getStatusVariant(item.status)}>
              {getStatusLabel(item.status)}
            </StatusBadge>
          ),
        },
        {
          key: "priority",
          header: (
            <HeaderCell
              icon={<Flag className="h-4 w-4" />}
              label="Priorité"
            />
          ),
          className: "min-w-[130px]",
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
          className: "min-w-[90px]",
          render: (item) => (
            <span className="text-sm font-medium text-foreground">
              {item.unreadCount}
            </span>
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
          className: "min-w-[140px]",
          render: (item) => (
            <span className="text-sm text-foreground">
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
          className: "min-w-[160px]",
          render: (item) => (
            <span className="text-sm text-foreground">
              {formatDate(item.lastMessageAt)}
            </span>
          ),
        },
      ]}
    />
  );
}