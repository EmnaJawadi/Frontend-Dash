// src/components/conversations/conversation-messages.tsx

import { MessageBubble } from "@/src/components/conversations/message-bubble";
import type { ConversationMessage } from "@/src/features/conversations/types/conversations.types";

type ConversationMessagesProps = {
  messages: ConversationMessage[];
};

function formatDateLabel(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function groupMessagesByDate(messages: ConversationMessage[]) {
  return messages.reduce<Record<string, ConversationMessage[]>>(
    (acc, message) => {
      const key = new Date(message.timestamp).toDateString();

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(message);
      return acc;
    },
    {}
  );
}

export function ConversationMessages({
  messages,
}: ConversationMessagesProps) {
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="section-card overflow-hidden">
      <div className="chat-bg h-[65vh] overflow-y-auto p-4 md:p-6 scrollbar-thin">
        <div className="space-y-6">
          {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
            <div key={dateKey} className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
                  {formatDateLabel(dayMessages[0].timestamp)}
                </div>
              </div>

              <div className="space-y-3">
                {dayMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="flex h-[40vh] items-center justify-center text-sm text-muted-foreground">
              Aucun message dans cette conversation pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}