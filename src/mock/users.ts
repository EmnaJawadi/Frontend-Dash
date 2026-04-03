import type { AuthUser } from "@/src/types/auth";

export type MockAuthUser = AuthUser & {
  password: string;
  isActive: boolean;
};

export const MOCK_USERS: MockAuthUser[] = [
  {
    id: "super-admin-1",
    firstName: "Emna",
    lastName: "Admin",
    email: "emna.admin@test.com",
    password: "123456",
    role: "SUPER_ADMIN",
    isActive: true,
  },
  {
    id: "super-admin-2",
    firstName: "Maryem",
    lastName: "Admin",
    email: "maryem.admin@test.com",
    password: "123456",
    role: "SUPER_ADMIN",
    isActive: true,
  },
  {
    id: "owner-1",
    firstName: "Emna",
    lastName: "Owner",
    email: "emna.owner@test.com",
    password: "123456",
    role: "OWNER",
    companyId: "company-1",
    companyName: "Support OS",
    isActive: true,
  },
  {
    id: "agent-1",
    firstName: "Maryem",
    lastName: "Support",
    email: "maryem.agent@test.com",
    password: "123456",
    role: "AGENT",
    companyId: "company-1",
    companyName: "Support OS",
    isActive: true,
  },
  {
    id: "agent-2",
    firstName: "Test",
    lastName: "Agent",
    email: "agent@test.com",
    password: "123456",
    role: "AGENT",
    companyId: "company-1",
    companyName: "Support OS",
    isActive: true,
  },
];