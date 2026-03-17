// src/components/conversations/message-bubble.tsx

import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationMessage } from "@/src/features/conversations/types/conversations.types";

type MessageBubbleProps = {
  message: ConversationMessage;
};

function formatMessageTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderMessageStatus(status?: ConversationMessage["status"]) {
  if (!status) return null;

  if (status === "read") {
    return <CheckCheck className="h-3.5 w-3.5" />;
  }

  if (status === "delivered") {
    return <CheckCheck className="h-3.5 w-3.5 opacity-70" />;
  }

  if (status === "sent") {
    return <Check className="h-3.5 w-3.5 opacity-70" />;
  }

  return null;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isSystem = message.senderType === "system";
  const isIncoming = message.senderType === "customer";
  const isOutgoing =
    message.senderType === "bot" || message.senderType === "agent";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="rounded-full border bg-muted px-4 py-2 text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full",
        isIncoming ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          isIncoming && "message-bubble-incoming",
          isOutgoing && "message-bubble-outgoing"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        <div
          className={cn(
            "message-meta flex items-center gap-1",
            isIncoming ? "justify-start" : "justify-end"
          )}
        >
          <span>{formatMessageTime(message.timestamp)}</span>
          {!isIncoming && renderMessageStatus(message.status)}
        </div>
      </div>
    </div>
  );
}