import { apiClient } from "@/src/lib/api-client";

export type ContactsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
};

function toQueryString(q?: Record<string, unknown>) {
  if (!q) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === "") continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const contactsService = {
  list: (query?: ContactsQuery) =>
    apiClient.get(`/contacts${toQueryString(query as Record<string, unknown>)}`),

  getById: (id: string) => apiClient.get(`/contacts/${id}`),

  create: (payload: Record<string, unknown>) => apiClient.post(`/contacts`, payload),

  update: (id: string, payload: Record<string, unknown>) => apiClient.patch(`/contacts/${id}`, payload),

  remove: (id: string) => apiClient.delete(`/contacts/${id}`),

  addNote: (contactId: string, payload: { note: string }) =>
    apiClient.post(`/contacts/${contactId}/notes`, payload),

  listNotes: (contactId: string) => apiClient.get(`/contacts/${contactId}/notes`),
};