"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { getCurrentUser } from "@/src/lib/auth";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin/dashboard": {
    title: "Dashboard Admin",
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

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Super Admin";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "SA";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-3 px-4 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Administration plateforme</p>
          <h1 className="truncate text-2xl font-semibold text-slate-900">{view.title}</h1>
          <p className="truncate text-sm text-slate-500">{view.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
            <Search className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-500">Recherche rapide</span>
          </div>

          <ThemeToggle />

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <Link
            href="/admin/settings/profile"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-slate-900">{fullName}</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
