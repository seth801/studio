'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCopilot } from './copilot-context';
import { Loader2, Sparkles, Wand2, Lightbulb, Copy, Check } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';

export function AIPanel() {
  const {
    isLoading,
    handleGenerate,
    handleExplain,
    handleImprove,
    generatedCode,
    explanation,
    improvements,
    insertGeneratedCode,
  } = useCopilot();

  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-[450px] bg-card border-l flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="generate">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate"><Sparkles className="h-4 w-4 mr-2"/>Generate</TabsTrigger>
              <TabsTrigger value="explain"><Lightbulb className="h-4 w-4 mr-2"/>Explain</TabsTrigger>
              <TabsTrigger value="improve"><Wand2 className="h-4 w-4 mr-2"/>Improve</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Code</CardTitle>
                  <CardDescription>
                    Describe the code you want to create.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="e.g., a React component with a button and a counter"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                  {isLoading.generate ? (
                    <Skeleton className="h-32 w-full" />
                  ) : generatedCode && (
                    <div className="relative rounded-md bg-background/50 p-3">
                       <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => copyToClipboard(generatedCode)}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <pre className="font-code text-sm whitespace-pre-wrap">
                        <code>{generatedCode}</code>
                      </pre>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                   <Button
                    onClick={() => handleGenerate(prompt)}
                    disabled={isLoading.generate || !prompt}
                  >
                    {isLoading.generate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate
                  </Button>
                  {generatedCode && (
                    <Button variant="secondary" onClick={insertGeneratedCode}>Insert Code</Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="explain" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Explain Code</CardTitle>
                  <CardDescription>
                    Get a detailed explanation of the code in the editor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading.explain ? (
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-4/5" />
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : explanation && (
                    <p className="text-sm leading-relaxed">{explanation}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleExplain} disabled={isLoading.explain}>
                    {isLoading.explain && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Explain Code
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="improve" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Suggest Improvements</CardTitle>
                  <CardDescription>
                    Get AI-powered suggestions to refactor and improve your code.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading.improve ? (
                     <div className="space-y-2">
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-full" />
                    </div>
                  ) : improvements.length > 0 && (
                    <ul className="space-y-3 list-disc list-inside">
                      {improvements.map((item, index) => (
                        <li key={index} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter>
                   <Button onClick={handleImprove} disabled={isLoading.improve}>
                    {isLoading.improve && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Suggest Improvements
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </aside>
  );
}
