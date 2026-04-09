import { apiClient } from "@/src/lib/api-client";

export const adminService = {
  health: () => apiClient.get("/health"),
};