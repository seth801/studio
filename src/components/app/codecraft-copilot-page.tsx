'use client';

import { AppHeader } from './app-header';
import { SidebarNav } from './sidebar-nav';
import { EditorPanel } from './editor-panel';
import { AIPanel } from './ai-panel';

export function CodeCraftCopilotPage() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 flex overflow-hidden">
            <EditorPanel />
            <AIPanel />
          </main>
        </div>
      </div>
    </div>
  );
}
