'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, MoreHorizontal } from 'lucide-react';
import { appsApi } from '@/lib/api';
import { App } from '@/lib/api/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AppsPage() {
  const [apps, setApps] = React.useState<App[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const loadApps = () => {
    setIsLoading(true);
    appsApi.list().then(data => { setApps(data); setIsLoading(false); });
  };

  React.useEffect(() => { loadApps(); }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await appsApi.create({ code: formData.get('code') as string, name: formData.get('name') as string });
      toast.success('Application created');
      setOpen(false);
      loadApps();
    } catch {
      toast.error('Failed to create application');
    }
  };

  const columns = [
    { accessorKey: 'name', header: 'Name', cell: ({ row }: any) => <Link href={`/dashboard/apps/${row.original.id}`} className="font-medium hover:underline">{row.original.name}</Link> },
    { accessorKey: 'code', header: 'Code', cell: ({ row }: any) => <code className="text-xs bg-muted p-1 rounded">{row.original.code}</code> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Link href={`/dashboard/apps/${row.original.id}`}>View Details</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Applications" description="Manage your applications and access control policies">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}><Plus className="mr-2 h-4 w-4" /> Create Application</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Application</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required placeholder="e.g. Billing App" /></div>
              <div className="space-y-2"><Label htmlFor="code">Code</Label><Input id="code" name="code" required placeholder="e.g. billing" className="font-mono text-sm" /></div>
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <DataTable columns={columns} data={apps} searchKey="name" searchPlaceholder="Search applications..." isLoading={isLoading} />
      </div>
    </div>
  );
}
