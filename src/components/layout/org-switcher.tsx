'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useOrgContextStore } from '@/lib/store';
import { orgsApi } from '@/lib/api';
import { Org } from '@/lib/api/types';

export function OrgSwitcher() {
  const { selectedOrgId, setSelectedOrgId, sidebarOpen } = useOrgContextStore();
  const [open, setOpen] = React.useState(false);
  const [orgs, setOrgs] = React.useState<Org[]>([]);

  React.useEffect(() => {
    orgsApi.list().then(setOrgs);
  }, []);

  const selectedOrg = selectedOrgId ? orgs.find((o) => o.id === selectedOrgId) : null;

  if (!sidebarOpen) {
    return (
      <div className="flex justify-center p-2">
        <Building2 className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between" />}>
        {selectedOrg ? selectedOrg.name : 'All Organizations'}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSelectedOrgId(null);
                  setOpen(false);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', selectedOrgId === null ? 'opacity-100' : 'opacity-0')} />
                All Organizations
              </CommandItem>
              {orgs.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={() => {
                    setSelectedOrgId(org.id);
                    setOpen(false);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', selectedOrgId === org.id ? 'opacity-100' : 'opacity-0')} />
                  {org.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
