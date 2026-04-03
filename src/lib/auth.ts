import type { AuthUser, LoginPayload, RegisterPayload } from "@/src/types/auth";
import type { UserRole } from "@/src/types/role";
import {
  clearSession,
  getAuthFlag,
  getSession,
  getStoredRole,
  saveSession,
} from "@/src/lib/session";
import { getDefaultRouteByRole } from "@/src/lib/routes";

export type CurrentUser = AuthUser;

function buildMockUserFromLogin(payload: LoginPayload): AuthUser {
  if (payload.role === "SUPER_ADMIN") {
    return {
      id: "super-admin-1",
      firstName: "Platform",
      lastName: "Admin",
      email: payload.email,
      role: "SUPER_ADMIN",
    };
  }

  if (payload.role === "OWNER") {
    return {
      id: "owner-1",
      firstName: "Company",
      lastName: "Owner",
      email: payload.email,
      role: "OWNER",
      companyId: "company-1",
      companyName: "Support OS",
    };
  }

  return {
    id: "agent-1",
    firstName: "Support",
    lastName: "Agent",
    email: payload.email,
    role: "AGENT",
    companyId: "company-1",
    companyName: "Support OS",
  };
}

function buildMockUserFromRegister(payload: RegisterPayload): AuthUser {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : "user-new";

  if (payload.role === "SUPER_ADMIN") {
    return {
      id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: "SUPER_ADMIN",
    };
  }

  return {
    id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    role: payload.role,
    companyId: "company-1",
    companyName: payload.companyName || "My Company",
  };
}

export function login(payload: LoginPayload): AuthUser {
  const user = buildMockUserFromLogin(payload);
  saveSession(user);
  return user;
}

export function register(payload: RegisterPayload): AuthUser {
  const user = buildMockUserFromRegister(payload);
  saveSession(user);
  return user;
}

export function logout(): void {
  clearSession();
}

export function isAuthenticated(): boolean {
  return getAuthFlag();
}

export function getCurrentUser(): CurrentUser | null {
  return getSession();
}

export function getUserRole(): UserRole | null {
  return getStoredRole();
}

export function hasRole(allowedRoles: UserRole[]): boolean {
  const role = getUserRole();
  if (!role) return false;
  return allowedRoles.includes(role);
}

export function getDefaultRedirectByRole(role: UserRole): string {
  return getDefaultRouteByRole(role);
}