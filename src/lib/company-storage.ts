"use client";

export type CompanyStatus = "Active" | "Inactive";
export type CompanyPlan = "Premium" | "Standard" | "Basic";

export type Company = {
  id: string;
  name: string;
  owner: string;
  email: string;
  plan: CompanyPlan;
  status: CompanyStatus;
  description: string;
  industry: string;
  createdAt: string;
  stats: {
    conversations: number;
    contacts: number;
    agents: number;
    satisfaction: string;
  };
  recentActivity: string[];
};

const STORAGE_KEY = "mock_companies";

const DEFAULT_COMPANIES: Company[] = [
  {
    id: "support-os",
    name: "Support OS",
    owner: "Emna Jawadi",
    email: "contact@supportos.com",
    plan: "Premium",
    status: "Active",
    description:
      "Plateforme de support client spécialisée dans la gestion des conversations et des interactions WhatsApp.",
    industry: "Customer Support",
    createdAt: "12 Jan 2026",
    stats: {
      conversations: 1280,
      contacts: 540,
      agents: 12,
      satisfaction: "94%",
    },
    recentActivity: [
      "12 nouvelles conversations aujourd’hui",
      "3 agents connectés actuellement",
      "Base de connaissances mise à jour",
      "Taux de satisfaction stable cette semaine",
    ],
  },
  {
    id: "client-bridge",
    name: "Client Bridge",
    owner: "Majdi Abbes",
    email: "hello@clientbridge.com",
    plan: "Standard",
    status: "Active",
    description:
      "Entreprise orientée relation client avec suivi des demandes et traitement multicanal.",
    industry: "CRM & Support",
    createdAt: "05 Feb 2026",
    stats: {
      conversations: 860,
      contacts: 310,
      agents: 8,
      satisfaction: "89%",
    },
    recentActivity: [
      "8 nouvelles conversations aujourd’hui",
      "2 tickets transférés au support avancé",
      "1 nouvel agent ajouté",
      "Performance stable sur 7 jours",
    ],
  },
  {
    id: "help-desk-pro",
    name: "Help Desk Pro",
    owner: "Sara Ben Ali",
    email: "admin@helpdeskpro.com",
    plan: "Basic",
    status: "Inactive",
    description:
      "Solution de support interne avec fonctionnalités de base pour petites équipes.",
    industry: "Internal Helpdesk",
    createdAt: "20 Mar 2026",
    stats: {
      conversations: 190,
      contacts: 95,
      agents: 3,
      satisfaction: "78%",
    },
    recentActivity: [
      "Aucune activité importante aujourd’hui",
      "Compte actuellement inactif",
      "Dernière connexion il y a 5 jours",
      "Plan Basic toujours actif côté abonnement",
    ],
  },
];

export function getStoredCompanies(): Company[] {
  if (typeof window === "undefined") {
    return DEFAULT_COMPANIES;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMPANIES));
    return DEFAULT_COMPANIES;
  }

  try {
    return JSON.parse(stored) as Company[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMPANIES));
    return DEFAULT_COMPANIES;
  }
}

export function saveStoredCompanies(companies: Company[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
}

export function getCompanyById(companyId: string): Company | null {
  const companies = getStoredCompanies();
  return companies.find((company) => company.id === companyId) ?? null;
}

export function updateCompany(
  companyId: string,
  payload: Pick<
    Company,
    "name" | "owner" | "email" | "plan" | "status" | "description" | "industry"
  >,
) {
  const companies = getStoredCompanies();

  const updatedCompanies = companies.map((company) =>
    company.id === companyId
      ? {
          ...company,
          name: payload.name.trim(),
          owner: payload.owner.trim(),
          email: payload.email.trim(),
          plan: payload.plan,
          status: payload.status,
          description: payload.description.trim(),
          industry: payload.industry.trim(),
        }
      : company,
  );

  saveStoredCompanies(updatedCompanies);

  return updatedCompanies.find((company) => company.id === companyId) ?? null;
}
export function deleteCompany(companyId: string): boolean {
  const companies = getStoredCompanies();
  const filteredCompanies = companies.filter((company) => company.id !== companyId);

  if (filteredCompanies.length === companies.length) {
    return false;
  }

  saveStoredCompanies(filteredCompanies);
  return true;
}