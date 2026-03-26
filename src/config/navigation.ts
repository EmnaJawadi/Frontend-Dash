import type { ComponentType } from "react";
import {
  BarChart3,
  BookOpen,
  Contact2,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  description?: string;
};

export const navigationItems: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vue globale des performances et indicateurs",
  },
  {
    title: "Conversations",
    href: "/conversations",
    icon: MessageSquare,
    description: "Gestion des conversations WhatsApp",
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Contact2,
    description: "Liste et suivi des contacts clients",
  },
  {
    title: "Base de connaissances",
    href: "/knowledge-base",
    icon: BookOpen,
    description: "Articles et réponses du bot",
  },
  {
    title: "Analyses",
    href: "/analytics",
    icon: BarChart3,
    description: "Rapports et statistiques détaillés",
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
    description: "Configuration de la plateforme",
  },
];