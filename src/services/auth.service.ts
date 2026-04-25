import { apiClient } from "@/src/lib/api-client";
import {
  clearAuthTokens,
  getRefreshToken,
  setAuthTokens,
} from "@/src/lib/auth-token";

export type BackendRole = "SUPER_ADMIN" | "COMPANY_ADMIN" | "AGENT" | "EMPLOYEE";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName?: string | null;
  email: string;
  password: string;
  phoneNumber?: string | null;
  role: BackendRole;
  companyId?: string;
  companyName?: string;
};

export type BackendAuthUser = {
  id: string;
  firstName: string;
  lastName?: string | null;
  fullName?: string;
  email: string;
  role: BackendRole;
  isActive: boolean;
  companyId?: string | null;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: BackendAuthUser;
};

export type UpdateMeRequest = {
  firstName?: string;
  lastName?: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
  user: BackendAuthUser;
};

function persistTokens(tokens: { accessToken?: string; refreshToken?: string }) {
  if (!tokens.accessToken) return;

  setAuthTokens({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/login", payload);
    persistTokens(res);
    return res;
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/register", payload);
    persistTokens(res);
    return res;
  },

  async refresh(): Promise<RefreshResponse> {
    const refreshToken = getRefreshToken();
    const res = await apiClient.post<RefreshResponse>(
      "/auth/refresh",
      refreshToken ? { refreshToken } : undefined
    );
    persistTokens(res);
    return res;
  },

  async me(): Promise<BackendAuthUser> {
    return apiClient.get<BackendAuthUser>("/auth/me");
  },

  async updateMe(payload: UpdateMeRequest): Promise<BackendAuthUser> {
    return apiClient.patch<BackendAuthUser>("/auth/me", payload);
  },

  async changePassword(payload: ChangePasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/auth/change-password", payload);
  },

  async forgotPassword(email: string): Promise<{ message: string } | string> {
    return apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string } | string> {
    return apiClient.post("/auth/reset-password", { token, newPassword });
  },

  logout(): void {
    clearAuthTokens();
  },
};
