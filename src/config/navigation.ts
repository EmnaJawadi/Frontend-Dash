import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Building2,
  UserRoundPlus,
  Wrench,
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
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
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
    label: "Parametres",
    href: "/settings",
    icon: Settings,
    matchStartsWith: true,
  },
  {
    label: "Informations societe",
    href: "/company-info",
    icon: Building2,
    matchStartsWith: true,
  },
  {
    label: "Equipe",
    href: "/team",
    icon: UserRoundPlus,
    matchStartsWith: true,
  },
  {
    label: "Configuration",
    href: "/setup",
    icon: Wrench,
    matchStartsWith: true,
  },
];

const AGENT_NAVIGATION: NavigationItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
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
    label: "Parametres",
    href: "/settings",
    icon: Settings,
    matchStartsWith: true,
  },
];

export function getNavigationByRole(role: UserRole): NavigationItem[] {
  switch (role) {
    case "OWNER":
      return OWNER_NAVIGATION;
    case "AGENT":
      return AGENT_NAVIGATION;
    default:
      return [];
  }
}
