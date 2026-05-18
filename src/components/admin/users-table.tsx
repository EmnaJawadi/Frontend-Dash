"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/src/components/shared/status-badge";
import type { SuperAdminMember } from "@/src/features/super-admin/types/super-admin.types";

type UsersTableProps = {
  members: SuperAdminMember[];
  companyNameById: Record<string, string>;
  onToggleActive?: (member: SuperAdminMember) => void;
};

export default function UsersTable({ members, companyNameById, onToggleActive }: UsersTableProps) {
  if (members.length === 0) {
    return (
      <div className="section-card p-6 text-sm text-muted-foreground">
        Aucun utilisateur trouve.
      </div>
    );
  }

  return (
    <div className="app-table-shell">
      <table className="app-table min-w-[900px]">
        <thead>
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
              <tr key={member.id} className="border-t border-border/70 transition hover:bg-primary/5">
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{member.fullName}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </td>

                <td className="px-4 py-3 text-foreground">
                  {companyNameById[member.companyId] ?? member.companyId}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge variant="info">{roleLabel}</StatusBadge>
                </td>

                <td className="px-4 py-3">
                  <StatusBadge variant={member.isActive ? "success" : "danger"}>
                    {member.isActive ? "Actif" : "Inactif"}
                  </StatusBadge>
                </td>

                <td className="px-4 py-3">
                  {onToggleActive ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleActive(member)}
                    >
                      {member.isActive ? "Desactiver" : "Activer"}
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
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
