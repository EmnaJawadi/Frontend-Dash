"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavigation } from "@/src/config/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const items = useMemo(() => adminNavigation, []);

  const isActive = (href: string, matchStartsWith?: boolean) => {
    if (matchStartsWith) {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-border bg-background transition-all duration-200 md:flex md:flex-col",
        collapsed ? "w-[84px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary font-bold text-primary-foreground">
            AD
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                Admin Platform
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Maintenance de l’application
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label={
            collapsed
              ? "Développer la barre latérale"
              : "Réduire la barre latérale"
          }
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
          const active = isActive(item.href, item.matchStartsWith);
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

      <div className="border-t border-border p-3">
        <div
          className={cn(
            "rounded-2xl border border-border bg-card p-3 text-card-foreground",
            collapsed && "flex items-center justify-center p-2"
          )}
        >
          {!collapsed ? (
            <>
              <p className="text-sm font-semibold text-foreground">
                Espace administrateur
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Surveillez les entreprises, utilisateurs et abonnements.
              </p>
            </>
          ) : (
            <Shield className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
    </aside>
  );
}