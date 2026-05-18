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
        <div className="flex min-h-screen">
          <AppSidebar />

          <div className="min-w-0 flex-1">
            <Header />

            <main className="px-4 pb-24 pt-4 md:px-7 md:pb-8 lg:px-9">
              <div className="mx-auto w-full max-w-[94rem] space-y-6 fade-up">{children}</div>
            </main>
          </div>
        </div>

        <MobileBottomNav />
      </div>
    </RoleGuard>
  );
}
