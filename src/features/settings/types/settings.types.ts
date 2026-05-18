export type ConnectionStatus = "connected" | "disconnected" | "pending";
export type IntegrationStatus = "healthy" | "warning" | "error";
export type ResponseTone = "professional" | "friendly" | "formal" | "concise";
export type SupportedLanguage = "fr" | "en" | "ar";

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
  responseTone: ResponseTone | string;
  language: SupportedLanguage | string;
  botGuidelines: string;
};

export type CompanyWorkflow = {
  enabled: boolean;
  defaultAssigneeId?: string | null;
  defaultAssignment: string;
  welcomeMessage: string;
  preHandoffMessage: string;
};

export type CompanyGeneral = {
  officialName: string;
  companyName: string;
  displayName?: string;
  supportEmail: string;
  supportPhone?: string;
  city?: string;
  country?: string;
  defaultLanguage: string;
  timezone: string;
  emailNotificationsEnabled: boolean;
  emailNotifications: boolean;
};

export type CompanyWhatsappProfile = {
  businessPhoneNumber: string;
  displayName: string;
  connectionStatus: ConnectionStatus;
};

export type CompanyWhatsappInstanceData = CompanyWhatsappProfile & {
  companyId: string;
  id: string | null;
  evolutionInstanceName: string;
  whatsappNumber: string;
  lastConnectionError: string | null;
  connectedAt: string | null;
  lastSyncAt: string | null;
  updatedAt: string | null;
};

export type CompanyWhatsappConfigData = {
  id: string | null;
  evolutionInstanceName: string;
  connectionStatus: ConnectionStatus;
  whatsappNumber: string;
  displayName: string;
  lastConnectionError: string | null;
  connectedAt: string | null;
  lastSyncAt: string | null;
  updatedAt: string | null;
  technicalConfigurationManagedByPlatform: boolean;
  sensitiveFieldsExposed: false;
  qrAvailable?: boolean;
};

export type CompanyWhatsappQrData = {
  status: ConnectionStatus;
  qrCode: string | null;
  pairingCode: string | null;
  checkedAt: string;
};

export type CompanyAiSettingsData = {
  enabled: boolean;
  handoffEnabled: boolean;
  responseTone: ResponseTone;
  language: SupportedLanguage;
  escalationDelayMinutes: number;
  botGuidelines: string;
  confidenceThresholdManagedByPlatform: boolean;
  technicalSettingsManagedByPlatform: boolean;
};

export type CompanyWorkflowSettingsData = {
  enabled: boolean;
  defaultAssigneeId: string | null;
  defaultAssignment: string;
  welcomeMessage: string;
  verificationMessage: string;
};

export type CompanyPreferencesData = {
  officialName: string;
  companyName: string;
  displayName: string;
  supportEmail: string;
  supportPhone: string;
  city: string;
  country: string;
  defaultLanguage: SupportedLanguage;
  timezone: string;
  emailNotificationsEnabled: boolean;
  emailNotifications: boolean;
  visibleOnlyForCompany: boolean;
};

export type CompanySupportAssigneeData = {
  id: string;
  label: string;
  email: string;
  role: string;
  type: "agent";
};

export type CompanyAdminSettingsData = {
  whatsapp: CompanyWhatsappConfigData | null;
  aiSettings: CompanyAiSettingsData | null;
  workflowSettings: CompanyWorkflowSettingsData | null;
  preferences: CompanyPreferencesData;
  supportAssignees: CompanySupportAssigneeData[];
};

export type UpdateCompanyWhatsappInstancePayload = Partial<{
  evolutionInstanceName: string;
  businessPhoneNumber: string;
  whatsappNumber: string;
  displayName: string;
}>;

export type TestWhatsappConnectionResult = {
  companyId: string;
  ok: boolean;
  code:
    | "CONNECTION_SUCCESS"
    | "INSTANCE_NOT_FOUND"
    | "INVALID_API_KEY"
    | "EVOLUTION_UNREACHABLE"
    | "CONFIGURATION_INCOMPLETE"
    | "INSTANCE_NOT_CONNECTED";
  status: ConnectionStatus;
  message: string;
  checkedAt: string;
};

export type UpdateCompanyPreferencesPayload = Partial<{
  officialName: string;
  displayName: string;
  supportEmail: string;
  supportPhone: string;
  city: string;
  country: string;
  defaultLanguage: SupportedLanguage;
  timezone: string;
  emailNotificationsEnabled: boolean;
  emailNotifications: boolean;
}>;

export type UpdateCompanyAiSettingsPayload = Partial<{
  enabled: boolean;
  handoffEnabled: boolean;
  responseTone: ResponseTone;
  language: SupportedLanguage;
  escalationDelayMinutes: number;
  botGuidelines: string;
}>;

export type UpdateCompanyWorkflowSettingsPayload = Partial<{
  enabled: boolean;
  defaultAssigneeId: string | null;
  welcomeMessage: string;
  verificationMessage: string;
}>;

export type CompanyWhatsappConnectPayload = Partial<{
  evolutionInstanceName: string;
}>;

export type CompanyWhatsappTechnicalSettings = {
  webhookUrl: string;
  verifyToken: string;
  verifyWebhookSignature: boolean;
  notificationsEnabled: boolean;
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
    | "evolution_api"
    | "gemini_ai"
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
