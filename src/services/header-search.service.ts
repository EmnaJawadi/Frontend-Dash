import { contactsService } from "@/src/services/contacts.service";
import { knowledgeBaseService } from "@/src/services/knowledge-base.service";
import { productsService } from "@/src/services/products.service";
import { conversationsService } from "@/src/features/conversations/services/conversations.service";

export type HeaderSearchResult = {
  id: string;
  label: string;
  description: string;
  href: string;
  type: "conversation" | "contact" | "knowledge" | "product";
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

type ProductsListResponse = {
  items?: Array<{
    id: string;
    name: string;
    category?: string | null;
    price?: number | null;
    currency?: string | null;
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

    const [conversationsResult, contactsResult, kbResult, productsResult] =
      await Promise.allSettled([
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
        productsService.list({ page: 1, limit: 4, search: q }) as Promise<ProductsListResponse>,
      ]);

    const conversationsResponse =
      conversationsResult.status === "fulfilled" ? conversationsResult.value : { data: [] };
    const contactsResponse =
      contactsResult.status === "fulfilled" ? contactsResult.value : { data: [] };
    const kbResponse =
      kbResult.status === "fulfilled" ? kbResult.value : { items: [] };
    const productsResponse =
      productsResult.status === "fulfilled" ? productsResult.value : { items: [] };

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

    const productResults: HeaderSearchResult[] = (productsResponse.items ?? []).map((item) => ({
      id: `product-${item.id}`,
      label: item.name,
      description:
        item.category ||
        (item.price === null || item.price === undefined
          ? "Produit"
          : `${item.price} ${item.currency || "TND"}`),
      href: "/products",
      type: "product",
    }));

    return [
      ...conversationResults,
      ...contactResults,
      ...knowledgeResults,
      ...productResults,
    ].slice(0, 10);
  },
};
