import { App, AppOrg, Membership, Org, Privilege, ProviderLink, Role, RolePrivilege, User } from './api/types';

const now = new Date().toISOString();

export const mockOrgs: Org[] = [
  { id: 'org_1', code: 'acme-corp', name: 'Acme Corp', parentId: null, status: 'active' },
  { id: 'org_2', code: 'globex-inc', name: 'Globex Inc', parentId: null, status: 'active' },
  { id: 'org_3', code: 'initech', name: 'Initech', parentId: 'org_1', status: 'active' },
];

export const mockApps: App[] = [
  { id: 'app_1', code: 'billing', name: 'Billing', status: 'active' },
  { id: 'app_2', code: 'analytics', name: 'Analytics', status: 'active' },
];

export const mockAppOrgs: AppOrg[] = [
  { id: 'ao_1', appId: 'app_1', orgId: 'org_1', status: 'active' }, // Billing -> Acme
  { id: 'ao_2', appId: 'app_1', orgId: 'org_2', status: 'active' }, // Billing -> Globex
  { id: 'ao_3', appId: 'app_2', orgId: 'org_1', status: 'active' }, // Analytics -> Acme
  { id: 'ao_4', appId: 'app_2', orgId: 'org_3', status: 'active' }, // Analytics -> Initech
];

export const mockRoles: Role[] = [
  { id: 'role_1', appId: 'app_1', code: 'admin', name: 'Administrator', isDefault: false, isSensitive: true },
  { id: 'role_2', appId: 'app_1', code: 'analyst', name: 'Analyst', isDefault: false, isSensitive: false },
  { id: 'role_3', appId: 'app_1', code: 'viewer', name: 'Viewer', isDefault: true, isSensitive: false },
  { id: 'role_4', appId: 'app_2', code: 'admin', name: 'Administrator', isDefault: false, isSensitive: true },
  { id: 'role_5', appId: 'app_2', code: 'viewer', name: 'Viewer', isDefault: true, isSensitive: false },
  { id: 'role_6', appId: 'app_2', code: 'data-engineer', name: 'Data Engineer', isDefault: false, isSensitive: true },
];

export const mockPrivileges: Privilege[] = [
  { id: 'priv_1', appId: 'app_1', code: 'read:reports', name: 'Read Reports' },
  { id: 'priv_2', appId: 'app_1', code: 'write:invoices', name: 'Write Invoices' },
  { id: 'priv_3', appId: 'app_1', code: 'manage:users', name: 'Manage Users' },
  { id: 'priv_4', appId: 'app_1', code: 'view:dashboard', name: 'View Dashboard' },
  { id: 'priv_5', appId: 'app_2', code: 'read:analytics', name: 'Read Analytics' },
  { id: 'priv_6', appId: 'app_2', code: 'write:queries', name: 'Write Queries' },
  { id: 'priv_7', appId: 'app_2', code: 'manage:pipelines', name: 'Manage Pipelines' },
  { id: 'priv_8', appId: 'app_2', code: 'view:dashboard', name: 'View Dashboard' },
];

export const mockRolePrivileges: RolePrivilege[] = [
  // Billing Admin gets all
  { roleId: 'role_1', privilegeId: 'priv_1' }, { roleId: 'role_1', privilegeId: 'priv_2' }, { roleId: 'role_1', privilegeId: 'priv_3' }, { roleId: 'role_1', privilegeId: 'priv_4' },
  // Billing Analyst gets read+view
  { roleId: 'role_2', privilegeId: 'priv_1' }, { roleId: 'role_2', privilegeId: 'priv_4' },
  // Billing Viewer gets view
  { roleId: 'role_3', privilegeId: 'priv_4' },
  // Analytics Admin gets all
  { roleId: 'role_4', privilegeId: 'priv_5' }, { roleId: 'role_4', privilegeId: 'priv_6' }, { roleId: 'role_4', privilegeId: 'priv_7' }, { roleId: 'role_4', privilegeId: 'priv_8' },
  // Analytics Viewer gets view
  { roleId: 'role_5', privilegeId: 'priv_8' },
  // Analytics Data Engineer gets read+write+view
  { roleId: 'role_6', privilegeId: 'priv_5' }, { roleId: 'role_6', privilegeId: 'priv_6' }, { roleId: 'role_6', privilegeId: 'priv_8' },
];

export const mockUsers: User[] = [
  { id: 'user_1', email: 'admin@acme.example', displayName: 'Acme Admin', status: 'active', createdAt: now, updatedAt: now },
  { id: 'user_2', email: 'alice@acme.example', displayName: 'Alice', status: 'active', createdAt: now, updatedAt: now },
  { id: 'user_3', email: 'bob@globex.example', displayName: 'Bob', status: 'active', createdAt: now, updatedAt: now },
  { id: 'user_4', email: 'charlie@initech.example', displayName: 'Charlie', status: 'active', createdAt: now, updatedAt: now },
  { id: 'user_5', email: 'dave@acme.example', displayName: 'Dave', status: 'inactive', createdAt: now, updatedAt: now },
  { id: 'user_6', email: 'eve@globex.example', displayName: 'Eve', status: 'active', createdAt: now, updatedAt: now },
];

export const mockProviderLinks: ProviderLink[] = mockUsers.map(u => ({
  id: `pl_${u.id}`, provider: 'auth0', providerSub: `auth0|${u.id}`, userId: u.id, email: u.email, createdAt: now
}));

export const mockMemberships: Membership[] = [
  { id: 'mem_1', userId: 'user_1', appOrgId: 'ao_1', roleId: 'role_1', status: 'active', createdAt: now }, // Admin -> Billing/Acme
  { id: 'mem_2', userId: 'user_1', appOrgId: 'ao_3', roleId: 'role_4', status: 'active', createdAt: now }, // Admin -> Analytics/Acme
  { id: 'mem_3', userId: 'user_2', appOrgId: 'ao_1', roleId: 'role_2', status: 'active', createdAt: now }, // Alice -> Analyst Billing/Acme
  { id: 'mem_4', userId: 'user_3', appOrgId: 'ao_2', roleId: 'role_3', status: 'active', createdAt: now }, // Bob -> Viewer Billing/Globex
  { id: 'mem_5', userId: 'user_4', appOrgId: 'ao_4', roleId: 'role_6', status: 'active', createdAt: now }, // Charlie -> Data Engineer Analytics/Initech
  { id: 'mem_6', userId: 'user_6', appOrgId: 'ao_2', roleId: 'role_1', status: 'active', createdAt: now }, // Eve -> Admin Billing/Globex
];
