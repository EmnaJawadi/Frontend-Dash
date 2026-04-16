export type UserRole = "SUPER_ADMIN" | "OWNER" | "AGENT";

export const USER_ROLES: UserRole[] = ["SUPER_ADMIN", "OWNER", "AGENT"];

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  OWNER: "Admin entreprise",
  AGENT: "Agent",
};

export function isSuperAdmin(role: UserRole): boolean {
  return role === "SUPER_ADMIN";
}

export function isOwner(role: UserRole): boolean {
  return role === "OWNER";
}

export function isAgent(role: UserRole): boolean {
  return role === "AGENT";
}
