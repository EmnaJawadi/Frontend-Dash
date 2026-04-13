import { conversationsService } from "@/src/features/conversations/services/conversations.service";

export type KnowledgeSuggestionAlert = {
  id: string;
  conversationId: string;
  contactName: string;
  lastMessage: string;
  href: string;
};

export const knowledgeAlertsService = {
  async listPendingKnowledgeSuggestions(): Promise<KnowledgeSuggestionAlert[]> {
    const response = await conversationsService.getConversations(
      {
        search: "",
        status: "human_assigned",
        priority: "all",
        assignedTo: "all",
        botState: "paused",
      },
      1,
      8,
    );

    return (response.data ?? []).map((item) => ({
      id: `kb-alert-${item.id}`,
      conversationId: item.id,
      contactName: item.contactName,
      lastMessage: item.lastMessage || "Conversation en prise en charge humaine.",
      href: `/conversations/${item.id}?suggestArticle=1`,
    }));
  },
};
