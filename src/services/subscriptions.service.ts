import { apiClient } from "@/src/lib/api-client";

export const subscriptionsService = {
  get: () => apiClient.get("/subscriptions"),
  update: (id: string, payload: Record<string, unknown>) =>
    apiClient.patch(`/subscriptions/${id}`, payload),
};
