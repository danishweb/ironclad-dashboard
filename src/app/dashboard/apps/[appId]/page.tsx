'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { appsApi, rolesApi, privilegesApi, rolePrivilegesApi } from '@/lib/api';
import { App, Role, Privilege, RolePrivilege } from '@/lib/api/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function AppDetailPage() {
  const params = useParams();
  const appId = params.appId as string;
  
  const [app, setApp] = React.useState<App | null>(null);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [privileges, setPrivileges] = React.useState<Privilege[]>([]);
  const [rolePrivileges, setRolePrivileges] = React.useState<RolePrivilege[]>([]);

  const loadData = React.useCallback(async () => {
    if (!appId) return;
    const a = await appsApi.getById(appId);
    if (a) setApp(a);
    
    const [rs, ps] = await Promise.all([rolesApi.list(appId), privilegesApi.list(appId)]);
    setRoles(rs);
    setPrivileges(ps);
    
    const rps = await Promise.all(rs.map(r => rolePrivilegesApi.listForRole(r.id)));
    setRolePrivileges(rps.flat());
  }, [appId]);

  React.useEffect(() => { loadData(); }, [loadData]);

  const togglePrivilege = async (roleId: string, privilegeId: string, current: boolean) => {
    try {
      if (current) await rolePrivilegesApi.revoke(roleId, privilegeId);
      else await rolePrivilegesApi.assign(roleId, privilegeId);
      await loadData();
      toast.success('Permissions updated');
    } catch {
      toast.error('Failed to update permissions');
    }
  };

  if (!app) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <PageHeader title={app.name} description={`Code: ${app.code}`}>
        <StatusBadge status={app.status} />
      </PageHeader>

      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="privileges">Privileges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matrix" className="mt-6 bg-card p-4 rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3">Role \ Privilege</th>
                  {privileges.map(p => <th key={p.id} className="px-6 py-3">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.id} className="border-b">
                    <td className="px-6 py-4 font-medium">{role.name}</td>
                    {privileges.map(priv => {
                      const hasPriv = rolePrivileges.some(rp => rp.roleId === role.id && rp.privilegeId === priv.id);
                      return (
                        <td key={priv.id} className="px-6 py-4 text-center">
                          <Checkbox checked={hasPriv} onCheckedChange={() => togglePrivilege(role.id, priv.id, hasPriv)} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-6 bg-card p-4 rounded-xl border">
          <DataTable columns={[{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'code', header: 'Code' }]} data={roles} />
        </TabsContent>
        
        <TabsContent value="privileges" className="mt-6 bg-card p-4 rounded-xl border">
          <DataTable columns={[{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'code', header: 'Code' }]} data={privileges} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
