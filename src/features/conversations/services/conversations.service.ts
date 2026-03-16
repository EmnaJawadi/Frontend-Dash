// src/features/conversations/services/conversations.service.ts

import type {
  ConversationDetails,
  ConversationFilters,
  ConversationListItem,
  ConversationsResponse,
} from "@/src/features/conversations/types/conversations.types";

const conversationsMock: ConversationListItem[] = [
  {
    id: "conv_001",
    contactName: "Sarah Ben Ali",
    phone: "+216 20 123 456",
    lastMessage: "I still haven’t received my order confirmation.",
    lastMessageAt: "2026-03-15T09:25:00Z",
    status: "human_assigned",
    priority: "high",
    unreadCount: 2,
    tags: [
      { id: "tag_1", label: "Order Issue" },
      { id: "tag_2", label: "VIP" },
    ],
    assignedAgent: "Emna Jawadi",
    botActive: false,
  },
  {
    id: "conv_002",
    contactName: "Omar Khaled",
    phone: "+216 55 987 321",
    lastMessage: "Can I change my delivery address?",
    lastMessageAt: "2026-03-15T09:12:00Z",
    status: "bot_active",
    priority: "medium",
    unreadCount: 0,
    tags: [{ id: "tag_3", label: "Delivery" }],
    assignedAgent: null,
    botActive: true,
  },
  {
    id: "conv_003",
    contactName: "Nour Haddad",
    phone: "+216 29 444 210",
    lastMessage: "Thank you, that solved my issue.",
    lastMessageAt: "2026-03-15T08:41:00Z",
    status: "closed",
    priority: "low",
    unreadCount: 0,
    tags: [{ id: "tag_4", label: "Resolved" }],
    assignedAgent: null,
    botActive: false,
  },
  {
    id: "conv_004",
    contactName: "Karim Trabelsi",
    phone: "+216 98 765 100",
    lastMessage: "I need to speak to a real person please.",
    lastMessageAt: "2026-03-15T08:10:00Z",
    status: "waiting_customer",
    priority: "high",
    unreadCount: 1,
    tags: [{ id: "tag_5", label: "Handoff" }],
    assignedAgent: "Sarra Mnif",
    botActive: false,
  },
];

const conversationDetailsMock: Record<string, ConversationDetails> = {
  conv_001: {
    id: "conv_001",
    status: "human_assigned",
    priority: "high",
    contact: {
      id: "contact_001",
      name: "Sarah Ben Ali",
      phone: "+216 20 123 456",
      email: "sarah.benali@example.com",
      language: "French",
      location: "Tunis, Tunisia",
    },
    tags: [
      { id: "tag_1", label: "Order Issue" },
      { id: "tag_2", label: "VIP" },
    ],
    notes: "Customer is waiting for a payment/order confirmation email.",
    createdAt: "2026-03-15T08:55:00Z",
    updatedAt: "2026-03-15T09:25:00Z",
    activity: {
      assignedAgent: "Emna Jawadi",
      handoffRequired: true,
      botActive: false,
      lastBotMessageAt: "2026-03-15T09:01:00Z",
      lastAgentReplyAt: "2026-03-15T09:20:00Z",
    },
    messages: [
      {
        id: "msg_001",
        conversationId: "conv_001",
        senderType: "customer",
        direction: "inbound",
        type: "text",
        content: "Hi, I placed an order but I didn’t receive the confirmation email.",
        timestamp: "2026-03-15T08:56:00Z",
        status: "read",
      },
      {
        id: "msg_002",
        conversationId: "conv_001",
        senderType: "bot",
        direction: "outbound",
        type: "text",
        content: "I’m checking that for you. Can you confirm the phone number used for the order?",
        timestamp: "2026-03-15T08:56:20Z",
        status: "read",
      },
      {
        id: "msg_003",
        conversationId: "conv_001",
        senderType: "customer",
        direction: "inbound",
        type: "text",
        content: "Yes, it is this same number.",
        timestamp: "2026-03-15T08:57:10Z",
        status: "read",
      },
      {
        id: "msg_004",
        conversationId: "conv_001",
        senderType: "system",
        direction: "outbound",
        type: "system",
        content: "Conversation handed off to human agent.",
        timestamp: "2026-03-15T09:18:00Z",
      },
      {
        id: "msg_005",
        conversationId: "conv_001",
        senderType: "agent",
        direction: "outbound",
        type: "text",
        content: "Hello Sarah, I’m taking over this conversation. I’m verifying your order now.",
        timestamp: "2026-03-15T09:20:00Z",
        status: "delivered",
      },
    ],
  },
  conv_002: {
    id: "conv_002",
    status: "bot_active",
    priority: "medium",
    contact: {
      id: "contact_002",
      name: "Omar Khaled",
      phone: "+216 55 987 321",
      email: "omar.khaled@example.com",
      language: "Arabic",
      location: "Sfax, Tunisia",
    },
    tags: [{ id: "tag_3", label: "Delivery" }],
    notes: "Customer wants to update shipping destination.",
    createdAt: "2026-03-15T08:50:00Z",
    updatedAt: "2026-03-15T09:12:00Z",
    activity: {
      assignedAgent: null,
      handoffRequired: false,
      botActive: true,
      lastBotMessageAt: "2026-03-15T09:12:00Z",
      lastAgentReplyAt: null,
    },
    messages: [
      {
        id: "msg_006",
        conversationId: "conv_002",
        senderType: "customer",
        direction: "inbound",
        type: "text",
        content: "Can I change my delivery address?",
        timestamp: "2026-03-15T09:11:00Z",
        status: "read",
      },
      {
        id: "msg_007",
        conversationId: "conv_002",
        senderType: "bot",
        direction: "outbound",
        type: "text",
        content: "Yes, I can help. Please send me your order number first.",
        timestamp: "2026-03-15T09:12:00Z",
        status: "delivered",
      },
    ],
  },
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyConversationFilters(
  items: ConversationListItem[],
  filters?: ConversationFilters
) {
  if (!filters) return items;

  return items.filter((item) => {
    const matchesSearch =
      !filters.search ||
      item.contactName.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.phone.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.lastMessage.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus =
      !filters.status || filters.status === "all" || item.status === filters.status;

    const matchesPriority =
      !filters.priority ||
      filters.priority === "all" ||
      item.priority === filters.priority;

    const matchesAssigned =
      !filters.assignedTo ||
      filters.assignedTo === "all" ||
      item.assignedAgent === filters.assignedTo;

    const matchesBotState =
      !filters.botState ||
      filters.botState === "all" ||
      (filters.botState === "active" && item.botActive) ||
      (filters.botState === "paused" && !item.botActive);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesAssigned &&
      matchesBotState
    );
  });
}

export const conversationsService = {
  async getConversations(
    filters?: ConversationFilters,
    page = 1,
    pageSize = 10
  ): Promise<ConversationsResponse> {
    await wait(400);

    const filtered = applyConversationFilters(conversationsMock, filters);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      pageSize,
    };
  },

  async getConversationById(id: string): Promise<ConversationDetails> {
    await wait(300);

    const conversation = conversationDetailsMock[id];

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return conversation;
  },

  async handoffConversation(id: string): Promise<{ success: boolean }> {
    await wait(500);

    if (!conversationDetailsMock[id]) {
      throw new Error("Conversation not found");
    }

    return { success: true };
  },

  async reactivateBot(id: string): Promise<{ success: boolean }> {
    await wait(500);

    if (!conversationDetailsMock[id]) {
      throw new Error("Conversation not found");
    }

    return { success: true };
  },
};