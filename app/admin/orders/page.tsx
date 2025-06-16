
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingBag, ExternalLink, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock order data - reuse from dashboard or expand
const mockAdminOrders = [
  { id: "AE10234", date: "2024-07-15", customer: "John Doe (john.doe@example.com)", status: "Shipped", total: 245.99, itemsCount: 2 },
  { id: "AE10230", date: "2024-07-10", customer: "Jane Smith (jane.s@example.com)", status: "Delivered", total: 120.00, itemsCount: 1 },
  { id: "AE10225", date: "2024-07-01", customer: "Tech Solutions LLC", status: "Processing", total: 599.00, itemsCount: 1 },
  { id: "QR-1047B", date: "2024-07-18", customer: "Bulk Buyer Inc.", status: "Quote Requested", total: null, itemsCount: 5 },
  { id: "AE10235", date: "2024-07-19", customer: "Mike Williams", status: "Pending Payment (Wire)", total: 350.00, itemsCount: 3 },
];

export default function AdminOrdersPage() {
  const [filteredOrders, setFilteredOrders] = useState(mockAdminOrders);
  // TODO: Add state for filter values (status, date range, etc.)

  useEffect(() => {
    document.title = 'Manage Orders | Aether Industries Admin';
  }, []);

  // Placeholder for filter logic
  // const applyFilters = () => { /* setFilteredOrders based on filter state */ };

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
          <ShoppingBag className="mr-3 h-8 w-8 text-primary" /> Manage Orders
        </h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Placeholder for Filters UI */}
      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center"><Filter className="mr-2 h-5 w-5"/>Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">Order filtering options will be implemented here (e.g., by status, date, customer).</p>
            {/* Example: <Input placeholder="Search by Order ID or Customer..." /> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">All Customer Orders & Quotes</CardTitle>
          <CardDescription>
            View and manage all submitted orders and quote requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order/Quote ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Badge 
                        variant={
                            order.status === 'Delivered' ? 'default' : 
                            order.status === 'Shipped' ? 'secondary' : 
                            order.status === 'Quote Requested' ? 'outline' :
                            order.status === 'Pending Payment (Wire)' ? 'default' : // Needs a custom color or better variant
                            'outline' 
                        }
                        className={
                            order.status === 'Delivered' ? 'bg-green-500 hover:bg-green-600 text-white' : 
                            order.status === 'Shipped' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                            order.status === 'Pending Payment (Wire)' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' :
                            order.status === 'Processing' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                            ''
                        }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.total ? `$${order.total.toFixed(2)}` : 'N/A'}</TableCell>
                  <TableCell className="text-right">{order.itemsCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild title="View Details">
                       {/* Link to a more detailed admin order view page, or reuse customer-facing one if suitable */}
                      <Link href={`/dashboard/orders/${order.id}`}> 
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No orders match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            This is a placeholder admin page. Full order management requires further development.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
