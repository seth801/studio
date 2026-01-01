
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

export function AddLoadForm() {
  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Add New Load</DialogTitle>
        <DialogDescription>
          Upload a rate confirmation or enter details manually.
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Rate Con</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
             <div className="flex flex-col items-center justify-center gap-2 text-center">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Upload Rate Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                    Drag and drop your PDF file here or click to browse.
                </p>
            </div>
            <Input id="rate-con-file" type="file" className="w-auto" />
            <Button>Analyze Rate Con</Button>
          </div>
        </TabsContent>
        <TabsContent value="manual">
           <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="broker" className="text-right">
                Broker
              </Label>
              <Input id="broker" placeholder="e.g., CH Robinson" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="load-number" className="text-right">
                Load Number
              </Label>
              <Input id="load-number" placeholder="e.g., LD-123456" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="truck" className="text-right">
                Assign Truck
              </Label>
              <Input id="truck" placeholder="e.g., TRUCK-A" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver" className="text-right">
                Assign Driver
              </Label>
              <Input id="driver" placeholder="e.g., John Doe" className="col-span-3" />
            </div>
          </div>
           <div className="flex justify-end">
            <Button>Save Load</Button>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
