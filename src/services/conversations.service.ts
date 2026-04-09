import { apiClient } from "@/src/lib/api-client";

export const conversationsService = {
  list: () => apiClient.get("/conversations"),
  getById: (id: string) => apiClient.get(`/conversations/${id}`),
  create: (payload: Record<string, unknown>) => apiClient.post("/conversations", payload),
  update: (id: string, payload: Record<string, unknown>) => apiClient.patch(`/conversations/${id}`, payload),
  remove: (id: string) => apiClient.delete(`/conversations/${id}`),

  listMessages: (conversationId: string) => apiClient.get(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, payload: Record<string, unknown>) =>
    apiClient.post(`/conversations/${conversationId}/messages`, payload),

  addTag: (conversationId: string, tagId: string) =>
    apiClient.post(`/conversations/${conversationId}/tags`, { tagId }),

  removeTag: (conversationId: string, tagId: string) =>
    apiClient.delete(`/conversations/${conversationId}/tags/${tagId}`),
};