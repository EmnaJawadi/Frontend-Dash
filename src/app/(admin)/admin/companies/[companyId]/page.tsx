"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Mail,
  Crown,
  Activity,
  Users,
  MessageSquare,
  Star,
  CircleCheck,
  CircleOff,
  Pencil,
} from "lucide-react";
import {
  getCompanyById,
  type Company,
  type CompanyPlan,
  type CompanyStatus,
} from "@/src/lib/company-storage";

function getPlanClasses(plan: CompanyPlan) {
  switch (plan) {
    case "Premium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Standard":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Basic":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-muted text-foreground border-border";
  }
}

function getStatusClasses(status: CompanyStatus) {
  return status === "Active"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-red-50 text-red-700 border-red-200";
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentCompany = getCompanyById(companyId);
    setCompany(currentCompany);
  }, [companyId]);

  if (!mounted) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <Link
            href="/admin/companies"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux entreprises
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-7 w-7" />
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {company.name}
                </h1>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getPlanClasses(
                    company.plan,
                  )}`}
                >
                  {company.plan}
                </span>

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
              </div>

              <p className="max-w-3xl text-sm text-muted-foreground">
                {company.description}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/admin/companies/${company.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <Pencil className="h-4 w-4" />
          Modifier
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Conversations</p>
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-bold text-foreground">
            {company.stats.conversations}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Contacts</p>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-bold text-foreground">
            {company.stats.contacts}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Agents</p>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-bold text-foreground">
            {company.stats.agents}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Satisfaction</p>
            <Star className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-bold text-foreground">
            {company.stats.satisfaction}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Activité récente
            </h2>
          </div>

          <div className="space-y-3">
            {company.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/30 px-4 py-3"
              >
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                <p className="text-sm text-foreground">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Informations
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Propriétaire
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  {company.owner}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  {company.email}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Secteur
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {company.industry}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Créé le
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {company.createdAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}