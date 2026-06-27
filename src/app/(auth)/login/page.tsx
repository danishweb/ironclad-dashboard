'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md p-8 bg-card rounded-xl border shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Shield className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">Ironclad</h1>
        <p className="text-muted-foreground mb-8">Authorization Management</p>
        
        <div className="space-y-4">
          <p className="text-sm font-medium">Sign in to continue</p>
          <Button className="w-full" size="lg" onClick={() => window.location.href='/api/auth/login'}>
            Sign in with Auth0
          </Button>
        </div>
        
        <div className="flex justify-center gap-4 mt-8 pt-6 border-t text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-full border bg-muted/50">RBAC</span>
          <span className="px-2 py-1 rounded-full border bg-muted/50">Multi-tenant</span>
          <span className="px-2 py-1 rounded-full border bg-muted/50">Token Exchange</span>
        </div>
      </div>
    </div>
  );
}
