"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  UserCircle2,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { getCurrentUser, logout } from "@/src/lib/auth";

const adminNav = [
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
    label: "Profil",
    href: "/admin/profile",
    icon: UserCircle2,
  },
  {
    label: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
  },
];

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.charAt(0).toUpperCase() ?? "";
  const last = lastName?.charAt(0).toUpperCase() ?? "";
  return `${first}${last}` || "SA";
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Super Admin";

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
            <Shield className="h-5 w-5 text-white" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Platform
            </p>
            <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
          </div>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
            Espace sécurisé
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Gérez les entreprises, utilisateurs, abonnements et paramètres de la plateforme.
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <div className="mb-3 px-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          Navigation
        </div>

        <div className="space-y-1.5">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    active ? "text-slate-950" : "text-slate-400 group-hover:text-white"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-white">
              {getInitials(user?.firstName, user?.lastName)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{fullName}</p>
              <p className="truncate text-xs text-slate-400">
                {user?.email ?? "admin@platform.com"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}