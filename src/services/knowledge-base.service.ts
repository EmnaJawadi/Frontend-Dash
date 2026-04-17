import { apiClient } from "@/src/lib/api-client";

type ListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "draft" | "published" | "archived";
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

export const knowledgeBaseService = {
  list: (query?: ListQuery) =>
    apiClient.get(`/knowledge-base/articles${toQueryString(query as Record<string, unknown>)}`),
  getById: (id: string) => apiClient.get(`/knowledge-base/articles/${id}`),
  create: (payload: Record<string, unknown>) =>
    apiClient.post("/knowledge-base/articles", payload),
  createFromFile: (payload: {
    file: File;
    title?: string;
    summary?: string;
    language?: string;
    tags?: string[];
    autoPublish?: boolean;
    chunkSize?: number;
    chunkOverlap?: number;
  }) => {
    const formData = new FormData();
    formData.append("file", payload.file);
    if (payload.title) formData.append("title", payload.title);
    if (payload.summary) formData.append("summary", payload.summary);
    if (payload.language) formData.append("language", payload.language);
    if (payload.tags?.length) formData.append("tags", payload.tags.join(","));
    if (payload.autoPublish !== undefined) formData.append("autoPublish", String(payload.autoPublish));
    if (payload.chunkSize !== undefined) formData.append("chunkSize", String(payload.chunkSize));
    if (payload.chunkOverlap !== undefined) formData.append("chunkOverlap", String(payload.chunkOverlap));

    return apiClient.postForm("/knowledge-base/articles/ingest/file", formData);
  },
  update: (id: string, payload: Record<string, unknown>) =>
    apiClient.put(`/knowledge-base/articles/${id}`, payload),
  publish: (id: string, published: boolean) =>
    apiClient.patch(`/knowledge-base/articles/${id}/publish`, { published }),
  remove: (id: string) => apiClient.delete(`/knowledge-base/articles/${id}`),
};
