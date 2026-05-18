import { apiClient } from "@/src/lib/api-client";

export const conversationsService = {
  list: () => apiClient.get("/conversations"),
  getById: (id: string) => apiClient.get(`/conversations/${id}`),
  create: (payload: Record<string, unknown>) => apiClient.post("/conversations", payload),
  update: (id: string, payload: Record<string, unknown>) => apiClient.patch(`/conversations/${id}`, payload),
  remove: (id: string) => apiClient.delete(`/conversations/${id}`),

  listMessages: (conversationId: string) =>
    apiClient.get(`/messages?conversationId=${encodeURIComponent(conversationId)}`),
  sendMessage: (conversationId: string, payload: Record<string, unknown>) =>
    apiClient.post(`/messages/send`, {
      conversationId,
      content: payload.content ?? payload.message,
      type: payload.type,
      senderId: payload.senderId,
    }),

  addTag: (conversationId: string, tagId: string) =>
    apiClient.post(`/conversation-tags`, {
      conversationId,
      label: tagId,
    }),

  removeTag: (conversationId: string, tagId: string) =>
    apiClient.deleteWithBody(`/conversation-tags`, {
      conversationId,
      label: tagId,
    }),
};
