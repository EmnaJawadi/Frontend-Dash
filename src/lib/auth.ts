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
import { clearAuthTokens, hasAccessToken } from "@/src/lib/auth-token";
import { getDefaultRouteByRole } from "@/src/lib/routes";
import {
  authService,
  type BackendAuthUser,
  type BackendRole,
} from "@/src/services/auth.service";

export type CurrentUser = AuthUser;

function mapBackendRole(role: BackendRole): UserRole {
  if (role === "SUPER_ADMIN") return "SUPER_ADMIN";
  if (role === "COMPANY_ADMIN") return "OWNER";
  return "AGENT";
}

function toAuthUser(user: BackendAuthUser, companyName?: string): AuthUser {
  const role = mapBackendRole(user.role);

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName ?? "",
    email: user.email,
    role,
    companyId: role === "SUPER_ADMIN" ? undefined : user.companyId ?? undefined,
    companyName: role === "SUPER_ADMIN" ? "Administration globale" : companyName || "My Company",
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
  const registerPayload = {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim(),
    password: payload.password,
    role:
      payload.role === "SUPER_ADMIN"
        ? ("SUPER_ADMIN" as const)
        : payload.role === "OWNER"
          ? ("COMPANY_ADMIN" as const)
          : ("AGENT" as const),
    ...(payload.role !== "SUPER_ADMIN" && payload.companyName?.trim()
      ? { companyName: payload.companyName.trim() }
      : {}),
  };

  const response = await authService.register(registerPayload);

  const safeUser = toAuthUser(response.user, payload.companyName);
  saveSession(safeUser);
  return safeUser;
}

export async function updateCurrentUserProfile(payload: {
  firstName: string;
  lastName: string;
}): Promise<AuthUser> {
  const currentUser = getCurrentStoredUser();
  const firstName = payload.firstName.trim();
  const lastName = payload.lastName.trim();

  if (!firstName || !lastName) {
    throw new Error("Le prenom et le nom sont obligatoires.");
  }

  const backendUser = await authService.updateMe({
    firstName,
    lastName,
  });

  const updatedUser = toAuthUser(backendUser, currentUser.companyName);

  saveSession(updatedUser);
  return updatedUser;
}

export async function updateCurrentUserPassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> {
  if (!payload.currentPassword.trim()) {
    throw new Error("Mot de passe actuel incorrect.");
  }

  if (payload.newPassword.length < 6) {
    throw new Error("Le nouveau mot de passe doit contenir au moins 6 caracteres.");
  }

  if (payload.newPassword !== payload.confirmPassword) {
    throw new Error("Les mots de passe ne correspondent pas.");
  }

  await authService.changePassword({
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });
}

export function logout(): void {
  authService.logout();
  clearSession();
}

export function isAuthenticated(): boolean {
  const authFlag = getAuthFlag();
  if (!authFlag) return false;

  if (!hasAccessToken()) {
    clearAuthTokens();
    clearSession();
    return false;
  }

  return true;
}

export function getCurrentUser(): CurrentUser | null {
  if (!isAuthenticated()) return null;
  return getSession();
}

export function getUserRole(): UserRole | null {
  if (!isAuthenticated()) return null;
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
