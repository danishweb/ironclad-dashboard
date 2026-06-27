import { App, AppOrg, DashboardStats, Membership, Org, Privilege, ProviderLink, Role, RolePrivilege, User } from './types';

const fetchApi = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`/api/proxy/v1/admin${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API Error: ${res.statusText}`);
  }
  return res.json();
};

export const initBackendSession = async () => {
  try { await fetch('/api/proxy/v1/whoami'); } catch (e) { /* ignore */ }
};

export const appsApi = {
  list: () => fetchApi<App[]>('/apps'),
  getById: async (id: string) => {
    const apps = await fetchApi<App[]>('/apps');
    return apps.find(a => a.id === id);
  },
  create: (data: { code: string; name: string }) => fetchApi<App>('/apps', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<App>) => fetchApi<App>(`/apps/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const orgsApi = {
  list: () => fetchApi<Org[]>('/orgs'),
  getById: async (id: string) => {
    const orgs = await fetchApi<Org[]>('/orgs');
    return orgs.find(o => o.id === id);
  },
  create: (data: { code: string; name: string; parentId?: string }) => fetchApi<Org>('/orgs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Org>) => fetchApi<Org>(`/orgs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const rolesApi = {
  list: async (appId?: string) => {
    const roles = await fetchApi<Role[]>('/roles');
    return appId ? roles.filter(r => r.appId === appId) : roles;
  },
  getById: async (id: string) => {
    const roles = await fetchApi<Role[]>('/roles');
    return roles.find(r => r.id === id);
  },
  create: (data: { appId: string; code: string; name: string }) => fetchApi<Role>('/roles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Role>) => fetchApi<Role>(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<void>(`/roles/${id}`, { method: 'DELETE' }),
};

export const privilegesApi = {
  list: async (appId?: string) => {
    const privs = await fetchApi<Privilege[]>('/privileges');
    return appId ? privs.filter(p => p.appId === appId) : privs;
  },
  getById: async (id: string) => {
    const privs = await fetchApi<Privilege[]>('/privileges');
    return privs.find(p => p.id === id);
  },
  create: (data: { appId: string; code: string; name: string }) => fetchApi<Privilege>('/privileges', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<void>(`/privileges/${id}`, { method: 'DELETE' }),
};

export const rolePrivilegesApi = {
  listForRole: async (roleId: string) => {
    const rps = await fetchApi<RolePrivilege[]>('/role-privileges');
    return rps.filter(rp => rp.roleId === roleId);
  },
  assign: (roleId: string, privilegeId: string) => fetchApi<void>('/role-privileges', { method: 'POST', body: JSON.stringify({ roleId, privilegeId }) }),
  revoke: (roleId: string, privilegeId: string) => fetchApi<void>(`/role-privileges/${roleId}/${privilegeId}`, { method: 'DELETE' }),
};

export const usersApi = {
  list: () => fetchApi<User[]>('/users'),
  getById: async (id: string) => {
    const users = await fetchApi<User[]>('/users');
    return users.find(u => u.id === id);
  },
};

export const membershipsApi = {
  list: async (filters?: { userId?: string; appOrgId?: string }) => {
    const mems = await fetchApi<Membership[]>('/memberships');
    let res = mems;
    if (filters?.userId) res = res.filter(m => m.userId === filters.userId);
    if (filters?.appOrgId) res = res.filter(m => m.appOrgId === filters.appOrgId);
    return res;
  },
  create: (data: { userId: string; appOrgId: string; roleId: string }) => fetchApi<Membership>('/memberships', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Membership>) => fetchApi<Membership>(`/memberships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<void>(`/memberships/${id}`, { method: 'DELETE' }),
};

export const appOrgsApi = {
  list: async (appId?: string, orgId?: string) => {
    const aos = await fetchApi<AppOrg[]>('/app-orgs');
    let res = aos;
    if (appId) res = res.filter(ao => ao.appId === appId);
    if (orgId) res = res.filter(ao => ao.orgId === orgId);
    return res;
  },
  create: (data: { appId: string; orgId: string }) => fetchApi<AppOrg>('/app-orgs', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<void>(`/app-orgs/${id}`, { method: 'DELETE' }),
};

export const statsApi = {
  getDashboardStats: () => fetchApi<DashboardStats>('/stats'),
};

export const providerLinksApi = {
  listForUser: async (userId: string) => {
    const links = await fetchApi<ProviderLink[]>('/provider-links');
    return links.filter(l => l.userId === userId);
  },
};
