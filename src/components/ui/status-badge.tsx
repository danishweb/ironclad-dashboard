import { Badge } from '@/components/ui/badge';

export function StatusBadge({ status }: { status: string }) {
  if (status === 'active') {
    return <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20">{status}</Badge>;
  }
  if (status === 'suspended') {
    return <Badge className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-red-500/20">{status}</Badge>;
  }
  return <Badge variant="secondary" className="bg-muted text-muted-foreground">{status}</Badge>;
}
