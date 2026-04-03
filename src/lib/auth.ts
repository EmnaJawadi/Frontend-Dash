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
import { MOCK_USERS, type MockAuthUser } from "@/src/mock/users";

export type CurrentUser = AuthUser;

const STORAGE_KEY = "mock_users";

function getStoredUsers(): MockAuthUser[] {
  if (typeof window === "undefined") {
    return MOCK_USERS;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  }

  try {
    return JSON.parse(stored) as MockAuthUser[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  }
}

function saveStoredUsers(users: MockAuthUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function stripPassword(user: MockAuthUser): AuthUser {
  const { password, isActive, ...safeUser } = user;
  return safeUser;
}

function generateUserId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `user-${Date.now()}`;
}

export function login(payload: LoginPayload): AuthUser {
  const users = getStoredUsers();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === payload.email.toLowerCase() &&
      item.password === payload.password &&
      item.role === payload.role &&
      item.isActive
  );

  if (!user) {
    throw new Error("Email, mot de passe ou role incorrect.");
  }

  const safeUser = stripPassword(user);
  saveSession(safeUser);

  return safeUser;
}

export function register(payload: RegisterPayload): AuthUser {
  const users = getStoredUsers();

  const existingUser = users.find(
    (item) => item.email.toLowerCase() === payload.email.toLowerCase()
  );

  if (existingUser) {
    throw new Error("Un compte avec cet email existe deja.");
  }

  const newUser: MockAuthUser =
    payload.role === "SUPER_ADMIN"
      ? {
          id: generateUserId(),
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password,
          role: "SUPER_ADMIN",
          isActive: true,
        }
      : {
          id: generateUserId(),
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password,
          role: payload.role,
          companyId: "company-1",
          companyName: payload.companyName || "My Company",
          isActive: true,
        };

  const updatedUsers = [...users, newUser];
  saveStoredUsers(updatedUsers);

  const safeUser = stripPassword(newUser);
  saveSession(safeUser);

  return safeUser;
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