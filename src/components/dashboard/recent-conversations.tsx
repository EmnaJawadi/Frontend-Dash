// src/components/dashboard/recent-conversations.tsx

import Link from "next/link";
import type { RecentConversationItem } from   "@/src/features/dashboard/types/dashboard.types"
import { cn } from "@/lib/utils";

type RecentConversationsProps = {
  conversations: RecentConversationItem[];
};

function getStatusLabel(status: RecentConversationItem["status"]) {
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

function getStatusClass(status: RecentConversationItem["status"]) {
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

function getPriorityClass(priority: RecentConversationItem["priority"]) {
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

export function RecentConversations({
  conversations,
}: RecentConversationsProps) {
  return (
    <div className="section-card">
      <div className="section-card-content">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold md:text-lg">
              Recent Conversations
            </h3>
            <p className="text-sm text-muted-foreground">
              Review the latest customer activity and jump into details.
            </p>
          </div>

          <Link
            href="/conversations"
            className="text-sm font-medium text-primary transition hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/conversations/${conversation.id}`}
              className="block rounded-2xl border bg-background p-4 transition hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="truncate text-sm font-semibold md:text-base">
                      {conversation.contactName}
                    </h4>

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

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>Updated {conversation.updatedAt}</span>

                    {conversation.assignedAgent && (
                      <span>Assigned to {conversation.assignedAgent}</span>
                    )}
                  </div>
                </div>

                {conversation.unreadCount > 0 && (
                  <div className="inline-flex min-w-8 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}