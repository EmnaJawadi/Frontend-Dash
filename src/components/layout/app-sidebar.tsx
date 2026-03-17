// src/components/layout/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  matchStartsWith?: boolean;
};

const navItems: NavItem[] = [
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
  },
  {
    label: "Base de connaissances",
    href: "/knowledge-base",
    icon: BookOpen,
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

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const items = useMemo(() => navItems, []);

  const isActive = (item: NavItem) => {
    if (item.matchStartsWith) {
      return pathname.startsWith(item.href);
    }
    return pathname === item.href;
  };

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r bg-background transition-all duration-200 md:flex md:flex-col",
        collapsed ? "w-[84px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary font-bold text-primary-foreground">
            WA
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Support OS</p>
              <p className="truncate text-xs text-muted-foreground">
                Tableau de bord WhatsApp
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-muted"
          aria-label={collapsed ? "Développer la barre latérale" : "Réduire la barre latérale"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <div
          className={cn(
            "rounded-2xl bg-muted p-3",
            collapsed && "flex items-center justify-center p-2"
          )}
        >
          {!collapsed ? (
            <>
              <p className="text-sm font-semibold">Espace agent</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Gérez les conversations, les prises en charge et l’activité du bot.
              </p>
            </>
          ) : (
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
    </aside>
  );
}