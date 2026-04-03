"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Plus,
  Search,
  CircleCheck,
  CircleOff,
  X,
  Trash2,
} from "lucide-react";
import {
  deleteCompany,
  getStoredCompanies,
  type Company,
  type CompanyPlan,
  type CompanyStatus,
} from "@/src/lib/company-storage";

function getPlanClasses(plan: CompanyPlan) {
  switch (plan) {
    case "Premium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Standard":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "Basic":
      return "border-slate-200 bg-slate-50 text-slate-700";
    default:
      return "border-border bg-muted text-foreground";
  }
}

function getStatusClasses(status: CompanyStatus) {
  return status === "Active"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-700";
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [mounted, setMounted] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompanies(getStoredCompanies());
  }, []);

  const openDeleteModal = (companyId: string, companyName: string) => {
    setSelectedCompanyId(companyId);
    setSelectedCompanyName(companyName);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setSelectedCompanyId(null);
    setSelectedCompanyName("");
  };

  const handleConfirmDelete = () => {
    if (!selectedCompanyId) return;

    setIsDeleting(true);

    const deleted = deleteCompany(selectedCompanyId);

    if (!deleted) {
      window.alert("Impossible de supprimer l’entreprise.");
      setIsDeleting(false);
      closeDeleteModal();
      return;
    }

    setCompanies(getStoredCompanies());
    setIsDeleting(false);
    closeDeleteModal();
  };

  if (!mounted) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Entreprises
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gérez les entreprises clientes qui utilisent la plateforme.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une entreprise..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:w-64"
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Entreprise
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Propriétaire
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/20"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="inline-flex items-center gap-2 font-semibold text-foreground transition hover:text-primary"
                      >
                        {company.name}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-foreground">{company.owner}</td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {company.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getPlanClasses(
                          company.plan,
                        )}`}
                      >
                        {company.plan}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          company.status,
                        )}`}
                      >
                        {company.status === "Active" ? (
                          <CircleCheck className="h-3.5 w-3.5" />
                        ) : (
                          <CircleOff className="h-3.5 w-3.5" />
                        )}
                        {company.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/companies/${company.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                        >
                          Voir
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            openDeleteModal(company.id, company.name)
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Supprimer l’entreprise
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Vous êtes sur le point de supprimer{" "}
                  <span className="font-semibold text-foreground">
                    {selectedCompanyName}
                  </span>
                  . Cette action est irréversible.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Cette suppression retirera l’entreprise de la liste locale.
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}