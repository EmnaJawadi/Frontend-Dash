import { apiClient } from "@/src/lib/api-client";
import type { DashboardData } from "@/src/features/dashboard/types/dashboard.types";

type BackendConversation = {
  id?: string;
  status?: string | null;
  priority?: string | null;
  assignedTo?: string | null;
  botPaused?: boolean | null;
  unreadCount?: number | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  lastMessage?: string | null;
  participant?: {
    contactName?: string | null;
    phoneNumber?: string | null;
  };
};

type BackendListResponse = {
  data?: unknown[];
  meta?: {
    total?: number;
  };
};

function toDateLabel(input: string): string {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(new Date(input));
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

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const [conversationsRes, contactsRes] = await Promise.all([
      apiClient.get<BackendListResponse>("/conversations?page=1&limit=100"),
      apiClient.get<BackendListResponse>("/contacts?page=1&limit=100"),
    ]);

    const conversations = (conversationsRes.data ?? []) as BackendConversation[];
    const totalConversations = conversationsRes.meta?.total ?? conversations.length;
    const totalContacts = contactsRes.meta?.total ?? 0;

    const activeConversations = conversations.filter(
      (item) => item.status !== "closed",
    ).length;
    const botActiveCount = conversations.filter((item) => !(item.botPaused ?? false)).length;
    const escalatedCount = conversations.filter(
      (item) => item.status === "human_handoff" || !!item.assignedTo,
    ).length;
    const unreadTotal = conversations.reduce((acc, item) => acc + Number(item.unreadCount ?? 0), 0);

    const automationRate =
      totalConversations > 0
        ? Math.round((botActiveCount / totalConversations) * 100)
        : 0;

    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - index));
      day.setHours(0, 0, 0, 0);
      return day;
    });

    const chart = last7Days.map((day) => {
      const start = day.getTime();
      const end = start + 24 * 60 * 60 * 1000;

      const dayConversations = conversations.filter((conversation) => {
        const source = conversation.updatedAt ?? conversation.createdAt;
        if (!source) return false;
        const ts = new Date(source).getTime();
        return ts >= start && ts < end;
      });

      const resolvedByBot = dayConversations.filter(
        (conversation) => !(conversation.botPaused ?? false),
      ).length;
      const escalated = dayConversations.filter(
        (conversation) =>
          conversation.status === "human_handoff" || !!conversation.assignedTo,
      ).length;

      return {
        date: toDateLabel(day.toISOString()),
        conversations: dayConversations.length,
        resolvedByBot,
        escalated,
      };
    });

    const recentConversations = conversations
      .slice()
      .sort((a, b) => {
        const aDate = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
        const bDate = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
        return bDate - aDate;
      })
      .slice(0, 6)
      .map((item) => {
        const updatedAt = item.updatedAt ?? item.createdAt ?? new Date().toISOString();
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
          subtitle: "volume global",
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
          subtitle: "transferts vers agent",
        },
        {
          key: "avgFirstResponseTime",
          title: "Messages non lus",
          value: unreadTotal,
          subtitle: "a traiter",
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
            value: conversations.filter((item) => item.status === "closed").length,
            hint: "cloturees",
          },
        ],
      },
      recentConversations,
      escalationSummary: {
        total: escalatedCount,
        pending: conversations.filter((item) => item.status === "pending").length,
        resolved: conversations.filter((item) => item.status === "closed").length,
        averageHandlingTime: "N/A",
        reasons: [
          {
            label: "Handoff manuel",
            count: conversations.filter((item) => item.status === "human_handoff").length,
          },
          {
            label: "Assignee a un agent",
            count: conversations.filter((item) => !!item.assignedTo).length,
          },
        ],
      },
    };
  },
};
