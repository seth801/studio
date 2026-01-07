
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
import { Address } from '@/types/address';


export type Stop = {
  type: 'pickup' | 'delivery';
  address: Address;
  date: string;
  time: string;
  companyName?: string;
  referenceNotes?: string;
  phoneNumber?: string;
  instructions?: string;
};

export type LoadDocument = {
  id: string;
  type: 'RateConfirmation' | 'BOL' | 'Other';
  url: string;
  name: string;
  uploadedAt: Date;
  verification?: {
    isMatch: boolean;
    matchConfidence: number;
    arrivalDate?: string | null;
    arrivalTime?: string | null;
    departureDate?: string | null;
    departureTime?: string | null;
    hasReceiverSignature: boolean;
    signatureName?: string | null;
    discrepancies: string[];
  };
};

export type Load = {
  id: string;
  brokerName: string;
  origin: Address;
  destination: Address;
  pickupDate: Date;
  dropDate: Date;
  stops: Stop[];
  driver: string;
  truck: string;
  trailer?: string;
  miles: number;
  hours: number;
  perMileRate: number;
  rate: number;
  estProfit: number;
  status: 'Booked' | 'En route' | 'Completed' | 'Rescheduled' | 'Canceled';
  // Optional base64 data URI of the uploaded Rate Confirmation PDF/image
  rateConDataUri?: string; // Legacy field, keeping for compatibility
  // Fine print details: late fees, detention charges, etc.
  finePrint?: string;
  documents: LoadDocument[];
};

export const initialLoadsData: Load[] = [];


export type Driver = {
  id: string; // Internal ID or Employee ID (100-XXX)
  firstName: string;
  lastName: string;
  name: string; // Full Name
  status: 'Active' | 'Applicant' | 'Terminated' | 'On Leave';

  // Personal
  dob?: string; // M/D/YYYY
  age?: number;
  phone?: string;
  email?: string;
  address?: Address;

  // Employment
  employeeId?: string; // 100-XXX
  hireDate?: string;
  terminationDate?: string; // Date Left IDS
  terminationReason?: string;
  yearsExperience?: number;
  yearsWorking?: number; // yrs working
  payRate?: string;
  fuelCode?: string;

  // License
  licenseNumber?: string;
  licenseState?: string;
  licenseIssued?: string;
  licenseExpiration?: string; // DL Exp - Watch for Alerts
  cdl: boolean; // Checkbox

  // Compliance & Certifications
  samsara: boolean;
  forkLiftCertExpiration?: string;
  medicalCardExpiration?: string; // DOT Card Exp - Watch for Alerts
  mvrAnnualDueDate?: string; // MVR Annual Due - Watch for Alerts
  drugAlcoholClearinghouse: boolean; // FMCSA DA
  lastRandomDrugTest?: string;
  consentFmcsaDate?: string;

  // Onboarding / Documents (Checkboxes mostly)
  hasHandbook: boolean;
  hasI9: boolean;
  hasApplication: boolean;
  hasRoadTest: boolean;
  hasMedicalDeclaration: boolean;
  hasDriversLicenseCopy: boolean;

  // AI & Uploads
  avatarUrl?: string; // AI Generated Avatar
  finePrint?: string;
  hasPev: boolean; // PEV
  hasPreEmploymentDrugTest: boolean; // Pre E Drug
  hasDrugAlcoholDocs: boolean;
  isEntryLevel: boolean; // Entry level Cert
  isMultiEmployer: boolean; // Multiple-Employer Drivers
  moveToPrevious?: boolean;

  // -- JOB APPLICATION FIELDS (New) --
  // Safety & Eligibility
  isCitizen?: boolean;
  licenseSuspended?: boolean;
  felonyConviction?: boolean;
  drugTestRefusal?: boolean;
  educationLevel?: string;

  // Experience
  equipmentExperience?: {
    boxTruck?: boolean;
    tractorTrailer?: boolean;
    pickup?: boolean;
  };

  // History
  previousEmployment?: {
    employerName: string;
    phone?: string;
    startDate: string;
    endDate: string;
    reasonForLeaving?: string;
    responsibilities?: string;
  }[];

  // Signature
  signatureUrl?: string; // Data URI
  applicationDate?: string;

  // Verified File Paths (Firebase/Drive Links)
  files?: {
    driversLicense?: string;
    medicalCard?: string;
    mvr?: string;
    roadTest?: string;
    handbook?: string;
    application?: string;
  };
};

export const allDrivers: Driver[] = [
  {
    id: 'driver-007',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    status: 'Active',
    cdl: true,
    samsara: true,
    hasHandbook: true,
    hasI9: true,
    hasApplication: true,
    hasRoadTest: true,
    hasMedicalDeclaration: true,
    hasDriversLicenseCopy: true,
    hasPev: true,
    hasPreEmploymentDrugTest: true,
    hasDrugAlcoholDocs: true,
    isEntryLevel: false,
    isMultiEmployer: false,
    drugAlcoholClearinghouse: true
  },
  { id: 'driver-009', firstName: 'Emily', lastName: 'Davis', name: 'Emily Davis', status: 'Active', cdl: true, samsara: true, hasHandbook: true, hasI9: true, hasApplication: true, hasRoadTest: true, hasMedicalDeclaration: true, hasPev: true, hasPreEmploymentDrugTest: true, hasDrugAlcoholDocs: true, hasDriversLicenseCopy: true, isEntryLevel: false, isMultiEmployer: false, drugAlcoholClearinghouse: true },
  { id: 'driver-001', firstName: 'Jane', lastName: 'Smith', name: 'Jane Smith', status: 'Active', cdl: true, samsara: true, hasHandbook: true, hasI9: true, hasApplication: true, hasRoadTest: true, hasMedicalDeclaration: true, hasPev: true, hasPreEmploymentDrugTest: true, hasDrugAlcoholDocs: true, hasDriversLicenseCopy: true, isEntryLevel: false, isMultiEmployer: false, drugAlcoholClearinghouse: true },
  { id: 'driver-002', firstName: 'Mike', lastName: 'Johnson', name: 'Mike Johnson', status: 'Active', cdl: true, samsara: true, hasHandbook: true, hasI9: true, hasApplication: true, hasRoadTest: true, hasMedicalDeclaration: true, hasPev: true, hasPreEmploymentDrugTest: true, hasDrugAlcoholDocs: true, hasDriversLicenseCopy: true, isEntryLevel: false, isMultiEmployer: false, drugAlcoholClearinghouse: true },
  { id: 'driver-003', firstName: 'Chris', lastName: 'Lee', name: 'Chris Lee', status: 'Active', cdl: true, samsara: true, hasHandbook: true, hasI9: true, hasApplication: true, hasRoadTest: true, hasMedicalDeclaration: true, hasPev: true, hasPreEmploymentDrugTest: true, hasDrugAlcoholDocs: true, hasDriversLicenseCopy: true, isEntryLevel: false, isMultiEmployer: false, drugAlcoholClearinghouse: true },
];


export const allTrucks = [
  { id: 'truck-a', name: 'TRUCK-A' },
  { id: 'truck-b', name: 'TRUCK-B' },
  { id: 'truck-c', name: 'TRUCK-C' },
  { id: 'truck-d', name: 'TRUCK-D' },
  { id: 'truck-e', name: 'TRUCK-E' },
];

export const allTrailers = [
  { id: 'trailer-001', name: 'TRAILER-001' },
  { id: 'trailer-002', name: 'TRAILER-002' },
  { id: 'trailer-003', name: 'TRAILER-003' },
  { id: 'trailer-004', name: 'TRAILER-004' },
  { id: 'trailer-005', name: 'TRAILER-005' },
];


import { useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

// Helper to safely display city, state from either old string format or new Address structure
const displayCityState = (address: Address | string | undefined): string => {
  if (!address) return '';

  // If it's already an Address object
  if (typeof address === 'object' && 'city' in address && 'state' in address) {
    return `${address.city}, ${address.state}`;
  }

  // If it's still a string (old format), try to parse it
  if (typeof address === 'string') {
    // Use regex to extract city and state
    const stateMatch = address.match(/\b([A-Z]{2})\b(?:\s+\d{5})?$/);
    if (stateMatch) {
      const state = stateMatch[1];
      const beforeState = address.substring(0, stateMatch.index).trim().replace(/,\s*$/, '');
      const parts = beforeState.split(',').map(s => s.trim());
      const city = parts[parts.length - 1];
      return `${city}, ${state}`;
    }
    return address; // Fallback to full string
  }

  return '';
};

export function LoadsPage() {
  const [loads, setLoads] = useState<Load[]>(initialLoadsData);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error setting up Firestore listener:', error);
        setIsLoading(false);
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
      await setDoc(doc(db, 'loads', loadId), { status: 'Canceled' }, { merge: true });
      setLoads(prev =>
        prev.map(l => (l.id === loadId ? { ...l, status: 'Canceled' } : l))
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

  const handleStopDateChange = async (loadId: string, stopIndex: number, newDate: string) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      // Update local state first
      setLoads(prev =>
        prev.map(l => {
          if (l.id !== loadId) return l;
          const updatedStops = [...l.stops];
          updatedStops[stopIndex] = { ...updatedStops[stopIndex], date: newDate };
          return { ...l, stops: updatedStops };
        })
      );

      // Update Firestore
      const fieldPath = `stops.${stopIndex}.date`;
      await setDoc(doc(db, 'loads', loadId), { [fieldPath]: newDate } as any, { merge: true });

      toast({ title: 'Stop date updated' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Failed to update stop date' });
    }
  };

  const handleStopTimeChange = async (loadId: string, stopIndex: number, newTime: string) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      // Update local state first
      setLoads(prev =>
        prev.map(l => {
          if (l.id !== loadId) return l;
          const updatedStops = [...l.stops];
          updatedStops[stopIndex] = { ...updatedStops[stopIndex], time: newTime };
          return { ...l, stops: updatedStops };
        })
      );

      // Update Firestore
      const fieldPath = `stops.${stopIndex}.time`;
      await setDoc(doc(db, 'loads', loadId), { [fieldPath]: newTime } as any, { merge: true });

      toast({ title: 'Stop time updated' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Failed to update stop time' });
    }
  };

  const handleStopFieldChange = async (loadId: string, stopIndex: number, field: keyof Stop, value: string) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      // Update local state first
      setLoads(prev =>
        prev.map(l => {
          if (l.id !== loadId) return l;
          const updatedStops = [...l.stops];
          updatedStops[stopIndex] = { ...updatedStops[stopIndex], [field]: value };
          return { ...l, stops: updatedStops };
        })
      );

      // Update Firestore
      const fieldPath = `stops.${stopIndex}.${field}`;
      await setDoc(doc(db, 'loads', loadId), { [fieldPath]: value } as any, { merge: true });

      toast({ title: `Stop ${field} updated` });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: `Failed to update stop ${field}` });
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
      case 'En route':
        return 'secondary';
      case 'Completed':
        return 'outline';
      case 'Rescheduled':
        return 'default';
      case 'Canceled':
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
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-8 w-[140px]" /></div></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-8 w-[140px]" /></div></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-4 w-[80px]" /></div></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-4 w-[80px]" /></div></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-4 w-[60px]" /></div></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-4 w-[60px]" /></div></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-4 w-[40px]" /></div></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-4 w-[60px]" /></div></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-4 w-[60px]" /></div></TableCell>
                        <TableCell className="text-center"><div className="flex justify-center"><Skeleton className="h-8 w-[100px]" /></div></TableCell>
                        <TableCell className="text-right"><div className="flex justify-end"><Skeleton className="h-8 w-[50px]" /></div></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    sortedLoads.map((load) => (
                      <TableRow key={load.id}>
                        <TableCell className="font-medium">
                          <Link href={`/load/${load.id}`} className='text-primary hover:underline'>{load.id}</Link>
                        </TableCell>
                        <TableCell>{load.brokerName}</TableCell>
                        <TableCell>{displayCityState(load.origin)}</TableCell>
                        <TableCell>{displayCityState(load.destination)}</TableCell>
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
                          <div className="flex items-center justify-center gap-1">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Badge variant={getStatusVariant(load.status)}>{load.status}</Badge>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[600px] p-4 max-h-[80vh] overflow-y-auto">
                                <div className="space-y-4">
                                  <h4 className="font-medium mb-2">Edit Stop Details</h4>
                                  {load.stops.map((stop, idx) => (
                                    <div key={idx} className="border rounded-lg p-3 space-y-3">
                                      <div className="font-medium text-sm capitalize">{stop.type} Stop {idx + 1}</div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-muted-foreground">Date</label>
                                          <Calendar mode="single" selected={new Date(stop.date)} onSelect={(date) => date && handleStopDateChange(load.id, idx, date.toISOString().split('T')[0])} className="w-full" />
                                        </div>
                                        <div className="space-y-2">
                                          <div>
                                            <label className="text-xs text-muted-foreground">Time</label>
                                            <Input type="time" value={stop.time} onChange={(e) => handleStopTimeChange(load.id, idx, e.target.value)} className="w-full" />
                                          </div>
                                          <div>
                                            <label className="text-xs text-muted-foreground">Company Name</label>
                                            <Input value={stop.companyName || ''} onChange={(e) => handleStopFieldChange(load.id, idx, 'companyName', e.target.value)} placeholder="Enter company name" className="w-full" />
                                          </div>
                                          <div>
                                            <label className="text-xs text-muted-foreground">Phone Number</label>
                                            <Input value={stop.phoneNumber || ''} onChange={(e) => handleStopFieldChange(load.id, idx, 'phoneNumber', e.target.value)} placeholder="Enter phone number" className="w-full" />
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground">Reference Notes</label>
                                        <textarea
                                          value={stop.referenceNotes || ''}
                                          onChange={(e) => handleStopFieldChange(load.id, idx, 'referenceNotes', e.target.value)}
                                          placeholder="Enter reference notes"
                                          className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground">Instructions</label>
                                        <textarea
                                          value={stop.instructions || ''}
                                          onChange={(e) => handleStopFieldChange(load.id, idx, 'instructions', e.target.value)}
                                          placeholder="Enter instructions"
                                          className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <span className="sr-only">Change status</span>
                                  ⋮
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'Booked')}>Booked</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'En route')}>En route</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'Completed')}>Completed</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'Rescheduled')}>Rescheduled</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStatusChange(load.id, 'Canceled')}>Canceled</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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
                    ))
                  )}
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



