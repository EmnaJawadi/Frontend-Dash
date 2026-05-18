"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ClipboardList,
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
  {
    label: "Demandes inscription",
    href: "/admin/registration-requests",
    icon: ClipboardList,
  },
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
  const email = user?.email ?? "admin@centre-support.local";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "SA";

  function handleLogout() {
    logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="hidden h-screen w-[320px] shrink-0 p-3 text-card-foreground lg:flex">
      <div className="flex h-full w-full flex-col rounded-[1.65rem] border border-border/80 bg-card/80 px-4 py-5 shadow-[0_22px_60px_rgba(30,64,175,0.10)] backdrop-blur-2xl">
      <div className="pb-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-2xl border border-primary/15 bg-white p-3 shadow-sm">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Plateforme</p>
            <p className="text-2xl font-extrabold tracking-tight">Admin Panel</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-background/60 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Espace securise</p>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Gerez les entreprises, utilisateurs, abonnements et parametres globaux.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Navigation</p>
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl px-3.5 py-3.5 text-sm font-semibold transition-all",
                active
                  ? "bg-primary/10 text-primary shadow-[0_10px_22px_rgba(37,99,235,0.08)] ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              {active ? (
                <>
                  <span className="absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  <span className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
                </>
              ) : null}
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border/70 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background/60 px-3 py-3 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50/70 px-3 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </button>
      </div>
      </div>
    </aside>
  );
}
