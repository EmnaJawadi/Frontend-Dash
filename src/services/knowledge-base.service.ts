import { apiClient } from "@/src/lib/api-client";

export const knowledgeBaseService = {
  list: () => apiClient.get("/knowledge-base"),
  search: (q: string) => apiClient.get(`/knowledge-base/search?q=${encodeURIComponent(q)}`),
  getById: (id: string) => apiClient.get(`/knowledge-base/${id}`),
  create: (payload: Record<string, unknown>) => apiClient.post("/knowledge-base", payload),
  update: (id: string, payload: Record<string, unknown>) => apiClient.patch(`/knowledge-base/${id}`, payload),
  remove: (id: string) => apiClient.delete(`/knowledge-base/${id}`),
};