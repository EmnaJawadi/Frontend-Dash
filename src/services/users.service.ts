import { apiClient } from "@/src/lib/api-client";

export type PaginationQuery = {
  page?: number;
  limit?: number;
  search?: string;
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

export const usersService = {
  me: () => apiClient.get("/users/me"),

  list: (query?: PaginationQuery) =>
    apiClient.get(`/users${toQueryString(query as Record<string, unknown>)}`),

  getById: (id: string) => apiClient.get(`/users/${id}`),

  create: (payload: Record<string, unknown>) => apiClient.post(`/users`, payload),

  update: (id: string, payload: Record<string, unknown>) => apiClient.patch(`/users/${id}`, payload),

  remove: (id: string) => apiClient.delete(`/users/${id}`),
};