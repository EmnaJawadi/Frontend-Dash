import type { UserRole } from "@/src/types/role";

export type SubscriptionPlan = "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE";
export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "OVERDUE" | "CANCELED";
export type BillingCycle = "MONTHLY" | "YEARLY";
export type CompanyLifecycleStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type TechnicalHealthStatus = "HEALTHY" | "WARNING" | "CRITICAL";
export type ManagedUserRole = Extract<UserRole, "OWNER" | "AGENT">;

export interface SuperAdminCompany {
  id: string;
  name: string;
  industry: string;
  ownerName: string;
  ownerEmail: string;
  adminCount: number;
  agentCount: number;
  lifecycleStatus: CompanyLifecycleStatus;
  plan: SubscriptionPlan;
  subscriptionDurationMonths: number;
  subscriptionStatus: SubscriptionStatus;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
  botHealthScore: number;
  createdAt: string;
}

export interface SuperAdminMember {
  id: string;
  companyId: string;
  fullName: string;
  email: string;
  role: ManagedUserRole;
  isActive: boolean;
}

export interface MaintenanceServiceCheck {
  key: string;
  label: string;
  status: TechnicalHealthStatus;
  message: string;
}

export interface MaintenanceReport {
  checkedAt: string;
  appVersion: string;
  apiLatencyMs: number;
  queueBacklog: number;
  botSuccessRate: number;
  services: MaintenanceServiceCheck[];
}

export interface SuperAdminSnapshot {
  companies: SuperAdminCompany[];
  members: SuperAdminMember[];
  maintenance: MaintenanceReport;
  globalSettings: {
    maintenanceMode: boolean;
    allowInvitations: boolean;
    defaultLanguage: string;
    supportEmail: string;
  };
  auditLogs: Array<{
    id: string;
    action: string;
    target: string;
    createdAt: string;
  }>;
}

export type UpsertCompanyPayload = Omit<
  SuperAdminCompany,
  "id" | "createdAt" | "botHealthScore"
>;

export type UpsertMemberPayload = {
  fullName: string;
  email: string;
  role: ManagedUserRole;
  isActive?: boolean;
};
