'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppWindow, Building2, UserCheck, Users, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { statsApi, usersApi, initBackendSession } from '@/lib/api';
import { DashboardStats, User } from '@/lib/api/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';

export default function DashboardPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    initBackendSession(); // Ponytail ultra: fire-and-forget JIT trigger
    statsApi.getDashboardStats().then(setStats);
    usersApi.list().then(u => setUsers(u.slice(0, 5)));
  }, []);

  const statCards = [
    { title: 'Total Apps', value: stats?.totalApps ?? '-', icon: AppWindow, color: 'text-blue-500' },
    { title: 'Total Orgs', value: stats?.totalOrgs ?? '-', icon: Building2, color: 'text-emerald-500' },
    { title: 'Total Users', value: stats?.totalUsers ?? '-', icon: Users, color: 'text-violet-500' },
    { title: 'Active Memberships', value: stats?.activeMemberships ?? '-', icon: UserCheck, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="Welcome to Ironclad Dashboard" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={[
                { accessorKey: 'displayName', header: 'Name' },
                { accessorKey: 'email', header: 'Email' },
                { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> }
              ]} 
              data={users} 
              isLoading={!stats}
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href='/dashboard/apps'}>
              <Plus className="mr-2 h-4 w-4" /> New Application
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href='/dashboard/orgs'}>
              <Plus className="mr-2 h-4 w-4" /> New Organization
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href='/dashboard/memberships'}>
              <Plus className="mr-2 h-4 w-4" /> Add Membership
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
