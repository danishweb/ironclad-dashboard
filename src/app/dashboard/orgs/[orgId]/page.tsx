'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { orgsApi } from '@/lib/api';
import { Org } from '@/lib/api/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OrgDetailPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const [org, setOrg] = React.useState<Org | null>(null);

  React.useEffect(() => {
    if (orgId) orgsApi.getById(orgId).then(o => o && setOrg(o));
  }, [orgId]);

  if (!org) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <PageHeader title={org.name} description={`Code: ${org.code}`}>
        <StatusBadge status={org.status} />
      </PageHeader>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 bg-card p-4 rounded-xl border">
          <p className="text-muted-foreground">Detailed view for {org.name}</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
