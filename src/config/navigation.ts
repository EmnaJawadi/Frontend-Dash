import type { UserRole } from "@/src/types/role";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Building2,
  CreditCard,
  Shield,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  matchStartsWith?: boolean;
};

export const appNavigation: NavigationItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Conversations",
    href: "/conversations",
    icon: MessageSquare,
    matchStartsWith: true,
  },
  {
    label: "Contacts",
    href: "/contacts",
    icon: Users,
    matchStartsWith: true,
  },
  {
    label: "Base de connaissances",
    href: "/knowledge-base",
    icon: BookOpen,
    matchStartsWith: true,
  },
  {
    label: "Analyses",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
];

export const adminNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Entreprises",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    label: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Abonnements",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Paramètres",
    href: "/admin/settings",
    icon: Shield,
  },
];

export function getNavigationByRole(role: UserRole): NavigationItem[] {
  if (role === "SUPER_ADMIN") {
    return adminNavigation;
  }

  if (role === "OWNER") {
    return appNavigation;
  }

  return appNavigation.filter(
    (item) => item.href !== "/analytics" && item.href !== "/settings"
  );
}