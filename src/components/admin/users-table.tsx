"use client";

import type { SuperAdminMember } from "@/src/features/super-admin/types/super-admin.types";

type UsersTableProps = {
  members: SuperAdminMember[];
  companyNameById: Record<string, string>;
  onToggleActive?: (member: SuperAdminMember) => void;
};

export default function UsersTable({ members, companyNameById, onToggleActive }: UsersTableProps) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Aucun utilisateur trouve.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Utilisateur</th>
            <th className="px-4 py-3">Entreprise</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => {
            const roleLabel = member.role === "OWNER" ? "Admin entreprise" : "Agent";

            return (
              <tr key={member.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{member.fullName}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {companyNameById[member.companyId] ?? member.companyId}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                    {roleLabel}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      member.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {onToggleActive ? (
                    <button
                      type="button"
                      onClick={() => onToggleActive(member)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      {member.isActive ? "Desactiver" : "Activer"}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
