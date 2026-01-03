
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
import { Loader2, UploadCloud, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractRateCon, Stop } from '@/ai/flows/extract-rate-con-flow';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const suggestedDrivers = [
  { id: 'driver-007', name: 'John Doe' },
  { id: 'driver-009', name: 'Emily Davis' },
];

const allDrivers = [
  { id: 'driver-001', name: 'Jane Smith' },
  { id: 'driver-002', name: 'Mike Johnson' },
  { id: 'driver-003', name: 'Chris Lee' },
];

const suggestedTrucks = [{ id: 'truck-b', name: 'TRUCK-B' }];

const allTrucks = [
  { id: 'truck-a', name: 'TRUCK-A' },
  { id: 'truck-c', name: 'TRUCK-C' },
  { id: 'truck-d', name: 'TRUCK-D' },
  { id: 'truck-e', name: 'TRUCK-E' },
];

export function AddLoadForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [broker, setBroker] = useState('');
  const [loadNumber, setLoadNumber] = useState('');
  const [truck, setTruck] = useState('');
  const [driver, setDriver] = useState('');

  const [stops, setStops] = useState<Stop[]>([
    { type: 'pickup', location: '', date: '', time: '' },
    { type: 'delivery', location: '', date: '', time: '' },
  ]);

  const [commodity, setCommodity] = useState('');
  const [weight, setWeight] = useState('');
  const [rate, setRate] = useState('');

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
        if (result.stops && result.stops.length > 0) {
          setStops(result.stops);
        }
        setCommodity(result.commodity);
        setWeight(result.weight.toString());
        setRate(result.rate.toString());

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

  const handleStopChange = (index: number, field: keyof Stop, value: string) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setStops(newStops);
  };

  const addStop = () => {
    setStops([...stops, { type: 'delivery', location: '', date: '', time: '' }]);
  };

  const removeStop = (index: number) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
  };


  const [isSaved, setIsSaved] = useState(false);
  const [savedLoadId, setSavedLoadId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // Validation
    if (!broker || !loadNumber || stops.some(s => !s.location)) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill in all required fields (Broker, Load #, and Stop locations).',
      });
      return;
    }

    setIsSaving(true);
    try {
      const mockId = loadNumber;

      // Calculate origin and destination from stops
      const origin = stops[0].location.split(',').slice(0, 2).join(', ');
      const destination = stops[stops.length - 1].location.split(',').slice(0, 2).join(', ');

      // Parse dates for the load object
      const pickupDateStr = stops[0].date;
      const dropDateStr = stops[stops.length - 1].date;
      const pickupDate = pickupDateStr ? new Date(pickupDateStr) : new Date();
      const dropDate = dropDateStr ? new Date(dropDateStr) : new Date();

      const loadData = {
        id: mockId,
        brokerName: broker,
        origin,
        destination,
        pickupDate: pickupDate,
        dropDate: dropDate,
        stops: stops,
        driver: driver || 'unassigned',
        truck: truck || 'unassigned',
        miles: 450, // Default for now
        hours: 8,   // Default for now
        perMileRate: parseFloat(rate) / 450,
        rate: parseFloat(rate) || 0,
        estProfit: (parseFloat(rate) || 0) * 0.3, // Simple mock profit
        status: 'Booked',
        commodity: commodity,
        weight: weight,
        createdAt: new Date(),
      };

      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      await setDoc(doc(db, 'loads', mockId), loadData);

      setSavedLoadId(mockId);
      setIsSaved(true);

      toast({
        title: 'Load Saved',
        description: `Load ${mockId} has been successfully saved to Firestore.`,
      });
    } catch (error) {
      console.error('Error saving load:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the load to Firestore. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setBroker('');
    setLoadNumber('');
    setTruck('');
    setDriver('');
    setStops([
      { type: 'pickup', location: '', date: '', time: '' },
      { type: 'delivery', location: '', date: '', time: '' },
    ]);
    setCommodity('');
    setWeight('');
    setRate('');
    setSelectedFile(null);
    setIsSaved(false);
    setSavedLoadId('');
    setActiveTab('upload');
  };

  if (isSaved) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Load Saved Successfully</DialogTitle>
          <DialogDescription>
            Load <strong>{savedLoadId}</strong> has been added to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-8">
          <Button onClick={resetForm} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Load
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href={`/load/${savedLoadId}`}>View Saved Load</a>
          </Button>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[725px]">
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
          <ScrollArea className="h-[60vh] pr-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="broker">Broker</Label>
                <Input id="broker" value={broker} onChange={(e) => setBroker(e.target.value)} placeholder="e.g., CH Robinson" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="load-number">Load Number</Label>
                <Input id="load-number" value={loadNumber} onChange={(e) => setLoadNumber(e.target.value)} placeholder="e.g., LD-123456" />
              </div>
              <div className="col-span-2 space-y-4">
                {stops.map((stop, index) => (
                  <div key={index} className="space-y-4 rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <Label className="capitalize font-semibold">{stop.type} #{stops.filter(s => s.type === stop.type).map((s, i) => i).indexOf(index) + 1}</Label>
                      {stops.length > 2 && <Button variant="ghost" size="icon" onClick={() => removeStop(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={stop.location} onChange={(e) => handleStopChange(index, 'location', e.target.value)} placeholder="e.g., West Valley City, UT" />
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input value={stop.date} onChange={(e) => handleStopChange(index, 'date', e.target.value)} placeholder="e.g., 12/29/2025" />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input value={stop.time} onChange={(e) => handleStopChange(index, 'time', e.target.value)} placeholder="e.g., 08:00-14:00" />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addStop}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Stop
                </Button>
              </div>
              <Separator className="col-span-2" />
              <div className="space-y-2">
                <Label htmlFor="commodity">Commodity</Label>
                <Input id="commodity" value={commodity} onChange={(e) => setCommodity(e.target.value)} placeholder="e.g., Dry Goods" />
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div className='space-y-2'>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 31200" />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="rate">Rate ($)</Label>
                  <Input id="rate" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g., 800" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="truck">Assign Truck</Label>
                <Select onValueChange={setTruck} value={truck}>
                  <SelectTrigger id="truck">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectGroup>
                      <SelectLabel>Suggested</SelectLabel>
                      {suggestedTrucks.map((truck) => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Available</SelectLabel>
                      {allTrucks.map((truck) => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver">Assign Driver</Label>
                <Select onValueChange={setDriver} value={driver}>
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectGroup>
                      <SelectLabel>Suggested</SelectLabel>
                      {suggestedDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Available</SelectLabel>
                      {allDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Load'
                )}
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
