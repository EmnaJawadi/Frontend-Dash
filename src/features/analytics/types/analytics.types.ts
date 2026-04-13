export type PeriodFilter = "7d" | "30d" | "90d";
export type ChannelFilter = "all" | "whatsapp";
export type TeamFilter = "all" | "bot" | "human";

export type AnalyticsDay = {
  key: string;
  day: string;
  totalMessages: number;
  botMessages: number;
  humanMessages: number;
  escalations: number;
};

export type AnalyticsTotals = {
  totalMessages: number;
  botMessages: number;
  humanMessages: number;
  escalations: number;
  botRate: number;
  avgResponseTimeLabel: string;
};

export type AnalyticsData = {
  generatedAt: string;
  totals: AnalyticsTotals;
  timeline: AnalyticsDay[];
};

export type AnalyticsFilters = {
  period: PeriodFilter;
  channel: ChannelFilter;
};

export type BackendTimelinePoint = {
  label: string;
  value: number;
};

export type BackendConversationMetrics = {
  totalConversations: number;
  openConversations: number;
  closedConversations: number;
  resolutionRate: number;
  averageMessagesPerConversation: number;
  averageFirstResponseTimeMs: number;
  averageResolutionTimeMs: number;
  timeline: BackendTimelinePoint[];
};

export type BackendAiMetrics = {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  successRate: number;
  averageLatencyMs: number;
  averageConfidenceScore: number;
  totalTokensUsed: number;
  averageTokensUsed: number;
  totalEstimatedCost: number;
  timeline: BackendTimelinePoint[];
};

export type BackendAnalyticsOverview = {
  generatedAt: string;
  period: {
    startDate: string | null;
    endDate: string | null;
    groupBy: "day" | "week" | "month";
  };
  conversations: BackendConversationMetrics;
  aiRuns: BackendAiMetrics;
};
