import type { ReactNode } from "react";
import RoleGuard from "@/src/components/layout/role-guard";
import AppSidebar from "@/src/components/layout/app-sidebar";
import MobileBottomNav from "@/src/components/layout/mobile-bottom-nav";
import { Header } from "@/src/components/layout/app-header";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RoleGuard allowedRoles={["OWNER", "AGENT"]}>
      <div className="min-h-screen">
        <Header />

        <div className="flex">
          <AppSidebar />

          <main className="min-w-0 flex-1 px-4 pb-24 pt-5 md:px-6 md:pb-8 md:pt-6">
            <div className="mx-auto w-full max-w-7xl space-y-6 fade-up">{children}</div>
          </main>
        </div>

        <MobileBottomNav />
      </div>
    </RoleGuard>
  );
}
