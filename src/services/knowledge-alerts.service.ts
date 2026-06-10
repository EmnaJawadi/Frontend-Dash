import { knowledgeBaseService } from "@/src/services/knowledge-base.service";

export type KnowledgeSuggestionAlert = {
  id: string;
  conversationId: string;
  contactName: string;
  lastMessage: string;
  href: string;
};

export const knowledgeAlertsService = {
  async listPendingKnowledgeSuggestions(): Promise<KnowledgeSuggestionAlert[]> {
    const suggestions = await knowledgeBaseService.listSuggestions({
      status: "pending",
    });

    return suggestions.slice(0, 8).map((item) => ({
      id: `kb-alert-${item.id}`,
      conversationId: item.conversationId,
      contactName: "Reponse humaine a valider",
      lastMessage:
        item.question ||
        item.customerMessage ||
        "Suggestion de connaissance en attente.",
      href: `/knowledge-base?suggestionId=${item.id}`,
    }));
  },
};
