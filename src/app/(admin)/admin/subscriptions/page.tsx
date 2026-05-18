"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import { useSuperAdminSnapshot } from "@/src/features/super-admin/hooks/use-super-admin-snapshot";

export default function AdminSubscriptionsPage() {
  const { snapshot, setSnapshot, isLoading, error } = useSuperAdminSnapshot();
  const [actionError, setActionError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);

  async function toggleSubscription(companyId: string, nextActive: boolean) {
    try {
      setIsUpdating(true);
      setActionError(null);
      const nextSnapshot = await superAdminService.toggleSubscription(companyId, nextActive);
      setSnapshot(nextSnapshot);
    } catch (toggleError) {
      setActionError(
        toggleError instanceof Error ? toggleError.message : "Impossible de mettre a jour l'abonnement.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function deleteSubscription(companyId: string, companyName: string) {
    if (!window.confirm(`Supprimer l'abonnement de ${companyName} ?`)) return;

    try {
      setDeletingCompanyId(companyId);
      setActionError(null);
      const nextSnapshot = await superAdminService.deleteSubscription(companyId);
      setSnapshot(nextSnapshot);
    } catch (deleteError) {
      setActionError(
        deleteError instanceof Error ? deleteError.message : "Impossible de supprimer l'abonnement.",
      );
    } finally {
      setDeletingCompanyId(null);
    }
  }

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Chargement abonnements...</div>;
  }

  if (error || !snapshot) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error ?? "Impossible de charger les abonnements."}</div>;
  }

  return (
    <div className="space-y-4">
      {actionError ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div> : null}
      {isUpdating ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">Mise a jour abonnement...</div> : null}
      {deletingCompanyId ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">Suppression abonnement...</div> : null}

      <div className="app-table-shell">
        <table className="app-table min-w-[860px]">
          <thead>
            <tr>
              <th className="px-4 py-3">Entreprise</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Cycle</th>
              <th className="px-4 py-3">Renouvellement</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.companies.map((company) => (
              <tr key={company.id} className="border-t border-border/70 transition hover:bg-primary/5">
                <td className="px-4 py-3">
                  <p className="font-bold text-foreground">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{company.ownerEmail}</p>
                </td>
                <td className="px-4 py-3 text-foreground">{company.plan}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {company.subscriptionStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground">{company.billingCycle}</td>
                <td className="px-4 py-3 text-foreground">{company.nextRenewalDate}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUpdating || deletingCompanyId !== null}
                      onClick={() => void toggleSubscription(company.id, company.subscriptionStatus !== "ACTIVE")}
                    >
                      {company.subscriptionStatus === "ACTIVE" ? "Suspendre" : "Activer"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isUpdating || deletingCompanyId !== null}
                      onClick={() => void deleteSubscription(company.id, company.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deletingCompanyId === company.id ? "Suppression..." : "Supprimer"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
