
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

export function BillingPage() {
  const invoices = [
    { invoiceId: 'INV-001', date: '2024-07-15', amount: '$250.00', status: 'Paid' },
    { invoiceId: 'INV-002', date: '2024-07-20', amount: '$150.00', status: 'Pending' },
    { invoiceId: 'INV-003', date: '2024-06-30', amount: '$350.00', status: 'Paid' },
    { invoiceId: 'INV-004', date: '2024-07-22', amount: '$450.00', status: 'Overdue' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Invoices</CardTitle>
        <CardDescription>
          Manage your billing information and view your invoices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoiceId}>
                <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === 'Paid'
                        ? 'secondary'
                        : invoice.status === 'Overdue'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
