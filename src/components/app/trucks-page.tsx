
'use client';

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
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TrucksPage() {
  const trucks = [
    { truckNumber: '387445', location: 'Los Angeles, CA', route: 'LAX-01', geofence: 'LAX Distribution Center', driver: 'John Doe', status: 'Driving' },
    { truckNumber: '219876', location: 'Phoenix, AZ', route: 'PHX-03', geofence: 'Phoenix Warehouse', driver: 'Jane Smith', status: 'Idling' },
    { truckNumber: '554321', location: 'Denver, CO', route: 'DEN-02', geofence: 'Denver Hub', driver: 'Mike Johnson', status: 'On' },
    { truckNumber: '987654', location: 'Las Vegas, NV', route: 'LVS-05', geofence: 'Las Vegas Depot', driver: 'Emily Davis', status: 'Driving' },
    { truckNumber: '123789', location: 'San Francisco, CA', route: 'SFO-04', geofence: 'SFO Logistics', driver: 'Chris Lee', status: 'On' },
  ];

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
              <TableHead>Truck Number</TableHead>
              <TableHead>Current Location</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Geofence Address</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trucks.map((truck) => (
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
