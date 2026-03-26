import { z } from "zod";

export const conversationStatusSchema = z.enum([
  "bot_active",
  "human_assigned",
  "waiting_customer",
  "closed",
]);

export const conversationPrioritySchema = z.enum([
  "low",
  "medium",
  "high",
]);

export const conversationTagSchema = z.object({
  id: z.string().min(1, "L'identifiant du tag est requis."),
  label: z.string().min(1, "Le libellé du tag est requis."),
});

export const conversationListItemSchema = z.object({
  id: z.string().min(1, "L'identifiant de la conversation est requis."),
  contactName: z
    .string()
    .min(1, "Le nom du contact est requis.")
    .max(100, "Le nom du contact est trop long."),
  phone: z
    .string()
    .min(8, "Le numéro de téléphone est invalide.")
    .max(20, "Le numéro de téléphone est trop long."),
  lastMessage: z
    .string()
    .min(1, "Le dernier message est requis.")
    .max(1000, "Le dernier message est trop long."),
  lastMessageAt: z
    .string()
    .datetime("La date du dernier message est invalide."),
  status: conversationStatusSchema,
  priority: conversationPrioritySchema,
  unreadCount: z
    .number()
    .int("Le nombre de messages non lus doit être un entier.")
    .min(0, "Le nombre de messages non lus ne peut pas être négatif."),
  tags: z.array(conversationTagSchema).default([]),
  assignedAgent: z
    .string()
    .max(100, "Le nom de l'agent est trop long.")
    .nullable(),
  botActive: z.boolean(),
});

export const conversationContactSchema = z.object({
  id: z.string().min(1, "L'identifiant du contact est requis."),
  name: z
    .string()
    .min(1, "Le nom du contact est requis.")
    .max(100, "Le nom du contact est trop long."),
  phone: z
    .string()
    .min(8, "Le numéro de téléphone est invalide.")
    .max(20, "Le numéro de téléphone est trop long."),
  email: z
    .string()
    .email("L'adresse e-mail est invalide.")
    .max(255, "L'adresse e-mail est trop longue.")
    .nullable()
    .optional(),
  language: z
    .string()
    .max(50, "La langue est trop longue.")
    .nullable()
    .optional(),
  location: z
    .string()
    .max(100, "La localisation est trop longue.")
    .nullable()
    .optional(),
});

export const conversationMessageSenderTypeSchema = z.enum([
  "customer",
  "bot",
  "agent",
  "system",
]);

export const conversationMessageDirectionSchema = z.enum([
  "inbound",
  "outbound",
]);

export const conversationMessageTypeSchema = z.enum([
  "text",
  "image",
  "file",
  "audio",
  "system",
]);

export const conversationMessageStatusSchema = z.enum([
  "sent",
  "delivered",
  "read",
]);

export const conversationMessageSchema = z.object({
  id: z.string().min(1, "L'identifiant du message est requis."),
  conversationId: z
    .string()
    .min(1, "L'identifiant de la conversation est requis."),
  senderType: conversationMessageSenderTypeSchema,
  direction: conversationMessageDirectionSchema,
  type: conversationMessageTypeSchema,
  content: z
    .string()
    .min(1, "Le contenu du message est requis.")
    .max(5000, "Le contenu du message est trop long."),
  timestamp: z.string().datetime("La date du message est invalide."),
  status: conversationMessageStatusSchema.optional(),
});

export const conversationActivitySchema = z.object({
  assignedAgent: z
    .string()
    .max(100, "Le nom de l'agent est trop long.")
    .nullable(),
  handoffRequired: z.boolean(),
  botActive: z.boolean(),
  lastBotMessageAt: z
    .string()
    .datetime("La date du dernier message bot est invalide.")
    .nullable()
    .optional(),
  lastAgentReplyAt: z
    .string()
    .datetime("La date de la dernière réponse agent est invalide.")
    .nullable()
    .optional(),
});

export const conversationDetailsSchema = z.object({
  id: z.string().min(1, "L'identifiant de la conversation est requis."),
  status: conversationStatusSchema,
  priority: conversationPrioritySchema,
  contact: conversationContactSchema,
  tags: z.array(conversationTagSchema).default([]),
  notes: z
    .string()
    .max(2000, "Les notes sont trop longues.")
    .nullable()
    .optional(),
  createdAt: z.string().datetime("La date de création est invalide."),
  updatedAt: z.string().datetime("La date de mise à jour est invalide."),
  activity: conversationActivitySchema,
  messages: z.array(conversationMessageSchema).default([]),
});

export const conversationFiltersSchema = z.object({
  search: z.string().max(200).optional().default(""),
  status: z.union([conversationStatusSchema, z.literal("")]).optional().default(""),
  priority: z
    .union([conversationPrioritySchema, z.literal("")])
    .optional()
    .default(""),
  assignedAgent: z.string().max(100).optional().default(""),
  tag: z.string().max(100).optional().default(""),
});

export const conversationsListSchema = z.array(conversationListItemSchema);

export const conversationDetailsRecordSchema = z.record(
  z.string(),
  conversationDetailsSchema
);

export type ConversationStatus = z.infer<typeof conversationStatusSchema>;
export type ConversationPriority = z.infer<typeof conversationPrioritySchema>;
export type ConversationTag = z.infer<typeof conversationTagSchema>;
export type ConversationListItem = z.infer<typeof conversationListItemSchema>;
export type ConversationContact = z.infer<typeof conversationContactSchema>;
export type ConversationMessageSenderType = z.infer<
  typeof conversationMessageSenderTypeSchema
>;
export type ConversationMessageDirection = z.infer<
  typeof conversationMessageDirectionSchema
>;
export type ConversationMessageType = z.infer<
  typeof conversationMessageTypeSchema
>;
export type ConversationMessageStatus = z.infer<
  typeof conversationMessageStatusSchema
>;
export type ConversationMessage = z.infer<typeof conversationMessageSchema>;
export type ConversationActivity = z.infer<typeof conversationActivitySchema>;
export type ConversationDetails = z.infer<typeof conversationDetailsSchema>;
export type ConversationFilters = z.infer<typeof conversationFiltersSchema>;