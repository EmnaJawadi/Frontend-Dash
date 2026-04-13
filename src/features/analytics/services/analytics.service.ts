import { apiClient } from "@/src/lib/api-client";
import type {
  AnalyticsData,
  AnalyticsDay,
  AnalyticsFilters,
  BackendAnalyticsOverview,
  PeriodFilter,
} from "@/src/features/analytics/types/analytics.types";

type BackendConversation = {
  id?: string;
  status?: string | null;
  assignedTo?: string | null;
  botActive?: boolean | null;
  botPaused?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type BackendConversationListResponse = {
  data?: BackendConversation[];
  meta?: {
    total?: number;
  };
};

const DAY_MS = 24 * 60 * 60 * 1000;

function getPeriodDays(period: PeriodFilter): number {
  if (period === "30d") return 30;
  if (period === "90d") return 90;
  return 7;
}

function startOfDay(input: Date): Date {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(input: Date): Date {
  const date = new Date(input);
  date.setHours(23, 59, 59, 999);
  return date;
}

function toIsoDay(input: Date): string {
  return input.toISOString().slice(0, 10);
}

function formatDayLabel(input: Date): string {
  const short = new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(input);
  return short.replace(".", "");
}

function formatDurationMs(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "N/A";

  const seconds = Math.round(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function normalizeBotFlag(conversation: BackendConversation): boolean {
  if (typeof conversation.botActive === "boolean") {
    return conversation.botActive;
  }

  if (typeof conversation.botPaused === "boolean") {
    return !conversation.botPaused;
  }

  const status = conversation.status?.toLowerCase();
  if (status === "bot_active") return true;
  if (status === "human_assigned" || status === "human_handoff" || status === "open") {
    return false;
  }

  return !conversation.assignedTo;
}

function isEscalated(conversation: BackendConversation): boolean {
  const status = conversation.status?.toLowerCase();
  return Boolean(
    conversation.assignedTo ||
      status === "human_assigned" ||
      status === "human_handoff" ||
      status === "open",
  );
}

function mapFallbackTimeline(overview: BackendAnalyticsOverview): AnalyticsDay[] {
  const aiTimelineMap = new Map<string, number>(
    overview.aiRuns.timeline.map((point) => [point.label, point.value]),
  );

  return overview.conversations.timeline.map((point) => {
    const totalMessages = point.value;
    const botMessages = aiTimelineMap.get(point.label) ?? 0;
    const boundedBotMessages = Math.min(totalMessages, Math.max(0, botMessages));
    const humanMessages = Math.max(0, totalMessages - boundedBotMessages);

    return {
      key: point.label,
      day: formatDayLabel(new Date(point.label)),
      totalMessages,
      botMessages: boundedBotMessages,
      humanMessages,
      escalations: humanMessages,
    };
  });
}

function buildTimelineFromConversations(
  conversations: BackendConversation[],
  period: PeriodFilter,
): AnalyticsDay[] {
  const days = getPeriodDays(period);
  const today = new Date();
  const start = startOfDay(new Date(today.getTime() - (days - 1) * DAY_MS));
  const end = endOfDay(today);

  const range = Array.from({ length: days }, (_, index) => {
    const date = new Date(start.getTime() + index * DAY_MS);
    return {
      key: toIsoDay(date),
      day: formatDayLabel(date),
      totalMessages: 0,
      botMessages: 0,
      humanMessages: 0,
      escalations: 0,
    };
  });

  const buckets = new Map(range.map((item) => [item.key, item]));

  for (const item of conversations) {
    const sourceDate = item.updatedAt ?? item.createdAt;
    if (!sourceDate) continue;

    const parsedDate = new Date(sourceDate);
    if (Number.isNaN(parsedDate.getTime())) continue;
    if (parsedDate < start || parsedDate > end) continue;

    const key = toIsoDay(startOfDay(parsedDate));
    const bucket = buckets.get(key);
    if (!bucket) continue;

    bucket.totalMessages += 1;

    if (normalizeBotFlag(item)) {
      bucket.botMessages += 1;
    } else {
      bucket.humanMessages += 1;
    }

    if (isEscalated(item)) {
      bucket.escalations += 1;
    }
  }

  return range;
}

function sumTimeline(timeline: AnalyticsDay[]) {
  return timeline.reduce(
    (acc, item) => {
      acc.totalMessages += item.totalMessages;
      acc.botMessages += item.botMessages;
      acc.humanMessages += item.humanMessages;
      acc.escalations += item.escalations;
      return acc;
    },
    {
      totalMessages: 0,
      botMessages: 0,
      humanMessages: 0,
      escalations: 0,
    },
  );
}

export const analyticsService = {
  async getAnalyticsData(filters: AnalyticsFilters): Promise<AnalyticsData> {
    const days = getPeriodDays(filters.period);
    const today = new Date();
    const startDate = startOfDay(new Date(today.getTime() - (days - 1) * DAY_MS));
    const endDate = endOfDay(today);

    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      groupBy: "day",
    });

    const [overview, conversationsResponse] = await Promise.all([
      apiClient.get<BackendAnalyticsOverview>(`/analytics/overview?${params.toString()}`),
      apiClient.get<BackendConversationListResponse>("/conversations?page=1&limit=500"),
    ]);

    const conversations = conversationsResponse.data ?? [];
    let timeline = buildTimelineFromConversations(conversations, filters.period);

    const hasTimelineData = timeline.some((item) => item.totalMessages > 0);
    if (!hasTimelineData && overview.conversations.timeline.length > 0) {
      timeline = mapFallbackTimeline(overview);
    }

    const totals = sumTimeline(timeline);
    const botRate =
      totals.totalMessages > 0
        ? Number(((totals.botMessages / totals.totalMessages) * 100).toFixed(1))
        : 0;

    const avgResponseTimeMs =
      overview.conversations.averageFirstResponseTimeMs ||
      overview.aiRuns.averageLatencyMs ||
      0;

    return {
      generatedAt: overview.generatedAt,
      totals: {
        totalMessages: totals.totalMessages,
        botMessages: totals.botMessages,
        humanMessages: totals.humanMessages,
        escalations: totals.escalations,
        botRate,
        avgResponseTimeLabel: formatDurationMs(avgResponseTimeMs),
      },
      timeline,
    };
  },
};
