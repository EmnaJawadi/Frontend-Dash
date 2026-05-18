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

export const mockCompanies: Company[] = [];

export function getCompanyById(companyId: string): Company | undefined {
  return mockCompanies.find((company) => company.id === companyId);
}
