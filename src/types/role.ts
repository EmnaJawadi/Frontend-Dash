export type UserRole = "OWNER" | "AGENT";

export const USER_ROLES: UserRole[] = ["OWNER", "AGENT"];

export const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: "Admin entreprise",
  AGENT: "Agent",
};

export function isOwner(role: UserRole): boolean {
  return role === "OWNER";
}

export function isAgent(role: UserRole): boolean {
  return role === "AGENT";
}
