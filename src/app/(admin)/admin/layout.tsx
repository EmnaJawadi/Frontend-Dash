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
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen">
          <AdminSidebar />

          <div className="min-w-0 flex-1">
            <AdminHeader />

            <main className="px-4 pb-8 pt-4 md:px-7 lg:px-9">
              <div className="mx-auto w-full max-w-[94rem]">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
