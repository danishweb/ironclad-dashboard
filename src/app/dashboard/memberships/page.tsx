'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { membershipsApi, usersApi, appOrgsApi, rolesApi } from '@/lib/api';
import { Membership } from '@/lib/api/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MembershipsPage() {
  const [memberships, setMemberships] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const [mems, users, appOrgs, roles] = await Promise.all([
      membershipsApi.list(), usersApi.list(), appOrgsApi.list(), rolesApi.list()
    ]);
    
    const enriched = mems.map(m => {
      const user = users.find(u => u.id === m.userId);
      const appOrg = appOrgs.find(ao => ao.id === m.appOrgId);
      const role = roles.find(r => r.id === m.roleId);
      return {
        ...m,
        userName: user?.displayName || user?.email || 'Unknown',
        userEmail: user?.email || '',
        appOrgName: appOrg ? `${appOrg.appId} / ${appOrg.orgId}` : 'Unknown', // Simplified
        roleName: role?.name || 'Unknown'
      };
    });
    
    setMemberships(enriched);
    setIsLoading(false);
  };

  React.useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await membershipsApi.delete(id);
      toast.success('Membership removed');
      loadData();
    } catch {
      toast.error('Failed to remove membership');
    }
  };

  const columns = [
    { accessorKey: 'userName', header: 'User' },
    { accessorKey: 'appOrgName', header: 'Context (App/Org)' },
    { accessorKey: 'roleName', header: 'Role' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Memberships" description="Manage user role assignments across applications and organizations">
        <Button><Plus className="mr-2 h-4 w-4" /> Assign Role</Button>
      </PageHeader>
      
      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <DataTable columns={columns} data={memberships} searchKey="userName" searchPlaceholder="Search users..." isLoading={isLoading} />
      </div>
    </div>
  );
}
