
'use client';

import { useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractRateCon } from '@/ai/flows/extract-rate-con-flow';

export function AddLoadForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [broker, setBroker] = useState('');
  const [loadNumber, setLoadNumber] = useState('');
  const [truck, setTruck] = useState('');
  const [driver, setDriver] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a Rate Confirmation file to analyze.',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const rateConDataUri = reader.result as string;
        
        const result = await extractRateCon({ rateConDataUri });

        setBroker(result.broker);
        setLoadNumber(result.loadNumber);
        
        toast({
          title: 'Analysis Complete',
          description: 'Rate con details have been extracted.',
        });
        setActiveTab('manual');
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
        });
      }
    } catch (error) {
      console.error('Error analyzing rate confirmation:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'Could not analyze the rate confirmation. Please try again or enter details manually.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };


  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Add New Load</DialogTitle>
        <DialogDescription>
          Upload a rate confirmation or enter details manually.
        </DialogDescription>
      </DialogHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Rate Con</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-semibold">
                Upload Rate Confirmation
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your PDF file here or click to browse.
              </p>
            </div>
            <Input id="rate-con-file" type="file" onChange={handleFileChange} className="w-auto" />
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Rate Con'
              )}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="manual">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="broker" className="text-right">
                Broker
              </Label>
              <Input id="broker" value={broker} onChange={(e) => setBroker(e.target.value)} placeholder="e.g., CH Robinson" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="load-number" className="text-right">
                Load Number
              </Label>
              <Input id="load-number" value={loadNumber} onChange={(e) => setLoadNumber(e.target.value)} placeholder="e.g., LD-123456" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="truck" className="text-right">
                Assign Truck
              </Label>
              <Input id="truck" value={truck} onChange={(e) => setTruck(e.target.value)} placeholder="e.g., TRUCK-A" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver" className="text-right">
                Assign Driver
              </Label>
              <Input id="driver" value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="e.g., John Doe" className="col-span-3" />
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
