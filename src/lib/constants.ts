export const APP_NAME = "WhatsApp Support Dashboard";

export const DEFAULT_LOCALE = "fr-FR";
export const DEFAULT_CURRENCY = "TND";
export const DEFAULT_TIMEZONE = "Africa/Tunis";

export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export const SEARCH_DEBOUNCE_DELAY = 400;
export const TOAST_DURATION = 3000;

export const CONVERSATION_STATUS = {
  BOT_ACTIVE: "bot_active",
  HUMAN_ASSIGNED: "human_assigned",
  WAITING_CUSTOMER: "waiting_customer",
  CLOSED: "closed",
} as const;

export const CONVERSATION_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const MESSAGE_SENDER_TYPE = {
  CUSTOMER: "customer",
  BOT: "bot",
  AGENT: "agent",
  SYSTEM: "system",
} as const;

export const MESSAGE_DIRECTION = {
  INBOUND: "inbound",
  OUTBOUND: "outbound",
} as const;

export const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
  AUDIO: "audio",
  SYSTEM: "system",
} as const;

export const MESSAGE_STATUS = {
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
} as const;

export const ANALYTICS_PERIODS = [
  { label: "Aujourd’hui", value: "today" },
  { label: "7 jours", value: "7d" },
  { label: "30 jours", value: "30d" },
  { label: "90 jours", value: "90d" },
] as const;

export const CHANNEL_OPTIONS = [
  { label: "Tous les canaux", value: "all" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Bot", value: "bot" },
  { label: "Agent humain", value: "human" },
] as const;

export const BOT_CONFIDENCE_THRESHOLDS = {
  LOW: 0.4,
  MEDIUM: 0.7,
  HIGH: 0.9,
} as const;

export const STATUS_LABELS = {
  [CONVERSATION_STATUS.BOT_ACTIVE]: "Bot actif",
  [CONVERSATION_STATUS.HUMAN_ASSIGNED]: "Agent assigné",
  [CONVERSATION_STATUS.WAITING_CUSTOMER]: "En attente client",
  [CONVERSATION_STATUS.CLOSED]: "Clôturée",
} as const;

export const PRIORITY_LABELS = {
  [CONVERSATION_PRIORITY.LOW]: "Faible",
  [CONVERSATION_PRIORITY.MEDIUM]: "Moyenne",
  [CONVERSATION_PRIORITY.HIGH]: "Élevée",
} as const;

export const EMPTY_STATE_MESSAGES = {
  conversations: "Aucune conversation trouvée.",
  contacts: "Aucun contact trouvé.",
  analytics: "Aucune donnée disponible.",
  knowledgeBase: "Aucun article disponible.",
} as const;