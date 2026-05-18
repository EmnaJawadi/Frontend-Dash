import type { UserRole } from "@/src/types/role";

export type CompanySettingsCardId =
  | "companyInfo"
  | "preferences"
  | "whatsapp"
  | "ai"
  | "workflow";

export type CompanySettingsCardPermission = {
  id: CompanySettingsCardId;
  title: string;
  allowedRoles: UserRole[];
};

export const COMPANY_SETTINGS_CARDS: CompanySettingsCardPermission[] = [
  {
    id: "companyInfo",
    title: "Informations entreprise",
    allowedRoles: ["OWNER"],
  },
  {
    id: "preferences",
    title: "Preferences entreprise",
    allowedRoles: ["OWNER"],
  },
  {
    id: "whatsapp",
    title: "Connexion WhatsApp",
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    id: "ai",
    title: "Assistant IA",
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    id: "workflow",
    title: "Workflow automatique",
    allowedRoles: ["SUPER_ADMIN"],
  },
];

export function getAllowedCompanySettingsCards(role: UserRole | null) {
  if (!role) return [];

  return COMPANY_SETTINGS_CARDS.filter((card) =>
    card.allowedRoles.includes(role),
  );
}

export function canAccessCompanySettingsCard(
  role: UserRole | null,
  cardId: CompanySettingsCardId,
) {
  if (!role) return false;

  return (
    COMPANY_SETTINGS_CARDS.find((card) => card.id === cardId)?.allowedRoles.includes(
      role,
    ) ?? false
  );
}
