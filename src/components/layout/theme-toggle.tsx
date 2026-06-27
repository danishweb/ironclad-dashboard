'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useOrgContextStore } from '@/lib/store';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { sidebarOpen } = useOrgContextStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button variant="ghost" size={sidebarOpen ? "default" : "icon"} onClick={toggleTheme} className="w-full justify-start">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {sidebarOpen && <span className="ml-2">Toggle Theme</span>}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
