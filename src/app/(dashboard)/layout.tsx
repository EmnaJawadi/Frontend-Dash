import type { ReactNode } from "react";
import RoleGuard from "@/src/components/layout/role-guard";
import AppSidebar from "@/src/components/layout/app-sidebar";
import { Header } from "@/src/components/layout/app-header";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RoleGuard allowedRoles={["OWNER", "AGENT"]}>
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="flex">
          <AppSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}