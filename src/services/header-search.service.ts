import { contactsService } from "@/src/services/contacts.service";
import { knowledgeBaseService } from "@/src/services/knowledge-base.service";
import { conversationsService } from "@/src/features/conversations/services/conversations.service";

export type HeaderSearchResult = {
  id: string;
  label: string;
  description: string;
  href: string;
  type: "conversation" | "contact" | "knowledge";
};

type ContactsListResponse = {
  data?: Array<{
    id: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string | null;
  }>;
};

type KnowledgeBaseListResponse = {
  items?: Array<{
    id: string;
    title: string;
    summary?: string | null;
    status?: string;
  }>;
};

function truncate(value: string, max = 80) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
}

export const headerSearchService = {
  async search(query: string): Promise<HeaderSearchResult[]> {
    const q = query.trim();

    if (q.length < 2) {
      return [];
    }

    const [conversationsResponse, contactsResponse, kbResponse] = await Promise.all([
      conversationsService.getConversations(
        {
          search: q,
          status: "all",
          priority: "all",
          assignedTo: "all",
          botState: "all",
        },
        1,
        4,
      ),
      contactsService.list({ page: 1, limit: 4, search: q }) as Promise<ContactsListResponse>,
      knowledgeBaseService.list({ page: 1, limit: 4, search: q }) as Promise<KnowledgeBaseListResponse>,
    ]);

    const conversationResults: HeaderSearchResult[] = (conversationsResponse.data ?? []).map(
      (item) => ({
        id: `conv-${item.id}`,
        label: item.contactName,
        description: truncate(item.lastMessage || "Conversation"),
        href: `/conversations/${item.id}`,
        type: "conversation",
      }),
    );

    const contactResults: HeaderSearchResult[] = (contactsResponse.data ?? []).map((item) => ({
      id: `contact-${item.id}`,
      label: item.fullName || item.phoneNumber || "Contact",
      description: item.email || item.phoneNumber || "Contact",
      href: `/contacts/${item.id}`,
      type: "contact",
    }));

    const knowledgeResults: HeaderSearchResult[] = (kbResponse.items ?? []).map((item) => ({
      id: `kb-${item.id}`,
      label: item.title,
      description: item.summary || item.status || "Article",
      href: `/knowledge-base/${item.id}`,
      type: "knowledge",
    }));

    return [...conversationResults, ...contactResults, ...knowledgeResults].slice(0, 10);
  },
};
