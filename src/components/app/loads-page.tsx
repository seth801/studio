
'use client';

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
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function LoadsPage() {
  const loads = [
    { id: 'LD-789012', brokerName: 'CH Robinson', origin: 'West Valley City, UT', destination: 'Boise, ID', status: 'Booked', rate: '$800' },
    { id: 'LD-345678', brokerName: 'Total Quality', origin: 'Phoenix, AZ', destination: 'Denver, CO', status: 'In-transit', rate: '$1,200' },
    { id: 'LD-901234', brokerName: 'Coyote', origin: 'Las Vegas, NV', destination: 'Los Angeles, CA', status: 'Delivered', rate: '$600' },
    { id: 'LD-567890', brokerName: 'Echo Global', origin: 'San Francisco, CA', destination: 'Seattle, WA', status: 'Booked', rate: '$1,500' },
    { id: 'LD-123456', brokerName: 'CH Robinson', origin: 'Salt Lake City, UT', destination: 'Reno, NV', status: 'Delivered', rate: '$750' },
  ];

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
                    <TableHead>Load #</TableHead>
                    <TableHead>Broker</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loads.map((load) => (
                    <TableRow key={load.id}>
                      <TableCell className="font-medium">{load.id}</TableCell>
                      <TableCell>{load.brokerName}</TableCell>
                      <TableCell>{load.origin}</TableCell>
                      <TableCell>{load.destination}</TableCell>
                      <TableCell>{load.rate}</TableCell>
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
