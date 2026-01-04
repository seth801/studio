
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, ArrowUp, ArrowDown, ArrowUpDown, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';


export type Stop = {
  type: 'pickup' | 'delivery';
  location: string;
  date: string;
  time: string;
};

export type Load = {
  id: string;
  brokerName: string;
  origin: string;
  destination: string;
  pickupDate: Date;
  dropDate: Date;
  stops: Stop[];
  driver: string;
  truck: string;
  miles: number;
  hours: number;
  perMileRate: number;
  rate: number;
  estProfit: number;
  status: 'Booked' | 'In-transit' | 'Delivered' | 'Pending' | 'Cancelled';
  // Optional base64 data URI of the uploaded Rate Confirmation PDF/image
  rateConDataUri?: string;
};

export const initialLoadsData: Load[] = [
  { id: 'LD-789012', brokerName: 'CH Robinson', origin: 'West Valley City, UT', destination: 'Boise, ID', pickupDate: new Date(2025, 11, 29), dropDate: new Date(2025, 11, 30), stops: [{ type: 'pickup', location: '123 Main St, West Valley City, UT 84119', date: '2025-12-29', time: '08:00 EST' }, { type: 'delivery', location: '456 Center St, Boise, ID 83702', date: '2025-12-30', time: '14:00 PST' }], driver: 'driver-007', truck: 'truck-a', miles: 342, hours: 6, perMileRate: 2.34, rate: 800, estProfit: 250, status: 'Booked' },
  { id: 'LD-345678', brokerName: 'Total Quality', origin: 'Phoenix, AZ', destination: 'Denver, CO', pickupDate: new Date(2025, 11, 28), dropDate: new Date(2025, 11, 29), stops: [{ type: 'pickup', location: '789 Grand Ave, Phoenix, AZ 85001', date: '2025-12-28', time: '09:00 MST' }, { type: 'delivery', location: '101 Broadway, Denver, CO 80203', date: '2025-12-29', time: '16:00 MST' }], driver: 'driver-001', truck: 'truck-b', miles: 818, hours: 13, perMileRate: 1.47, rate: 1200, estProfit: 400, status: 'In-transit' },
  { id: 'LD-901234', brokerName: 'Coyote', origin: 'Las Vegas, NV', destination: 'Los Angeles, CA', pickupDate: new Date(2025, 11, 27), dropDate: new Date(2025, 11, 27), stops: [{ type: 'pickup', location: '212 Fremont St, Las Vegas, NV 89101', date: '2025-12-27', time: '10:00 PST' }, { type: 'delivery', location: '313 Hollywood Blvd, Los Angeles, CA 90028', date: '2025-12-27', time: '15:00 PST' }], driver: 'driver-003', truck: 'truck-c', miles: 270, hours: 4, perMileRate: 2.22, rate: 600, estProfit: 200, status: 'Delivered' },
  { id: 'LD-567890', brokerName: 'Echo Global', origin: 'San Francisco, CA', destination: 'Seattle, WA', pickupDate: new Date(2025, 11, 30), dropDate: new Date(2026, 0, 1), stops: [{ type: 'pickup', location: '414 Lombard St, San Francisco, CA 94133', date: '2025-12-30', time: '11:00 PST' }, { type: 'delivery', location: '515 Pike St, Seattle, WA 98101', date: '2026-01-01', time: '18:00 PST' }], driver: 'driver-009', truck: 'truck-d', miles: 808, hours: 13, perMileRate: 1.86, rate: 1500, estProfit: 500, status: 'Booked' },
  { id: 'LD-123456', brokerName: 'CH Robinson', origin: 'Salt Lake City, UT', destination: 'Reno, NV', pickupDate: new Date(2025, 11, 26), dropDate: new Date(2025, 11, 27), stops: [{ type: 'pickup', location: '616 Temple Square, Salt Lake City, UT 84150', date: '2025-12-26', time: '12:00 MST' }, { type: 'delivery', location: '717 Virginia St, Reno, NV 89501', date: '2025-12-27', time: '19:00 PST' }], driver: 'driver-002', truck: 'truck-e', miles: 520, hours: 8, perMileRate: 1.44, rate: 750, estProfit: 225, status: 'Delivered' },
];

export const allDrivers = [
  { id: 'driver-007', name: 'John Doe' },
  { id: 'driver-009', name: 'Emily Davis' },
  { id: 'driver-001', name: 'Jane Smith' },
  { id: 'driver-002', name: 'Mike Johnson' },
  { id: 'driver-003', name: 'Chris Lee' },
];

export const allTrucks = [
  { id: 'truck-a', name: 'TRUCK-A' },
  { id: 'truck-b', name: 'TRUCK-B' },
  { id: 'truck-c', name: 'TRUCK-C' },
  { id: 'truck-d', name: 'TRUCK-D' },
  { id: 'truck-e', name: 'TRUCK-E' },
];


import { useEffect } from 'react';

export function LoadsPage() {
  const [loads, setLoads] = useState<Load[]>(initialLoadsData);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Load; direction: 'ascending' | 'descending' } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe = () => { };

    const setupFirestore = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, query, onSnapshot, orderBy } = await import('firebase/firestore');

        const q = query(collection(db, 'loads'), orderBy('createdAt', 'desc'));

        unsubscribe = onSnapshot(q, (snapshot) => {
          const firestoreLoads = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
              // Convert Firestore Timestamp to Date
              pickupDate: data.pickupDate?.toDate ? data.pickupDate.toDate() : new Date(data.pickupDate),
              dropDate: data.dropDate?.toDate ? data.dropDate.toDate() : new Date(data.dropDate),
            } as Load;
          });

          // Merge with initial mock data if needed, or just replace
          // Replacing for now to see real data
          setLoads(prevLoads => {
            // Keep initial loads that aren't in Firestore yet? 
            // Or just show Firestore data if there's any.
            if (firestoreLoads.length > 0) {
              return firestoreLoads;
            }
            return initialLoadsData;
          });
        });
      } catch (error) {
        console.error('Error setting up Firestore listener:', error);
      }
    };

    setupFirestore();
    return () => unsubscribe();
  }, []);

  const sortedLoads = useMemo(() => {
    let sortableItems = [...loads];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [loads, sortConfig]);

  const requestSort = (key: keyof Load) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Delete a load from Firestore and local state
  const handleDeleteLoad = async (loadId: string) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'loads', loadId));
      // Remove from local state
      setLoads(prev => prev.filter(l => l.id !== loadId));
      toast({
        title: 'Load Deleted',
        description: `Load ${loadId} has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting load:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: 'Could not delete the load. Please try again.',
      });
    }
  };

  // Cancel a load (set status to Cancelled)
  const handleCancelLoad = async (loadId: string) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'loads', loadId), { status: 'Cancelled' }, { merge: true });
      setLoads(prev =>
        prev.map(l => (l.id === loadId ? { ...l, status: 'Cancelled' } : l))
      );
      toast({
        title: 'Load Cancelled',
        description: `Load ${loadId} has been cancelled.`,
      });
    } catch (error) {
      console.error('Error cancelling load:', error);
      toast({
        variant: 'destructive',
        title: 'Cancel Failed',
        description: 'Could not cancel the load. Please try again.',
      });
    }
  };

  // Update load status
  const handleStatusChange = async (loadId: string, newStatus: Load['status']) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'loads', loadId), { status: newStatus }, { merge: true });
      setLoads(prev =>
        prev.map(l => (l.id === loadId ? { ...l, status: newStatus } : l))
      );
      toast({
        title: 'Load Status Updated',
        description: `Load ${loadId} status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating load status:', error);
      toast({
        variant: 'destructive',
        title: 'Status Update Failed',
        description: 'Could not update load status. Please try again.',
      });
    }
  };

  const handleFieldChange = async (loadId: string, field: keyof Load, value: any) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      // Special handling for Date objects to convert them to Firestore Timestamps
      const fieldValue = value instanceof Date ? value : value;

      await setDoc(doc(db, 'loads', loadId), { [field]: fieldValue }, { merge: true });

      setLoads(prevLoads =>
        prevLoads.map(load =>
          load.id === loadId ? { ...load, [field]: value } : load
        )
      );
      toast({
        title: 'Load Updated',
        description: `Load ${loadId} ${String(field)} updated.`,
      });
    } catch (error) {
      console.error(`Error updating load field ${String(field)}:`, error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: `Could not update ${String(field)}. Please try again.`,
      });
    }
  };

  const getSortIndicator = (key: keyof Load) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'default';
      case 'In-transit':
        return 'secondary';
      case 'Delivered':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  }

  const getDriverName = (driverId: string) => {
    return allDrivers.find(d => d.id === driverId)?.name || 'Unassigned';
  }

  const getTruckName = (truckId: string) => {
    return allTrucks.find(t => t.id === truckId)?.name || 'Unassigned';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispatch</CardTitle>
        <CardDescription>
          Manage all your loads from here. View by table, calendar, or availability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <div className="overflow-auto max-h-[calc(100vh-320px)] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('id')}>Load # {getSortIndicator('id')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('brokerName')}>Broker {getSortIndicator('brokerName')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('origin')}>Origin {getSortIndicator('origin')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('destination')}>Destination {getSortIndicator('destination')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('pickupDate')}>Pickup Date {getSortIndicator('pickupDate')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('dropDate')}>Drop Date {getSortIndicator('dropDate')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('driver')}>Driver {getSortIndicator('driver')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('truck')}>Truck {getSortIndicator('truck')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('miles')}>Miles {getSortIndicator('miles')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('hours')}>Hours {getSortIndicator('hours')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('perMileRate')}>$/Mile {getSortIndicator('perMileRate')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('rate')}>Rate {getSortIndicator('rate')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('estProfit')}>Est Profit {getSortIndicator('estProfit')}</Button></TableHead>
                    <TableHead className="text-center"><Button variant="ghost" onClick={() => requestSort('status')}>Status {getSortIndicator('status')}</Button></TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLoads.map((load) => (
                    <TableRow key={load.id}>
                      <TableCell className="font-medium">
                        <Link href={`/load/${load.id}`} className='text-primary hover:underline'>{load.id}</Link>
                      </TableCell>
                      <TableCell>{load.brokerName}</TableCell>
                      <TableCell>{load.origin}</TableCell>
                      <TableCell>{load.destination}</TableCell>
                      <TableCell className="text-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[140px] justify-start text-left font-normal",
                                !load.pickupDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {load.pickupDate ? format(load.pickupDate, "M/d/yy") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={load.pickupDate}
                              onSelect={(date) => handleFieldChange(load.id, 'pickupDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="text-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[140px] justify-start text-left font-normal",
                                !load.dropDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {load.dropDate ? format(load.dropDate, "M/d/yy") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={load.dropDate}
                              onSelect={(date) => handleFieldChange(load.id, 'dropDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="text-center">
                        <Select onValueChange={(value) => handleFieldChange(load.id, 'driver', value)} defaultValue={load.driver}>
                          <SelectTrigger className='w-[150px]'>
                            <SelectValue placeholder="Select driver" >{getDriverName(load.driver)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {allDrivers.map(driver => (
                              <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <Select onValueChange={(value) => handleFieldChange(load.id, 'truck', value)} defaultValue={load.truck}>
                          <SelectTrigger className='w-[120px]'>
                            <SelectValue placeholder="Select truck">{getTruckName(load.truck)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {allTrucks.map(truck => (
                              <SelectItem key={truck.id} value={truck.id}>{truck.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">{load.miles}</TableCell>
                      <TableCell className="text-center">{load.hours}</TableCell>
                      <TableCell className="text-center">${load.perMileRate.toFixed(2)}</TableCell>
                      <TableCell className="text-center">${load.rate}</TableCell>
                      <TableCell className="text-center">${load.estProfit}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Badge variant={getStatusVariant(load.status)}>{load.status}</Badge>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2">
                                  <div className="space-y-2">
                                    <h4 className="font-medium mb-2">Edit Stops</h4>
                                    {load.stops.map((stop, idx) => (
                                      <div key={idx} className="flex items-center space-x-2 mb-2">
                                        <Calendar mode="single" selected={new Date(stop.date)} onSelect={(date) => date && handleStopDateChange(load.id, idx, date.toISOString().split('T')[0])} />
                                        <Input type="time" value={stop.time} onChange={(e) => handleStopTimeChange(load.id, idx, e.target.value)} className="w-24" />
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'Booked')}>Booked</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'In-transit')}>In-transit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'Delivered')}>Delivered</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'Pending')}>Pending</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'Cancelled')}>Cancelled</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Link href={`/load/${load.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleCancelLoad(load.id)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteLoad(load.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="calendar">
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Calendar view coming soon.</p>
            </div>
          </TabsContent>
          <TabsContent value="board">
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Board view coming soon.</p>
            </div>
          </TabsContent>
          <TabsContent value="availability">
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Availability view coming soon.</p>
            </div>
          </TabsContent>
        </Tabs >
      </CardContent >
    </Card >
  );
}



