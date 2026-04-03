export type UserRole = "OWNER" | "AGENT" | "SUPER_ADMIN";

export const USER_ROLES: UserRole[] = ["OWNER", "AGENT", "SUPER_ADMIN"];

export const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: "Owner",
  AGENT: "Agent",
  SUPER_ADMIN: "Super Admin",
};

export function isOwner(role: UserRole): boolean {
  return role === "OWNER";
}

export function isAgent(role: UserRole): boolean {
  return role === "AGENT";
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === "SUPER_ADMIN";
}