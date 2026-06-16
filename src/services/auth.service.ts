import { apiClient } from "@/src/lib/api-client";

export type BackendRole = "SUPER_ADMIN" | "COMPANY_ADMIN" | "AGENT" | "EMPLOYEE";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  companyName: string;
  businessEmail: string;
  phoneNumber: string;
  responsibleFullName: string;
  businessType: string;
  message?: string;
  password: string;
  requestedRole?: "COMPANY_ADMIN";
};

export type RegisterAgentRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
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
  user: BackendAuthUser;
  tokenType?: "Cookie";
};

export type RegisterResponse = {
  success?: boolean;
  message?: string;
  status?: string;
  requestId?: string;
  data?: {
    id: string;
    status: string;
    companyName: string;
    businessEmail: string;
    createdAt: string;
  };
};

export type RegisterAgentResponse = {
  success?: boolean;
  message?: string;
  data?: {
    id: string;
    status: string;
    companyId: string;
    companyName: string;
    email: string;
    createdAt: string;
  };
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
  user: BackendAuthUser;
  tokenType?: "Cookie";
};

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", payload);
  },

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const res = await apiClient.post<RegisterResponse>("/public/company-registration", payload);
    return res;
  },

  async registerAgent(payload: RegisterAgentRequest): Promise<RegisterAgentResponse> {
    return apiClient.post<RegisterAgentResponse>("/auth/register-agent", payload);
  },

  async refresh(): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse>("/auth/refresh");
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

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};
