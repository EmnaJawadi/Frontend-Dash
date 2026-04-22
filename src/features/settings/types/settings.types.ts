export type ConnectionStatus = "connected" | "disconnected";
export type IntegrationStatus = "healthy" | "warning" | "error";

export type BusinessHoursDay = {
  day: string;
  start: string;
  end: string;
  active: boolean;
};

export type CompanyBusinessHours = {
  enabled: boolean;
  timezone: string;
  days: BusinessHoursDay[];
  autoReplyOutsideHours: boolean;
  outOfHoursMessage: string;
};

export type CompanyAiPolicy = {
  enabled: boolean;
  handoffEnabled: boolean;
  confidenceThreshold: number;
  escalationDelayMinutes: number;
  responseTone: string;
  language: string;
  botGuidelines: string;
};

export type CompanyWorkflow = {
  enabled: boolean;
  defaultAssignment: string;
  welcomeMessage: string;
  preHandoffMessage: string;
};

export type CompanyGeneral = {
  companyName: string;
  supportEmail: string;
  defaultLanguage: string;
  timezone: string;
  emailNotifications: boolean;
};

export type CompanyWhatsappProfile = {
  businessPhoneNumber: string;
  displayName: string;
  connectionStatus: ConnectionStatus;
  phoneNumberId: string;
  businessAccountId: string;
};

export type CompanyWhatsappTechnicalSettings = {
  webhookUrl: string;
  verifyToken: string;
  verifyWebhookSignature: boolean;
  notificationsEnabled: boolean;
  sessionWindowHours: number;
  allowTemplatesOutsideWindow: boolean;
  defaultCountryCode: string;
};

export type CompanySettingsData = {
  companyId: string;
  updatedAt: string;
  businessHours: CompanyBusinessHours;
  aiPolicy: CompanyAiPolicy;
  workflow: CompanyWorkflow;
  general: CompanyGeneral;
  whatsappProfile: CompanyWhatsappProfile;
  readonly: {
    confidenceThreshold: boolean;
  };
  adminOnly?: {
    workflow: {
      primaryTag: string;
    };
    general: {
      secureMode: boolean;
    };
    whatsappTechnicalSettings: CompanyWhatsappTechnicalSettings;
  };
};

export type PlatformConfigurationSettings = {
  maintenanceMode: boolean;
  allowInvitations: boolean;
  defaultLanguage: string;
  platformTimezone: string;
  supportEmail: string;
  companySignupPolicy: "open" | "invite_only" | "closed";
  manualCompanyValidation: boolean;
};

export type PlatformSecuritySettings = {
  enforceAdmin2fa: boolean;
  adminSessionDurationMinutes: number;
  maxLoginAttempts: number;
  lockDurationMinutes: number;
  allowPasswordReset: boolean;
  securityAlertEmail: string;
};

export type PlatformAiGlobalSettings = {
  provider: "Google Gemini";
  model: "gemini-2.5-flash";
  confidenceThreshold: number;
  timeoutMs: number;
  maxTokens: number;
  logsEnabled: boolean;
  maskSensitiveDataInLogs: boolean;
  systemPrompt: string;
  humanFallbackEnabled: boolean;
};

export type PlatformSettings = {
  id: string;
  key: string;
  configuration: PlatformConfigurationSettings;
  security: PlatformSecuritySettings;
  aiGlobal: PlatformAiGlobalSettings;
  updatedAt: string;
};

export type PlatformIntegration = {
  key:
    | "backend_api"
    | "postgresql"
    | "redis"
    | "n8n"
    | "smtp"
    | "whatsapp_meta"
    | "file_storage"
    | "queue_jobs";
  label: string;
  status: IntegrationStatus;
  lastCheck: string;
  message: string;
};

export type PlatformSupervisionSnapshot = {
  apiLatencyMs: number;
  queueBacklog: number;
  uptimePercent: number;
  globalBotSuccessRate: number;
  recentErrorsCount: number;
  lastCriticalError: string | null;
  services: Array<{
    key: string;
    label: string;
    status: IntegrationStatus;
    message: string;
  }>;
};

export type PlatformSteeringSnapshot = {
  totalCompanies: number;
  activeCompanies: number;
  activeUsers: number;
  activeAgents: number;
  globalConversations: number;
  globalAutomationRate: number;
  globalHandoffRate: number;
  subscriptionsExpiringSoon: number;
  criticalAlerts: number;
};

export type PlatformAuditLogItem = {
  id: string;
  createdAt: string;
  action: string;
  entity: string;
  entityId: string | null;
  userId: string | null;
};

export type PlatformSettingsData = {
  settings: PlatformSettings;
  integrations: PlatformIntegration[];
  supervision: PlatformSupervisionSnapshot;
  steering: PlatformSteeringSnapshot;
  auditLogs: {
    data: PlatformAuditLogItem[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PlatformAuditFilters = {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  action?: string;
  entity?: string;
  userId?: string;
};

export type UpdatePlatformSettingsPayload = Partial<{
  configuration: Partial<PlatformConfigurationSettings>;
  security: Partial<PlatformSecuritySettings>;
  aiGlobal: Partial<PlatformAiGlobalSettings>;
}>;

export type UpdateCompanySettingsPayload = Partial<{
  businessHours: Partial<CompanyBusinessHours>;
  aiPolicy: Partial<
    Omit<CompanyAiPolicy, "confidenceThreshold"> & {
      confidenceThreshold?: never;
    }
  >;
  workflow: Partial<CompanyWorkflow>;
  general: Partial<CompanyGeneral>;
  whatsappProfile: Partial<CompanyWhatsappProfile>;
}>;

export type UpdateCompanyAdminSettingsPayload = {
  companyId: string;
  aiPolicy?: Partial<Pick<CompanyAiPolicy, "confidenceThreshold">>;
  workflow?: {
    primaryTag?: string;
  };
  general?: {
    secureMode?: boolean;
  };
  whatsappTechnicalSettings?: Partial<CompanyWhatsappTechnicalSettings>;
};

export type AgentSettingsSummaryData = {
  companyId: string;
  companyName: string;
  botEnabled: boolean;
  handoffEnabled: boolean;
  supportHoursEnabled: boolean;
  supportHoursTimezone: string;
  businessHours: BusinessHoursDay[];
  defaultLanguage: string;
  defaultAssignment: string;
};
