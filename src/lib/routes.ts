export const USER_ROLES = {
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  AGENT: "agent",
  VIEWER: "viewer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_CONVERSATIONS: "view_conversations",
  MANAGE_CONVERSATIONS: "manage_conversations",
  ASSIGN_CONVERSATIONS: "assign_conversations",
  HANDOFF_CONVERSATIONS: "handoff_conversations",
  REACTIVATE_BOT: "reactivate_bot",
  VIEW_CONTACTS: "view_contacts",
  MANAGE_CONTACTS: "manage_contacts",
  VIEW_KNOWLEDGE_BASE: "view_knowledge_base",
  MANAGE_KNOWLEDGE_BASE: "manage_knowledge_base",
  VIEW_ANALYTICS: "view_analytics",
  EXPORT_ANALYTICS: "export_analytics",
  VIEW_SETTINGS: "view_settings",
  MANAGE_SETTINGS: "manage_settings",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CONVERSATIONS,
    PERMISSIONS.MANAGE_CONVERSATIONS,
    PERMISSIONS.ASSIGN_CONVERSATIONS,
    PERMISSIONS.HANDOFF_CONVERSATIONS,
    PERMISSIONS.REACTIVATE_BOT,
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.MANAGE_CONTACTS,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
    PERMISSIONS.MANAGE_KNOWLEDGE_BASE,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_ANALYTICS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SETTINGS,
  ],

  [USER_ROLES.SUPERVISOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CONVERSATIONS,
    PERMISSIONS.MANAGE_CONVERSATIONS,
    PERMISSIONS.ASSIGN_CONVERSATIONS,
    PERMISSIONS.HANDOFF_CONVERSATIONS,
    PERMISSIONS.REACTIVATE_BOT,
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.MANAGE_CONTACTS,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
    PERMISSIONS.MANAGE_KNOWLEDGE_BASE,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_ANALYTICS,
    PERMISSIONS.VIEW_SETTINGS,
  ],

  [USER_ROLES.AGENT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CONVERSATIONS,
    PERMISSIONS.MANAGE_CONVERSATIONS,
    PERMISSIONS.HANDOFF_CONVERSATIONS,
    PERMISSIONS.REACTIVATE_BOT,
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
  ],

  [USER_ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CONVERSATIONS,
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
};

export function getPermissionsByRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(
  role: UserRole,
  permission: Permission
): boolean {
  return getPermissionsByRole(role).includes(permission);
}

export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  const rolePermissions = getPermissionsByRole(role);

  return permissions.some((permission) =>
    rolePermissions.includes(permission)
  );
}

export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  const rolePermissions = getPermissionsByRole(role);

  return permissions.every((permission) =>
    rolePermissions.includes(permission)
  );
}