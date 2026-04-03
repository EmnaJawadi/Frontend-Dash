import type { UserRole } from "@/src/types/role";
import {
  APP_ROUTES,
  ADMIN_ROUTES,
  getAllowedRoutes,
  matchesAllowedRoute,
} from "@/src/lib/routes";

export function canAccessAdmin(role: UserRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canAccessDashboard(role: UserRole): boolean {
  return role === "OWNER" || role === "AGENT";
}

export function canManageCompany(role: UserRole): boolean {
  return role === "OWNER" || role === "SUPER_ADMIN";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "OWNER" || role === "SUPER_ADMIN";
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
  if (role === "SUPER_ADMIN") {
    return [
      { label: "Dashboard", href: ADMIN_ROUTES.DASHBOARD },
      { label: "Entreprises", href: ADMIN_ROUTES.COMPANIES },
      { label: "Utilisateurs", href: ADMIN_ROUTES.USERS },
      { label: "Abonnements", href: ADMIN_ROUTES.SUBSCRIPTIONS },
      { label: "Paramètres", href: ADMIN_ROUTES.SETTINGS },
    ];
  }

  if (role === "OWNER") {
    return [
      { label: "Tableau de bord", href: APP_ROUTES.DASHBOARD },
      { label: "Conversations", href: APP_ROUTES.CONVERSATIONS },
      { label: "Contacts", href: APP_ROUTES.CONTACTS },
      { label: "Base de connaissances", href: APP_ROUTES.KNOWLEDGE_BASE },
      { label: "Analyses", href: APP_ROUTES.ANALYTICS },
      { label: "Paramètres", href: APP_ROUTES.SETTINGS },
    ];
  }

  return [
    { label: "Tableau de bord", href: APP_ROUTES.DASHBOARD },
    { label: "Conversations", href: APP_ROUTES.CONVERSATIONS },
    { label: "Contacts", href: APP_ROUTES.CONTACTS },
    { label: "Base de connaissances", href: APP_ROUTES.KNOWLEDGE_BASE },
  ];
}