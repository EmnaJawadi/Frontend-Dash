import { apiClient } from "@/src/lib/api-client";

export type DashboardStats = {
  totalUsers: number;
  totalMessages: number;
  totalTickets: number;
  activeSubscriptions: number;
};

export const dashboardService = {
  stats: (): Promise<DashboardStats> =>
    apiClient.get<DashboardStats>("/dashboard/stats"),

  analytics: (range?: string) =>
    apiClient.get(
      range
        ? `/analytics?range=${encodeURIComponent(range)}`
        : "/analytics"
    ),
};