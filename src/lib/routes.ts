import type { UserRole } from "@/src/types/role";

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
} as const;

export const ONBOARDING_ROUTES = {
  COMPANY_INFO: "/company-info",
  TEAM: "/team",
  SETUP: "/setup",
} as const;

export const APP_ROUTES = {
  SUPER_ADMIN: "/super-admin",
  DASHBOARD: "/dashboard",
  CONVERSATIONS: "/conversations",
  CONTACTS: "/contacts",
  KNOWLEDGE_BASE: "/knowledge-base",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
  PROFILE_SETTINGS: "/settings/profile",
} as const;

export const PUBLIC_ROUTES: string[] = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  AUTH_ROUTES.FORGOT_PASSWORD,
];

export const OWNER_ROUTES: string[] = [
  APP_ROUTES.DASHBOARD,
  APP_ROUTES.CONVERSATIONS,
  APP_ROUTES.CONTACTS,
  APP_ROUTES.KNOWLEDGE_BASE,
  APP_ROUTES.ANALYTICS,
  APP_ROUTES.SETTINGS,
  APP_ROUTES.PROFILE_SETTINGS,
  ONBOARDING_ROUTES.COMPANY_INFO,
  ONBOARDING_ROUTES.TEAM,
  ONBOARDING_ROUTES.SETUP,
];

export const SUPER_ADMIN_ROUTES: string[] = [
  APP_ROUTES.SUPER_ADMIN,
  ...OWNER_ROUTES,
];

export const AGENT_ROUTES: string[] = [
  APP_ROUTES.DASHBOARD,
  APP_ROUTES.CONVERSATIONS,
  APP_ROUTES.CONTACTS,
  APP_ROUTES.KNOWLEDGE_BASE,
  APP_ROUTES.SETTINGS,
  APP_ROUTES.PROFILE_SETTINGS,
];

export const DEFAULT_ROUTE_BY_ROLE: Record<UserRole, string> = {
  SUPER_ADMIN: APP_ROUTES.SUPER_ADMIN,
  OWNER: APP_ROUTES.DASHBOARD,
  AGENT: APP_ROUTES.DASHBOARD,
};

export function getAllowedRoutes(role: UserRole): string[] {
  switch (role) {
    case "SUPER_ADMIN":
      return SUPER_ADMIN_ROUTES;
    case "OWNER":
      return OWNER_ROUTES;
    case "AGENT":
      return AGENT_ROUTES;
    default:
      return [];
  }
}

export function getDefaultRouteByRole(role: UserRole): string {
  return DEFAULT_ROUTE_BY_ROLE[role];
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

export function isAdminRoute(_pathname: string): boolean {
  return _pathname === APP_ROUTES.SUPER_ADMIN || _pathname.startsWith(`${APP_ROUTES.SUPER_ADMIN}/`);
}

export function isOnboardingRoute(pathname: string): boolean {
  return (
    pathname === ONBOARDING_ROUTES.COMPANY_INFO ||
    pathname === ONBOARDING_ROUTES.TEAM ||
    pathname === ONBOARDING_ROUTES.SETUP ||
    pathname.startsWith("/company-info/") ||
    pathname.startsWith("/team/") ||
    pathname.startsWith("/setup/")
  );
}

export function matchesAllowedRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
