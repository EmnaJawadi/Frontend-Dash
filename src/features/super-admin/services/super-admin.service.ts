"use client";

import type {
  BillingCycle,
  CompanyLifecycleStatus,
  MaintenanceReport,
  MaintenanceServiceCheck,
  SubscriptionPlan,
  SubscriptionStatus,
  SuperAdminCompany,
  SuperAdminMember,
  SuperAdminSnapshot,
  UpsertCompanyPayload,
  UpsertMemberPayload,
} from "@/src/features/super-admin/types/super-admin.types";

const STORAGE_KEY = "super_admin_snapshot_v2";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nowIso(): string {
  return new Date().toISOString();
}

function todayIso(): string {
  return nowIso().slice(0, 10);
}

function addDays(baseDate: string, days: number): string {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addMonths(baseDate: string, months: number): string {
  const date = new Date(baseDate);
  date.setMonth(date.getMonth() + Math.max(1, Math.trunc(months)));
  return date.toISOString().slice(0, 10);
}

function toId(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `company-${Date.now()}`
  );
}

function makeMemberId(companyId: string, role: "OWNER" | "AGENT"): string {
  return `${companyId}-${role.toLowerCase()}-${Math.random().toString(16).slice(2, 8)}`;
}

function computeBotHealth(
  plan: SubscriptionPlan,
  lifecycleStatus: CompanyLifecycleStatus,
  subscriptionStatus: SubscriptionStatus,
): number {
  const baseByPlan: Record<SubscriptionPlan, number> = {
    BASIC: 78,
    STANDARD: 85,
    PREMIUM: 92,
    ENTERPRISE: 97,
  };

  const lifecyclePenalty = lifecycleStatus === "ACTIVE" ? 0 : lifecycleStatus === "INACTIVE" ? 8 : 12;
  const subscriptionPenalty =
    subscriptionStatus === "ACTIVE"
      ? 0
      : subscriptionStatus === "TRIAL"
        ? 2
        : subscriptionStatus === "OVERDUE"
          ? 11
          : 16;

  return Math.max(35, baseByPlan[plan] - lifecyclePenalty - subscriptionPenalty);
}

function buildMaintenanceServices(apiLatencyMs: number, queueBacklog: number): MaintenanceServiceCheck[] {
  return [
    {
      key: "backend",
      label: "API Backend",
      status: apiLatencyMs < 420 ? "HEALTHY" : "WARNING",
      message: apiLatencyMs < 420 ? "Reponse API stable." : "Latence elevee detectee.",
    },
    {
      key: "bot",
      label: "Moteur Bot",
      status: "HEALTHY",
      message: "Intents charges et reponses automatiques actives.",
    },
    {
      key: "gateway",
      label: "Passerelle WhatsApp",
      status: "HEALTHY",
      message: "Reception et emission des messages operationnelles.",
    },
    {
      key: "queue",
      label: "File de traitement",
      status: queueBacklog < 35 ? "HEALTHY" : "WARNING",
      message: queueBacklog < 35 ? "File sous controle." : "Backlog en hausse a surveiller.",
    },
  ];
}

function buildMaintenance(seed?: number): MaintenanceReport {
  const minute = seed ?? new Date().getMinutes();
  const apiLatencyMs = 180 + (minute % 9) * 32;
  const queueBacklog = 8 + (minute % 7) * 5;
  const botSuccessRate = Math.max(85, 99 - (minute % 6) * 2);

  return {
    checkedAt: nowIso(),
    appVersion: "frontend-2.4.0",
    apiLatencyMs,
    queueBacklog,
    botSuccessRate,
    services: buildMaintenanceServices(apiLatencyMs, queueBacklog),
  };
}

function buildMember(
  companyId: string,
  fullName: string,
  email: string,
  role: "OWNER" | "AGENT",
  isActive = true,
): SuperAdminMember {
  return {
    id: makeMemberId(companyId, role),
    companyId,
    fullName,
    email,
    role,
    isActive,
  };
}

function createDefaultSnapshot(): SuperAdminSnapshot {
  const today = todayIso();

  const companies: SuperAdminCompany[] = [
    {
      id: "support-os",
      name: "Support OS",
      industry: "Customer Support SaaS",
      ownerName: "Emna Jawadi",
      ownerEmail: "emna@supportos.com",
      adminCount: 2,
      agentCount: 14,
      lifecycleStatus: "ACTIVE",
      plan: "ENTERPRISE",
      subscriptionDurationMonths: 12,
      subscriptionStatus: "ACTIVE",
      billingCycle: "YEARLY",
      nextRenewalDate: addDays(today, 240),
      botHealthScore: 97,
      createdAt: addDays(today, -210),
    },
    {
      id: "client-bridge",
      name: "Client Bridge",
      industry: "Retail Operations",
      ownerName: "Majdi Abbes",
      ownerEmail: "majdi@clientbridge.com",
      adminCount: 1,
      agentCount: 8,
      lifecycleStatus: "ACTIVE",
      plan: "PREMIUM",
      subscriptionDurationMonths: 1,
      subscriptionStatus: "ACTIVE",
      billingCycle: "MONTHLY",
      nextRenewalDate: addDays(today, 23),
      botHealthScore: 91,
      createdAt: addDays(today, -124),
    },
    {
      id: "help-desk-pro",
      name: "Help Desk Pro",
      industry: "Internal Support",
      ownerName: "Sara Ben Ali",
      ownerEmail: "sara@helpdeskpro.com",
      adminCount: 1,
      agentCount: 3,
      lifecycleStatus: "SUSPENDED",
      plan: "STANDARD",
      subscriptionDurationMonths: 1,
      subscriptionStatus: "OVERDUE",
      billingCycle: "MONTHLY",
      nextRenewalDate: addDays(today, -3),
      botHealthScore: 72,
      createdAt: addDays(today, -86),
    },
  ];

  const members: SuperAdminMember[] = [
    buildMember("support-os", "Emna Jawadi", "emna@supportos.com", "OWNER"),
    buildMember("support-os", "Nesrine Kefi", "nesrine@supportos.com", "OWNER"),
    buildMember("support-os", "Youssef Ben Amor", "youssef@supportos.com", "AGENT"),
    buildMember("support-os", "Mouna Tlatli", "mouna@supportos.com", "AGENT"),
    buildMember("client-bridge", "Majdi Abbes", "majdi@clientbridge.com", "OWNER"),
    buildMember("client-bridge", "Meriem Khlifi", "meriem@clientbridge.com", "AGENT"),
    buildMember("client-bridge", "Rim Chatti", "rim@clientbridge.com", "AGENT"),
    buildMember("help-desk-pro", "Sara Ben Ali", "sara@helpdeskpro.com", "OWNER"),
    buildMember("help-desk-pro", "Adem Mansour", "adem@helpdeskpro.com", "AGENT"),
  ];

  return {
    companies,
    members,
    maintenance: buildMaintenance(2),
    globalSettings: {
      maintenanceMode: false,
      allowInvitations: true,
      defaultLanguage: "fr",
      supportEmail: "support@plateforme.com",
    },
    auditLogs: [
      {
        id: `log-${Date.now()}-1`,
        action: "Initialisation espace Super Admin",
        target: "Plateforme",
        createdAt: nowIso(),
      },
    ],
  };
}

function readSnapshot(): SuperAdminSnapshot {
  if (typeof window === "undefined") return createDefaultSnapshot();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = createDefaultSnapshot();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(raw) as SuperAdminSnapshot;
  } catch {
    const fallback = createDefaultSnapshot();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function persist(snapshot: SuperAdminSnapshot): SuperAdminSnapshot {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }
  return clone(snapshot);
}

function pushAudit(snapshot: SuperAdminSnapshot, action: string, target: string): void {
  snapshot.auditLogs = [
    { id: `log-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, action, target, createdAt: nowIso() },
    ...snapshot.auditLogs,
  ].slice(0, 150);
}

function membersOf(snapshot: SuperAdminSnapshot, companyId: string): SuperAdminMember[] {
  return snapshot.members.filter((member) => member.companyId === companyId);
}

function syncCompanyCounts(snapshot: SuperAdminSnapshot, companyId: string): void {
  const company = snapshot.companies.find((item) => item.id === companyId);
  if (!company) return;

  const members = membersOf(snapshot, companyId);
  const admins = members.filter((member) => member.role === "OWNER");
  const agents = members.filter((member) => member.role === "AGENT");

  company.adminCount = admins.length;
  company.agentCount = agents.length;

  const primaryAdmin = admins.find((admin) => admin.isActive) ?? admins[0];
  if (primaryAdmin) {
    company.ownerName = primaryAdmin.fullName;
    company.ownerEmail = primaryAdmin.email;
  }
}

function ensureAtLeastOneOwner(snapshot: SuperAdminSnapshot, companyId: string): void {
  const ownerCount = membersOf(snapshot, companyId).filter((member) => member.role === "OWNER").length;
  if (ownerCount < 1) {
    throw new Error("Chaque entreprise doit conserver au moins un admin.");
  }
}

function ensureAtLeastOneActiveOwner(snapshot: SuperAdminSnapshot, companyId: string): void {
  const activeOwnerCount = membersOf(snapshot, companyId).filter(
    (member) => member.role === "OWNER" && member.isActive,
  ).length;
  if (activeOwnerCount < 1) {
    throw new Error("Au moins un admin actif est requis.");
  }
}

function adjustMembersToTargets(snapshot: SuperAdminSnapshot, company: SuperAdminCompany): void {
  const desiredAdmins = Math.max(1, Math.trunc(company.adminCount));
  const desiredAgents = Math.max(0, Math.trunc(company.agentCount));
  const currentMembers = membersOf(snapshot, company.id);
  const admins = currentMembers.filter((member) => member.role === "OWNER");
  const agents = currentMembers.filter((member) => member.role === "AGENT");

  if (admins.length < desiredAdmins) {
    for (let i = admins.length; i < desiredAdmins; i += 1) {
      snapshot.members.push(
        buildMember(
          company.id,
          i === 0 ? company.ownerName : `${company.name} Admin ${i + 1}`,
          i === 0 ? company.ownerEmail : `admin${i + 1}@${company.id}.com`,
          "OWNER",
        ),
      );
    }
  } else if (admins.length > desiredAdmins) {
    let toRemove = admins.length - desiredAdmins;
    snapshot.members = snapshot.members.filter((member) => {
      if (toRemove < 1) return true;
      if (member.companyId !== company.id || member.role !== "OWNER") return true;
      if (member.email === company.ownerEmail && member.fullName === company.ownerName) return true;
      toRemove -= 1;
      return false;
    });
  }

  if (agents.length < desiredAgents) {
    for (let i = agents.length; i < desiredAgents; i += 1) {
      snapshot.members.push(
        buildMember(company.id, `${company.name} Agent ${i + 1}`, `agent${i + 1}@${company.id}.com`, "AGENT"),
      );
    }
  } else if (agents.length > desiredAgents) {
    let toRemove = agents.length - desiredAgents;
    snapshot.members = snapshot.members.filter((member) => {
      if (toRemove < 1) return true;
      if (member.companyId !== company.id || member.role !== "AGENT") return true;
      toRemove -= 1;
      return false;
    });
  }

  syncCompanyCounts(snapshot, company.id);
}

export const superAdminService = {
  getSnapshot(): SuperAdminSnapshot {
    return clone(readSnapshot());
  },

  addCompany(payload: UpsertCompanyPayload): SuperAdminSnapshot {
    const snapshot = readSnapshot();
    const id = toId(payload.name);
    const baseDate = todayIso();
    const company: SuperAdminCompany = {
      ...payload,
      id,
      adminCount: Math.max(1, Math.trunc(payload.adminCount)),
      agentCount: Math.max(0, Math.trunc(payload.agentCount)),
      subscriptionDurationMonths: Math.max(1, Math.trunc(payload.subscriptionDurationMonths)),
      nextRenewalDate: payload.nextRenewalDate || addMonths(baseDate, payload.subscriptionDurationMonths),
      createdAt: baseDate,
      botHealthScore: computeBotHealth(payload.plan, payload.lifecycleStatus, payload.subscriptionStatus),
    };

    snapshot.companies = [company, ...snapshot.companies.filter((item) => item.id !== id)];
    adjustMembersToTargets(snapshot, company);
    pushAudit(snapshot, "Creation entreprise", company.name);

    return persist(snapshot);
  },

  updateCompany(companyId: string, payload: UpsertCompanyPayload): SuperAdminSnapshot {
    const snapshot = readSnapshot();
    const company = snapshot.companies.find((item) => item.id === companyId);
    if (!company) throw new Error("Entreprise introuvable.");

    company.name = payload.name.trim();
    company.industry = payload.industry.trim() || "Non defini";
    company.ownerName = payload.ownerName.trim();
    company.ownerEmail = payload.ownerEmail.trim();
    company.lifecycleStatus = payload.lifecycleStatus;
    company.plan = payload.plan;
    company.subscriptionStatus = payload.subscriptionStatus;
    company.billingCycle = payload.billingCycle;
    company.subscriptionDurationMonths = Math.max(1, Math.trunc(payload.subscriptionDurationMonths));
    company.nextRenewalDate = payload.nextRenewalDate;
    company.adminCount = Math.max(1, Math.trunc(payload.adminCount));
    company.agentCount = Math.max(0, Math.trunc(payload.agentCount));
    company.botHealthScore = computeBotHealth(company.plan, company.lifecycleStatus, company.subscriptionStatus);

    adjustMembersToTargets(snapshot, company);
    pushAudit(snapshot, "Mise a jour entreprise", company.name);

    return persist(snapshot);
  },

  deleteCompany(companyId: string): SuperAdminSnapshot {
    const snapshot = readSnapshot();
    const company = snapshot.companies.find((item) => item.id === companyId);
    snapshot.companies = snapshot.companies.filter((item) => item.id !== companyId);
    snapshot.members = snapshot.members.filter((member) => member.companyId !== companyId);
    pushAudit(snapshot, "Suppression entreprise", company?.name ?? companyId);
    return persist(snapshot);
  },

  updateSubscription(
    companyId: string,
    payload: Partial<
      Pick<
        SuperAdminCompany,
        "plan" | "subscriptionStatus" | "billingCycle" | "nextRenewalDate" | "lifecycleStatus" | "subscriptionDurationMonths"
      >
    >,
  ): SuperAdminSnapshot {
    const snapshot = readSnapshot();
    const company = snapshot.companies.find((item) => item.id === companyId);
    if (!company) throw new Error("Entreprise introuvable.");

    if (payload.plan) company.plan = payload.plan;
    if (payload.subscriptionStatus) company.subscriptionStatus = payload.subscriptionStatus;
    if (payload.billingCycle) company.billingCycle = payload.billingCycle;
    if (payload.lifecycleStatus) company.lifecycleStatus = payload.lifecycleStatus;
    if (payload.subscriptionDurationMonths !== undefined) {
      company.subscriptionDurationMonths = Math.max(1, Math.trunc(payload.subscriptionDurationMonths));
    }
    if (payload.nextRenewalDate) company.nextRenewalDate = payload.nextRenewalDate;

    company.botHealthScore = computeBotHealth(company.plan, company.lifecycleStatus, company.subscriptionStatus);
    pushAudit(snapshot, "Mise a jour abonnement", company.name);

    return persist(snapshot);
  },

  toggleSubscription(companyId: string, isEnabled: boolean): SuperAdminSnapshot {
    const status: SubscriptionStatus = isEnabled ? "ACTIVE" : "CANCELED";
    return this.updateSubscription(companyId, { subscriptionStatus: status });
  },

  addMember(companyId: string, payload: UpsertMemberPayload): SuperAdminSnapshot {
    const snapshot = readSnapshot();
    const company = snapshot.companies.find((item) => item.id === companyId);
    if (!company) throw new Error("Entreprise introuvable.");

    const normalizedEmail = payload.email.trim().toLowerCase();
    const exists = snapshot.members.some((member) => member.email.toLowerCase() === normalizedEmail);
    if (exists) throw new Error("Cet email existe deja.");

    snapshot.members.push(
      buildMember(
        companyId,
        payload.fullName.trim(),
        normalizedEmail,
        payload.role,
        payload.isActive ?? true,
      ),
    );

    syncCompanyCounts(snapshot, companyId);
    ensureAtLeastOneOwner(snapshot, companyId);
    ensureAtLeastOneActiveOwner(snapshot, companyId);
    pushAudit(snapshot, "Ajout utilisateur", company.name);

    return persist(snapshot);
  },

  updateMember(memberId: string, payload: Partial<UpsertMemberPayload>): SuperAdminSnapshot {
    const snapshot = readSnapshot();
    const member = snapshot.members.find((item) => item.id === memberId);
    if (!member) throw new Error("Utilisateur introuvable.");

    const previousRole = member.role;
    const previousActive = member.isActive;

    if (payload.fullName !== undefined) member.fullName = payload.fullName.trim();
    if (payload.email !== undefined) member.email = payload.email.trim().toLowerCase();
    if (payload.role !== undefined) member.role = payload.role;
    if (payload.isActive !== undefined) member.isActive = payload.isActive;

    syncCompanyCounts(snapshot, member.companyId);

    if (previousRole === "OWNER" && member.role !== "OWNER") {
      ensureAtLeastOneOwner(snapshot, member.companyId);
    }

    if (previousRole === "OWNER" && previousActive && !member.isActive) {
      ensureAtLeastOneActiveOwner(snapshot, member.companyId);
    }

    if (payload.role === "OWNER") {
      ensureAtLeastOneOwner(snapshot, member.companyId);
      ensureAtLeastOneActiveOwner(snapshot, member.companyId);
    }

    pushAudit(snapshot, "Mise a jour utilisateur", member.email);
    return persist(snapshot);
  },

  toggleMember(memberId: string, isActive: boolean): SuperAdminSnapshot {
    return this.updateMember(memberId, { isActive });
  },

  deleteMember(memberId: string): SuperAdminSnapshot {
    const snapshot = readSnapshot();
    const member = snapshot.members.find((item) => item.id === memberId);
    if (!member) throw new Error("Utilisateur introuvable.");

    const companyId = member.companyId;
    snapshot.members = snapshot.members.filter((item) => item.id !== memberId);

    if (member.role === "OWNER") {
      ensureAtLeastOneOwner(snapshot, companyId);
      ensureAtLeastOneActiveOwner(snapshot, companyId);
    }

    syncCompanyCounts(snapshot, companyId);
    pushAudit(snapshot, "Suppression utilisateur", member.email);

    return persist(snapshot);
  },

  updateGlobalSettings(
    payload: Partial<{
      maintenanceMode: boolean;
      allowInvitations: boolean;
      defaultLanguage: string;
      supportEmail: string;
    }>,
  ): SuperAdminSnapshot {
    const snapshot = readSnapshot();

    snapshot.globalSettings = {
      ...snapshot.globalSettings,
      ...payload,
      defaultLanguage: payload.defaultLanguage?.trim() ?? snapshot.globalSettings.defaultLanguage,
      supportEmail: payload.supportEmail?.trim() ?? snapshot.globalSettings.supportEmail,
    };

    pushAudit(snapshot, "Mise a jour parametres globaux", "Plateforme");
    return persist(snapshot);
  },

  runMaintenance(): SuperAdminSnapshot {
    const snapshot = readSnapshot();
    snapshot.maintenance = buildMaintenance();
    pushAudit(snapshot, "Execution test maintenance", "Technique");
    return persist(snapshot);
  },
};
