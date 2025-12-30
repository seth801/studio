
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Truck = {
  truckNumber: string;
  location: string;
  route: string;
  geofence: string;
  driver: string;
  status: string;
};

const trucksData: Truck[] = [
  { truckNumber: '387445', location: 'Los Angeles, CA', route: 'LAX-01', geofence: 'LAX Distribution Center', driver: 'John Doe', status: 'Driving' },
  { truckNumber: '219876', location: 'Phoenix, AZ', route: 'PHX-03', geofence: 'Phoenix Warehouse', driver: 'Jane Smith', status: 'Idling' },
  { truckNumber: '554321', location: 'Denver, CO', route: 'DEN-02', geofence: 'Denver Hub', driver: 'Mike Johnson', status: 'On' },
  { truckNumber: '987654', location: 'Las Vegas, NV', route: 'LVS-05', geofence: 'Las Vegas Depot', driver: 'Emily Davis', status: 'Driving' },
  { truckNumber: '123789', location: 'San Francisco, CA', route: 'SFO-04', geofence: 'SFO Logistics', driver: 'Chris Lee', status: 'On' },
];

export function TrucksPage() {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Truck; direction: 'ascending' | 'descending' } | null>(null);

  const sortedTrucks = useMemo(() => {
    let sortableItems = [...trucksData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);

  const requestSort = (key: keyof Truck) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Truck) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    // Icons can be changed to up/down arrows based on direction if desired
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };


  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Driving':
        return 'default';
      case 'Idling':
        return 'secondary';
      case 'On':
        return 'outline';
      default:
        return 'default';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trucks</CardTitle>
        <CardDescription>
          A list of all trucks in the fleet and their current status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('truckNumber')}>
                  Truck Number
                  {getSortIndicator('truckNumber')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('location')}>
                  Current Location
                  {getSortIndicator('location')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('route')}>
                  Route
                  {getSortIndicator('route')}
                </Button>
              </TableHead>
              <TableHead>Geofence Address</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('driver')}>
                  Driver
                  {getSortIndicator('driver')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('status')}>
                  Status
                  {getSortIndicator('status')}
                </Button>
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTrucks.map((truck) => (
              <TableRow key={truck.truckNumber}>
                <TableCell className="font-medium">{truck.truckNumber}</TableCell>
                <TableCell>{truck.location}</TableCell>
                <TableCell>{truck.route}</TableCell>
                <TableCell>{truck.geofence}</TableCell>
                <TableCell>{truck.driver}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(truck.status)}>
                    {truck.status}
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
                      <DropdownMenuItem>View Truck Details</DropdownMenuItem>
                      <DropdownMenuItem>Message Driver</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
