import { ApiError } from "@/src/lib/api-error";
import { env } from "@/src/config/env";
import { clearSession } from "@/src/lib/session";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

const API_URL = env.NEXT_PUBLIC_API_URL;
const NETWORK_ERROR_STATUS = 0;

const AUTH_ENDPOINT_PREFIXES = [
  "/auth/login",
  "/auth/register",
  "/auth/register-agent",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

let refreshPromise: Promise<boolean> | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isAuthEndpoint(endpoint: string): boolean {
  return AUTH_ENDPOINT_PREFIXES.some((prefix) => endpoint.startsWith(prefix));
}

function clearClientAuthState(): void {
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

async function refreshAccessToken(): Promise<boolean> {
  if (!API_URL) return false;

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await parseResponse(response);

      if (!response.ok || !data || typeof data !== "object") {
        return false;
      }

      return true;
    } catch {
      return false;
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
    try {
      return await fetch(`${API_URL}${endpoint}`, {
        method,
        credentials: "include",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...headers,
        },
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      });
    } catch {
      throw new ApiError(
        `Impossible de joindre le serveur API (${API_URL}). Verifiez que le backend est demarre.`,
        NETWORK_ERROR_STATUS,
      );
    }
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

  deleteWithBody: <T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ) => request<T>(endpoint, { method: "DELETE", body, headers }),
};
