
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';

type Load = {
  id: string;
  brokerName: string;
  origin: string;
  destination: string;
  pickupDate: string;
  dropDate: string;
  driver: string;
  truck: string;
  miles: number;
  hours: number;
  perMileRate: number;
  rate: number;
  status: 'Booked' | 'In-transit' | 'Delivered' | 'Pending';
};

const loadsData: Load[] = [
    { id: 'LD-789012', brokerName: 'CH Robinson', origin: 'West Valley City, UT', destination: 'Boise, ID', pickupDate: '2025-12-29', dropDate: '2025-12-30', driver: 'John Doe', truck: 'TRUCK-A', miles: 342, hours: 6, perMileRate: 2.34, rate: 800, status: 'Booked' },
    { id: 'LD-345678', brokerName: 'Total Quality', origin: 'Phoenix, AZ', destination: 'Denver, CO', pickupDate: '2025-12-28', dropDate: '2025-12-29', driver: 'Jane Smith', truck: 'TRUCK-B', miles: 818, hours: 13, perMileRate: 1.47, rate: 1200, status: 'In-transit' },
    { id: 'LD-901234', brokerName: 'Coyote', origin: 'Las Vegas, NV', destination: 'Los Angeles, CA', pickupDate: '2025-12-27', dropDate: '2025-12-27', driver: 'Mike Johnson', truck: 'TRUCK-C', miles: 270, hours: 4, perMileRate: 2.22, rate: 600, status: 'Delivered' },
    { id: 'LD-567890', brokerName: 'Echo Global', origin: 'San Francisco, CA', destination: 'Seattle, WA', pickupDate: '2025-12-30', dropDate: '2026-01-01', driver: 'Emily Davis', truck: 'TRUCK-D', miles: 808, hours: 13, perMileRate: 1.86, rate: 1500, status: 'Booked' },
    { id: 'LD-123456', brokerName: 'CH Robinson', origin: 'Salt Lake City, UT', destination: 'Reno, NV', pickupDate: '2025-12-26', dropDate: '2025-12-27', driver: 'Chris Lee', truck: 'TRUCK-E', miles: 520, hours: 8, perMileRate: 1.44, rate: 750, status: 'Delivered' },
];

export function LoadsPage() {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Load; direction: 'ascending' | 'descending' } | null>(null);
  
  const sortedLoads = useMemo(() => {
    let sortableItems = [...loadsData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
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
  }, [sortConfig]);

  const requestSort = (key: keyof Load) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
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
      default:
        return 'default';
    }
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
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('id')}>Load # {getSortIndicator('id')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('brokerName')}>Broker {getSortIndicator('brokerName')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('origin')}>Origin {getSortIndicator('origin')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('destination')}>Destination {getSortIndicator('destination')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('pickupDate')}>Pickup Date {getSortIndicator('pickupDate')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('dropDate')}>Drop Date {getSortIndicator('dropDate')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('driver')}>Driver {getSortIndicator('driver')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('truck')}>Truck {getSortIndicator('truck')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('miles')}>Miles {getSortIndicator('miles')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('hours')}>Hours {getSortIndicator('hours')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('perMileRate')}>$/Mile {getSortIndicator('perMileRate')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('rate')}>Rate {getSortIndicator('rate')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('status')}>Status {getSortIndicator('status')}</Button></TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLoads.map((load) => (
                    <TableRow key={load.id}>
                      <TableCell className="font-medium">{load.id}</TableCell>
                      <TableCell>{load.brokerName}</TableCell>
                      <TableCell>{load.origin}</TableCell>
                      <TableCell>{load.destination}</TableCell>
                      <TableCell>{load.pickupDate}</TableCell>
                      <TableCell>{load.dropDate}</TableCell>
                      <TableCell>{load.driver}</TableCell>
                      <TableCell>{load.truck}</TableCell>
                      <TableCell>{load.miles}</TableCell>
                      <TableCell>{load.hours}</TableCell>
                      <TableCell>${load.perMileRate.toFixed(2)}</TableCell>
                      <TableCell>${load.rate}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(load.status)}>
                          {load.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign Driver/Truck</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
