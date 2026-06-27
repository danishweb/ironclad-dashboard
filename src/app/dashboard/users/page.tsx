'use client';

import * as React from 'react';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { usersApi } from '@/lib/api';
import { User } from '@/lib/api/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    usersApi.list().then(data => { setUsers(data); setIsLoading(false); });
  }, []);

  const columns = [
    { accessorKey: 'displayName', header: 'Name', cell: ({ row }: any) => <Link href={`/dashboard/users/${row.original.id}`} className="font-medium hover:underline">{row.original.displayName}</Link> },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Link href={`/dashboard/users/${row.original.id}`}>View Details</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Users" description="Manage user identities and access" />
      
      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <DataTable columns={columns} data={users} searchKey="email" searchPlaceholder="Search by email..." isLoading={isLoading} />
      </div>
    </div>
  );
}
