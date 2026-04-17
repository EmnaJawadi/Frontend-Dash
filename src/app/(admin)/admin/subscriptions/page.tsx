"use client";

import { useState } from "react";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import { useSuperAdminSnapshot } from "@/src/features/super-admin/hooks/use-super-admin-snapshot";

export default function AdminSubscriptionsPage() {
  const { snapshot, setSnapshot, isLoading, error } = useSuperAdminSnapshot();
  const [actionError, setActionError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Entreprise</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Cycle</th>
              <th className="px-4 py-3">Renouvellement</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.companies.map((company) => (
              <tr key={company.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{company.name}</p>
                  <p className="text-xs text-slate-500">{company.ownerEmail}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{company.plan}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                    {company.subscriptionStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{company.billingCycle}</td>
                <td className="px-4 py-3 text-slate-700">{company.nextRenewalDate}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => void toggleSubscription(company.id, company.subscriptionStatus !== "ACTIVE")}
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {company.subscriptionStatus === "ACTIVE" ? "Suspendre" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
