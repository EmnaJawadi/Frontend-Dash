const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string, days = 7): void {
  if (!isBrowser()) return;

  const expires = new Date();
  expires.setDate(expires.getDate() + days);

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) return null;
  return decodeURIComponent(cookie.split("=")[1] ?? "");
}

function deleteCookie(name: string): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function setAccessToken(token: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  setCookie(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? getCookie(ACCESS_TOKEN_KEY);
}

export function removeAccessToken(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  deleteCookie(ACCESS_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
  setCookie(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY) ?? getCookie(REFRESH_TOKEN_KEY);
}

export function removeRefreshToken(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
}

export function setAuthTokens(params: {
  accessToken: string;
  refreshToken?: string;
}): void {
  setAccessToken(params.accessToken);

  if (params.refreshToken) {
    setRefreshToken(params.refreshToken);
  }
}

export function clearAuthTokens(): void {
  removeAccessToken();
  removeRefreshToken();
}

export function hasAccessToken(): boolean {
  return !!getAccessToken();
}
