import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/src/types/auth";
import type { UserRole } from "@/src/types/role";
import {
  clearSession,
  getAuthFlag,
  getSession,
  getStoredRole,
  saveSession,
} from "@/src/lib/session";
import { getDefaultRouteByRole } from "@/src/lib/routes";
import {
  authService,
  type BackendAuthUser,
  type BackendRole,
} from "@/src/services/auth.service";

export type CurrentUser = AuthUser;

function mapBackendRole(role: BackendRole): UserRole {
  if (role === "AGENT") return "AGENT";
  return "OWNER";
}

function toAuthUser(user: BackendAuthUser, companyName?: string): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName ?? "",
    email: user.email,
    role: mapBackendRole(user.role),
    companyId: "company-1",
    companyName: companyName || "My Company",
  };
}

function getCurrentStoredUser(): AuthUser {
  const sessionUser = getSession();
  if (!sessionUser) {
    throw new Error("Utilisateur introuvable.");
  }
  return sessionUser;
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await authService.login({
    email: payload.email.trim(),
    password: payload.password,
  });

  const safeUser = toAuthUser(response.user);

  if (safeUser.role !== payload.role) {
    authService.logout();
    clearSession();
    throw new Error("Email, mot de passe ou role incorrect.");
  }

  saveSession(safeUser);
  return safeUser;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const response = await authService.register({
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim(),
    password: payload.password,
    role: payload.role === "OWNER" ? "ADMIN" : "AGENT",
  });

  const safeUser = toAuthUser(response.user, payload.companyName);
  saveSession(safeUser);
  return safeUser;
}

export function updateCurrentUserProfile(payload: {
  firstName: string;
  lastName: string;
}): AuthUser {
  const currentUser = getCurrentStoredUser();

  const updatedUser: AuthUser = {
    ...currentUser,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
  };

  saveSession(updatedUser);
  return updatedUser;
}

export function updateCurrentUserPassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): void {
  if (!payload.currentPassword.trim()) {
    throw new Error("Mot de passe actuel incorrect.");
  }

  if (payload.newPassword.length < 6) {
    throw new Error("Le nouveau mot de passe doit contenir au moins 6 caracteres.");
  }

  if (payload.newPassword !== payload.confirmPassword) {
    throw new Error("Les mots de passe ne correspondent pas.");
  }
}

export function logout(): void {
  authService.logout();
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
