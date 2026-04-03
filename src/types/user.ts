import type { UserRole } from "./role";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  companyId?: string;
  companyName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  fullName: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: UserRole;
  isActive?: boolean;
  companyId?: string;
  companyName?: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Emna",
    lastName: "Jawadi",
    email: "owner@company.com",
    role: "OWNER",
    isActive: true,
    companyId: "company-1",
    companyName: "Support OS",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    firstName: "Majdi",
    lastName: "Abbes",
    email: "agent@company.com",
    role: "AGENT",
    isActive: true,
    companyId: "company-1",
    companyName: "Support OS",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    firstName: "Platform",
    lastName: "Admin",
    email: "admin@platform.com",
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export function getFullName(user: Pick<User, "firstName" | "lastName">): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function toUserProfile(user: User): UserProfile {
  return {
    ...user,
    fullName: getFullName(user),
  };
}