"use client";

import CompanyTable from "@/src/components/admin/company-table";
import { useSuperAdminSnapshot } from "@/src/features/super-admin/hooks/use-super-admin-snapshot";

export default function AdminCompaniesPage() {
  const { snapshot, isLoading, error } = useSuperAdminSnapshot();

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Chargement des entreprises...</div>;
  }

  if (error || !snapshot) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error ?? "Impossible de charger les entreprises."}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Super Admin: acces direct a toutes les entreprises avec raccourcis vers leurs admins et agents.
      </div>
      <CompanyTable companies={snapshot.companies} />
    </div>
  );
}
