"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import UsersTable from "@/src/components/admin/users-table";
import { useSuperAdminSnapshot } from "@/src/features/super-admin/hooks/use-super-admin-snapshot";

export default function AdminCompanyDetailsPage() {
  const params = useParams<{ companyId: string }>();
  const companyId = params.companyId;
  const { snapshot, isLoading, error } = useSuperAdminSnapshot();

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Chargement entreprise...</div>;
  }

  if (error || !snapshot) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error ?? "Impossible de charger l'entreprise."}</div>;
  }

  const company = snapshot.companies.find((item) => item.id === companyId);
  if (!company) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Entreprise introuvable.</div>;
  }

  const members = snapshot.members.filter((member) => member.companyId === companyId);
  const admins = members.filter((member) => member.role === "OWNER");
  const agents = members.filter((member) => member.role === "AGENT");

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{company.name}</h2>
            <p className="text-sm text-slate-500">{company.industry}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`/admin/companies/${company.id}/edit`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Modifier entreprise
            </Link>
            <Link href={`/admin/users?companyId=${company.id}&role=OWNER`} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-100">
              Ouvrir admins
            </Link>
            <Link href={`/admin/users?companyId=${company.id}&role=AGENT`} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
              Ouvrir agents
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Plan</p>
            <p className="text-lg font-semibold text-slate-900">{company.plan}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Abonnement</p>
            <p className="text-lg font-semibold text-slate-900">{company.subscriptionStatus}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Admins entreprise</p>
            <p className="text-lg font-semibold text-slate-900">{admins.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Agents</p>
            <p className="text-lg font-semibold text-slate-900">{agents.length}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Admins et agents de l'entreprise</h3>
        <UsersTable
          members={members}
          companyNameById={{ [companyId]: company.name }}
        />
      </section>
    </div>
  );
}
