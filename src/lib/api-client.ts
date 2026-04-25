import { ApiError } from "@/src/lib/api-error";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/src/lib/auth-token";
import { clearSession } from "@/src/lib/session";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AUTH_ENDPOINT_PREFIXES = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

let refreshPromise: Promise<string | null> | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isAuthEndpoint(endpoint: string): boolean {
  return AUTH_ENDPOINT_PREFIXES.some((prefix) => endpoint.startsWith(prefix));
}

function clearClientAuthState(): void {
  clearAuthTokens();
  clearSession();
}

function redirectToLoginIfNeeded(): void {
  if (!isBrowser()) return;
  if (window.location.pathname === "/login") return;
  window.location.replace("/login");
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function resolveApiErrorMessage(data: unknown): string {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const value = data as { message?: unknown; error?: unknown };

    if (typeof value.message === "string" && value.message.trim()) {
      return value.message;
    }

    if (Array.isArray(value.message) && value.message.length > 0) {
      const first = value.message[0];
      if (typeof first === "string" && first.trim()) {
        return first;
      }
    }

    if (typeof value.error === "string" && value.error.trim()) {
      return value.error;
    }
  }

  return "Request failed";
}

async function refreshAccessToken(): Promise<string | null> {
  if (!API_URL) return null;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await parseResponse(response);

      if (!response.ok || !data || typeof data !== "object") {
        return null;
      }

      const tokens = data as {
        accessToken?: unknown;
        refreshToken?: unknown;
      };

      if (
        typeof tokens.accessToken !== "string" ||
        !tokens.accessToken.trim()
      ) {
        return null;
      }

      setAuthTokens({
        accessToken: tokens.accessToken,
        refreshToken:
          typeof tokens.refreshToken === "string"
            ? tokens.refreshToken
            : undefined,
      });

      return tokens.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  canRetryOnUnauthorized = true
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const { method = "GET", body, headers = {} } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const performRequest = async () => {
    const token = getAccessToken();

    return fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  };

  let response = await performRequest();
  let data = await parseResponse(response);

  if (
    response.status === 401 &&
    canRetryOnUnauthorized &&
    !isAuthEndpoint(endpoint)
  ) {
    const refreshedAccessToken = await refreshAccessToken();

    if (refreshedAccessToken) {
      response = await performRequest();
      data = await parseResponse(response);
    }
  }

  if (!response.ok) {
    if (response.status === 401 && !isAuthEndpoint(endpoint)) {
      clearClientAuthState();
      redirectToLoginIfNeeded();
    }

    throw new ApiError(resolveApiErrorMessage(data), response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "GET", headers }),

  post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "POST", body, headers }),

  postForm: <T>(endpoint: string, formData: FormData, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "POST", body: formData, headers }),

  put: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "PUT", body, headers }),

  patch: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "PATCH", body, headers }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "DELETE", headers }),
};
