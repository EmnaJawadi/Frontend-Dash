import type { UserRole } from "./role";

export type RegisterRole = UserRole;

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RegisterRole;
  companyName?: string;
  phoneNumber?: string;
  businessType?: string;
  message?: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}
