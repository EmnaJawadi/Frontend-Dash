import { apiClient } from "@/src/lib/api-client";

export type PaginationQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export type UserProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  role: string;
  companyId?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  avatarUrl?: string | null;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type UsersListResponse = {
  data: UserProfile[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

function buildQuery(query?: PaginationQuery): string {
  if (!query) return "";

  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export const usersService = {
  me: (): Promise<UserProfile> => apiClient.get<UserProfile>("/users/me"),

  getProfile: (): Promise<UserProfile> => apiClient.get<UserProfile>("/users/me"),

  updateProfile: (payload: UpdateProfilePayload): Promise<UserProfile> =>
    apiClient.patch<UserProfile>("/users/me", payload),

  changePassword: (
    payload: ChangePasswordPayload
  ): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>("/users/change-password", payload),

  list: (query?: PaginationQuery): Promise<UsersListResponse> =>
    apiClient.get<UsersListResponse>(`/users${buildQuery(query)}`),

  getById: (id: string): Promise<UserProfile> =>
    apiClient.get<UserProfile>(`/users/${id}`),

  create: (payload: Record<string, unknown>): Promise<UserProfile> =>
    apiClient.post<UserProfile>("/users", payload),

  update: (id: string, payload: Record<string, unknown>): Promise<UserProfile> =>
    apiClient.patch<UserProfile>(`/users/${id}`, payload),

  remove: (id: string): Promise<{ message: string }> =>
    apiClient.delete<{ message: string }>(`/users/${id}`),
};