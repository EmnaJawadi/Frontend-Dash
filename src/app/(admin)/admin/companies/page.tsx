"use client";

import { useState } from "react";
import CompanyTable from "@/src/components/admin/company-table";
import { useSuperAdminSnapshot } from "@/src/features/super-admin/hooks/use-super-admin-snapshot";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import type { SuperAdminCompany } from "@/src/features/super-admin/types/super-admin.types";

export default function AdminCompaniesPage() {
  const { snapshot, setSnapshot, isLoading, error } = useSuperAdminSnapshot();
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  async function handleDeleteCompany(company: SuperAdminCompany) {
    const confirmed = window.confirm(
      `Supprimer l'entreprise "${company.name}" ? Cette action est definitive.`,
    );

    if (!confirmed) return;

    try {
      setDeletingCompanyId(company.id);
      setActionError(null);
      setActionFeedback(null);
      const nextSnapshot = await superAdminService.deleteCompany(company.id);
      setSnapshot(nextSnapshot);
      setActionFeedback("Entreprise supprimee.");
    } catch (deleteError) {
      setActionError(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer cette entreprise.",
      );
    } finally {
      setDeletingCompanyId(null);
    }
  }

  if (isLoading) {
    return <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Chargement des entreprises...</div>;
  }

  if (error || !snapshot) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error ?? "Impossible de charger les entreprises."}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm font-medium text-foreground">
        Super Admin: acces direct a toutes les entreprises avec raccourcis vers leurs admins et agents.
      </div>
      {actionFeedback ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {actionFeedback}
        </div>
      ) : null}
      {actionError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}
      <CompanyTable
        companies={snapshot.companies}
        deletingCompanyId={deletingCompanyId}
        onDeleteCompany={(company) => void handleDeleteCompany(company)}
      />
    </div>
  );
}
