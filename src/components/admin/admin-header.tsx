"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, ChevronDown, RefreshCw, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import type { SuperAdminNotificationItem } from "@/src/features/super-admin/types/super-admin.types";
import { getCurrentUser } from "@/src/lib/auth";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin/dashboard": {
    title: "Tableau de bord",
    subtitle: "Supervision globale de la plateforme",
  },
  "/admin/companies": {
    title: "Entreprises",
    subtitle: "Gestion globale des entreprises clientes",
  },
  "/admin/users": {
    title: "Utilisateurs",
    subtitle: "Acces direct aux admins entreprise et agents",
  },
  "/admin/registration-requests": {
    title: "Demandes d'inscription",
    subtitle: "Validation ou refus des inscriptions entreprises",
  },
  "/admin/subscriptions": {
    title: "Abonnements",
    subtitle: "Suivi des plans, statuts et renouvellements",
  },
  "/admin/settings": {
    title: "Parametres Plateforme",
    subtitle: "Maintenance, supervision et configuration globale",
  },
  "/admin/settings/profile": {
    title: "Mon profil",
    subtitle: "Informations personnelles et securite du compte",
  },
};

function resolveTitle(pathname: string) {
  if (pathname.startsWith("/admin/companies/")) {
    return {
      title: "Detail Entreprise",
      subtitle: "Vue detaillee avec acces admins et agents",
    };
  }

  if (pathname.startsWith("/admin/settings/profile")) {
    return TITLES["/admin/settings/profile"];
  }

  return TITLES[pathname] ?? TITLES["/admin/dashboard"];
}

export default function AdminHeader() {
  const pathname = usePathname();
  const user = getCurrentUser();
  const view = resolveTitle(pathname);
  const [notifications, setNotifications] = useState<SuperAdminNotificationItem[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRefreshingNotifications, setIsRefreshingNotifications] = useState(false);
  const [isMarkingNotificationsRead, setIsMarkingNotificationsRead] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Super Admin";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "SA";
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const loadNotifications = useCallback(async (forceRefresh = false) => {
    setIsRefreshingNotifications(true);
    try {
      const nextNotifications =
        await superAdminService.getCompanyRegistrationNotifications(
          20,
          forceRefresh ? Date.now() : undefined,
        );
      setNotifications(nextNotifications);
    } catch {
      setNotifications([]);
    } finally {
      setIsRefreshingNotifications(false);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    setIsMarkingNotificationsRead(true);

    try {
      await superAdminService.markAllCompanyRegistrationNotificationsAsRead();
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
      await loadNotifications(true);
    } finally {
      setIsMarkingNotificationsRead(false);
    }
  }, [loadNotifications]);

  useEffect(() => {
    void loadNotifications();
    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [loadNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-transparent px-4 pt-5 backdrop-blur-xl md:px-7 lg:px-9">
      <div className="flex min-h-[6.1rem] items-start justify-between gap-4">
        <div className="min-w-0 pt-1">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Administration plateforme</p>
          <h1 className="mt-1 flex items-center gap-2 truncate text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            <span className="truncate">{view.title}</span>
          </h1>
          <p className="truncate text-base text-muted-foreground">{view.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
          <div className="app-control hidden min-w-[22rem] items-center gap-3 px-3.5 lg:flex">
            <Search className="h-5 w-5 text-foreground" />
            <span className="text-sm text-muted-foreground">Rechercher rapide</span>
            <span className="ml-auto rounded-lg border border-border/70 bg-background/80 px-2 py-1 text-xs font-semibold text-muted-foreground">
              ⌘K
            </span>
          </div>

          <ThemeToggle />

          <div
            ref={notificationsRef}
            className="relative"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen((current) => !current);
                void loadNotifications();
              }}
              className="app-control relative inline-flex w-10 items-center justify-center text-foreground transition hover:bg-accent"
              aria-label="Notifications inscriptions"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {isNotificationsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-background p-2 shadow-xl">
                <div className="mb-1 flex flex-col gap-2 px-2 py-1">
                  <p className="text-sm font-semibold text-foreground">Inscriptions entreprises</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void markAllNotificationsAsRead();
                      }}
                      disabled={unreadCount === 0 || isMarkingNotificationsRead}
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      {isMarkingNotificationsRead ? "Marquage..." : "Tout marquer comme lu"}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void loadNotifications(true);
                      }}
                      disabled={isRefreshingNotifications}
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 ${
                          isRefreshingNotifications ? "animate-spin" : ""
                        }`}
                      />
                      {isRefreshingNotifications ? "Actualisation..." : "Actualiser"}
                    </button>
                  </div>
                </div>
                {notifications.length === 0 ? (
                  <p className="px-2 py-4 text-sm text-muted-foreground">
                    Aucune notification.
                  </p>
                ) : (
                  <div className="max-h-80 space-y-1 overflow-y-auto">
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        href="/admin/registration-requests"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="block rounded-xl px-3 py-2 transition hover:bg-muted"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="min-w-0 break-words text-sm font-medium text-foreground">{notification.title}</p>
                          {!notification.isRead ? (
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 break-words text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <Link
            href="/admin/settings/profile"
            className="app-control flex items-center gap-2 px-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-bold text-foreground">{fullName}</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
          </Link>
        </div>
      </div>
    </header>
  );
}
