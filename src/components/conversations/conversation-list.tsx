// src/components/conversations/conversation-list.tsx

import Link from "next/link";
import type { ConversationListItem } from "@/src/features/conversations/types/conversations.types";
import { cn } from "@/lib/utils";

type ConversationListProps = {
  conversations: ConversationListItem[];
};

function getStatusLabel(status: ConversationListItem["status"]) {
  switch (status) {
    case "bot_active":
      return "Bot Active";
    case "human_assigned":
      return "Human Assigned";
    case "waiting_customer":
      return "Waiting Customer";
    case "closed":
      return "Closed";
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
      return "status-neutral";
    case "closed":
      return "status-neutral";
    default:
      return "status-neutral";
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

export function ConversationList({ conversations }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="section-card">
        <div className="section-card-content py-10 text-center text-sm text-muted-foreground">
          No conversations found.
        </div>
      </div>
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

                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        getStatusClass(conversation.status)
                      )}
                    >
                      {getStatusLabel(conversation.status)}
                    </span>

                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                        getPriorityClass(conversation.priority)
                      )}
                    >
                      {conversation.priority}
                    </span>
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
                      Updated {new Date(conversation.lastMessageAt).toLocaleString()}
                    </span>
                    <span>Assigned: {conversation.assignedAgent ?? "—"}</span>
                    <span>Bot: {conversation.botActive ? "Active" : "Paused"}</span>
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