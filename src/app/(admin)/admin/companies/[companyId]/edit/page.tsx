"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import { useSuperAdminSnapshot } from "@/src/features/super-admin/hooks/use-super-admin-snapshot";
import type {
  BillingCycle,
  CompanyLifecycleStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  UpsertCompanyPayload,
} from "@/src/features/super-admin/types/super-admin.types";

const PLAN_OPTIONS: SubscriptionPlan[] = ["BASIC", "STANDARD", "PREMIUM", "ENTERPRISE"];
const STATUS_OPTIONS: SubscriptionStatus[] = ["ACTIVE", "SUSPENDED", "EXPIRED", "CANCELED"];
const CYCLE_OPTIONS: BillingCycle[] = ["MONTHLY", "YEARLY"];
const LIFECYCLE_OPTIONS: CompanyLifecycleStatus[] = ["ACTIVE", "INACTIVE"];

export default function AdminCompanyEditPage() {
  const params = useParams<{ companyId: string }>();
  const router = useRouter();
  const companyId = params.companyId;
  const { snapshot, isLoading, error } = useSuperAdminSnapshot();

  const [form, setForm] = useState<UpsertCompanyPayload | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!snapshot) return;
    const company = snapshot.companies.find((item) => item.id === companyId);
    if (!company) return;

    setForm({
      name: company.name,
      industry: company.industry,
      ownerName: company.ownerName,
      ownerEmail: company.ownerEmail,
      adminCount: company.adminCount,
      agentCount: company.agentCount,
      lifecycleStatus: company.lifecycleStatus,
      plan: company.plan,
      subscriptionDurationMonths: company.subscriptionDurationMonths,
      subscriptionStatus: company.subscriptionStatus,
      billingCycle: company.billingCycle,
      nextRenewalDate: company.nextRenewalDate,
    });
  }, [companyId, snapshot]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      await superAdminService.updateCompany(companyId, form);
      router.push(`/admin/companies/${companyId}`);
      router.refresh();
    } catch (submitError) {
      setSaveError(
        submitError instanceof Error ? submitError.message : "Erreur lors de la mise a jour.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Chargement formulaire...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  }

  if (!form) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Entreprise introuvable.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-slate-900">Modifier entreprise</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Nom entreprise</span>
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.name} onChange={(event) => setForm((prev) => prev ? { ...prev, name: event.target.value } : prev)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Secteur</span>
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.industry} onChange={(event) => setForm((prev) => prev ? { ...prev, industry: event.target.value } : prev)} />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Admin principal</span>
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.ownerName} onChange={(event) => setForm((prev) => prev ? { ...prev, ownerName: event.target.value } : prev)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Email admin</span>
          <input type="email" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.ownerEmail} onChange={(event) => setForm((prev) => prev ? { ...prev, ownerEmail: event.target.value } : prev)} />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Admins</span>
          <input type="number" min={1} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.adminCount} onChange={(event) => setForm((prev) => prev ? { ...prev, adminCount: Number(event.target.value) || 1 } : prev)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Agents</span>
          <input type="number" min={0} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.agentCount} onChange={(event) => setForm((prev) => prev ? { ...prev, agentCount: Number(event.target.value) || 0 } : prev)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Duree (mois)</span>
          <input type="number" min={1} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.subscriptionDurationMonths} onChange={(event) => setForm((prev) => prev ? { ...prev, subscriptionDurationMonths: Number(event.target.value) || 1 } : prev)} />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Plan</span>
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.plan} onChange={(event) => setForm((prev) => prev ? { ...prev, plan: event.target.value as SubscriptionPlan } : prev)}>
            {PLAN_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Abonnement</span>
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.subscriptionStatus} onChange={(event) => setForm((prev) => prev ? { ...prev, subscriptionStatus: event.target.value as SubscriptionStatus } : prev)}>
            {STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Cycle</span>
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.billingCycle} onChange={(event) => setForm((prev) => prev ? { ...prev, billingCycle: event.target.value as BillingCycle } : prev)}>
            {CYCLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Etat entreprise</span>
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.lifecycleStatus} onChange={(event) => setForm((prev) => prev ? { ...prev, lifecycleStatus: event.target.value as CompanyLifecycleStatus } : prev)}>
            {LIFECYCLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-600">Date renouvellement</span>
          <input type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.nextRenewalDate} onChange={(event) => setForm((prev) => prev ? { ...prev, nextRenewalDate: event.target.value } : prev)} />
        </label>
      </div>

      {saveError ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</div> : null}

      <div className="flex gap-2">
        <button type="submit" disabled={isSaving} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70">
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button type="button" onClick={() => router.push(`/admin/companies/${companyId}`)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Annuler
        </button>
      </div>
    </form>
  );
}
