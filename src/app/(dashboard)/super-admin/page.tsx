"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  Building2,
  CreditCard,
  RefreshCw,
  Save,
  ServerCog,
  Trash2,
  UserPlus2,
  Users,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RoleGuard from "@/src/components/layout/role-guard";
import { superAdminService } from "@/src/features/super-admin/services/super-admin.service";
import type {
  BillingCycle,
  CompanyRegistrationRequestItem,
  CompanyLifecycleStatus,
  ManagedUserRole,
  SubscriptionPlan,
  SubscriptionStatus,
  SuperAdminCompany,
  SuperAdminSnapshot,
  UpsertCompanyPayload,
  UpsertMemberPayload,
} from "@/src/features/super-admin/types/super-admin.types";
import { logout } from "@/src/lib/auth";

const PLAN_OPTIONS: SubscriptionPlan[] = ["BASIC", "STANDARD", "PREMIUM", "ENTERPRISE"];
const STATUS_OPTIONS: SubscriptionStatus[] = ["ACTIVE", "SUSPENDED", "EXPIRED", "CANCELED"];
const CYCLE_OPTIONS: BillingCycle[] = ["MONTHLY", "YEARLY"];
const COMPANY_STATUS_OPTIONS: CompanyLifecycleStatus[] = ["ACTIVE", "INACTIVE"];
const EMPTY_COMPANIES: SuperAdminCompany[] = [];

const EMPTY_COMPANY_FORM: UpsertCompanyPayload = {
  name: "",
  industry: "",
  ownerName: "",
  ownerEmail: "",
  adminCount: 1,
  agentCount: 0,
  lifecycleStatus: "ACTIVE",
  plan: "STANDARD",
  subscriptionDurationMonths: 1,
  subscriptionStatus: "ACTIVE",
  billingCycle: "MONTHLY",
  nextRenewalDate: new Date().toISOString().slice(0, 10),
};

const EMPTY_MEMBER_FORM: UpsertMemberPayload = {
  fullName: "",
  email: "",
  role: "AGENT",
  isActive: true,
};

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

function withErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export default function SuperAdminPage() {
  const router = useRouter();

  const [snapshot, setSnapshot] = useState<SuperAdminSnapshot | null>(null);
  const [registrationRequests, setRegistrationRequests] = useState<
    CompanyRegistrationRequestItem[]
  >([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const [companyForm, setCompanyForm] = useState<UpsertCompanyPayload>(EMPTY_COMPANY_FORM);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  const [memberForm, setMemberForm] = useState<UpsertMemberPayload>(EMPTY_MEMBER_FORM);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const [globalSettingsForm, setGlobalSettingsForm] = useState({
    maintenanceMode: false,
    allowInvitations: true,
    defaultLanguage: "fr",
    supportEmail: "",
  });

  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const [current, requests] = await Promise.all([
          superAdminService.getSnapshot(),
          superAdminService.getCompanyRegistrationRequests(),
        ]);
        if (!isMounted) return;

        setSnapshot(current);
        setRegistrationRequests(requests);
        setSelectedCompanyId(current.companies[0]?.id ?? null);
        setGlobalSettingsForm(current.globalSettings);
      } catch (loadError) {
        if (!isMounted) return;
        setError(withErrorMessage(loadError));
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const companies = snapshot?.companies ?? EMPTY_COMPANIES;
  const selectedCompany =
    companies.find((company) => company.id === selectedCompanyId) ?? null;
  const selectedMembers = useMemo(
    () => snapshot?.members.filter((member) => member.companyId === selectedCompanyId) ?? [],
    [selectedCompanyId, snapshot?.members],
  );

  const stats = useMemo(() => {
    const totalCompanies = companies.length;
    const activeSubscriptions = companies.filter((company) => company.subscriptionStatus === "ACTIVE").length;
    const totalAdmins = companies.reduce((sum, company) => sum + company.adminCount, 0);
    const totalAgents = companies.reduce((sum, company) => sum + company.agentCount, 0);
    const avgBotHealth =
      totalCompanies > 0
        ? Math.round(companies.reduce((sum, company) => sum + company.botHealthScore, 0) / totalCompanies)
        : 0;

    return { totalCompanies, activeSubscriptions, totalAdmins, totalAgents, avgBotHealth };
  }, [companies]);

  const accessSummary = useMemo(() => {
    if (!snapshot) {
      return { owners: 0, activeOwners: 0, agents: 0, activeAgents: 0 };
    }

    const owners = snapshot.members.filter((member) => member.role === "OWNER");
    const agents = snapshot.members.filter((member) => member.role === "AGENT");

    return {
      owners: owners.length,
      activeOwners: owners.filter((member) => member.isActive).length,
      agents: agents.length,
      activeAgents: agents.filter((member) => member.isActive).length,
    };
  }, [snapshot]);

  function applySnapshot(next: SuperAdminSnapshot, message: string) {
    setSnapshot(next);
    setFeedback(message);
    setError("");
    setGlobalSettingsForm(next.globalSettings);

    if (!selectedCompanyId || !next.companies.some((company) => company.id === selectedCompanyId)) {
      setSelectedCompanyId(next.companies[0]?.id ?? null);
    }
  }

  async function runWithGuard(task: () => Promise<SuperAdminSnapshot>, successMessage: string) {
    try {
      const nextSnapshot = await task();
      applySnapshot(nextSnapshot, successMessage);
    } catch (taskError) {
      setError(withErrorMessage(taskError));
      setFeedback("");
    }
  }

  async function refreshRegistrationRequests() {
    try {
      const requests = await superAdminService.getCompanyRegistrationRequests();
      setRegistrationRequests(requests);
    } catch (loadError) {
      setError(withErrorMessage(loadError));
    }
  }

  async function runRegistrationAction(task: () => Promise<void>, successMessage: string) {
    try {
      await task();
      await Promise.all([
        refreshRegistrationRequests(),
        runWithGuard(() => superAdminService.getSnapshot(), successMessage),
      ]);
    } catch (taskError) {
      setError(withErrorMessage(taskError));
      setFeedback("");
    }
  }

  function resetCompanyForm() {
    setCompanyForm(EMPTY_COMPANY_FORM);
    setEditingCompanyId(null);
  }

  function resetMemberForm() {
    setMemberForm(EMPTY_MEMBER_FORM);
    setEditingMemberId(null);
  }

  function handleLogout() {
    logout();
    router.replace("/login");
    router.refresh();
  }

  async function handleCompanySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: UpsertCompanyPayload = {
      ...companyForm,
      name: companyForm.name.trim(),
      industry: companyForm.industry.trim(),
      ownerName: companyForm.ownerName.trim(),
      ownerEmail: companyForm.ownerEmail.trim().toLowerCase(),
      adminCount: Math.max(1, Math.trunc(companyForm.adminCount)),
      agentCount: Math.max(0, Math.trunc(companyForm.agentCount)),
      subscriptionDurationMonths: Math.max(1, Math.trunc(companyForm.subscriptionDurationMonths)),
    };

    await runWithGuard(
      () => (editingCompanyId ? superAdminService.updateCompany(editingCompanyId, payload) : superAdminService.addCompany(payload)),
      editingCompanyId ? "Entreprise mise a jour." : "Entreprise ajoutee.",
    );
    resetCompanyForm();
  }

  function handleEditCompany(company: SuperAdminCompany) {
    setCompanyForm({
      name: company.name,
      industry: company.industry,
      ownerName: company.ownerName,
      ownerEmail: company.ownerEmail,
      adminCount: company.adminCount,
      agentCount: company.agentCount,
      lifecycleStatus: company.lifecycleStatus,
      plan: company.plan,
      subscriptionDurationMonths: company.subscriptionDurationMonths,
      subscriptionStatus: company.subscriptionStatus,
      billingCycle: company.billingCycle,
      nextRenewalDate: company.nextRenewalDate,
    });
    setEditingCompanyId(company.id);
  }

  async function handleDeleteCompany(companyId: string) {
    if (!window.confirm("Supprimer cette entreprise ?")) return;
    await runWithGuard(() => superAdminService.deleteCompany(companyId), "Entreprise supprimee.");
    if (editingCompanyId === companyId) resetCompanyForm();
  }

  async function handleSubscriptionPatch(
    companyId: string,
    patch: Partial<
      Pick<
        SuperAdminCompany,
        | "plan"
        | "subscriptionStatus"
        | "billingCycle"
        | "nextRenewalDate"
        | "lifecycleStatus"
        | "subscriptionDurationMonths"
      >
    >,
  ) {
    await runWithGuard(() => superAdminService.updateSubscription(companyId, patch), "Abonnement mis a jour.");
  }

  async function handleMemberSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCompanyId) {
      setError("Selectionne une entreprise avant d'ajouter un utilisateur.");
      return;
    }

    await runWithGuard(
      () =>
        editingMemberId
          ? superAdminService.updateMember(editingMemberId, memberForm)
          : superAdminService.addMember(selectedCompanyId, memberForm),
      editingMemberId ? "Utilisateur mis a jour." : "Utilisateur ajoute.",
    );
    resetMemberForm();
  }

  function handleEditMember(memberId: string) {
    const member = snapshot?.members.find((item) => item.id === memberId);
    if (!member) return;
    setMemberForm({
      fullName: member.fullName,
      email: member.email,
      role: member.role as ManagedUserRole,
      isActive: member.isActive,
    });
    setEditingMemberId(member.id);
  }

  async function handleDeleteMember(memberId: string) {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    await runWithGuard(() => superAdminService.deleteMember(memberId), "Utilisateur supprime.");
    if (editingMemberId === memberId) resetMemberForm();
  }

  async function handleSaveGlobalSettings() {
    await runWithGuard(
      () => superAdminService.updateGlobalSettings(globalSettingsForm),
      "Parametres globaux enregistres.",
    );
  }

  async function handleRunMaintenance() {
    await runWithGuard(() => superAdminService.runMaintenance(), "Test de maintenance execute.");
  }

  async function handleApproveRegistrationRequest(requestId: string) {
    await runRegistrationAction(
      () => superAdminService.approveCompanyRegistrationRequest(requestId),
      "Demande d'inscription approuvee.",
    );
  }

  async function handleRejectRegistrationRequest(requestId: string) {
    const reason = window.prompt("Motif de rejet (optionnel) :") ?? "";
    await runRegistrationAction(
      () => superAdminService.rejectCompanyRegistrationRequest(requestId, reason),
      "Demande d'inscription rejetee.",
    );
  }

  async function handleNeedsMoreInfoRegistrationRequest(requestId: string) {
    const infoRequest = window.prompt("Informations a demander :") ?? "";
    if (!infoRequest.trim()) return;

    await runRegistrationAction(
      () =>
        superAdminService.requestMoreInfoForCompanyRegistration(
          requestId,
          infoRequest.trim(),
        ),
      "Demande mise en statut besoin d'informations.",
    );
  }

  if (!snapshot) {
    return (
      <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Chargement espace Super Admin...
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card to-muted/40 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-primary">Espace Super Admin</p>
              <h2 className="text-2xl font-semibold">Gestion globale de la plateforme</h2>
              <p className="text-sm text-muted-foreground">
                Abonnements, entreprises, admins/agents, maintenance, audit et controle des acces.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => void handleRunMaintenance()}>
                <ServerCog className="mr-2 h-4 w-4" />
                Test maintenance
              </Button>
              <Button type="button" variant="outline" onClick={handleLogout}>
                Deconnexion Super Admin
              </Button>
            </div>
          </div>
        </section>

        {feedback ? <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{feedback}</div> : null}
        {error ? <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div> : null}

        <section id="company-registration-requests">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Building2 className="h-4 w-4" />
              <h3 className="text-lg font-semibold">
                Demandes d'inscription entreprise
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {registrationRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune demande en attente.
                </p>
              ) : (
                registrationRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-border/70 p-3"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{request.companyName}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.businessEmail} - {request.phoneNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Responsable: {request.responsibleFullName} | Type:{" "}
                          {request.businessType}
                        </p>
                        {request.message ? (
                          <p className="text-xs text-muted-foreground">
                            Message: {request.message}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{request.status}</Badge>
                          {request.approvedCompanyId ? (
                            <Badge variant="secondary">
                              Company ID: {request.approvedCompanyId}
                            </Badge>
                          ) : null}
                          {request.activationToken ? (
                            <Badge variant="secondary">
                              Lien activation genere
                            </Badge>
                          ) : null}
                        </div>
                      </div>

                      {request.status === "PENDING_APPROVAL" ||
                      request.status === "NEEDS_MORE_INFO" ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              void handleApproveRegistrationRequest(request.id)
                            }
                          >
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              void handleNeedsMoreInfoRegistrationRequest(
                                request.id,
                              )
                            }
                          >
                            Demander infos
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() =>
                              void handleRejectRegistrationRequest(request.id)
                            }
                          >
                            Rejeter
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-muted-foreground">Entreprises</p><p className="text-2xl font-semibold">{stats.totalCompanies}</p></div><Building2 className="h-5 w-5 text-primary" /></CardContent></Card>
          <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-muted-foreground">Abonnements actifs</p><p className="text-2xl font-semibold">{stats.activeSubscriptions}</p></div><CreditCard className="h-5 w-5 text-primary" /></CardContent></Card>
          <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-muted-foreground">Admins entreprise</p><p className="text-2xl font-semibold">{stats.totalAdmins}</p></div><Users className="h-5 w-5 text-primary" /></CardContent></Card>
          <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-muted-foreground">Agents</p><p className="text-2xl font-semibold">{stats.totalAgents}</p></div><Users className="h-5 w-5 text-primary" /></CardContent></Card>
          <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-muted-foreground">Sante bot globale</p><p className="text-2xl font-semibold">{stats.avgBotHealth}%</p></div><Bot className="h-5 w-5 text-primary" /></CardContent></Card>
        </section>

        <section id="subscriptions">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2"><CreditCard className="h-4 w-4" /><h3 className="text-lg font-semibold">1) Gestion des abonnements</h3></CardHeader>
            <CardContent className="space-y-3">
              {companies.map((company) => (
                <div key={company.id} className="grid gap-3 rounded-xl border border-border/70 p-3 md:grid-cols-8">
                  <div className="md:col-span-2">
                    <p className="font-medium">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.ownerEmail}</p>
                  </div>
                  <select value={company.plan} onChange={(event) => void handleSubscriptionPatch(company.id, { plan: event.target.value as SubscriptionPlan })} className="rounded-xl border border-border bg-background px-2 py-2">{PLAN_OPTIONS.map((plan) => <option key={plan} value={plan}>{plan}</option>)}</select>
                  <select value={company.billingCycle} onChange={(event) => void handleSubscriptionPatch(company.id, { billingCycle: event.target.value as BillingCycle })} className="rounded-xl border border-border bg-background px-2 py-2">{CYCLE_OPTIONS.map((cycle) => <option key={cycle} value={cycle}>{cycle}</option>)}</select>
                  <Input type="number" min={1} value={company.subscriptionDurationMonths} onChange={(event) => void handleSubscriptionPatch(company.id, { subscriptionDurationMonths: Number(event.target.value) || 1 })} />
                  <select value={company.subscriptionStatus} onChange={(event) => void handleSubscriptionPatch(company.id, { subscriptionStatus: event.target.value as SubscriptionStatus })} className="rounded-xl border border-border bg-background px-2 py-2">{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}</select>
                  <Input type="date" value={company.nextRenewalDate} onChange={(event) => void handleSubscriptionPatch(company.id, { nextRenewalDate: event.target.value })} />
                  <Button type="button" variant="outline" onClick={() => void runWithGuard(() => superAdminService.toggleSubscription(company.id, company.subscriptionStatus !== "ACTIVE"), company.subscriptionStatus === "ACTIVE" ? "Abonnement desactive." : "Abonnement active.")}>
                    {company.subscriptionStatus === "ACTIVE" ? "Desactiver" : "Activer"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="companies" className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2"><Wrench className="h-4 w-4" /><h3 className="text-lg font-semibold">2) Gestion des entreprises</h3></CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit} className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div><Label>Nom entreprise</Label><Input value={companyForm.name} onChange={(event) => setCompanyForm((prev) => ({ ...prev, name: event.target.value }))} /></div>
                  <div><Label>Secteur</Label><Input value={companyForm.industry} onChange={(event) => setCompanyForm((prev) => ({ ...prev, industry: event.target.value }))} /></div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div><Label>Admin principal</Label><Input value={companyForm.ownerName} onChange={(event) => setCompanyForm((prev) => ({ ...prev, ownerName: event.target.value }))} /></div>
                  <div><Label>Email admin</Label><Input type="email" value={companyForm.ownerEmail} onChange={(event) => setCompanyForm((prev) => ({ ...prev, ownerEmail: event.target.value }))} /></div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div><Label>Admins</Label><Input type="number" min={1} value={companyForm.adminCount} onChange={(event) => setCompanyForm((prev) => ({ ...prev, adminCount: Number(event.target.value) || 1 }))} /></div>
                  <div><Label>Agents</Label><Input type="number" min={0} value={companyForm.agentCount} onChange={(event) => setCompanyForm((prev) => ({ ...prev, agentCount: Number(event.target.value) || 0 }))} /></div>
                  <div><Label>Duree (mois)</Label><Input type="number" min={1} value={companyForm.subscriptionDurationMonths} onChange={(event) => setCompanyForm((prev) => ({ ...prev, subscriptionDurationMonths: Number(event.target.value) || 1 }))} /></div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <select value={companyForm.plan} onChange={(event) => setCompanyForm((prev) => ({ ...prev, plan: event.target.value as SubscriptionPlan }))} className="h-10 rounded-xl border border-border bg-background px-2">{PLAN_OPTIONS.map((plan) => <option key={plan} value={plan}>{plan}</option>)}</select>
                  <select value={companyForm.subscriptionStatus} onChange={(event) => setCompanyForm((prev) => ({ ...prev, subscriptionStatus: event.target.value as SubscriptionStatus }))} className="h-10 rounded-xl border border-border bg-background px-2">{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}</select>
                  <select value={companyForm.billingCycle} onChange={(event) => setCompanyForm((prev) => ({ ...prev, billingCycle: event.target.value as BillingCycle }))} className="h-10 rounded-xl border border-border bg-background px-2">{CYCLE_OPTIONS.map((cycle) => <option key={cycle} value={cycle}>{cycle}</option>)}</select>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <select value={companyForm.lifecycleStatus} onChange={(event) => setCompanyForm((prev) => ({ ...prev, lifecycleStatus: event.target.value as CompanyLifecycleStatus }))} className="h-10 rounded-xl border border-border bg-background px-2">{COMPANY_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}</select>
                  <Input type="date" value={companyForm.nextRenewalDate} onChange={(event) => setCompanyForm((prev) => ({ ...prev, nextRenewalDate: event.target.value }))} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit"><Save className="mr-2 h-4 w-4" />{editingCompanyId ? "Mettre a jour" : "Ajouter entreprise"}</Button>
                  {editingCompanyId ? <Button type="button" variant="outline" onClick={resetCompanyForm}>Annuler</Button> : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="text-lg font-semibold">Liste et details entreprise</h3></CardHeader>
            <CardContent className="space-y-3">
              {companies.map((company) => (
                <div key={company.id} className={`rounded-xl border p-3 ${selectedCompanyId === company.id ? "border-primary/50 bg-primary/5" : "border-border/70"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" className="text-left" onClick={() => setSelectedCompanyId(company.id)}>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.ownerName} - {company.ownerEmail}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="secondary">{company.plan}</Badge>
                        <Badge variant="secondary">{company.subscriptionStatus}</Badge>
                        <Badge variant="secondary">{company.lifecycleStatus}</Badge>
                      </div>
                    </button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCompany(company)}>Modifier</Button>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => void handleDeleteCompany(company.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {selectedCompany ? (
                <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-sm">
                  <p className="font-medium">Entreprise selectionnee: {selectedCompany.name}</p>
                  <p className="text-xs text-muted-foreground">Plan {selectedCompany.plan} - Renouvellement {selectedCompany.nextRenewalDate}</p>
                  <p className="text-xs text-muted-foreground">Admins {selectedCompany.adminCount} | Agents {selectedCompany.agentCount} | Sante bot {selectedCompany.botHealthScore}%</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <section id="users" className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2"><UserPlus2 className="h-4 w-4" /><h3 className="text-lg font-semibold">3) Gestion admins et agents</h3></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Entreprise cible</Label>
                <select value={selectedCompanyId ?? ""} onChange={(event) => setSelectedCompanyId(event.target.value || null)} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-2">
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </select>
              </div>
              <form onSubmit={handleMemberSubmit} className="space-y-3">
                <div><Label>Nom complet</Label><Input value={memberForm.fullName} onChange={(event) => setMemberForm((prev) => ({ ...prev, fullName: event.target.value }))} /></div>
                <div><Label>Email</Label><Input type="email" value={memberForm.email} onChange={(event) => setMemberForm((prev) => ({ ...prev, email: event.target.value }))} /></div>
                <div className="grid gap-3 md:grid-cols-2">
                  <select value={memberForm.role} onChange={(event) => setMemberForm((prev) => ({ ...prev, role: event.target.value as ManagedUserRole }))} className="h-10 rounded-xl border border-border bg-background px-2">
                    <option value="OWNER">Admin entreprise</option>
                    <option value="AGENT">Agent</option>
                  </select>
                  <select value={memberForm.isActive ? "true" : "false"} onChange={(event) => setMemberForm((prev) => ({ ...prev, isActive: event.target.value === "true" }))} className="h-10 rounded-xl border border-border bg-background px-2">
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingMemberId ? "Mettre a jour utilisateur" : "Ajouter utilisateur"}</Button>
                  {editingMemberId ? <Button type="button" variant="outline" onClick={resetMemberForm}>Annuler</Button> : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="text-lg font-semibold">Utilisateurs par entreprise</h3></CardHeader>
            <CardContent className="space-y-3">
              {selectedMembers.map((member) => (
                <div key={member.id} className="rounded-xl border border-border/70 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{member.fullName}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                      <div className="mt-1 flex gap-2">
                        <Badge variant="secondary">{member.role === "OWNER" ? "Admin" : "Agent"}</Badge>
                        <Badge variant="secondary">{member.isActive ? "Actif" : "Inactif"}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => handleEditMember(member.id)}>Editer</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => void runWithGuard(() => superAdminService.toggleMember(member.id, !member.isActive), member.isActive ? "Utilisateur desactive." : "Utilisateur active.")}>
                        {member.isActive ? "Desactiver" : "Activer"}
                      </Button>
                      <Button type="button" size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => void handleDeleteMember(member.id)}>
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="maintenance" className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2"><ServerCog className="h-4 w-4" /><h3 className="text-lg font-semibold">4) Technique / maintenance</h3></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Dernier test: <span className="font-medium">{formatDate(snapshot.maintenance.checkedAt)}</span></p>
              <p>Version application: <span className="font-medium">{snapshot.maintenance.appVersion}</span></p>
              <p>Latence API: <span className="font-medium">{snapshot.maintenance.apiLatencyMs} ms</span></p>
              <p>Queue backlog: <span className="font-medium">{snapshot.maintenance.queueBacklog}</span></p>
              <p>Taux succes bot: <span className="font-medium">{snapshot.maintenance.botSuccessRate}%</span></p>
              <div className="space-y-2">
                {snapshot.maintenance.services.map((service) => (
                  <div key={service.key} className="rounded-xl border border-border/70 px-3 py-2">
                    <p className="font-medium">{service.label} - {service.status}</p>
                    <p className="text-xs text-muted-foreground">{service.message}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                <p className="font-medium">Controle des acces</p>
                <p>Admins actifs: {accessSummary.activeOwners}/{accessSummary.owners}</p>
                <p>Agents actifs: {accessSummary.activeAgents}/{accessSummary.agents}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2"><RefreshCw className="h-4 w-4" /><h3 className="text-lg font-semibold">Parametres globaux et audit logs</h3></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <select value={globalSettingsForm.maintenanceMode ? "true" : "false"} onChange={(event) => setGlobalSettingsForm((prev) => ({ ...prev, maintenanceMode: event.target.value === "true" }))} className="h-10 rounded-xl border border-border bg-background px-2">
                  <option value="false">Maintenance OFF</option>
                  <option value="true">Maintenance ON</option>
                </select>
                <select value={globalSettingsForm.allowInvitations ? "true" : "false"} onChange={(event) => setGlobalSettingsForm((prev) => ({ ...prev, allowInvitations: event.target.value === "true" }))} className="h-10 rounded-xl border border-border bg-background px-2">
                  <option value="true">Invitations autorisees</option>
                  <option value="false">Invitations bloquees</option>
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Input value={globalSettingsForm.defaultLanguage} onChange={(event) => setGlobalSettingsForm((prev) => ({ ...prev, defaultLanguage: event.target.value }))} placeholder="Langue par defaut" />
                <Input type="email" value={globalSettingsForm.supportEmail} onChange={(event) => setGlobalSettingsForm((prev) => ({ ...prev, supportEmail: event.target.value }))} placeholder="Email support" />
              </div>
              <Button type="button" onClick={() => void handleSaveGlobalSettings()}>Enregistrer parametres globaux</Button>

              <div className="space-y-2 rounded-xl border border-border/70 p-3">
                <p className="text-sm font-medium">Audit logs recents</p>
                {snapshot.auditLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="rounded-lg border border-border/60 px-2 py-1 text-xs">
                    <p className="font-medium">{log.action}</p>
                    <p className="text-muted-foreground">{log.target} - {formatDate(log.createdAt)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </RoleGuard>
  );
}
