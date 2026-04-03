export interface Company {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  industry?: string;
  size?: number;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCompanyPayload {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  industry?: string;
  size?: number;
  logo?: string;
}

export interface UpdateCompanyPayload {
  name?: string;
  slug?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  industry?: string;
  size?: number;
  logo?: string;
  isActive?: boolean;
}

export const mockCompanies: Company[] = [
  {
    id: "company-1",
    name: "Support OS",
    slug: "support-os",
    email: "contact@supportos.com",
    phone: "+216 00 000 000",
    address: "Tunis, Tunisia",
    website: "https://supportos.com",
    industry: "Customer Support",
    size: 12,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "company-2",
    name: "Frontend Dash",
    slug: "frontend-dash",
    email: "hello@frontenddash.com",
    phone: "+216 11 111 111",
    address: "Sousse, Tunisia",
    website: "https://frontenddash.com",
    industry: "SaaS",
    size: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export function getCompanyById(companyId: string): Company | undefined {
  return mockCompanies.find((company) => company.id === companyId);
}