"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, CreditCard, ShieldCheck, Users } from "lucide-react";
import { useSuperAdminSnapshot } from "@/src/features/super-admin/hooks/use-super-admin-snapshot";

function card(title: string, value: number, helper: string, icon: ReactNode) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{title}</p>
        <div className="text-slate-500">{icon}</div>
      </div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { snapshot, isLoading, error } = useSuperAdminSnapshot();

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Chargement dashboard admin...</div>;
  }

  if (error || !snapshot) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error ?? "Impossible de charger le dashboard admin."}</div>;
  }

  const companies = snapshot.companies;
  const members = snapshot.members;
  const activeCompanies = companies.filter((company) => company.lifecycleStatus === "ACTIVE").length;
  const activeSubscriptions = companies.filter((company) => company.subscriptionStatus === "ACTIVE").length;
  const companyAdmins = members.filter((member) => member.role === "OWNER").length;
  const companyAgents = members.filter((member) => member.role === "AGENT").length;
  const inactiveMembers = members.filter((member) => !member.isActive).length;
  const avgHealth =
    companies.length > 0
      ? Math.round(companies.reduce((sum, company) => sum + company.botHealthScore, 0) / companies.length)
      : 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {card("Entreprises actives", activeCompanies, "Entreprises utilisant actuellement la plateforme.", <Building2 className="h-5 w-5" />)}
        {card("Utilisateurs", members.length, "Admins entreprise + agents actifs/inactifs.", <Users className="h-5 w-5" />)}
        {card("Abonnements actifs", activeSubscriptions, "Plans en cours de validite.", <CreditCard className="h-5 w-5" />)}
        {card("Incidents ouverts", inactiveMembers, "Comptes desactives a verifier.", <ShieldCheck className="h-5 w-5" />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Acces direct admins entreprise et agents</h2>
          <p className="mt-1 text-sm text-slate-500">
            Ouvre directement les comptes admin/agent de chaque entreprise.
          </p>

          <div className="mt-4 space-y-3">
            {companies.slice(0, 6).map((company) => (
              <div key={company.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="font-medium text-slate-900">{company.name}</p>
                  <p className="text-xs text-slate-500">
                    {company.adminCount} admins / {company.agentCount} agents
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/users?companyId=${company.id}&role=OWNER`}
                    className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-cyan-700 transition hover:bg-cyan-100"
                  >
                    Admins
                  </Link>
                  <Link
                    href={`/admin/users?companyId=${company.id}&role=AGENT`}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Agents
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Statistiques et analyses globales</h2>
          <p className="mt-1 text-sm text-slate-500">
            Vision transversale de la plateforme Super Admin.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-600">Sante moyenne plateforme</span>
                <span className="font-medium text-slate-900">{avgHealth}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, avgHealth)}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Admins entreprise</p>
                <p className="text-2xl font-semibold text-slate-900">{companyAdmins}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Agents</p>
                <p className="text-2xl font-semibold text-slate-900">{companyAgents}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <p className="mb-2 text-sm font-medium text-slate-800">Actions rapides</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/admin/companies" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  Voir entreprises
                </Link>
                <Link href="/admin/users" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  Voir utilisateurs
                </Link>
                <Link href="/admin/registration-requests" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  Voir demandes inscription
                </Link>
                <Link href="/admin/subscriptions" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  Voir abonnements
                </Link>
                <Link href="/admin/settings" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  Parametres admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
