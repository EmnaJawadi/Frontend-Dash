"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
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
    const baseHref = href.split("#")[0];

    if (matchStartsWith) {
      return pathname.startsWith(baseHref);
    }
    return pathname === baseHref;
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  if (!mounted) {
    return (
      <aside className="hidden h-screen w-[304px] p-3 md:flex">
        <div className="text-sm text-muted-foreground">Chargement...</div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 p-3 transition-all duration-300 md:flex",
        collapsed ? "w-[104px]" : "w-[316px]",
      )}
    >
      <div className="flex h-full flex-col rounded-[1.65rem] border border-border/80 bg-card/80 px-4 py-5 shadow-[0_22px_60px_rgba(30,64,175,0.10)] backdrop-blur-2xl">
        <div className="mb-6 flex items-center justify-between gap-2 fade-up">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-white shadow-sm">
              <Image src="/logopfe.png" alt="Centre Support" width={34} height={34} className="h-9 w-9 object-contain" priority />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold tracking-tight text-foreground">Centre Support</p>
                <p className="text-sm text-muted-foreground">WhatsApp Entreprise</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-background/70 text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
            aria-label={collapsed ? "Developper la barre laterale" : "Reduire la barre laterale"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="mb-6 rounded-3xl border border-border/80 bg-background/60 p-4 shadow-sm fade-up-delay-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-gradient-to-br from-white to-muted text-sm font-bold text-foreground shadow-sm">
                {avatarLetter}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Compte</p>
                <p className="truncate text-base font-bold text-foreground">{userRoleLabel || "Utilisateur"}</p>
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
                  "group relative flex items-center gap-3 rounded-2xl px-3.5 py-3.5 text-sm font-semibold transition-all",
                  active
                    ? "bg-primary/10 text-primary shadow-[0_10px_22px_rgba(37,99,235,0.08)] ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  collapsed && "justify-center px-2",
                )}
              >
                {active && !collapsed ? (
                  <>
                    <span className="absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                    <span className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
                  </>
                ) : null}

                <Icon className={cn("h-5 w-5 shrink-0", !active && "transition-transform group-hover:scale-105")} />
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
                "group relative flex items-center gap-3 rounded-2xl px-3.5 py-3.5 text-sm font-semibold transition-all",
                pathname.startsWith("/settings/profile")
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              {pathname.startsWith("/settings/profile") && !collapsed ? (
                <span className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
              ) : null}
              <UserCog className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">Mon profil</span>}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 dark:hover:bg-red-500/10",
                collapsed && "justify-center px-2",
              )}
            >
              <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:scale-105" />
              {!collapsed && <span className="truncate">Deconnexion</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
