"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  UserCircle2,
  Users,
} from "lucide-react";
import { getCurrentUser, logout } from "@/src/lib/auth";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Entreprises", href: "/admin/companies", icon: Building2 },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
  { label: "Abonnements", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Parametres Plateforme", href: "/admin/settings", icon: Settings },
  { label: "Mon profil", href: "/admin/settings/profile", icon: UserCircle2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Super Admin";
  const email = user?.email ?? "admin@platform.local";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "SA";

  function handleLogout() {
    logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-[300px] shrink-0 border-r border-slate-800 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
      <div className="border-b border-slate-800 px-5 py-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-slate-900 p-2 ring-1 ring-slate-700">
            <Shield className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Platform</p>
            <p className="text-lg font-semibold">Admin Panel</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-xs uppercase tracking-widest text-cyan-300">Espace securise</p>
          <p className="mt-1 text-sm text-slate-300">
            Gerez les entreprises, utilisateurs, abonnements et parametres globaux.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        <p className="mb-2 px-2 text-xs uppercase tracking-[0.18em] text-slate-500">Navigation</p>
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/30"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-100">{fullName}</p>
            <p className="truncate text-xs text-slate-400">{email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </button>
      </div>
    </aside>
  );
}
