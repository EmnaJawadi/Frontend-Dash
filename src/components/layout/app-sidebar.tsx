"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutGrid,
  UserCog,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getCurrentUser, getUserRole, logout } from "@/src/lib/auth";
import { getNavigationByRole } from "@/src/config/navigation";
import { ROLE_LABELS, type UserRole } from "@/src/types/role";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userRoleLabel, setUserRoleLabel] = useState("");
  const [avatarLetter, setAvatarLetter] = useState("U");

  useEffect(() => {
    setMounted(true);

    const currentRole = getUserRole();
    const currentUser = getCurrentUser();

    setRole(currentRole);

    if (currentUser) {
      setUserRoleLabel(ROLE_LABELS[currentUser.role]);
      setAvatarLetter(
        currentUser.firstName?.charAt(0)?.toUpperCase() ||
          currentUser.lastName?.charAt(0)?.toUpperCase() ||
          "U",
      );
    }
  }, []);

  const items = useMemo(() => {
    if (!role) return [];
    return getNavigationByRole(role);
  }, [role]);

  const isActive = (href: string, matchStartsWith?: boolean) => {
    if (matchStartsWith) {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
    router.refresh();
  };

  if (!mounted) {
    return (
      <aside className="hidden h-[calc(100vh-4.5rem)] w-[280px] border-r border-border bg-background/85 px-4 py-4 md:flex">
        <div className="text-sm text-muted-foreground">Chargement...</div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-[4.5rem] hidden h-[calc(100vh-4.5rem)] flex-col border-r border-border/60 bg-background/70 px-3 py-4 backdrop-blur-xl transition-all duration-300 md:flex",
        collapsed ? "w-[92px]" : "w-[282px]",
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-2 fade-up">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
            <LayoutGrid className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">Centre Support</p>
              <p className="text-xs text-muted-foreground">WhatsApp Entreprise</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label={collapsed ? "Developper la barre laterale" : "Reduire la barre laterale"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mb-5 rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card to-muted/50 p-4 shadow-sm fade-up-delay-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
              {avatarLetter}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Compte</p>
              <p className="truncate text-sm font-semibold text-foreground">{userRoleLabel || "Utilisateur"}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-2 overflow-y-auto pr-1 fade-up-delay-2">
        {items.map((item) => {
          const active = isActive(item.href, item.matchStartsWith);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              {active && !collapsed ? (
                <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              ) : null}

              <Icon className={cn("h-4 w-4 shrink-0", !active && "transition-transform group-hover:scale-105")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-border/70 pt-4">
        <div className="space-y-2">
          <Link
            href="/settings/profile"
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
              pathname.startsWith("/settings/profile")
                ? "bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            <UserCog className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">Mon profil</span>}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:hover:bg-red-500/10",
              collapsed && "justify-center px-2",
            )}
          >
            <LogOut className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />
            {!collapsed && <span className="truncate">Deconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
