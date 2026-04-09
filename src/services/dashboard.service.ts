import { apiClient } from "@/src/lib/api-client";

export const dashboardService = {
  stats: () => apiClient.get("/dashboard/stats"),
  analytics: (range?: string) => apiClient.get(range ? `/analytics?range=${encodeURIComponent(range)}` : "/analytics"),
};