import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";
import RoleGuard from "@/src/components/layout/role-guard";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <div className="flex min-h-screen bg-slate-100">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="flex h-20 items-center justify-between px-6">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Administration plateforme
                </p>
                <h1 className="text-2xl font-semibold text-slate-950">
                  Espace Super Admin
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
                  <Search className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Recherche rapide</span>
                </div>

                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                >
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}