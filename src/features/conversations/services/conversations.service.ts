import { apiClient } from "@/src/lib/api-client";
import type {
  ConversationDetails,
  ConversationFilters,
  ConversationListItem,
  ConversationsResponse,
  ConversationStatus,
} from "@/src/features/conversations/types/conversations.types";

type BackendListResponse = {
  data?: unknown[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};

type BackendConversation = {
  id?: string;
  status?: string | null;
  priority?: string | null;
  unreadCount?: number | null;
  assignedTo?: string | null;
  assignedAgent?: string | null;
  botActive?: boolean;
  botPaused?: boolean | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  lastMessage?: string | null;
  participant?: {
    contactId?: string;
    contactName?: string | null;
    phoneNumber?: string | null;
  };
  contact?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    language?: string;
    location?: string;
  };
  tags?: Array<{ id?: string; name?: string; label?: string; tag?: string } | string>;
  messages?: Array<{
    id?: string;
    conversationId?: string;
    senderType?: string;
    direction?: string;
    type?: string;
    messageType?: string;
    content?: string | null;
    timestamp?: string | null;
    messageTimestamp?: string | null;
    createdAt?: string | null;
    status?: string | null;
  }>;
  notes?: string | null;
  activity?: {
    assignedAgent?: string | null;
    handoffRequired?: boolean;
    botActive?: boolean;
    lastBotMessageAt?: string | null;
    lastAgentReplyAt?: string | null;
  };
};

function toBackendStatus(status?: ConversationFilters["status"]): string | undefined {
  if (!status || status === "all") return undefined;
  return status;
}

function toFrontendStatus(status: string | null | undefined, botActive: boolean): ConversationStatus {
  if (status === "closed") return "closed";
  if (status === "bot_active") return "bot_active";
  if (status === "waiting_customer") return "waiting_customer";
  if (status === "human_assigned") return "human_assigned";
  if (status === "pending") return "waiting_customer";
  if (status === "human_handoff") return "human_assigned";
  return botActive ? "bot_active" : "human_assigned";
}

function normalizePriority(priority: string | null | undefined): "low" | "medium" | "high" {
  if (priority === "low" || priority === "high") return priority;
  return "medium";
}

function mapTags(input: BackendConversation["tags"]) {
  if (!Array.isArray(input)) return [];

  return input
    .map((item, index) => {
      if (typeof item === "string") {
        return { id: `tag-${index}`, label: item };
      }

      const label = item.label ?? item.name ?? item.tag;
      if (!label) return null;

      return {
        id: item.id ?? `tag-${index}`,
        label,
      };
    })
    .filter((item): item is { id: string; label: string } => item !== null);
}

function mapListItem(item: BackendConversation): ConversationListItem {
  const botActive = item.botActive ?? !(item.botPaused ?? false);

  return {
    id: item.id ?? "",
    contactName:
      item.participant?.contactName ??
      item.contact?.name ??
      "Contact inconnu",
    phone: item.participant?.phoneNumber ?? item.contact?.phone ?? "",
    lastMessage: item.lastMessage ?? item.messages?.[0]?.content ?? "Aucun message",
    lastMessageAt:
      item.messages?.[0]?.timestamp ??
      item.updatedAt ??
      item.createdAt ??
      new Date().toISOString(),
    status: toFrontendStatus(item.status, botActive),
    priority: normalizePriority(item.priority),
    unreadCount: Number(item.unreadCount ?? 0),
    tags: mapTags(item.tags),
    assignedAgent: item.assignedTo ?? item.assignedAgent ?? null,
    botActive,
  };
}

function mapDetails(item: BackendConversation): ConversationDetails {
  const base = mapListItem(item);

  const messages =
    item.messages?.map((message, index) => ({
      id: message.id ?? `${base.id}-message-${index}`,
      conversationId: message.conversationId ?? base.id,
      senderType:
        (message.senderType as "customer" | "bot" | "agent" | "system") ?? "customer",
      direction: (message.direction as "inbound" | "outbound") ?? "inbound",
      type:
        (message.type as "text" | "image" | "audio" | "document" | "system") ??
        (message.messageType as "text" | "image" | "audio" | "document" | "system") ??
        "text",
      content: message.content ?? "",
      timestamp:
        message.timestamp ??
        message.messageTimestamp ??
        message.createdAt ??
        new Date().toISOString(),
      status: (message.status as "sent" | "delivered" | "read" | "failed") ?? "read",
    })) ?? [];

  return {
    id: base.id,
    status: base.status,
    priority: base.priority,
    contact: {
      id: item.participant?.contactId ?? item.contact?.id ?? "",
      name: base.contactName,
      phone: base.phone,
      email: item.contact?.email,
      language: item.contact?.language,
      location: item.contact?.location,
    },
    tags: base.tags,
    notes: item.notes ?? undefined,
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
    activity: {
      assignedAgent:
        item.activity?.assignedAgent ?? item.assignedTo ?? item.assignedAgent ?? null,
      handoffRequired: item.activity?.handoffRequired ?? false,
      botActive: item.activity?.botActive ?? base.botActive,
      lastBotMessageAt: item.activity?.lastBotMessageAt ?? null,
      lastAgentReplyAt: item.activity?.lastAgentReplyAt ?? null,
    },
    messages,
  };
}

function toQueryString(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export const conversationsService = {
  async getConversations(
    filters?: ConversationFilters,
    page = 1,
    pageSize = 10,
  ): Promise<ConversationsResponse> {
    const queryString = toQueryString({
      page,
      limit: pageSize,
      search: filters?.search?.trim() || undefined,
      status: toBackendStatus(filters?.status),
      assignedTo:
        filters?.assignedTo && filters.assignedTo !== "all"
          ? filters.assignedTo
          : undefined,
      botActive:
        filters?.botState === "all"
          ? undefined
          : filters?.botState === "active"
          ? true
          : false,
    });

    const response = await apiClient.get<BackendListResponse>(
      `/conversations${queryString}`,
    );

    let data = (response.data ?? []).map((item) => mapListItem(item as BackendConversation));

    if (filters?.priority && filters.priority !== "all") {
      data = data.filter((item) => item.priority === filters.priority);
    }

    if (filters?.status === "human_assigned") {
      data = data.filter((item) => item.status === "human_assigned");
    }

    return {
      data,
      total: response.meta?.total ?? data.length,
      page: response.meta?.page ?? page,
      pageSize: response.meta?.limit ?? pageSize,
    };
  },

  async getConversationById(id: string): Promise<ConversationDetails> {
    const response = await apiClient.get<BackendConversation>(`/conversations/${id}`);
    return mapDetails(response);
  },

  async handoffConversation(id: string): Promise<{ success: boolean }> {
    await apiClient.patch(`/conversations/${id}/handoff`, {
      assignedTo: "Support Agent",
      reason: "Manual handoff from dashboard",
    });

    return { success: true };
  },

  async reactivateBot(id: string): Promise<{ success: boolean }> {
    await apiClient.patch(`/conversations/${id}/reactivate-bot`, {
      botActive: true,
    });

    return { success: true };
  },

  async deleteConversation(id: string): Promise<{ success: boolean }> {
    await apiClient.delete(`/conversations/${id}`);
    return { success: true };
  },
};
