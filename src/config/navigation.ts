import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Building2,
  UserRoundPlus,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/src/types/role";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  matchStartsWith?: boolean;
};

const OWNER_NAVIGATION: NavigationItem[] = [
  { label: "Dashboard entreprise", href: "/dashboard", icon: LayoutDashboard },
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
    matchStartsWith: true,
  },
  {
    label: "Parametres entreprise",
    href: "/settings",
    icon: Settings,
    matchStartsWith: true,
  },
  {
    label: "Equipe",
    href: "/team",
    icon: UserRoundPlus,
    matchStartsWith: true,
  },
];

const SUPER_ADMIN_NAVIGATION: NavigationItem[] = [
  {
    label: "Dashboard Admin",
    href: "/admin/dashboard",
    icon: ShieldCheck,
    matchStartsWith: true,
  },
  {
    label: "Entreprises",
    href: "/admin/companies",
    icon: Building2,
    matchStartsWith: true,
  },
  {
    label: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
    matchStartsWith: true,
  },
  {
    label: "Abonnements",
    href: "/admin/subscriptions",
    icon: CreditCard,
    matchStartsWith: true,
  },
  {
    label: "Parametres",
    href: "/admin/settings",
    icon: Settings,
    matchStartsWith: true,
  },
];

const AGENT_NAVIGATION: NavigationItem[] = [
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
    matchStartsWith: true,
  },
];

export function getNavigationByRole(role: UserRole): NavigationItem[] {
  switch (role) {
    case "SUPER_ADMIN":
      return SUPER_ADMIN_NAVIGATION;
    case "OWNER":
      return OWNER_NAVIGATION;
    case "AGENT":
      return AGENT_NAVIGATION;
    default:
      return [];
  }
}
