'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { usersApi } from '@/lib/api';
import { User } from '@/lib/api/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (userId) usersApi.getById(userId).then(u => u && setUser(u));
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <PageHeader title={user.displayName || user.email} description={user.email}>
        <StatusBadge status={user.status} />
      </PageHeader>

      <div className="bg-card p-4 rounded-xl border">
        <p className="text-muted-foreground">User details for {user.displayName}</p>
      </div>
    </div>
  );
}
