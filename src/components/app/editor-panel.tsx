'use client';

import { useCopilot } from './copilot-context';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export function EditorPanel() {
  const { code, setCode } = useCopilot();

  return (
    <div className="flex-1 flex flex-col bg-background/50">
       <div className="px-4 pt-2">
        <Tabs defaultValue="app.js" className="w-fit">
          <TabsList>
            <TabsTrigger value="app.js">app.js</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 p-4 pt-2 relative">
        <Textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Type your code here..."
          className="w-full h-full font-code text-base bg-card border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="absolute top-6 right-8 text-sm text-muted-foreground font-code">
          {code.split('\n').length} lines
        </div>
      </div>
    </div>
  );
}
