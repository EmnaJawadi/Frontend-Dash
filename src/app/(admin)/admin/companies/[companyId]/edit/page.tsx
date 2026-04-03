"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import {
  getCompanyById,
  updateCompany,
  type CompanyPlan,
  type CompanyStatus,
} from "@/src/lib/company-storage";

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;

  const [mounted, setMounted] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);

  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<CompanyPlan>("Basic");
  const [status, setStatus] = useState<CompanyStatus>("Active");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    const company = getCompanyById(companyId);

    if (!company) {
      setNotFoundState(true);
      return;
    }

    setName(company.name);
    setOwner(company.owner);
    setEmail(company.email);
    setPlan(company.plan);
    setStatus(company.status);
    setDescription(company.description);
    setIndustry(company.industry);
  }, [companyId]);

  if (!mounted) {
    return <div className="p-6">Chargement...</div>;
  }

  if (notFoundState) {
    notFound();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim() || !owner.trim() || !email.trim()) {
      setError("Nom, propriétaire et email sont obligatoires.");
      return;
    }

    const updated = updateCompany(companyId, {
      name,
      owner,
      email,
      plan,
      status,
      description,
      industry,
    });

    if (!updated) {
      setError("Impossible de mettre à jour l’entreprise.");
      return;
    }

    setMessage("Entreprise mise à jour avec succès.");

    setTimeout(() => {
      router.push(`/admin/companies/${companyId}`);
      router.refresh();
    }, 800);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-4">
        <Link
          href={`/admin/companies/${companyId}`}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux détails
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier entreprise</h1>
          <p className="text-sm text-muted-foreground">
            Mettez à jour les informations de l’entreprise.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-3xl border border-border bg-background p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom entreprise</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Propriétaire</label>
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Secteur</label>
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as CompanyPlan)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
            >
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CompanyStatus)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Save className="h-4 w-4" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}