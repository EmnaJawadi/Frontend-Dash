import { apiClient } from "@/src/lib/api-client";
import { getPeriodDateRange, type PeriodFilter } from "@/src/lib/period-filter";
import type { DashboardData } from "@/src/features/dashboard/types/dashboard.types";

type BackendConversation = {
  id?: string;
  status?: string | null;
  priority?: string | null;
  assignedTo?: string | null;
  botPaused?: boolean | null;
  unreadCount?: number | null;
  lastMessageAt?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  lastMessage?: string | null;
  participant?: {
    contactName?: string | null;
    phoneNumber?: string | null;
  };
};

const DAY_MS = 24 * 60 * 60 * 1000;

type BackendListResponse = {
  data?: unknown[];
  meta?: {
    total?: number;
  };
};

function toDateLabel(input: Date, days: number): string {
  const formatter =
    days <= 7
      ? new Intl.DateTimeFormat("fr-FR", { weekday: "short" })
      : new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" });

  return formatter.format(input);
}

function toRelative(input: string): string {
  const date = new Date(input).getTime();
  const diffMinutes = Math.max(0, Math.floor((Date.now() - date) / 60000));

  if (diffMinutes < 1) return "maintenant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `il y a ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  return `il y a ${diffDays} j`;
}

function normalizeStatus(status: string | null | undefined, botPaused: boolean | null | undefined) {
  if (status === "closed") return "closed" as const;
  if (status === "human_assigned") return "human_assigned" as const;
  if (status === "waiting_customer") return "waiting_customer" as const;
  if (status === "pending") return "waiting_customer" as const;
  if (status === "human_handoff") return "human_assigned" as const;
  if (status === "bot_active") return "bot_active" as const;
  return botPaused ? "human_assigned" : "bot_active";
}

function normalizePriority(
  priority: string | null | undefined,
): "low" | "medium" | "high" {
  if (priority === "low" || priority === "high") return priority;
  return "medium";
}

function getConversationDate(conversation: BackendConversation): Date | null {
  const source = conversation.lastMessageAt ?? conversation.updatedAt ?? conversation.createdAt;
  if (!source) return null;

  const date = new Date(source);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isInRange(conversation: BackendConversation, startDate: Date, endDate: Date): boolean {
  const date = getConversationDate(conversation);
  return date ? date >= startDate && date <= endDate : false;
}

function isEscalated(conversation: BackendConversation): boolean {
  return conversation.status === "human_handoff" || !!conversation.assignedTo;
}

export const dashboardService = {
  async getDashboardData(period: PeriodFilter = "30d"): Promise<DashboardData> {
    const { days, startDate, endDate } = getPeriodDateRange(period);

    const [conversationsRes, contactsRes] = await Promise.all([
      apiClient.get<BackendListResponse>("/conversations?page=1&limit=500"),
      apiClient.get<BackendListResponse>("/contacts?page=1&limit=1"),
    ]);

    const conversations = (conversationsRes.data ?? []) as BackendConversation[];
    const periodConversations = conversations.filter((item) => isInRange(item, startDate, endDate));
    const totalConversations = periodConversations.length;
    const totalContacts = contactsRes.meta?.total ?? 0;

    const activeConversations = periodConversations.filter(
      (item) => item.status !== "closed",
    ).length;
    const botActiveCount = periodConversations.filter((item) => !(item.botPaused ?? false)).length;
    const escalatedCount = periodConversations.filter(isEscalated).length;
    const unreadTotal = periodConversations.reduce((acc, item) => acc + Number(item.unreadCount ?? 0), 0);

    const automationRate =
      totalConversations > 0
        ? Math.round((botActiveCount / totalConversations) * 100)
        : 0;

    const periodDays = Array.from({ length: days }, (_, index) => {
      const day = new Date(startDate.getTime() + index * DAY_MS);
      return day;
    });

    const chart = periodDays.map((day) => {
      const start = day.getTime();
      const end = start + DAY_MS;

      const dayConversations = periodConversations.filter((conversation) => {
        const date = getConversationDate(conversation);
        if (!date) return false;
        const ts = date.getTime();
        return ts >= start && ts < end;
      });

      const resolvedByBot = dayConversations.filter(
        (conversation) => !(conversation.botPaused ?? false),
      ).length;
      const escalated = dayConversations.filter(isEscalated).length;

      return {
        date: toDateLabel(day, days),
        conversations: dayConversations.length,
        resolvedByBot,
        escalated,
      };
    });

    const recentConversations = periodConversations
      .slice()
      .sort((a, b) => {
        const aDate = getConversationDate(a)?.getTime() ?? 0;
        const bDate = getConversationDate(b)?.getTime() ?? 0;
        return bDate - aDate;
      })
      .slice(0, 6)
      .map((item) => {
        const updatedAt = getConversationDate(item)?.toISOString() ?? new Date().toISOString();
        return {
          id: item.id ?? "",
          contactName: item.participant?.contactName ?? "Contact inconnu",
          phone: item.participant?.phoneNumber ?? "N/A",
          lastMessage: item.lastMessage ?? "Aucun message",
          updatedAt: toRelative(updatedAt),
          status: normalizeStatus(item.status, item.botPaused),
          priority: normalizePriority(item.priority),
          unreadCount: Number(item.unreadCount ?? 0),
          assignedAgent: item.assignedTo ?? null,
        };
      });

    return {
      stats: [
        {
          key: "totalConversations",
          title: "Total des conversations",
          value: totalConversations,
          subtitle: "sur la periode",
        },
        {
          key: "activeConversations",
          title: "Conversations actives",
          value: activeConversations,
          subtitle: "ouvertes ou en attente",
        },
        {
          key: "automationRate",
          title: "Taux d'automatisation",
          value: `${automationRate}%`,
          subtitle: "prises en charge par le bot",
        },
        {
          key: "escalationsToday",
          title: "Escalades",
          value: escalatedCount,
          subtitle: "sur la periode",
        },
        {
          key: "avgFirstResponseTime",
          title: "Messages non lus",
          value: unreadTotal,
          subtitle: "a traiter sur la periode",
        },
      ],
      chart,
      botPerformance: {
        automationRate,
        averageConfidence: 90,
        averageResponseTime: "12s",
        fallbackRate: Math.max(0, 100 - automationRate),
        metrics: [
          {
            label: "Contacts",
            value: totalContacts,
            hint: "nombre total de contacts",
          },
          {
            label: "Conversations bot",
            value: botActiveCount,
            hint: "avec bot actif",
          },
          {
            label: "Conversations escaladees",
            value: escalatedCount,
            hint: "transfert humain",
          },
          {
            label: "Conversations fermees",
            value: periodConversations.filter((item) => item.status === "closed").length,
            hint: "cloturees",
          },
        ],
      },
      recentConversations,
      escalationSummary: {
        total: escalatedCount,
        pending: periodConversations.filter((item) => item.status === "pending").length,
        resolved: periodConversations.filter((item) => item.status === "closed").length,
        averageHandlingTime: "N/A",
        reasons: [
          {
            label: "Handoff manuel",
            count: periodConversations.filter((item) => item.status === "human_handoff").length,
          },
          {
            label: "Assignee a un agent",
            count: periodConversations.filter((item) => !!item.assignedTo).length,
          },
        ],
      },
    };
  },
};
