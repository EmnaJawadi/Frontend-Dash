import type { UserRole } from "@/src/types/role";
import { APP_ROUTES, getAllowedRoutes, matchesAllowedRoute } from "@/src/lib/routes";

export function canAccessAdmin(_role: UserRole): boolean {
  return _role === "SUPER_ADMIN";
}

export function canAccessDashboard(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "OWNER" || role === "AGENT";
}

export function canManageCompany(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "OWNER";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "OWNER";
}

export function canViewAnalytics(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "OWNER";
}

export function canViewContacts(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "OWNER" || role === "AGENT";
}

export function canViewConversations(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "OWNER" || role === "AGENT";
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  const allowedRoutes = getAllowedRoutes(role);
  return matchesAllowedRoute(pathname, allowedRoutes);
}

export function getNavigationByRole(role: UserRole) {
  if (role === "SUPER_ADMIN") {
    return [
      { label: "Dashboard Admin", href: APP_ROUTES.ADMIN_DASHBOARD },
      { label: "Entreprises", href: APP_ROUTES.ADMIN_COMPANIES },
      { label: "Utilisateurs", href: APP_ROUTES.ADMIN_USERS },
      { label: "Abonnements", href: APP_ROUTES.ADMIN_SUBSCRIPTIONS },
      { label: "Parametres", href: APP_ROUTES.ADMIN_SETTINGS },
    ];
  }

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
