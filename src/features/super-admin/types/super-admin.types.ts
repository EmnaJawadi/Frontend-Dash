import type { UserRole } from "@/src/types/role";

export type SubscriptionPlan = "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE";
export type SubscriptionStatus = "ACTIVE" | "SUSPENDED" | "EXPIRED" | "CANCELED";
export type BillingCycle = "MONTHLY" | "YEARLY";
export type CompanyLifecycleStatus = "ACTIVE" | "INACTIVE";
export type TechnicalHealthStatus = "HEALTHY" | "WARNING" | "CRITICAL";
export type ManagedUserRole = Extract<UserRole, "OWNER" | "AGENT">;
export type CompanyRegistrationRequestStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_MORE_INFO";

export type SuperAdminNotificationPriority = "low" | "medium" | "high";

export interface SuperAdminNotificationItem {
  id: string;
  type: "COMPANY_REGISTRATION_REQUEST";
  title: string;
  message: string;
  priority: SuperAdminNotificationPriority;
  isRead: boolean;
  createdAt: string;
}

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

export interface CompanyRegistrationRequestItem {
  id: string;
  companyName: string;
  businessEmail: string;
  phoneNumber: string;
  responsibleFullName: string;
  requestedRole: "COMPANY_ADMIN";
  businessType: string;
  message?: string | null;
  status: CompanyRegistrationRequestStatus;
  rejectionReason?: string | null;
  infoRequest?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  approvedAt?: string | null;
  activationToken?: string | null;
  approvedCompanyId?: string | null;
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
