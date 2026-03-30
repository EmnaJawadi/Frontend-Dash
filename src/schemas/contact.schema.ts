import { z } from "zod";

export const contactStatusSchema = z.enum(["active", "inactive", "blocked"]);

export const contactSourceSchema = z.enum(["whatsapp", "manual", "import"]);

export const contactSegmentSchema = z.enum([
  "vip",
  "lead",
  "customer",
  "inactive",
]);

export const contactLanguageSchema = z.enum(["fr", "ar", "en"]);

export const contactTagSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(50),
});

export const contactListItemSchema = z.object({
  id: z.string().min(1),
  fullName: z.string().min(1).max(100),
  phone: z.string().min(8).max(20),
  email: z.string().email().nullable().optional(),
  city: z.string().min(1).max(100).nullable().optional(),
  language: contactLanguageSchema.nullable().optional(),
  status: contactStatusSchema,
  source: contactSourceSchema,
  segment: contactSegmentSchema,
  tags: z.array(contactTagSchema).default([]),
  notesCount: z.number().int().min(0),
  conversationsCount: z.number().int().min(0),
  lastConversationAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
});

export const contactActivitySchema = z.object({
  notesCount: z.number().int().min(0),
  conversationsCount: z.number().int().min(0),
  lastConversationAt: z.string().datetime().nullable().optional(),
});

export const contactDetailsSchema = z.object({
  id: z.string().min(1),
  fullName: z.string().min(1).max(100),
  phone: z.string().min(8).max(20),
  email: z.string().email().nullable().optional(),
  city: z.string().min(1).max(100).nullable().optional(),
  language: contactLanguageSchema.nullable().optional(),
  status: contactStatusSchema,
  source: contactSourceSchema,
  segment: contactSegmentSchema,
  tags: z.array(contactTagSchema).default([]),
  activity: contactActivitySchema,
  createdAt: z.string().datetime(),
});

export const contactFiltersSchema = z.object({
  search: z.string().default(""),
  status: z.union([contactStatusSchema, z.literal("all")]).default("all"),
  segment: z.union([contactSegmentSchema, z.literal("all")]).default("all"),
  source: z.union([contactSourceSchema, z.literal("all")]).default("all"),
  tag: z.string().default("all"),
  sortBy: z
    .enum(["recent", "oldest", "most-conversations", "most-notes"])
    .default("recent"),
});

export const contactsListSchema = z.array(contactListItemSchema);

export const contactDetailsRecordSchema = z.record(
  z.string(),
  contactDetailsSchema
);

export type ContactStatus = z.infer<typeof contactStatusSchema>;
export type ContactSource = z.infer<typeof contactSourceSchema>;
export type ContactSegment = z.infer<typeof contactSegmentSchema>;
export type ContactLanguage = z.infer<typeof contactLanguageSchema>;
export type ContactTag = z.infer<typeof contactTagSchema>;
export type ContactListItem = z.infer<typeof contactListItemSchema>;
export type ContactActivity = z.infer<typeof contactActivitySchema>;
export type ContactDetails = z.infer<typeof contactDetailsSchema>;
export type ContactFilters = z.infer<typeof contactFiltersSchema>;
export type ContactsList = z.infer<typeof contactsListSchema>;
export type ContactDetailsRecord = z.infer<typeof contactDetailsRecordSchema>;