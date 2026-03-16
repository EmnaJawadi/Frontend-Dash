// src/features/conversations/types/conversations.types.ts

export type ConversationStatus =
  | "bot_active"
  | "human_assigned"
  | "waiting_customer"
  | "closed";

export type ConversationPriority = "low" | "medium" | "high";

export type SenderType = "customer" | "bot" | "agent" | "system";

export type MessageDirection = "inbound" | "outbound";

export type MessageType = "text" | "image" | "audio" | "document" | "system";

export type MessageStatus = "sent" | "delivered" | "read" | "failed";

export interface ConversationTag {
  id: string;
  label: string;
  color?: string;
}

export interface ConversationListItem {
  id: string;
  contactName: string;
  phone: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageAt: string;
  status: ConversationStatus;
  priority: ConversationPriority;
  unreadCount: number;
  tags: ConversationTag[];
  assignedAgent?: string | null;
  botActive: boolean;
}

export interface ConversationContact {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  email?: string;
  language?: string;
  location?: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderType: SenderType;
  direction: MessageDirection;
  type: MessageType;
  content: string;
  timestamp: string;
  status?: MessageStatus;
}

export interface ConversationActivity {
  assignedAgent?: string | null;
  handoffRequired?: boolean;
  botActive: boolean;
  lastBotMessageAt?: string | null;
  lastAgentReplyAt?: string | null;
}

export interface ConversationDetails {
  id: string;
  status: ConversationStatus;
  priority: ConversationPriority;
  contact: ConversationContact;
  tags: ConversationTag[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  activity: ConversationActivity;
  messages: ConversationMessage[];
}

export interface ConversationFilters {
  search?: string;
  status?: ConversationStatus | "all";
  priority?: ConversationPriority | "all";
  assignedTo?: string | "all";
  botState?: "all" | "active" | "paused";
}

export interface ConversationsResponse {
  data: ConversationListItem[];
  total: number;
  page: number;
  pageSize: number;
}