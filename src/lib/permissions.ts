import type { UserRole } from "@/src/types/role";
import { APP_ROUTES, getAllowedRoutes, matchesAllowedRoute } from "@/src/lib/routes";

export function canAccessAdmin(_role: UserRole): boolean {
  return false;
}

export function canAccessDashboard(role: UserRole): boolean {
  return role === "OWNER" || role === "AGENT";
}

export function canManageCompany(role: UserRole): boolean {
  return role === "OWNER";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "OWNER";
}

export function canViewAnalytics(role: UserRole): boolean {
  return role === "OWNER";
}

export function canViewContacts(role: UserRole): boolean {
  return role === "OWNER" || role === "AGENT";
}

export function canViewConversations(role: UserRole): boolean {
  return role === "OWNER" || role === "AGENT";
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  const allowedRoutes = getAllowedRoutes(role);
  return matchesAllowedRoute(pathname, allowedRoutes);
}

export function getNavigationByRole(role: UserRole) {
  if (role === "OWNER") {
    return [
      { label: "Tableau de bord", href: APP_ROUTES.DASHBOARD },
      { label: "Conversations", href: APP_ROUTES.CONVERSATIONS },
      { label: "Contacts", href: APP_ROUTES.CONTACTS },
      { label: "Base de connaissances", href: APP_ROUTES.KNOWLEDGE_BASE },
      { label: "Analyses", href: APP_ROUTES.ANALYTICS },
      { label: "Parametres", href: APP_ROUTES.SETTINGS },
    ];
  }

  return [
    { label: "Tableau de bord", href: APP_ROUTES.DASHBOARD },
    { label: "Conversations", href: APP_ROUTES.CONVERSATIONS },
    { label: "Contacts", href: APP_ROUTES.CONTACTS },
    { label: "Base de connaissances", href: APP_ROUTES.KNOWLEDGE_BASE },
  ];
}
