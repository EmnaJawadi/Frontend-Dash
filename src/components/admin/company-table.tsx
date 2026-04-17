"use client";

import Link from "next/link";
import type { SuperAdminCompany } from "@/src/features/super-admin/types/super-admin.types";

type CompanyTableProps = {
  companies: SuperAdminCompany[];
};

function statusBadge(status: string) {
  if (status === "ACTIVE") return "bg-emerald-100 text-emerald-700";
  if (status === "SUSPENDED") return "bg-amber-100 text-amber-700";
  if (status === "EXPIRED") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
}

export default function CompanyTable({ companies }: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Aucune entreprise trouvee.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Entreprise</th>
            <th className="px-4 py-3">Admin principal</th>
            <th className="px-4 py-3">Plan</th>
            <th className="px-4 py-3">Abonnement</th>
            <th className="px-4 py-3">Equipe</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-t border-slate-100">
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-900">{company.name}</p>
                <p className="text-xs text-slate-500">{company.industry}</p>
              </td>

              <td className="px-4 py-3">
                <p className="text-slate-900">{company.ownerName}</p>
                <p className="text-xs text-slate-500">{company.ownerEmail}</p>
              </td>

              <td className="px-4 py-3 text-slate-700">{company.plan}</td>

              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(company.subscriptionStatus)}`}>
                  {company.subscriptionStatus}
                </span>
              </td>

              <td className="px-4 py-3 text-slate-700">
                {company.adminCount} admins / {company.agentCount} agents
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/companies/${company.id}`}
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Ouvrir
                  </Link>
                  <Link
                    href={`/admin/users?companyId=${company.id}&role=OWNER`}
                    className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-cyan-700 transition hover:bg-cyan-100"
                  >
                    Voir admins
                  </Link>
                  <Link
                    href={`/admin/users?companyId=${company.id}&role=AGENT`}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Voir agents
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
