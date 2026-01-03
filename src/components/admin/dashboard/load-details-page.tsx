
'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { allDrivers, allTrucks, initialLoadsData, type Load, type Stop } from './loads-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Truck, User, Milestone, Calendar, ArrowRight, Weight, Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

import { GoogleMapDirections } from './google-map-directions';

function GoogleMapEmbed({ stops }: { stops: { location: string }[] }) {
  return <GoogleMapDirections stops={stops} />;
}


function RateConPdfViewer() {
  // In a real app, you would fetch the PDF URL for the load
  const pdfUrl = '/rate-con-placeholder.pdf';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Confirmation</CardTitle>
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


export function LoadDetailsPage({ loadId }: { loadId: string }) {
  const [currentLoad, setCurrentLoad] = useState<Load | undefined>(() => initialLoadsData.find((l) => l.id === loadId));
  const [isLoading, setIsLoading] = useState(!currentLoad);

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

  const handleStopLocationChange = (stopIndex: number, newLocation: string) => {
    const updatedStops = [...currentLoad.stops];
    updatedStops[stopIndex].location = newLocation;

    const updatedLoad = { ...currentLoad, stops: updatedStops };

    if (stopIndex === 0) {
      updatedLoad.origin = newLocation.split(',').slice(0, 2).join(', ');
    }
    if (stopIndex === updatedStops.length - 1) {
      updatedLoad.destination = newLocation.split(',').slice(0, 2).join(', ');
    }

    setCurrentLoad(updatedLoad);
    // Here you would typically also update this in your backend/DB
  };

  const getDriverName = (driverId: string) => allDrivers.find(d => d.id === driverId)?.name || 'Unassigned';
  const getTruckName = (truckId: string) => allTrucks.find(t => t.id === truckId)?.name || 'Unassigned';

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Booked': return 'default';
      case 'In-transit': return 'secondary';
      case 'Delivered': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">Back to Loads</Link>
        </Button>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

          <Card className='h-[60vh]'>
            <GoogleMapEmbed stops={currentLoad.stops} />
          </Card>

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
                    {index < currentLoad.stops.length - 1 && <div className='h-20 w-px bg-border my-2' />}
                  </div>
                  <div>
                    <p className='capitalize font-medium text-muted-foreground'>{stop.type}</p>
                    <EditableStopLocation
                      location={stop.location}
                      onSave={(newLocation) => handleStopLocationChange(index, newLocation)}
                    />
                    <p className='text-sm text-muted-foreground flex items-center gap-2 mt-1'>
                      <Calendar className='h-4 w-4' /> {stop.date}
                      <Clock className='h-4 w-4 ml-2' /> {stop.time}
                    </p>
                    {index > 0 && (
                      <p className='text-sm text-green-400 font-medium flex items-center gap-2 mt-1'>
                        ETA: in 2h 30m
                      </p>
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
                  <Badge variant={getStatusVariant(currentLoad.status)} className='text-md'>{currentLoad.status}</Badge>
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
                <div className="text-xs text-muted-foreground">${currentLoad.perMileRate.toFixed(2)} / mile</div>
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
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Truck className='h-4 w-4' /> Truck</span>
                <span>{getTruckName(currentLoad.truck)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><User className='h-4 w-4' /> Driver</span>
                <span>{getDriverName(currentLoad.driver)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Milestone className='h-4 w-4' /> Total Miles</span>
                <span>{currentLoad.miles} mi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Clock className='h-4 w-4' /> Est. Hours</span>
                <span>~{currentLoad.hours} hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Weight className='h-4 w-4' /> Commodity</span>
                <span>Dry Goods, {currentLoad.stops[0].location.includes('31200') ? '31200' : 'N/A'} lbs</span>
              </div>
              <Separator />
              <div className='flex flex-col gap-2'>
                <div className="flex items-center justify-between font-semibold">
                  <span>{currentLoad.origin}</span>
                  <ArrowRight className='h-4 w-4' />
                  <span>{currentLoad.destination}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{format(currentLoad.pickupDate, 'M/d/yy')}</span>
                  <span>{format(currentLoad.dropDate, 'M/d/yy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <RateConPdfViewer />
        </div>

      </main>
    </div>
  );
}

