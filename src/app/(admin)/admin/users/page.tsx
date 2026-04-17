"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import UsersTable from "@/src/components/admin/users-table";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import { useSuperAdminSnapshot } from "@/src/features/super-admin/hooks/use-super-admin-snapshot";
import type { SuperAdminMember } from "@/src/features/super-admin/types/super-admin.types";

export default function AdminUsersPage() {
  const { snapshot, setSnapshot, isLoading, error } = useSuperAdminSnapshot();
  const [actionError, setActionError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const roleFilter = searchParams.get("role");
  const companyIdFilter = searchParams.get("companyId");

  const companyNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const company of snapshot?.companies ?? []) {
      map[company.id] = company.name;
    }
    return map;
  }, [snapshot?.companies]);

  const filteredMembers = useMemo(() => {
    const members = snapshot?.members ?? [];
    return members.filter((member) => {
      const roleOk =
        roleFilter === "OWNER"
          ? member.role === "OWNER"
          : roleFilter === "AGENT"
            ? member.role === "AGENT"
            : true;
      const companyOk = companyIdFilter ? member.companyId === companyIdFilter : true;
      return roleOk && companyOk;
    });
  }, [companyIdFilter, roleFilter, snapshot?.members]);

  async function handleToggleActive(member: SuperAdminMember) {
    try {
      setIsUpdating(true);
      setActionError(null);
      const nextSnapshot = await superAdminService.toggleMember(member.id, !member.isActive);
      setSnapshot(nextSnapshot);
    } catch (toggleError) {
      setActionError(
        toggleError instanceof Error ? toggleError.message : "Erreur lors de la mise a jour utilisateur.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  function clearFilters() {
    router.push("/admin/users");
  }

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Chargement utilisateurs...</div>;
  }

  if (error || !snapshot) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error ?? "Impossible de charger les utilisateurs."}</div>;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          Acces direct super admin aux comptes admins entreprise et agents.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/users?role=OWNER" className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100">
            Voir tous les admins entreprise
          </Link>
          <Link href="/admin/users?role=AGENT" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100">
            Voir tous les agents
          </Link>
          <button type="button" onClick={clearFilters} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Reinitialiser filtres
          </button>
        </div>

        {(roleFilter || companyIdFilter) ? (
          <p className="mt-2 text-xs text-slate-500">
            Filtres actifs: {roleFilter ? `role=${roleFilter}` : ""} {companyIdFilter ? `companyId=${companyIdFilter}` : ""}
          </p>
        ) : null}
      </section>

      {actionError ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div> : null}
      {isUpdating ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">Mise a jour utilisateur...</div> : null}

      <UsersTable
        members={filteredMembers}
        companyNameById={companyNameById}
        onToggleActive={handleToggleActive}
      />
    </div>
  );
}
