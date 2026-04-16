import type { AuthUser } from "@/src/types/auth";
import type { UserRole } from "@/src/types/role";

const STORAGE_KEYS = {
  AUTH: "is_authenticated",
  ROLE: "user_role",
  USER: "user_data",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function setCookie(name: string, value: string, days = 7): void {
  if (!isBrowser()) return;

  const expires = new Date();
  expires.setDate(expires.getDate() + days);

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/`;
}

export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.split("=")[1]);
}

export function deleteCookie(name: string): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function saveSession(user: AuthUser): void {
  if (!isBrowser()) return;

  setCookie(STORAGE_KEYS.AUTH, "true");
  setCookie(STORAGE_KEYS.ROLE, user.role);
  setCookie(STORAGE_KEYS.USER, JSON.stringify(user));

  localStorage.setItem(STORAGE_KEYS.AUTH, "true");
  localStorage.setItem(STORAGE_KEYS.ROLE, user.role);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  if (!isBrowser()) return null;

  const rawUser =
    getCookie(STORAGE_KEYS.USER) ?? localStorage.getItem(STORAGE_KEYS.USER);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (!isBrowser()) return;

  deleteCookie(STORAGE_KEYS.AUTH);
  deleteCookie(STORAGE_KEYS.ROLE);
  deleteCookie(STORAGE_KEYS.USER);

  localStorage.removeItem(STORAGE_KEYS.AUTH);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getStoredRole(): UserRole | null {
  const role =
    getCookie(STORAGE_KEYS.ROLE) ?? localStorage.getItem(STORAGE_KEYS.ROLE);

  if (role === "SUPER_ADMIN" || role === "OWNER" || role === "AGENT") {
    return role;
  }

  return null;
}

export function getAuthFlag(): boolean {
  const auth =
    getCookie(STORAGE_KEYS.AUTH) ?? localStorage.getItem(STORAGE_KEYS.AUTH);

  return auth === "true";
}
