import { apiClient } from "@/src/lib/api-client";

export type BackendRole = "SUPER_ADMIN" | "ADMIN" | "AGENT";

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
  role?: "SUPER_ADMIN" | "ADMIN" | "AGENT";
};

export type BackendAuthUser = {
  id: string;
  firstName: string;
  lastName?: string | null;
  fullName?: string;
  email: string;
  role: BackendRole;
  isActive: boolean;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: BackendAuthUser;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
  user: BackendAuthUser;
};

function persistTokens(tokens: { accessToken?: string; refreshToken?: string }) {
  if (typeof window === "undefined") return;
  if (tokens.accessToken) localStorage.setItem("accessToken", tokens.accessToken);
  if (tokens.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
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
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
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

  async forgotPassword(email: string): Promise<{ message: string } | string> {
    return apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string } | string> {
    return apiClient.post("/auth/reset-password", { token, newPassword });
  },

  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
