'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, MoreHorizontal } from 'lucide-react';
import { orgsApi } from '@/lib/api';
import { Org } from '@/lib/api/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function OrgsPage() {
  const [orgs, setOrgs] = React.useState<Org[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const loadOrgs = () => {
    setIsLoading(true);
    orgsApi.list().then(data => { setOrgs(data); setIsLoading(false); });
  };

  React.useEffect(() => { loadOrgs(); }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await orgsApi.create({ code: formData.get('code') as string, name: formData.get('name') as string });
      toast.success('Organization created');
      setOpen(false);
      loadOrgs();
    } catch {
      toast.error('Failed to create organization');
    }
  };

  const columns = [
    { accessorKey: 'name', header: 'Name', cell: ({ row }: any) => <Link href={`/dashboard/orgs/${row.original.id}`} className="font-medium hover:underline">{row.original.name}</Link> },
    { accessorKey: 'code', header: 'Code', cell: ({ row }: any) => <code className="text-xs bg-muted p-1 rounded">{row.original.code}</code> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Link href={`/dashboard/orgs/${row.original.id}`}>View Details</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Organizations" description="Manage tenants and organizations">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}><Plus className="mr-2 h-4 w-4" /> Create Organization</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Organization</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required placeholder="e.g. Acme Corp" /></div>
              <div className="space-y-2"><Label htmlFor="code">Code</Label><Input id="code" name="code" required placeholder="e.g. acme-corp" className="font-mono text-sm" /></div>
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <DataTable columns={columns} data={orgs} searchKey="name" searchPlaceholder="Search organizations..." isLoading={isLoading} />
      </div>
    </div>
  );
}
