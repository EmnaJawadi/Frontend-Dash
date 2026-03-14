"use client";

import Link from "next/link";

// import { Badge } from "@/components/ui/badge";
// import { Badge } from "../../ui/badge";
import { Badge } from "@/components/ui/badge";
import { HandoffButton } from "./handoff-button";
import { ReactivateBotButton } from "@/components/conversations/reactivate-bot-button";
import { ConversationItem } from "@/src/features/conversations/hooks/use-conversation-details";


type ConversationListProps = {
  conversations: ConversationItem[];
};

function getStatusVariant(status: ConversationItem["status"]) {
  if (status === "Handoff requis") return "destructive";
  if (status === "Bot actif") return "default";
  return "secondary";
}

function getPriorityClass(priority: ConversationItem["priority"]) {
  switch (priority) {
    case "Urgente":
      return "bg-red-100 text-red-700 border-red-200";
    case "Haute":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Moyenne":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function ConversationList({ conversations }: ConversationListProps) {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="rounded-2xl border bg-background p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <Link
                href={`/conversations/${conversation.id}`}
                className="block"
              >
                <h3 className="font-semibold">{conversation.customer}</h3>
              </Link>

              <p className="text-xs text-muted-foreground">
                {conversation.phone}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusVariant(conversation.status)}>
                  {conversation.status}
                </Badge>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                    conversation.priority
                  )}`}
                >
                  {conversation.priority}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {conversation.lastMessage}
              </p>

              <p className="text-xs text-muted-foreground">
                Assigné à: {conversation.assignedTo ?? "Aucun"}
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <div className="text-xs text-muted-foreground">
                {conversation.updatedAt}
              </div>

              <div className="flex flex-wrap gap-2">
                <HandoffButton />
                <ReactivateBotButton />
              </div>
            </div>
          </div>
        </div>
      ))}

      {conversations.length === 0 ? (
        <div className="rounded-2xl border bg-background p-8 text-center text-sm text-muted-foreground shadow-sm">
          Aucune conversation trouvée.
        </div>
      ) : null}
    </div>
  );
}