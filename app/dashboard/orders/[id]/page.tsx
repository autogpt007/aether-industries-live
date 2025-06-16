
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Package, CalendarDays, DollarSign, Truck, Info, User, MapPin, CreditCard, AlertCircle } from 'lucide-react';

// Mock order data - replace with actual data fetching
const getMockOrderById = (id: string | string[] | undefined) => {
  if (!id || Array.isArray(id)) return null;
  const mockOrders: { [key: string]: any } = {
    "AE10234": { 
      id: "AE10234", 
      date: "2024-07-15", 
      status: "Shipped", 
      total: 245.99, 
      subtotal: 220.00,
      shippingCost: 15.00,
      tax: 10.99,
      paymentMethod: "Credit Card ending in **** 1234",
      items: [
        { id: 'p1', name: 'Freon™ R-410A (25lb)', qty: 1, price: 120.00, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'refrigerant cylinder r410a' }, 
        { id: 'p2', name: 'Manifold Gauge Set (Digital)', qty: 1, price: 100.00, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'digital manifold hvac' }
      ], 
      shippingAddress: { name: "John Doe", line1: "123 Main St", line2: "Apt 4B", city: "Anytown", state: "CA", zip: "90210", country: "USA" },
      billingAddress: { name: "John Doe", line1: "123 Main St", line2: "Apt 4B", city: "Anytown", state: "CA", zip: "90210", country: "USA" },
      trackingNumber: "1Z999AA10123456789",
      trackingUrl: "https://www.ups.com/track?loc=en_US&tracknum=1Z999AA10123456789"
    },
    "AE10230": { 
      id: "AE10230", 
      date: "2024-07-10", 
      status: "Delivered", 
      total: 120.00, 
      subtotal: 100.00,
      shippingCost: 10.00,
      tax: 10.00,
      paymentMethod: "Bank Wire Transfer (Confirmed)",
      items: [{ id: 'p3', name: 'Freon™ R-134a (30lb)', qty: 1, price: 100.00, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'refrigerant tank r134a' }], 
      shippingAddress: { name: "Jane Smith", line1: "456 Oak Ave", city: "Otherville", state: "NY", zip: "10001", country: "USA" },
      billingAddress: { name: "Jane Smith", line1: "456 Oak Ave", city: "Otherville", state: "NY", zip: "10001", country: "USA" },
      deliveryDate: "2024-07-12" 
    },
    "AE10225": { 
      id: "AE10225", 
      date: "2024-07-01", 
      status: "Processing", 
      total: 599.00, 
      subtotal: 550.00,
      shippingCost: 29.00,
      tax: 20.00,
      paymentMethod: "Credit Card ending in **** 5678",
      items: [{ id: 'p4', name: 'Refrigerant Recovery Machine', qty: 1, price: 550.00, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'refrigerant recovery unit' }], 
      shippingAddress: { name: "Tech Solutions LLC", line1: "789 Pine Ln", city: "Sometown", state: "TX", zip: "75001", country: "USA" },
      billingAddress: { name: "Tech Solutions LLC", line1: "789 Pine Ln", city: "Sometown", state: "TX", zip: "75001", country: "USA" }
    },
  };
  return mockOrders[id] || null;
};

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = 'bg-muted';
  let textColor = 'text-muted-foreground';
  if (status === 'Delivered') {
    bgColor = 'bg-green-100 dark:bg-green-900';
    textColor = 'text-green-700 dark:text-green-300';
  } else if (status === 'Shipped') {
    bgColor = 'bg-blue-100 dark:bg-blue-900';
    textColor = 'text-blue-700 dark:text-blue-300';
  } else if (status === 'Processing') {
    bgColor = 'bg-orange-100 dark:bg-orange-900';
    textColor = 'text-orange-700 dark:text-orange-300';
  } else if (status === 'Cancelled') {
    bgColor = 'bg-red-100 dark:bg-red-900';
    textColor = 'text-red-700 dark:text-red-300';
  }
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>{status}</span>;
};

export default function OrderDetailPage() {
  const params = useParams();
  const { id } = params;
  const order = getMockOrderById(id); 

  useEffect(() => {
    if (order) {
      document.title = `Order ${order.id} Details | Aether Industries Dashboard`;
    } else {
      document.title = `Order Not Found | Aether Industries Dashboard`;
    }
  }, [order]);

  if (!order) {
    return (
      <div className="py-8 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h1 className="font-headline text-3xl md:text-4xl font-bold">Order Not Found</h1>
            <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Orders
            </Link>
            </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Sorry, we could not find details for this order ID. It might have been removed or the ID is incorrect.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
            <Package className="mr-3 h-8 w-8 text-primary"/>Order Details
          </h1>
          <p className="text-muted-foreground">Order ID: <span className="font-semibold text-foreground">{order.id}</span></p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/orders"> 
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Orders
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-muted/30 dark:bg-muted/10 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="font-headline text-xl">Order Summary</CardTitle>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <CalendarDays className="mr-1.5 h-4 w-4"/> Ordered on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-muted-foreground flex items-center"><Truck className="mr-2 h-4 w-4"/>Shipping Address</h3>
            <address className="not-italic text-sm">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.line1}{order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}
            </address>
          </div>
           <div className="space-y-1">
            <h3 className="font-semibold text-sm text-muted-foreground flex items-center"><User className="mr-2 h-4 w-4"/>Billing Address</h3>
            <address className="not-italic text-sm">
              {order.billingAddress.name}<br />
              {order.billingAddress.line1}{order.billingAddress.line2 && `, ${order.billingAddress.line2}`}<br />
              {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}<br />
              {order.billingAddress.country}
            </address>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-muted-foreground flex items-center"><CreditCard className="mr-2 h-4 w-4"/>Payment Method</h3>
            <p className="text-sm">{order.paymentMethod}</p>
          </div>
          {order.trackingNumber && (
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center"><Info className="mr-2 h-4 w-4"/>Tracking</h3>
              <Button variant="link" asChild className="p-0 h-auto text-sm">
                <a href={order.trackingUrl || '#'} target="_blank" rel="noopener noreferrer">
                  {order.trackingNumber}
                </a>
              </Button>
            </div>
          )}
          {order.deliveryDate && (
             <div className="space-y-1">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Delivered On</h3>
              <p className="text-sm">{new Date(order.deliveryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="p-6">
          <CardTitle className="font-headline text-xl">Items in this Order</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {order.items.map((item: any) => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md border object-cover aspect-square" data-ai-hint={item.dataAiHint || 'product image'}/>
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.qty}</p>
                </div>
                <p className="text-sm font-semibold sm:ml-auto">${(item.price * item.qty).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="bg-muted/30 dark:bg-muted/10 p-6 mt-0 border-t">
            <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>${order.shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                <Separator className="my-2"/>
                <div className="flex justify-between font-bold text-lg"><span>Order Total</span><span>${order.total.toFixed(2)}</span></div>
            </div>
        </CardFooter>
      </Card>
      
      <div className="text-center pt-4">
        <Button variant="outline" asChild>
          <Link href={`/contact?subject=Question%20about%20Order%20${order.id}`}>Need Help with this Order?</Link>
        </Button>
      </div>
    </div>
  );
}
