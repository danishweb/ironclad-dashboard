export type User = { id: string; email: string; displayName: string | null; status: string; createdAt: string; updatedAt: string }
export type ProviderLink = { id: string; provider: string; providerSub: string; userId: string; email: string | null; createdAt: string }
export type Org = { id: string; code: string; name: string; parentId: string | null; status: string }
export type App = { id: string; code: string; name: string; status: string }
export type AppOrg = { id: string; appId: string; orgId: string; status: string }
export type Role = { id: string; appId: string; code: string; name: string; isDefault: boolean; isSensitive: boolean }
export type Privilege = { id: string; appId: string; code: string; name: string }
export type RolePrivilege = { roleId: string; privilegeId: string }
export type Membership = { id: string; userId: string; appOrgId: string; roleId: string; status: string; createdAt: string }
export type OrgUnit = { id: string; appOrgId: string; code: string; name: string; status: string }

export type DashboardStats = { totalApps: number; totalOrgs: number; totalUsers: number; activeMemberships: number }
