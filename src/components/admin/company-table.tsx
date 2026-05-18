"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/src/components/shared/status-badge";
import type { SuperAdminCompany } from "@/src/features/super-admin/types/super-admin.types";

type CompanyTableProps = {
  companies: SuperAdminCompany[];
  deletingCompanyId?: string | null;
  onDeleteCompany?: (company: SuperAdminCompany) => void;
};

function statusVariant(status: string): "success" | "warning" | "danger" | "neutral" {
  if (status === "ACTIVE") return "success";
  if (status === "SUSPENDED") return "warning";
  if (status === "EXPIRED" || status === "CANCELED") return "danger";
  return "neutral";
}

export default function CompanyTable({
  companies,
  deletingCompanyId = null,
  onDeleteCompany,
}: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <div className="section-card p-6 text-sm text-muted-foreground">
        Aucune entreprise trouvee.
      </div>
    );
  }

  return (
    <div className="app-table-shell">
      <table className="app-table min-w-[900px]">
        <thead>
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
            <tr key={company.id} className="border-t border-border/70 transition hover:bg-primary/5">
              <td className="px-4 py-3">
                <p className="font-semibold text-foreground">{company.name}</p>
                <p className="text-xs text-muted-foreground">{company.industry}</p>
              </td>

              <td className="px-4 py-3">
                <p className="text-foreground">{company.ownerName}</p>
                <p className="text-xs text-muted-foreground">{company.ownerEmail}</p>
              </td>

              <td className="px-4 py-3 text-foreground">{company.plan}</td>

              <td className="px-4 py-3">
                <StatusBadge variant={statusVariant(company.subscriptionStatus)}>
                  {company.subscriptionStatus}
                </StatusBadge>
              </td>

              <td className="px-4 py-3 text-foreground">
                {company.adminCount} admins / {company.agentCount} agents
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/companies/${company.id}`}>Ouvrir</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users?companyId=${company.id}&role=OWNER`}>Voir admins</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users?companyId=${company.id}&role=AGENT`}>Voir agents</Link>
                  </Button>
                  {onDeleteCompany ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={deletingCompanyId === company.id}
                      onClick={() => onDeleteCompany(company)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deletingCompanyId === company.id
                        ? "Suppression..."
                        : "Supprimer entreprise"}
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
