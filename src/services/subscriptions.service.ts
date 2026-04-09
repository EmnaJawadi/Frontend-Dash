import { apiClient } from "@/src/lib/api-client";

export const subscriptionsService = {
  get: () => apiClient.get("/subscriptions"),
  update: (payload: Record<string, unknown>) => apiClient.patch("/subscriptions", payload),
};