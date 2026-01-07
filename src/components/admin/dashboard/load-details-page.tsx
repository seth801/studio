
'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { allDrivers, allTrucks, allTrailers, initialLoadsData, type Load, type Stop } from './loads-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Truck, User, Milestone, Calendar as CalendarIcon, ArrowRight, Weight, Pencil, Loader2, FileText, Upload, CheckCircle, AlertTriangle, XCircle, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar } from '@/components/ui/calendar';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { verifyBol } from '@/ai/flows/verify-bol-flow';
import { LoadDocument } from './loads-page';

import { GoogleMapDirections } from './google-map-directions';
import { Address } from '@/types/address';

// Helper to format Address object as string for Google Maps
const formatAddressForGoogleMaps = (address: Address | string): string => {
  if (typeof address === 'string') return address;
  return `${address.street}, ${address.city}, ${address.state} ${address.zipcode}, ${address.country}`;
};

function GoogleMapEmbed({ stops }: { stops: { address: Address }[] }) {
  const stopsWithLocation = stops.map(stop => ({
    location: formatAddressForGoogleMaps(stop.address)
  }));
  return <GoogleMapDirections stops={stopsWithLocation} />;
}



function RateConPdfViewer({ dataUri }: { dataUri?: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Use stored data URI if available; fallback to placeholder PDF
  const pdfUrl = dataUri || '/rate-con-placeholder.pdf';

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rate Confirmation</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
            Fullscreen
          </Button>
        </CardHeader>
        <CardContent>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        </CardContent>
      </Card>

      {/* Fullscreen Dialog */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="fixed inset-0 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Rate Confirmation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function EditableStopLocation({ location, onSave }: { location: string; onSave: (newLocation: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(location);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-8" />
        <Button size="sm" onClick={handleSave}>Save</Button>
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <p className='font-semibold'>{location}</p>
      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => setIsEditing(true)}>
        <Pencil className='h-3 w-3' />
      </Button>
    </div>
  );
}

// Editable date and time for a stop
function EditableStopDateTime({ date, time, onSaveDate, onSaveTime }: { date: string; time: string; onSaveDate: (newDate: string) => void; onSaveTime: (newTime: string) => void }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(date));
  const [timeValue, setTimeValue] = useState<string>(time);

  const handleDateSelect = (d: Date | undefined) => {
    if (!d) return;
    setSelectedDate(d);
    onSaveDate(d.toISOString().split('T')[0]);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value);
    onSaveTime(e.target.value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-0">
          <CalendarIcon className="h-4 w-4 mr-1" /> {date}
          <Clock className="h-4 w-4 ml-2 mr-1" /> {time}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} required={false} />
        <div className="mt-2">
          <label className="text-sm mr-2">Time:</label>
          <Input type="time" value={timeValue} onChange={handleTimeChange} className="w-24" />
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Editable text field for stop details
function EditableStopField({ value, label, onSave, multiline = false }: { value?: string; label: string; onSave: (newValue: string) => void; multiline?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value || '');

  const handleSave = () => {
    onSave(fieldValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 mt-1">
        <label className="text-xs text-muted-foreground">{label}</label>
        {multiline ? (
          <textarea
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <Input
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="h-8"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>Save</Button>
          <Button size="sm" variant="ghost" onClick={() => { setIsEditing(false); setFieldValue(value || ''); }}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group mt-1">
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value || <span className="text-muted-foreground italic">Not set</span>}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => setIsEditing(true)}>
        <Pencil className='h-3 w-3' />
      </Button>
    </div>
  );
}


export default function LoadDetailsPage({ loadId }: { loadId: string }) {
  const { toast } = useToast();
  const [currentLoad, setCurrentLoad] = useState<Load | undefined>(() => initialLoadsData.find((l) => l.id === loadId));
  const [isLoading, setIsLoading] = useState(!currentLoad);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; miles: number }[]>([]);
  const [totalMiles, setTotalMiles] = useState<number>(0);

  // Calculate distances between stops using Google Maps Directions API
  useEffect(() => {
    if (!currentLoad || currentLoad.stops.length < 2) return;

    const calculateDistances = async () => {
      try {
        const google = (window as any).google;
        if (!google || !google.maps) {
          console.log('Google Maps not loaded yet');
          return;
        }

        let directionsService;
        try {
          directionsService = new google.maps.DirectionsService();
        } catch (constructorError) {
          console.log('DirectionsService not available:', constructorError);
          return;
        }
        const routes: { distance: string; duration: string; miles: number }[] = [];
        let totalMilesCalc = 0;

        // Calculate distance between each consecutive pair of stops
        for (let i = 0; i < currentLoad.stops.length - 1; i++) {
          const origin = formatAddressForGoogleMaps(currentLoad.stops[i].address);
          const destination = formatAddressForGoogleMaps(currentLoad.stops[i + 1].address);

          try {
            const result = await new Promise<any>((resolve, reject) => {
              directionsService.route(
                {
                  origin,
                  destination,
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (result: any, status: any) => {
                  if (status === 'OK') {
                    resolve(result);
                  } else {
                    reject(status);
                  }
                }
              );
            });

            const leg = result.routes[0].legs[0];
            const distanceText = leg.distance.text;
            const durationText = leg.duration.text;
            const miles = Math.round(leg.distance.value * 0.000621371); // Convert meters to miles

            routes.push({
              distance: distanceText,
              duration: durationText,
              miles,
            });

            totalMilesCalc += miles;
          } catch (error) {
            console.error(`Error calculating route ${i} to ${i + 1}:`, error);
            routes.push({ distance: 'N/A', duration: 'N/A', miles: 0 });
          }
        }

        setRouteInfo(routes);
        setTotalMiles(totalMilesCalc);
      } catch (error) {
        console.error('Error calculating distances:', error);
      }
    };

    // Wait for Google Maps to load
    const checkGoogleMaps = setInterval(() => {
      if ((window as any).google?.maps) {
        clearInterval(checkGoogleMaps);
        calculateDistances();
      }
    }, 100);

    return () => clearInterval(checkGoogleMaps);
  }, [currentLoad]);


  useEffect(() => {
    if (currentLoad) return;

    const fetchLoad = async () => {
      setIsLoading(true);
      try {
        const { db } = await import('@/lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');

        const docRef = doc(db, 'loads', loadId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentLoad({
            ...data,
            id: docSnap.id,
            pickupDate: data.pickupDate?.toDate ? data.pickupDate.toDate() : new Date(data.pickupDate),
            dropDate: data.dropDate?.toDate ? data.dropDate.toDate() : new Date(data.dropDate),
          } as Load);
        }
      } catch (error) {
        console.error('Error fetching load from Firestore:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoad();
  }, [loadId, currentLoad]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading load details...</p>
      </div>
    );
  }

  if (!currentLoad) {
    notFound();
  }

  const handleStopLocationChange = async (stopIndex: number, newLocation: string) => {
    const updatedStops = [...currentLoad.stops];
    // Parse string back to Address object (simple parser for now)
    const parts = newLocation.split(',').map(s => s.trim());
    const address: Address = {
      street: parts[0] || '',
      city: parts[1] || '',
      state: parts[2] || '',
      zipcode: '',
      country: 'USA'
    };
    updatedStops[stopIndex].address = address;

    const updatedLoad = { ...currentLoad, stops: updatedStops };

    if (stopIndex === 0) {
      updatedLoad.origin = newLocation.split(',').slice(0, 2).join(', ');
    }
    if (stopIndex === updatedStops.length - 1) {
      updatedLoad.destination = newLocation.split(',').slice(0, 2).join(', ');
    }

    setCurrentLoad(updatedLoad);
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const fieldPath = `stops.${stopIndex}.address`;
      await setDoc(doc(db, 'loads', loadId), { [fieldPath]: address }, { merge: true });
      toast({ title: 'Stop location updated' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Failed to update stop location' });
    }
  };

  const handleStopDateChange = async (stopIndex: number, newDate: string) => {
    const updatedStops = [...currentLoad.stops];
    updatedStops[stopIndex].date = newDate;
    setCurrentLoad({ ...currentLoad, stops: updatedStops });
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const fieldPath = `stops.${stopIndex}.date`;
      await setDoc(doc(db, 'loads', loadId), { [fieldPath]: newDate }, { merge: true });
      toast({ title: 'Stop date updated' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Failed to update stop date' });
    }
  };

  const handleStopTimeChange = async (stopIndex: number, newTime: string) => {
    const updatedStops = [...currentLoad.stops];
    updatedStops[stopIndex].time = newTime;
    setCurrentLoad({ ...currentLoad, stops: updatedStops });
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const fieldPath = `stops.${stopIndex}.time`;
      await setDoc(doc(db, 'loads', loadId), { [fieldPath]: newTime }, { merge: true });
      toast({ title: 'Stop time updated' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Failed to update stop time' });
    }
  };

  const handleTruckAssignment = async (truckId: string) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      setCurrentLoad({ ...currentLoad, truck: truckId });
      await setDoc(doc(db, 'loads', loadId), { truck: truckId }, { merge: true });

      toast({ title: 'Truck assigned successfully' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Failed to assign truck' });
    }
  };

  const handleDriverAssignment = async (driverId: string) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      setCurrentLoad({ ...currentLoad, driver: driverId });
      await setDoc(doc(db, 'loads', loadId), { driver: driverId }, { merge: true });

      toast({ title: 'Driver assigned successfully' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Failed to assign driver' });
    }
  };

  const handleTrailerAssignment = async (trailerId: string) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      const trailerValue = trailerId === 'none' ? undefined : trailerId;
      setCurrentLoad({ ...currentLoad, trailer: trailerValue });
      await setDoc(doc(db, 'loads', loadId), { trailer: trailerValue }, { merge: true });

      toast({ title: trailerId === 'none' ? 'Trailer unassigned' : 'Trailer assigned successfully' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Failed to assign trailer' });
    }
  };

  const handleBolUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF or image)
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({ variant: 'destructive', title: 'Invalid file type. Please upload an image or PDF.' });
      return;
    }

    // Checking file size (limit to 5MB for now)
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File too large. Maximum size is 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUri = event.target?.result as string;
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      const uploadToast = toast({ title: 'Processing BOL...', description: 'Analyzing document with AI...' });

      try {
        // 1. Verify with AI
        const verificationResult = await verifyBol({
          fileDataUri: dataUri,
          loadContext: {
            loadId: currentLoad.id,
            origin: currentLoad.origin,
            destination: currentLoad.destination,
            brokerName: currentLoad.brokerName
          }
        });

        // 2. Create document object
        const newDoc: LoadDocument = {
          id: crypto.randomUUID(),
          type: 'BOL',
          name: file.name,
          url: dataUri, // For demo, storing data URI directly. In prod, verify upload to Storage.
          uploadedAt: new Date(),
          verification: verificationResult
        };

        // 3. Update State & Firestore
        const updatedDocuments = [...(currentLoad.documents || []), newDoc];
        setCurrentLoad({ ...currentLoad, documents: updatedDocuments });

        await setDoc(doc(db, 'loads', loadId), { documents: updatedDocuments }, { merge: true });

        // 4. Notify user
        if (verificationResult.isMatch) {
          uploadToast.update({ id: uploadToast.id, title: 'BOL Verified', description: 'Document matched and saved.', variant: 'default' });
        } else {
          uploadToast.update({ id: uploadToast.id, title: 'Detailed Review Needed', description: 'Discrepancies found in BOL.', variant: 'destructive' });
        }

      } catch (error) {
        console.error('Error processing BOL:', error);
        uploadToast.update({ id: uploadToast.id, title: 'Upload Failed', description: 'Could not process document.', variant: 'destructive' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStopFieldChange = async (stopIndex: number, field: keyof Stop, value: string) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      // Update local state
      const updatedStops = [...currentLoad.stops];
      updatedStops[stopIndex] = { ...updatedStops[stopIndex], [field]: value };
      setCurrentLoad({ ...currentLoad, stops: updatedStops });

      // Update Firestore
      const fieldPath = `stops.${stopIndex}.${field}`;
      await setDoc(doc(db, 'loads', loadId), { [fieldPath]: value }, { merge: true });

      toast({ title: `Stop ${field} updated` });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: `Failed to update stop ${field}` });
    }
  };

  const getDriverName = (driverId: string) => allDrivers.find(d => d.id === driverId)?.name || 'Unassigned';
  const getTruckName = (truckId: string) => allTrucks.find(t => t.id === truckId)?.name || 'Unassigned';
  const getTrailerName = (trailerId?: string) => trailerId ? allTrailers.find(t => t.id === trailerId)?.name || 'Unassigned' : 'None';


  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Booked': return 'default';
      case 'En route': return 'secondary';
      case 'Completed': return 'outline';
      case 'Rescheduled': return 'default';
      case 'Canceled': return 'destructive';
      default: return 'default';
    }
  };


  if (isLoading || !currentLoad) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-30 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to Loads</Link>
            </Button>
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/6" />
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card className='h-[60vh] flex items-center justify-center p-6'>
              <Skeleton className="h-full w-full" />
            </Card>
            <Card>
              <CardHeader><CardTitle><Skeleton className="h-6 w-20" /></CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <Card>
              <CardHeader><CardTitle><Skeleton className="h-6 w-24" /></CardTitle></CardHeader>
              <CardContent className="grid gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to Loads</Link>
          </Button>
        </div>
        {/* Route Title */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {(() => {
              const extractCity = (str: string) => {
                if (!str) return '';
                // Split by comma
                const parts = str.split(',').map(p => p.trim());

                // Filter out parts that are just USA/Country or State/Zip
                const filtered = parts.filter(p => {
                  const isCountry = /^(USA|US|United States|Canada|Mexico)$/i.test(p);
                  const isStateZip = /^[A-Z]{2}\s+\d{5}(-\d{4})?(?:\s+USA)?$/i.test(p) || /^[A-Z]{2}$/.test(p);
                  return !isCountry && !isStateZip;
                });

                if (filtered.length === 0) return parts[0];

                // Take the last meaningful part (usually City)
                let city = filtered[filtered.length - 1];

                // If the city part looks like it includes the street address (starts with number), try to clean it
                // This handles cases like "123 Main St CityName" where there was no comma
                if (/^\d+/.test(city)) {
                  // Heuristic: remove leading digits and street types, keep the rest
                  // This is conservative; if it fails, it returns the original
                  const match = city.match(/(?:Suite\s+[A-Za-z0-9]+|Apt\s+[A-Za-z0-9]+|\d+[A-Za-z\s]+(?:St|Ave|Rd|Blvd|ln|Dr|Way|Ct|Pl|Cir))\s+(.+)$/i);
                  if (match && match[1]) return match[1];

                  // Fallback: If it's "Number Street City", try to grab the last few words
                  // This is risky, so we only do it if we're fairly sure
                }

                return city;
              };

              const originCity = extractCity(formatAddressForGoogleMaps(currentLoad.stops[0]?.address) || (typeof currentLoad.origin === 'string' ? currentLoad.origin : `${currentLoad.origin.city}, ${currentLoad.origin.state}`));
              const destCity = extractCity(formatAddressForGoogleMaps(currentLoad.stops[currentLoad.stops.length - 1]?.address) || (typeof currentLoad.destination === 'string' ? currentLoad.destination : `${currentLoad.destination.city}, ${currentLoad.destination.state}`));

              return (
                <>
                  {originCity} {' → '} {destCity}
                </>
              );
            })()}
            <span className="text-sm font-normal text-muted-foreground ml-3">
              {currentLoad.id}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentLoad.brokerName}
          </p>
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

          <Card className='h-[60vh]'>
            <GoogleMapEmbed stops={currentLoad.stops} />
          </Card>
          {/* Google Maps Link */}
          <div className="flex justify-center -mt-2">
            <a
              href={`https://www.google.com/maps/dir/${currentLoad.stops.map(stop => encodeURIComponent(formatAddressForGoogleMaps(stop.address))).join('/')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-700 underline flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Open route in Google Maps
            </a>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Stops</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {currentLoad.stops.map((stop, index) => (
                <div key={index} className='flex items-start gap-4'>
                  <div className='flex flex-col items-center'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                      <MapPin className='h-4 w-4' />
                    </div>
                    {index < currentLoad.stops.length - 1 && <div className='h-full min-h-[200px] w-px bg-border my-2' />}
                  </div>
                  <div className="flex-1">
                    {/* Stop Type and Company Name Header */}
                    <div className="mb-3">
                      <h3 className='text-lg font-semibold capitalize inline'>
                        {stop.type}
                      </h3>
                      {stop.companyName ? (
                        <span className='text-lg font-bold ml-2'>- {stop.companyName}</span>
                      ) : (
                        <EditableStopField
                          value={stop.companyName}
                          label="Company Name (suggested by Google Maps)"
                          onSave={(value) => handleStopFieldChange(index, 'companyName', value)}
                        />
                      )}
                    </div>

                    {/* Location */}
                    <EditableStopLocation
                      location={formatAddressForGoogleMaps(stop.address)}
                      onSave={(newLocation) => handleStopLocationChange(index, newLocation)}
                    />

                    {/* Date and Time */}
                    <EditableStopDateTime
                      date={stop.date}
                      time={stop.time}
                      onSaveDate={(newDate) => handleStopDateChange(index, newDate)}
                      onSaveTime={(newTime) => handleStopTimeChange(index, newTime)}
                    />

                    {/* Information Grid - 2 Columns */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <EditableStopField
                        value={stop.phoneNumber}
                        label="Phone Number"
                        onSave={(value) => handleStopFieldChange(index, 'phoneNumber', value)}
                      />
                      <EditableStopField
                        value={stop.referenceNotes}
                        label="Reference Notes"
                        onSave={(value) => handleStopFieldChange(index, 'referenceNotes', value)}
                      />
                    </div>

                    {/* Instructions - Full Width */}
                    <div className="mt-3">
                      <EditableStopField
                        value={stop.instructions}
                        label="Instructions"
                        onSave={(value) => handleStopFieldChange(index, 'instructions', value)}
                        multiline
                      />
                    </div>

                    {/* Distance and Travel Time to Next Stop */}
                    {index < currentLoad.stops.length - 1 && routeInfo[index] && (
                      <div className='mt-4 p-3 bg-muted/50 rounded-lg border border-border'>
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center gap-2'>
                            <ArrowRight className='h-4 w-4 text-muted-foreground' />
                            <span className='font-medium'>To next stop:</span>
                          </div>
                          <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-1'>
                              <Milestone className='h-4 w-4 text-blue-500' />
                              <span className='font-semibold text-blue-500'>{routeInfo[index].distance}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Clock className='h-4 w-4 text-green-500' />
                              <span className='font-semibold text-green-500'>{routeInfo[index].duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <div className='grid grid-cols-2 gap-4'>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Broker</CardDescription>
                <CardTitle className="text-xl">{currentLoad.brokerName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Load ID: {currentLoad.id}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Status</CardDescription>
                <CardTitle className="text-xl">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Badge variant={getStatusVariant(currentLoad.status)} className='text-md'>{currentLoad.status}</Badge>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <div className="space-y-2">
                        <h4 className="font-medium mb-2">Edit Stops</h4>
                        {currentLoad.stops.map((stop, idx) => (
                          <EditableStopDateTime
                            key={idx}
                            date={stop.date}
                            time={stop.time}
                            onSaveDate={(newDate) => handleStopDateChange(idx, newDate)}
                            onSaveTime={(newTime) => handleStopTimeChange(idx, newTime)}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Updated 2 hours ago</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Rate</CardDescription>
                <CardTitle className="text-xl">${currentLoad.rate.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">${(currentLoad.rate / (totalMiles > 0 ? totalMiles : currentLoad.miles)).toFixed(2)} / mile</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Est. Profit</CardDescription>
                <CardTitle className="text-xl text-green-400">${currentLoad.estProfit.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">After estimated expenses</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Truck */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Truck className='h-4 w-4' /> Truck</span>
                <Select value={currentLoad.truck} onValueChange={handleTruckAssignment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTrucks.map((truck) => (
                      <SelectItem key={truck.id} value={truck.id}>
                        {truck.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trailer */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="6" width="22" height="14" rx="2" />
                    <path d="M16 21V6" />
                  </svg>
                  Trailer
                </span>
                <Select value={currentLoad.trailer || 'none'} onValueChange={handleTrailerAssignment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select trailer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {allTrailers.map((trailer) => (
                      <SelectItem key={trailer.id} value={trailer.id}>
                        {trailer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Driver */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><User className='h-4 w-4' /> Driver</span>
                <Select value={currentLoad.driver} onValueChange={handleDriverAssignment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {allDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Send to Driver Button */}
              <div className="flex justify-end -mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => toast({ title: 'Send to Driver feature coming soon!' })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send to Driver
                </Button>
              </div>

              <Separator />

              {/* Commodity */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Weight className='h-4 w-4' /> Commodity</span>
                <span>To be extracted from Rate Con</span>
              </div>

              <Separator />

              {/* Total Miles */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Milestone className='h-4 w-4' /> Total Miles</span>
                <span className="flex items-center gap-2">
                  {totalMiles > 0 ? (
                    <>
                      <span className="font-semibold text-blue-500">{totalMiles} mi</span>
                      <span className="text-xs text-muted-foreground">(calculated)</span>
                    </>
                  ) : (
                    <span>{currentLoad.miles} mi</span>
                  )}
                </span>
              </div>

              {/* Est. Hours */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Clock className='h-4 w-4' /> Est. Hours</span>
                <span>~{currentLoad.hours} hrs</span>
              </div>
            </CardContent>
          </Card>

          {/* Paperwork Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Paperwork</CardTitle>
                <CardDescription>Manage and verify load documentation</CardDescription>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  id="bol-upload"
                  onChange={handleBolUpload}
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('bol-upload')?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload BOL
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(!currentLoad.documents || currentLoad.documents.length === 0) && (
                <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                  No documents uploaded yet
                </div>
              )}

              {currentLoad.documents?.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {doc.type === 'BOL' ? <FileText className="h-8 w-8 text-blue-500" /> : <FileText className="h-8 w-8 text-gray-500" />}
                      </div>
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Uploaded {format(new Date(doc.uploadedAt), 'MMM d, h:mm a')} • {doc.type}
                        </div>

                        {/* Verification Results */}
                        {doc.verification && (
                          <div className="mt-2 text-sm space-y-1">
                            {doc.verification.isMatch ? (
                              <div className="flex items-center text-green-600 gap-1.5 font-medium">
                                <CheckCircle className="h-3.5 w-3.5" /> Verified Match ({doc.verification.matchConfidence}%)
                              </div>
                            ) : (
                              <div className="flex items-center text-red-500 gap-1.5 font-medium">
                                <XCircle className="h-3.5 w-3.5" /> Mismatch Detected
                              </div>
                            )}

                            {(doc.verification.arrivalDate || doc.verification.arrivalTime) && (
                              <div className="text-xs text-muted-foreground flex gap-3">
                                <span>Arrival: {doc.verification.arrivalDate || '--'} {doc.verification.arrivalTime || '--'}</span>
                              </div>
                            )}
                            {(doc.verification.departureDate || doc.verification.departureTime) && (
                              <div className="text-xs text-muted-foreground flex gap-3">
                                <span>Departure: {doc.verification.departureDate || '--'} {doc.verification.departureTime || '--'}</span>
                              </div>
                            )}

                            {doc.verification.hasReceiverSignature ? (
                              <div className="flex items-center text-green-600 gap-1.5 text-xs mt-1">
                                <CheckCircle className="h-3 w-3" /> Signed by Receiver {doc.verification.signatureName ? `(${doc.verification.signatureName})` : ''}
                              </div>
                            ) : (
                              <div className="flex items-center text-amber-500 gap-1.5 text-xs mt-1">
                                <AlertTriangle className="h-3 w-3" /> Missing Signature
                              </div>
                            )}

                            {doc.verification.discrepancies?.length > 0 && (
                              <div className="mt-2 text-xs bg-red-50 text-red-600 p-2 rounded">
                                <strong>Issues:</strong>
                                <ul className="list-disc list-inside">
                                  {doc.verification.discrepancies.map((issue, i) => (
                                    <li key={i}>{issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fine Print Section */}
          <Card>
            <CardHeader>
              <CardTitle>Fine Print & Terms</CardTitle>
              <CardDescription>Late fees, detention charges, and other contractual terms</CardDescription>
            </CardHeader>
            <CardContent>
              <EditableStopField
                value={currentLoad.finePrint}
                label="Contract Terms"
                onSave={(value) => {
                  setCurrentLoad({ ...currentLoad, finePrint: value });
                  // Save to Firestore
                  (async () => {
                    try {
                      const { db } = await import('@/lib/firebase');
                      const { doc, setDoc } = await import('firebase/firestore');
                      await setDoc(doc(db, 'loads', loadId), { finePrint: value }, { merge: true });
                      toast({ title: 'Fine print updated' });
                    } catch (e) {
                      console.error(e);
                      toast({ variant: 'destructive', title: 'Failed to update fine print' });
                    }
                  })();
                }}
                multiline
              />
            </CardContent>
          </Card>

          <RateConPdfViewer dataUri={currentLoad.rateConDataUri} />
        </div>

      </main>
    </div>
  );
}
