"use client";

import { apiClient } from "@/src/lib/api-client";
import type {
  BillingCycle,
  CompanyLifecycleStatus,
  CompanyRegistrationRequestItem,
  MaintenanceReport,
  MaintenanceServiceCheck,
  ManagedUserRole,
  SubscriptionPlan,
  SubscriptionStatus,
  SuperAdminCompany,
  SuperAdminMember,
  SuperAdminSnapshot,
  UpsertCompanyPayload,
  UpsertMemberPayload,
} from "@/src/features/super-admin/types/super-admin.types";

type CompanyStatusBackend = "ACTIVE" | "INACTIVE";
type SubscriptionStatusBackend = "ACTIVE" | "SUSPENDED" | "EXPIRED" | "CANCELED";
type UserRoleBackend = "SUPER_ADMIN" | "COMPANY_ADMIN" | "AGENT" | "EMPLOYEE";

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type BackendDashboardStats = {
  companies: {
    total: number;
    active: number;
    inactive: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  subscriptions: {
    total: number;
    active: number;
    suspended: number;
    expired: number;
    canceled: number;
  };
  platform: {
    maintenanceMode: boolean;
    databaseConnected: boolean;
    status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE";
  };
  generatedAt: string;
};

type BackendMaintenanceHealth = {
  status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE";
  maintenanceMode: boolean;
  database: {
    connected: boolean;
  };
  counters: BackendDashboardStats;
  generatedAt: string;
};

type BackendPlatformSettings = {
  platformName?: string;
  supportEmail?: string | null;
  defaultLanguage?: string;
  defaultCurrency?: string;
  maintenanceMode?: boolean;
  allowUserInvitations?: boolean;
  allowInvitations?: boolean;
  updatedAt?: string;
};

type BackendAuditLog = {
  id: string;
  action: string | null;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
};

type BackendCompany = {
  id: string;
  name: string;
  legalName: string | null;
  email: string | null;
  status: CompanyStatusBackend;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type BackendSubscription = {
  id: string;
  companyId: string;
  plan: string;
  status: SubscriptionStatusBackend;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type BackendUser = {
  id: string;
  firstName: string;
  lastName: string | null;
  fullName: string;
  email: string;
  role: UserRoleBackend;
  isActive: boolean;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
};

type BackendCompanyRegistrationRequest = {
  id: string;
  companyName: string;
  businessEmail: string;
  phoneNumber: string;
  responsibleFullName: string;
  requestedRole: "COMPANY_ADMIN";
  businessType: string;
  message: string | null;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "NEEDS_MORE_INFO";
  rejectionReason: string | null;
  infoRequest: string | null;
  createdAt: string;
  reviewedAt: string | null;
  approvedAt: string | null;
  activationToken: string | null;
  approvedCompanyId: string | null;
};

const DEFAULT_USER_PASSWORD = "TempPass#2026";
const PLAN_VALUES: SubscriptionPlan[] = ["BASIC", "STANDARD", "PREMIUM", "ENTERPRISE"];
const STATUS_VALUES: SubscriptionStatus[] = ["ACTIVE", "SUSPENDED", "EXPIRED", "CANCELED"];

function toDateOnly(value: string | Date): string {
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

function todayDateOnly(): string {
  return toDateOnly(new Date());
}

function addMonths(baseDate: string, months: number): string {
  const date = new Date(baseDate);
  date.setMonth(date.getMonth() + Math.max(1, Math.trunc(months)));
  return toDateOnly(date);
}

function durationMonths(startDate: string, endDate: string | null | undefined): number {
  if (!endDate) return 1;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  return Math.max(1, months || 1);
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return { firstName: parts[0] ?? "User", lastName: "Admin" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function safeText(value: string | null | undefined, fallback: string): string {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
}

function normalizePlan(plan: string | null | undefined): SubscriptionPlan {
  const normalized = plan?.trim().toUpperCase();
  if (normalized && PLAN_VALUES.includes(normalized as SubscriptionPlan)) {
    return normalized as SubscriptionPlan;
  }
  return "STANDARD";
}

function normalizeSubscriptionStatus(
  status: SubscriptionStatusBackend | string | null | undefined,
): SubscriptionStatus {
  const normalized = status?.toString().trim().toUpperCase();
  if (normalized && STATUS_VALUES.includes(normalized as SubscriptionStatus)) {
    return normalized as SubscriptionStatus;
  }
  return "ACTIVE";
}

function normalizeLifecycleStatus(status: CompanyStatusBackend | string): CompanyLifecycleStatus {
  return status.toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE";
}

function toBackendCompanyStatus(status: CompanyLifecycleStatus): CompanyStatusBackend {
  return status === "ACTIVE" ? "ACTIVE" : "INACTIVE";
}

function toBackendSubscriptionStatus(status: SubscriptionStatus): SubscriptionStatusBackend {
  if (status === "SUSPENDED") return "SUSPENDED";
  if (status === "EXPIRED") return "EXPIRED";
  if (status === "CANCELED") return "CANCELED";
  return "ACTIVE";
}

function toManagedRole(role: UserRoleBackend): ManagedUserRole | null {
  if (role === "COMPANY_ADMIN") return "OWNER";
  if (role === "AGENT" || role === "EMPLOYEE") return "AGENT";
  return null;
}

function toBackendRole(role: ManagedUserRole): Exclude<UserRoleBackend, "SUPER_ADMIN" | "EMPLOYEE"> {
  return role === "OWNER" ? "COMPANY_ADMIN" : "AGENT";
}

function computeBillingCycle(duration: number): BillingCycle {
  return duration >= 12 ? "YEARLY" : "MONTHLY";
}

function computeBotHealth(
  lifecycleStatus: CompanyLifecycleStatus,
  subscriptionStatus: SubscriptionStatus,
  plan: SubscriptionPlan,
): number {
  const planBase: Record<SubscriptionPlan, number> = {
    BASIC: 78,
    STANDARD: 85,
    PREMIUM: 92,
    ENTERPRISE: 97,
  };

  const lifecyclePenalty = lifecycleStatus === "ACTIVE" ? 0 : 10;
  const subscriptionPenalty =
    subscriptionStatus === "ACTIVE"
      ? 0
      : subscriptionStatus === "SUSPENDED"
        ? 12
        : subscriptionStatus === "EXPIRED"
          ? 15
          : 18;

  return Math.max(35, planBase[plan] - lifecyclePenalty - subscriptionPenalty);
}

function toMaintenanceServices(
  maintenance: BackendMaintenanceHealth,
  stats: BackendDashboardStats,
): MaintenanceServiceCheck[] {
  const degraded = maintenance.status !== "OPERATIONAL";
  const hasExpired = stats.subscriptions.expired > 0 || stats.subscriptions.suspended > 0;

  return [
    {
      key: "backend",
      label: "API Backend",
      status: degraded ? "WARNING" : "HEALTHY",
      message: degraded ? "Plateforme en mode degrade/maintenance." : "API operationnelle.",
    },
    {
      key: "database",
      label: "Base de donnees",
      status: maintenance.database.connected ? "HEALTHY" : "CRITICAL",
      message: maintenance.database.connected ? "Connexion PostgreSQL stable." : "Connexion base indisponible.",
    },
    {
      key: "subscriptions",
      label: "Abonnements",
      status: hasExpired ? "WARNING" : "HEALTHY",
      message: hasExpired
        ? "Des abonnements suspendus/expirés necessitent une action."
        : "Aucun abonnement critique detecte.",
    },
  ];
}

function toMaintenanceReport(
  maintenance: BackendMaintenanceHealth,
  stats: BackendDashboardStats,
): MaintenanceReport {
  const activeUsers = stats.users.active || 1;
  const successRate = Math.round((stats.subscriptions.active / Math.max(stats.subscriptions.total, 1)) * 100);

  return {
    checkedAt: maintenance.generatedAt ?? new Date().toISOString(),
    appVersion: "backend-live",
    apiLatencyMs: maintenance.database.connected ? 180 : 1800,
    queueBacklog: Math.max(0, stats.users.total - activeUsers),
    botSuccessRate: Math.max(45, Math.min(99, successRate)),
    services: toMaintenanceServices(maintenance, stats),
  };
}

function toAuditTarget(log: BackendAuditLog): string {
  const type = safeText(log.entityType, "Systeme");
  const entityId = safeText(log.entityId, "");
  return entityId ? `${type} (${entityId})` : type;
}

function toRegistrationRequestItem(
  item: BackendCompanyRegistrationRequest,
): CompanyRegistrationRequestItem {
  return {
    id: item.id,
    companyName: item.companyName,
    businessEmail: item.businessEmail,
    phoneNumber: item.phoneNumber,
    responsibleFullName: item.responsibleFullName,
    requestedRole: "COMPANY_ADMIN",
    businessType: item.businessType,
    message: item.message,
    status: item.status,
    rejectionReason: item.rejectionReason,
    infoRequest: item.infoRequest,
    createdAt: item.createdAt,
    reviewedAt: item.reviewedAt,
    approvedAt: item.approvedAt,
    activationToken: item.activationToken,
    approvedCompanyId: item.approvedCompanyId,
  };
}

function buildSnapshot(input: {
  companies: BackendCompany[];
  subscriptions: BackendSubscription[];
  users: BackendUser[];
  stats: BackendDashboardStats;
  maintenance: BackendMaintenanceHealth;
  settings: BackendPlatformSettings;
  auditLogs: BackendAuditLog[];
}): SuperAdminSnapshot {
  const mappedMembers: SuperAdminMember[] = input.users
    .filter((user) => Boolean(user.companyId))
    .map((user) => {
      const role = toManagedRole(user.role);
      if (!role) return null;

      return {
        id: user.id,
        companyId: user.companyId as string,
        fullName: safeText(user.fullName, `${user.firstName} ${user.lastName ?? ""}`.trim()),
        email: user.email,
        role,
        isActive: user.isActive,
      } satisfies SuperAdminMember;
    })
    .filter((member): member is SuperAdminMember => member !== null);

  const subscriptionsByCompany = new Map<string, BackendSubscription>();
  for (const subscription of input.subscriptions) {
    if (!subscriptionsByCompany.has(subscription.companyId)) {
      subscriptionsByCompany.set(subscription.companyId, subscription);
    }
  }

  const companies: SuperAdminCompany[] = input.companies.map((company) => {
    const companyMembers = mappedMembers.filter((member) => member.companyId === company.id);
    const admins = companyMembers.filter((member) => member.role === "OWNER");
    const agents = companyMembers.filter((member) => member.role === "AGENT");
    const owner = admins.find((admin) => admin.isActive) ?? admins[0];

    const subscription = subscriptionsByCompany.get(company.id);
    const plan = normalizePlan(subscription?.plan);
    const subscriptionStatus = normalizeSubscriptionStatus(subscription?.status);
    const lifecycleStatus = normalizeLifecycleStatus(company.status);
    const nextRenewalDate = subscription?.endDate
      ? toDateOnly(subscription.endDate)
      : addMonths(todayDateOnly(), 1);
    const subscriptionDurationMonths = durationMonths(
      subscription?.startDate ?? company.createdAt,
      subscription?.endDate ?? null,
    );

    return {
      id: company.id,
      name: company.name,
      industry: safeText(company.legalName, "Non defini"),
      ownerName: owner?.fullName ?? "Admin non assigne",
      ownerEmail: owner?.email ?? company.email ?? "owner@company.local",
      adminCount: admins.length,
      agentCount: agents.length,
      lifecycleStatus,
      plan,
      subscriptionDurationMonths,
      subscriptionStatus,
      billingCycle: computeBillingCycle(subscriptionDurationMonths),
      nextRenewalDate,
      botHealthScore: computeBotHealth(lifecycleStatus, subscriptionStatus, plan),
      createdAt: toDateOnly(company.createdAt),
    };
  });

  const settings = input.settings ?? {};

  return {
    companies,
    members: mappedMembers,
    maintenance: toMaintenanceReport(input.maintenance, input.stats),
    globalSettings: {
      maintenanceMode: Boolean(settings.maintenanceMode),
      allowInvitations: Boolean(settings.allowUserInvitations ?? settings.allowInvitations ?? true),
      defaultLanguage: safeText(settings.defaultLanguage, "fr"),
      supportEmail: safeText(settings.supportEmail ?? undefined, ""),
    },
    auditLogs: input.auditLogs.map((log) => ({
      id: log.id,
      action: safeText(log.action ?? undefined, "Action systeme"),
      target: toAuditTarget(log),
      createdAt: log.createdAt,
    })),
  };
}

async function fetchCompanies(): Promise<BackendCompany[]> {
  const res = await apiClient.get<PaginatedResponse<BackendCompany>>("/admin/companies?page=1&limit=500");
  return res.data;
}

async function fetchSubscriptions(companyId?: string): Promise<BackendSubscription[]> {
  const query = companyId
    ? `/admin/subscriptions?page=1&limit=500&companyId=${encodeURIComponent(companyId)}`
    : "/admin/subscriptions?page=1&limit=500";

  const res = await apiClient.get<PaginatedResponse<BackendSubscription>>(query);
  return res.data;
}

async function fetchUsers(companyId?: string): Promise<BackendUser[]> {
  const query = companyId
    ? `/admin/users?page=1&limit=500&companyId=${encodeURIComponent(companyId)}`
    : "/admin/users?page=1&limit=500";

  const res = await apiClient.get<PaginatedResponse<BackendUser>>(query);
  return res.data;
}

async function fetchSnapshot(): Promise<SuperAdminSnapshot> {
  const [stats, maintenance, settings, auditLogs, companies, subscriptions, users] = await Promise.all([
    apiClient.get<BackendDashboardStats>("/admin/dashboard/stats"),
    apiClient.get<BackendMaintenanceHealth>("/admin/maintenance/health"),
    apiClient.get<BackendPlatformSettings>("/admin/maintenance/platform-settings"),
    apiClient.get<PaginatedResponse<BackendAuditLog>>("/admin/maintenance/audit-logs?page=1&limit=50"),
    fetchCompanies(),
    fetchSubscriptions(),
    fetchUsers(),
  ]);

  return buildSnapshot({
    companies,
    subscriptions,
    users,
    stats,
    maintenance,
    settings,
    auditLogs: auditLogs.data,
  });
}

async function ensurePrimaryOwner(companyId: string, fullName: string, email: string): Promise<void> {
  const users = await fetchUsers(companyId);
  const admins = users.filter((user) => user.role === "COMPANY_ADMIN");
  const normalizedEmail = email.trim().toLowerCase();
  const names = splitFullName(fullName);
  const matched = admins.find((admin) => admin.email.toLowerCase() === normalizedEmail);
  const target = matched ?? admins[0];

  if (!target) {
    await apiClient.post("/admin/users", {
      companyId,
      firstName: names.firstName,
      lastName: names.lastName,
      email: normalizedEmail,
      password: DEFAULT_USER_PASSWORD,
      role: "COMPANY_ADMIN",
    });
    return;
  }

  await apiClient.patch(`/admin/users/${target.id}`, {
    firstName: names.firstName,
    lastName: names.lastName,
    email: normalizedEmail,
    role: "COMPANY_ADMIN",
    isActive: true,
  });
}

async function ensureMinimumUsers(companyId: string, desiredAdmins: number, desiredAgents: number): Promise<void> {
  const users = await fetchUsers(companyId);
  const admins = users.filter((user) => user.role === "COMPANY_ADMIN");
  const agents = users.filter((user) => user.role === "AGENT" || user.role === "EMPLOYEE");
  const normalizedAdmins = Math.max(1, Math.trunc(desiredAdmins));
  const normalizedAgents = Math.max(0, Math.trunc(desiredAgents));

  for (let i = admins.length; i < normalizedAdmins; i += 1) {
    const index = i + 1;
    await apiClient.post("/admin/users", {
      companyId,
      firstName: "Admin",
      lastName: `${index}`,
      email: `admin-${Date.now()}-${index}@${companyId}.local`,
      password: DEFAULT_USER_PASSWORD,
      role: "COMPANY_ADMIN",
    });
  }

  for (let i = agents.length; i < normalizedAgents; i += 1) {
    const index = i + 1;
    await apiClient.post("/admin/users", {
      companyId,
      firstName: "Agent",
      lastName: `${index}`,
      email: `agent-${Date.now()}-${index}@${companyId}.local`,
      password: DEFAULT_USER_PASSWORD,
      role: "AGENT",
    });
  }
}

async function resolveCompanySubscription(companyId: string): Promise<BackendSubscription | null> {
  const subscriptions = await fetchSubscriptions(companyId);
  return subscriptions[0] ?? null;
}

function toSubscriptionDates(payload: UpsertCompanyPayload): { startDate: string; endDate: string } {
  const startDate = todayDateOnly();
  const duration = Math.max(1, Math.trunc(payload.subscriptionDurationMonths));
  const endDate = payload.nextRenewalDate || addMonths(startDate, duration);

  return {
    startDate,
    endDate,
  };
}

export const superAdminService = {
  async getSnapshot(): Promise<SuperAdminSnapshot> {
    return fetchSnapshot();
  },

  async addCompany(payload: UpsertCompanyPayload): Promise<SuperAdminSnapshot> {
    const createdCompany = await apiClient.post<BackendCompany>("/admin/companies", {
      name: payload.name.trim(),
      legalName: payload.industry.trim() || null,
      email: payload.ownerEmail.trim().toLowerCase(),
      isActive: payload.lifecycleStatus === "ACTIVE",
    });

    const subscriptionDates = toSubscriptionDates(payload);

    await apiClient.post("/admin/subscriptions", {
      companyId: createdCompany.id,
      plan: payload.plan,
      status: toBackendSubscriptionStatus(payload.subscriptionStatus),
      startDate: subscriptionDates.startDate,
      endDate: subscriptionDates.endDate,
      isActive: payload.subscriptionStatus === "ACTIVE",
    });

    await ensurePrimaryOwner(
      createdCompany.id,
      payload.ownerName.trim(),
      payload.ownerEmail.trim().toLowerCase(),
    );

    await ensureMinimumUsers(
      createdCompany.id,
      payload.adminCount,
      payload.agentCount,
    );

    return fetchSnapshot();
  },

  async updateCompany(companyId: string, payload: UpsertCompanyPayload): Promise<SuperAdminSnapshot> {
    await apiClient.patch(`/admin/companies/${companyId}`, {
      name: payload.name.trim(),
      legalName: payload.industry.trim() || null,
      email: payload.ownerEmail.trim().toLowerCase(),
      isActive: toBackendCompanyStatus(payload.lifecycleStatus) === "ACTIVE",
    });

    const existingSubscription = await resolveCompanySubscription(companyId);
    const subscriptionDates = toSubscriptionDates(payload);

    if (existingSubscription) {
      await apiClient.patch(`/admin/subscriptions/${existingSubscription.id}`, {
        plan: payload.plan,
        status: toBackendSubscriptionStatus(payload.subscriptionStatus),
        startDate: subscriptionDates.startDate,
        endDate: subscriptionDates.endDate,
        isActive: payload.subscriptionStatus === "ACTIVE",
      });
    } else {
      await apiClient.post("/admin/subscriptions", {
        companyId,
        plan: payload.plan,
        status: toBackendSubscriptionStatus(payload.subscriptionStatus),
        startDate: subscriptionDates.startDate,
        endDate: subscriptionDates.endDate,
        isActive: payload.subscriptionStatus === "ACTIVE",
      });
    }

    await ensurePrimaryOwner(
      companyId,
      payload.ownerName.trim(),
      payload.ownerEmail.trim().toLowerCase(),
    );

    await ensureMinimumUsers(companyId, payload.adminCount, payload.agentCount);

    return fetchSnapshot();
  },

  async deleteCompany(companyId: string): Promise<SuperAdminSnapshot> {
    await apiClient.delete(`/admin/companies/${companyId}`);
    return fetchSnapshot();
  },

  async updateSubscription(
    companyId: string,
    payload: Partial<
      Pick<
        SuperAdminCompany,
        "plan" | "subscriptionStatus" | "billingCycle" | "nextRenewalDate" | "lifecycleStatus" | "subscriptionDurationMonths"
      >
    >,
  ): Promise<SuperAdminSnapshot> {
    if (payload.lifecycleStatus) {
      await apiClient.patch(`/admin/companies/${companyId}/activation`, {
        isActive: payload.lifecycleStatus === "ACTIVE",
      });
    }

    const existingSubscription = await resolveCompanySubscription(companyId);
    const baseStartDate = existingSubscription?.startDate ? toDateOnly(existingSubscription.startDate) : todayDateOnly();
    const duration = payload.subscriptionDurationMonths ?? durationMonths(baseStartDate, existingSubscription?.endDate);
    const endDate = payload.nextRenewalDate ?? addMonths(baseStartDate, duration);

    if (existingSubscription) {
      await apiClient.patch(`/admin/subscriptions/${existingSubscription.id}`, {
        ...(payload.plan ? { plan: payload.plan } : {}),
        ...(payload.subscriptionStatus
          ? { status: toBackendSubscriptionStatus(payload.subscriptionStatus), isActive: payload.subscriptionStatus === "ACTIVE" }
          : {}),
        ...(payload.nextRenewalDate || payload.subscriptionDurationMonths
          ? { startDate: baseStartDate, endDate }
          : {}),
      });
    } else {
      await apiClient.post("/admin/subscriptions", {
        companyId,
        plan: payload.plan ?? "STANDARD",
        status: toBackendSubscriptionStatus(payload.subscriptionStatus ?? "ACTIVE"),
        startDate: baseStartDate,
        endDate,
        isActive: (payload.subscriptionStatus ?? "ACTIVE") === "ACTIVE",
      });
    }

    return fetchSnapshot();
  },

  async toggleSubscription(companyId: string, isEnabled: boolean): Promise<SuperAdminSnapshot> {
    const existingSubscription = await resolveCompanySubscription(companyId);
    const nextStatus: SubscriptionStatus = isEnabled ? "ACTIVE" : "SUSPENDED";

    if (existingSubscription) {
      await apiClient.patch(`/admin/subscriptions/${existingSubscription.id}/status`, {
        status: toBackendSubscriptionStatus(nextStatus),
        isActive: isEnabled,
      });
    } else {
      await apiClient.post("/admin/subscriptions", {
        companyId,
        plan: "STANDARD",
        status: toBackendSubscriptionStatus(nextStatus),
        startDate: todayDateOnly(),
        endDate: addMonths(todayDateOnly(), 1),
        isActive: isEnabled,
      });
    }

    return fetchSnapshot();
  },

  async addMember(companyId: string, payload: UpsertMemberPayload): Promise<SuperAdminSnapshot> {
    const names = splitFullName(payload.fullName);
    const created = await apiClient.post<BackendUser>("/admin/users", {
      companyId,
      firstName: names.firstName,
      lastName: names.lastName,
      email: payload.email.trim().toLowerCase(),
      password: DEFAULT_USER_PASSWORD,
      role: toBackendRole(payload.role),
    });

    if (payload.isActive === false) {
      await apiClient.patch(`/admin/users/${created.id}/activation`, { isActive: false });
    }

    return fetchSnapshot();
  },

  async updateMember(memberId: string, payload: Partial<UpsertMemberPayload>): Promise<SuperAdminSnapshot> {
    const names = payload.fullName ? splitFullName(payload.fullName) : null;

    await apiClient.patch(`/admin/users/${memberId}`, {
      ...(names ? { firstName: names.firstName, lastName: names.lastName } : {}),
      ...(payload.email !== undefined ? { email: payload.email.trim().toLowerCase() } : {}),
      ...(payload.role !== undefined ? { role: toBackendRole(payload.role) } : {}),
      ...(payload.isActive !== undefined ? { isActive: payload.isActive } : {}),
    });

    return fetchSnapshot();
  },

  async toggleMember(memberId: string, isActive: boolean): Promise<SuperAdminSnapshot> {
    await apiClient.patch(`/admin/users/${memberId}/activation`, { isActive });
    return fetchSnapshot();
  },

  async deleteMember(memberId: string): Promise<SuperAdminSnapshot> {
    await apiClient.delete(`/admin/users/${memberId}`);
    return fetchSnapshot();
  },

  async updateGlobalSettings(
    payload: Partial<{
      maintenanceMode: boolean;
      allowInvitations: boolean;
      defaultLanguage: string;
      supportEmail: string;
    }>,
  ): Promise<SuperAdminSnapshot> {
    await apiClient.patch("/admin/maintenance/platform-settings", {
      ...(payload.maintenanceMode !== undefined ? { maintenanceMode: payload.maintenanceMode } : {}),
      ...(payload.allowInvitations !== undefined ? { allowUserInvitations: payload.allowInvitations } : {}),
      ...(payload.defaultLanguage !== undefined ? { defaultLanguage: payload.defaultLanguage } : {}),
      ...(payload.supportEmail !== undefined ? { supportEmail: payload.supportEmail || null } : {}),
    });

    return fetchSnapshot();
  },

  async runMaintenance(): Promise<SuperAdminSnapshot> {
    await apiClient.get("/admin/maintenance/health");
    return fetchSnapshot();
  },

  async getCompanyRegistrationRequests(): Promise<CompanyRegistrationRequestItem[]> {
    const response = await apiClient.get<{
      items: BackendCompanyRegistrationRequest[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>("/admin/company-registration-requests?page=1&limit=200");

    return response.items.map(toRegistrationRequestItem);
  },

  async approveCompanyRegistrationRequest(id: string): Promise<void> {
    await apiClient.patch(`/admin/company-registration-requests/${id}/approve`, {
      companyStatus: "TRIAL",
    });
  },

  async rejectCompanyRegistrationRequest(
    id: string,
    rejectionReason?: string,
  ): Promise<void> {
    await apiClient.patch(`/admin/company-registration-requests/${id}/reject`, {
      rejectionReason: rejectionReason || undefined,
    });
  },

  async requestMoreInfoForCompanyRegistration(
    id: string,
    infoRequest: string,
  ): Promise<void> {
    await apiClient.patch(
      `/admin/company-registration-requests/${id}/needs-more-info`,
      { infoRequest },
    );
  },
};
