// src/features/dashboard/types/dashboard.types.ts

export type ConversationStatus =
  | "bot_active"
  | "human_assigned"
  | "waiting_customer"
  | "closed";

export type ConversationPriority = "low" | "medium" | "high";

export type StatsCardKey =
  | "totalConversations"
  | "activeConversations"
  | "automationRate"
  | "escalationsToday"
  | "avgFirstResponseTime";

export interface DashboardStat {
  key: StatsCardKey;
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
}

export interface ConversationsChartPoint {
  date: string;
  conversations: number;
  resolvedByBot: number;
  escalated: number;
}

export interface BotPerformanceMetric {
  label: string;
  value: string | number;
  hint?: string;
}

export interface BotPerformanceCardData {
  automationRate: number;
  averageConfidence: number;
  averageResponseTime: string;
  fallbackRate: number;
  metrics: BotPerformanceMetric[];
}

export interface RecentConversationItem {
  id: string;
  contactName: string;
  phone: string;
  lastMessage: string;
  updatedAt: string;
  status: ConversationStatus;
  priority: ConversationPriority;
  unreadCount: number;
  assignedAgent?: string | null;
}

export interface EscalationReasonItem {
  label: string;
  count: number;
}

export interface EscalationSummaryData {
  total: number;
  pending: number;
  resolved: number;
  averageHandlingTime: string;
  reasons: EscalationReasonItem[];
}

export interface DashboardData {
  stats: DashboardStat[];
  chart: ConversationsChartPoint[];
  botPerformance: BotPerformanceCardData;
  recentConversations: RecentConversationItem[];
  escalationSummary: EscalationSummaryData;
}