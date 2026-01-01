
'use client';

import { notFound } from 'next/navigation';
import { allDrivers, allTrucks, initialLoadsData, type Load } from './loads-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { MapPin, Clock, Truck, User, Milestone, Calendar, ArrowRight, Weight, DraftingCompass } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

function GoogleMapEmbed({ stops }: { stops: { location: string }[] }) {
    if (!stops || stops.length === 0) {
      return <div>No stops defined to display map.</div>;
    }
  
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
    if (!apiKey) {
      return (
        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
          <p className="text-muted-foreground">Google Maps API Key not configured.</p>
        </div>
      );
    }
  
    const origin = stops[0].location;
    const destination = stops[stops.length - 1].location;
    const waypoints = stops.slice(1, -1).map(stop => stop.location).join('|');
  
    const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}`;
  
    return (
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={embedUrl}
      ></iframe>
    );
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

export function LoadDetailsPage({ loadId }: { loadId: string }) {
  const load = initialLoadsData.find((l) => l.id === loadId);

  if (!load) {
    // In a real app, you'd fetch from a DB and show a not found page.
    // For now, we can use the `notFound()` from Next.js
    notFound();
  }

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

  const stops = [
      { type: 'Pickup', location: load.origin, date: load.pickupDate, time: "08:00 EST" },
      { type: 'Delivery', location: load.destination, date: load.dropDate, time: "14:00 PST" }
  ]

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
                <GoogleMapEmbed stops={stops} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Stops</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {stops.map((stop, index) => (
                        <div key={index} className='flex items-start gap-4'>
                            <div className='flex flex-col items-center'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                                    <MapPin className='h-4 w-4'/>
                                </div>
                                {index < stops.length - 1 && <div className='h-16 w-px bg-border my-2'/>}
                            </div>
                            <div>
                                <p className='font-semibold'>{stop.type}: {stop.location}</p>
                                <p className='text-sm text-muted-foreground flex items-center gap-2'>
                                    <Calendar className='h-4 w-4'/> {stop.date.toLocaleDateString()}
                                    <Clock className='h-4 w-4 ml-2'/> {stop.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>

        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
             <div className='grid gap-4 sm:grid-cols-2'>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Broker</CardDescription>
                        <CardTitle className="text-xl">{load.brokerName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">Load ID: {load.id}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Status</CardDescription>
                        <CardTitle className="text-xl">
                             <Badge variant={getStatusVariant(load.status)} className='text-md'>{load.status}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">Updated 2 hours ago</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Rate</CardDescription>
                        <CardTitle className="text-xl">${load.rate.toLocaleString()}</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <div className="text-xs text-muted-foreground">${load.perMileRate.toFixed(2)} / mile</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Est. Profit</CardDescription>
                        <CardTitle className="text-xl text-green-400">${load.estProfit.toLocaleString()}</CardTitle>
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
                        <span className="text-muted-foreground flex items-center gap-2"><Truck className='h-4 w-4'/> Truck</span>
                        <span>{getTruckName(load.truck)}</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><User className='h-4 w-4'/> Driver</span>
                        <span>{getDriverName(load.driver)}</span>
                    </div>
                     <Separator />
                     <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Milestone className='h-4 w-4'/> Total Miles</span>
                        <span>{load.miles} mi</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Clock className='h-4 w-4'/> Est. Hours</span>
                        <span>~{load.hours} hrs</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Weight className='h-4 w-4'/> Commodity</span>
                        <span>Dry Goods, 31200 lbs</span>
                    </div>
                    <Separator />
                    <div className='flex flex-col gap-2'>
                        <div className="flex items-center justify-between font-semibold">
                            <span>{load.origin}</span>
                            <ArrowRight className='h-4 w-4'/>
                            <span>{load.destination}</span>
                        </div>
                         <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{load.pickupDate.toLocaleDateString()}</span>
                            <span>{load.dropDate.toLocaleDateString()}</span>
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
