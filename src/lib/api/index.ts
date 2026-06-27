import { App, AppOrg, DashboardStats, Membership, Org, Privilege, ProviderLink, Role, RolePrivilege, User } from './types';
import { mockAppOrgs, mockApps, mockMemberships, mockOrgs, mockPrivileges, mockProviderLinks, mockRolePrivileges, mockRoles, mockUsers } from '../mock-data';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Ponytail ultra: minimal integration hook to trigger DB JIT provisioning on first load
export const initBackendSession = async () => {
  try { await fetch('/api/proxy/v1/whoami'); } catch (e) { /* ignore */ }
};

export const appsApi = {
  list: async (): Promise<App[]> => { await delay(150); return [...mockApps]; },
  getById: async (id: string): Promise<App | undefined> => { await delay(150); return mockApps.find(a => a.id === id); },
  create: async (data: { code: string; name: string }): Promise<App> => {
    await delay(150);
    const newApp = { id: crypto.randomUUID(), ...data, status: 'active' };
    mockApps.push(newApp);
    return newApp;
  },
  update: async (id: string, data: Partial<App>): Promise<App> => {
    await delay(150);
    const app = mockApps.find(a => a.id === id);
    if (!app) throw new Error('Not found');
    Object.assign(app, data);
    return app;
  },
};

export const orgsApi = {
  list: async (): Promise<Org[]> => { await delay(150); return [...mockOrgs]; },
  getById: async (id: string): Promise<Org | undefined> => { await delay(150); return mockOrgs.find(o => o.id === id); },
  create: async (data: { code: string; name: string; parentId?: string }): Promise<Org> => {
    await delay(150);
    const newOrg = { id: crypto.randomUUID(), code: data.code, name: data.name, parentId: data.parentId || null, status: 'active' };
    mockOrgs.push(newOrg);
    return newOrg;
  },
  update: async (id: string, data: Partial<Org>): Promise<Org> => {
    await delay(150);
    const org = mockOrgs.find(o => o.id === id);
    if (!org) throw new Error('Not found');
    Object.assign(org, data);
    return org;
  },
};

export const rolesApi = {
  list: async (appId?: string): Promise<Role[]> => {
    await delay(150);
    return appId ? mockRoles.filter(r => r.appId === appId) : [...mockRoles];
  },
  getById: async (id: string): Promise<Role | undefined> => { await delay(150); return mockRoles.find(r => r.id === id); },
  create: async (data: { appId: string; code: string; name: string }): Promise<Role> => {
    await delay(150);
    const newRole = { id: crypto.randomUUID(), ...data, isDefault: false, isSensitive: false };
    mockRoles.push(newRole);
    return newRole;
  },
  update: async (id: string, data: Partial<Role>): Promise<Role> => {
    await delay(150);
    const role = mockRoles.find(r => r.id === id);
    if (!role) throw new Error('Not found');
    Object.assign(role, data);
    return role;
  },
  delete: async (id: string): Promise<void> => {
    await delay(150);
    const idx = mockRoles.findIndex(r => r.id === id);
    if (idx > -1) mockRoles.splice(idx, 1);
  },
};

export const privilegesApi = {
  list: async (appId?: string): Promise<Privilege[]> => {
    await delay(150);
    return appId ? mockPrivileges.filter(p => p.appId === appId) : [...mockPrivileges];
  },
  getById: async (id: string): Promise<Privilege | undefined> => { await delay(150); return mockPrivileges.find(p => p.id === id); },
  create: async (data: { appId: string; code: string; name: string }): Promise<Privilege> => {
    await delay(150);
    const newPriv = { id: crypto.randomUUID(), ...data };
    mockPrivileges.push(newPriv);
    return newPriv;
  },
  delete: async (id: string): Promise<void> => {
    await delay(150);
    const idx = mockPrivileges.findIndex(p => p.id === id);
    if (idx > -1) mockPrivileges.splice(idx, 1);
  },
};

export const rolePrivilegesApi = {
  listForRole: async (roleId: string): Promise<RolePrivilege[]> => {
    await delay(150);
    return mockRolePrivileges.filter(rp => rp.roleId === roleId);
  },
  assign: async (roleId: string, privilegeId: string): Promise<void> => {
    await delay(150);
    if (!mockRolePrivileges.find(rp => rp.roleId === roleId && rp.privilegeId === privilegeId)) {
      mockRolePrivileges.push({ roleId, privilegeId });
    }
  },
  revoke: async (roleId: string, privilegeId: string): Promise<void> => {
    await delay(150);
    const idx = mockRolePrivileges.findIndex(rp => rp.roleId === roleId && rp.privilegeId === privilegeId);
    if (idx > -1) mockRolePrivileges.splice(idx, 1);
  },
};

export const usersApi = {
  list: async (): Promise<User[]> => { await delay(150); return [...mockUsers]; },
  getById: async (id: string): Promise<User | undefined> => { await delay(150); return mockUsers.find(u => u.id === id); },
};

export const membershipsApi = {
  list: async (filters?: { userId?: string; appOrgId?: string }): Promise<Membership[]> => {
    await delay(150);
    let res = [...mockMemberships];
    if (filters?.userId) res = res.filter(m => m.userId === filters.userId);
    if (filters?.appOrgId) res = res.filter(m => m.appOrgId === filters.appOrgId);
    return res;
  },
  create: async (data: { userId: string; appOrgId: string; roleId: string }): Promise<Membership> => {
    await delay(150);
    const newMem = { id: crypto.randomUUID(), ...data, status: 'active', createdAt: new Date().toISOString() };
    mockMemberships.push(newMem);
    return newMem;
  },
  update: async (id: string, data: Partial<Membership>): Promise<Membership> => {
    await delay(150);
    const mem = mockMemberships.find(m => m.id === id);
    if (!mem) throw new Error('Not found');
    Object.assign(mem, data);
    return mem;
  },
  delete: async (id: string): Promise<void> => {
    await delay(150);
    const idx = mockMemberships.findIndex(m => m.id === id);
    if (idx > -1) mockMemberships.splice(idx, 1);
  },
};

export const appOrgsApi = {
  list: async (appId?: string, orgId?: string): Promise<AppOrg[]> => {
    await delay(150);
    let res = [...mockAppOrgs];
    if (appId) res = res.filter(ao => ao.appId === appId);
    if (orgId) res = res.filter(ao => ao.orgId === orgId);
    return res;
  },
  create: async (data: { appId: string; orgId: string }): Promise<AppOrg> => {
    await delay(150);
    const newAo = { id: crypto.randomUUID(), ...data, status: 'active' };
    mockAppOrgs.push(newAo);
    return newAo;
  },
  delete: async (id: string): Promise<void> => {
    await delay(150);
    const idx = mockAppOrgs.findIndex(ao => ao.id === id);
    if (idx > -1) mockAppOrgs.splice(idx, 1);
  },
};

export const statsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(150);
    return {
      totalApps: mockApps.length,
      totalOrgs: mockOrgs.length,
      totalUsers: mockUsers.length,
      activeMemberships: mockMemberships.filter(m => m.status === 'active').length,
    };
  },
};

export const providerLinksApi = {
  listForUser: async (userId: string): Promise<ProviderLink[]> => {
    await delay(150);
    return mockProviderLinks.filter(pl => pl.userId === userId);
  },
};
