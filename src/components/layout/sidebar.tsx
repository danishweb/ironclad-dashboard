'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, AppWindow, Building2, UserCheck, Shield, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrgContextStore } from '@/lib/store';
import { OrgSwitcher } from './org-switcher';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useOrgContextStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '[' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleSidebar]);

  const navItems = [
    { title: 'Overview', items: [{ title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] },
    { title: 'Directory', items: [{ title: 'Users', href: '/dashboard/users', icon: Users }] },
    { title: 'Access Control', items: [
      { title: 'Applications', href: '/dashboard/apps', icon: AppWindow },
      { title: 'Organizations', href: '/dashboard/orgs', icon: Building2 },
      { title: 'Memberships', href: '/dashboard/memberships', icon: UserCheck },
    ] },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300", sidebarOpen ? "w-[260px]" : "w-[64px]")}>
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <Shield className="h-6 w-6 text-primary shrink-0" />
        {sidebarOpen && <span className="ml-2 font-bold text-lg">Ironclad</span>}
      </div>

      <div className="p-2 border-b border-sidebar-border">
        <OrgSwitcher />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((group, i) => (
          <div key={i} className="px-3 mb-6">
            {sidebarOpen && <div className="mb-2 px-2 text-xs font-semibold tracking-tight text-sidebar-accent-foreground">{group.title.toUpperCase()}</div>}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link key={item.href} href={item.href}>
                    <span className={cn(
                      "flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                      active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                      !sidebarOpen && "justify-center"
                    )}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {sidebarOpen && <span className="ml-3">{item.title}</span>}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-sidebar-border flex flex-col gap-2">
        <ThemeToggle />
        <Button variant="ghost" size={sidebarOpen ? "default" : "icon"} onClick={toggleSidebar} className="w-full justify-start" title="Toggle Sidebar (Cmd+[)">
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          {sidebarOpen && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </div>
  );
}
