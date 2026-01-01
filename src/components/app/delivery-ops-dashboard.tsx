
'use client';

import { useState } from 'react';
import { Package, Truck, MapPin, Activity, MoreHorizontal, UserCircle, Search, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '../ui/input';
import { BillingPage } from './billing-page';
import { TrucksPage } from './trucks-page';

export function DeliveryOpsDashboard() {
  const [activeView, setActiveView] = useState('runs');

  const runs = [
    { id: 'RUN-001', truckId: 'TRUCK-A', status: 'In Progress', driver: 'John Doe', startTime: '08:00 AM' },
    { id: 'RUN-002', truckId: 'TRUCK-B', status: 'Completed', driver: 'Jane Smith', startTime: '09:30 AM' },
    { id: 'RUN-003', truckId: 'TRUCK-C', status: 'Pending', driver: 'Mike Johnson', startTime: '11:00 AM' },
    { id: 'RUN-004', truckId: 'TRUCK-D', status: 'In Progress', driver: 'Emily Davis', startTime: '10:15 AM' },
    { id: 'RUN-005', truckId: 'TRUCK-E', status: 'Completed', driver: 'Chris Lee', startTime: '07:45 AM' },
  ];

  const formatDriverName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
    }
    return name;
  };

  const renderContent = () => {
    switch(activeView) {
      case 'runs':
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Deliveries
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,257</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trucks on Route
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  3 currently idle
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Runs</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{runs.filter(r => r.status === 'In Progress').length}</div>
                <p className="text-xs text-muted-foreground">
                  View live map
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Online</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Active Runs</CardTitle>
              <CardDescription>
                A list of all active and recent delivery runs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run ID</TableHead>
                    <TableHead>First name Last Initial</TableHead>
                    <TableHead>Truck Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-medium">{run.id}</TableCell>
                      <TableCell>{formatDriverName(run.driver)}</TableCell>
                      <TableCell>{run.truckId}</TableCell>
                      <TableCell>
                        <Badge variant={run.status === 'Completed' ? 'secondary' : 'default'}>
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{run.startTime}</TableCell>
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
                            <DropdownMenuItem>Track on Map</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        );
      case 'trucks':
        return <TrucksPage />;
      case 'billing':
        return <BillingPage />;
      default:
        return <div>Select a view</div>;
    }
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Truck className="h-6 w-6 text-primary" />
              <span className="">Ideal Delivery Ops</span>
            </a>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <button
                onClick={() => setActiveView('runs')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${activeView === 'runs' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
              >
                <MapPin className="h-4 w-4" />
                Active Runs
              </button>
              <button
                onClick={() => setActiveView('trucks')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${activeView === 'trucks' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
              >
                <Truck className="h-4 w-4" />
                Trucks
              </button>
              <button
                onClick={() => setActiveView('deliveries')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${activeView === 'deliveries' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
              >
                <Package className="h-4 w-4" />
                Deliveries
              </button>
              <button
                onClick={() => setActiveView('drivers')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${activeView === 'drivers' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
              >
                <UserCircle className="h-4 w-4" />
                Drivers
              </button>
              <button
                onClick={() => setActiveView('status')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${activeView === 'status' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
              >
                <Activity className="h-4 w-4" />
                System Status
              </button>
              <button
                onClick={() => setActiveView('billing')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${activeView === 'billing' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
              >
                <CreditCard className="h-4 w-4" />
                Billing
              </button>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6">
          <a href="#" className="lg:hidden">
            <Truck className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </a>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search runs, trucks, drivers..."
                  className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border w-8 h-8"
              >
                <UserCircle className="h-4 w-4" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
