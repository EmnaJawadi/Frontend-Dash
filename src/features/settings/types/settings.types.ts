export type ConnectionStatus = "connected" | "disconnected";

export type BusinessHoursDay = {
  day: string;
  start: string;
  end: string;
  active: boolean;
};

export type BusinessHours = {
  enabled: boolean;
  timezone: string;
  days: BusinessHoursDay[];
  autoReplyOutsideHours: boolean;
  outOfHoursMessage: string;
};

export type AiPolicy = {
  enabled: boolean;
  handoffEnabled: boolean;
  confidenceThreshold: number;
  handoffThreshold: number;
  escalationDelayMinutes: number;
  responseTone: string;
  language: string;
  systemInstruction: string;
};

export type WhatsappPolicy = {
  businessPhoneNumber: string;
  displayName: string;
  webhookUrl: string;
  verifyToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  notificationsEnabled: boolean;
  connectionStatus: ConnectionStatus;
  sessionWindowHours: number;
  allowTemplatesOutsideWindow: boolean;
  defaultCountryCode: string;
  verifyWebhookSignature: boolean;
};

export type WorkflowPolicy = {
  enabled: boolean;
  primaryTag: string;
  defaultAgent: string;
  welcomeMessage: string;
  preHandoffMessage: string;
};

export type GeneralSettings = {
  companyName: string;
  supportEmail: string;
  defaultLanguage: string;
  timezone: string;
  emailNotifications: boolean;
  secureMode: boolean;
};

export type SettingsData = {
  id: string;
  businessHours: BusinessHours;
  aiPolicy: AiPolicy;
  whatsappPolicy: WhatsappPolicy;
  workflow: WorkflowPolicy;
  general: GeneralSettings;
  updatedAt: string;
};

export type UpdateSettingsPayload = Partial<{
  businessHours: Partial<BusinessHours>;
  aiPolicy: Partial<AiPolicy>;
  whatsappPolicy: Partial<WhatsappPolicy>;
  workflow: Partial<WorkflowPolicy>;
  general: Partial<GeneralSettings>;
}>;
