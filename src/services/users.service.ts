import { apiClient } from "@/src/lib/api-client";

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

export const usersService = {
  me: (): Promise<UserProfile> => apiClient.get<UserProfile>("/auth/me"),

  getProfile: (): Promise<UserProfile> => apiClient.get<UserProfile>("/auth/me"),

  updateProfile: (payload: UpdateProfilePayload): Promise<UserProfile> =>
    apiClient.patch<UserProfile>("/auth/me", payload),

  changePassword: (
    payload: ChangePasswordPayload
  ): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>("/auth/change-password", payload),
};
