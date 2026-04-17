import type { ReactNode } from "react";
import RoleGuard from "@/src/components/layout/role-guard";
import AdminSidebar from "@/src/components/admin/admin-sidebar";
import AdminHeader from "@/src/components/admin/admin-header";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen">
          <AdminSidebar />

          <div className="min-w-0 flex-1">
            <AdminHeader />

            <main className="px-4 py-5 md:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
