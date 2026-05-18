import { apiClient } from "@/src/lib/api-client";

export type DashboardStats = {
  totalUsers: number;
  totalMessages: number;
  totalTickets: number;
  activeSubscriptions: number;
};

type CountResponse = {
  meta?: {
    total?: number;
  };
};

function totalFrom(response: CountResponse): number {
  return Number(response.meta?.total ?? 0);
}

export const dashboardService = {
  async stats(): Promise<DashboardStats> {
    const [contacts, messages, conversations] = await Promise.all([
      apiClient.get<CountResponse>("/contacts?page=1&limit=1"),
      apiClient.get<CountResponse>("/messages?page=1&limit=1"),
      apiClient.get<CountResponse>("/conversations?page=1&limit=1"),
    ]);

    return {
      totalUsers: totalFrom(contacts),
      totalMessages: totalFrom(messages),
      totalTickets: totalFrom(conversations),
      activeSubscriptions: 0,
    };
  },

  analytics: (range?: string) =>
    apiClient.get(
      range
        ? `/analytics/overview?range=${encodeURIComponent(range)}`
        : "/analytics/overview"
    ),
};
