'use client';

import { Bot, Files, Search, Settings } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Logo } from './logo';

const navItems = [
  { icon: Files, label: 'Files' },
  { icon: Search, label: 'Search' },
  { icon: Bot, label: 'AI Tools' },
  { icon: Settings, label: 'Settings' },
];

export function SidebarNav() {
  return (
    <aside className="w-16 bg-card flex flex-col items-center py-4 border-r">
      <div className="mb-8">
        <Logo />
      </div>
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-6">
          {navItems.map((item, index) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    index === 2
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                  aria-label={item.label}
                >
                  <item.icon className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
