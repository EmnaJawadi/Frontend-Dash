import { apiClient } from "@/src/lib/api-client";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string; // كان backend يرجّعو
  user?: unknown;        // اختياري
};

export type RefreshResponse = {
  accessToken: string;
};

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>("/auth/login", payload);
    if (res?.accessToken) localStorage.setItem("accessToken", res.accessToken);
    if (res?.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);
    return res;
  },

  async refresh(): Promise<RefreshResponse> {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    const res = await apiClient.post<RefreshResponse>("/auth/refresh", refreshToken ? { refreshToken } : undefined);
    if (res?.accessToken) localStorage.setItem("accessToken", res.accessToken);
    return res;
  },

  async forgotPassword(email: string): Promise<{ message: string } | string> {
    return apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string } | string> {
    return apiClient.post("/auth/reset-password", { token, newPassword });
  },

  async registerCompanyAdmin(payload: Record<string, unknown>): Promise<unknown> {
    // بدّل payload حسب DTO: register-company-admin.dto.ts
    return apiClient.post("/auth/register-company-admin", payload);
  },

  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};