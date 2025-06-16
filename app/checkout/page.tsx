
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, User, ShoppingBag, FileText, ArrowLeft, ShieldCheck, AlertTriangle, Banknote, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams as useNextSearchParams } from 'next/navigation'; // Import useRouter
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { useCart } from '@/contexts/CartContext'; // Import useCart

// export async function generateMetadata({ searchParams }: { searchParams: { action?: string } }): Promise<Metadata> {
// No, metadata cannot be dynamic in client components like this. This needs to be handled in a parent layout or a server component.
// }

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useNextSearchParams(); // Use the Next.js 13+ hook
  const { toast } = useToast();
  const { cartItems, getCartSubtotal, clearCart } = useCart();

  const action = searchParams.get('action');
  const isQuote = action === 'quote';

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('us');
  const [epaNumber, setEpaNumber] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');


  // Calculate summary based on actual cart for non-quote orders
  const directPurchaseItems = cartItems.filter(item => !item.isQuoteItem);
  const cartSubtotal = getCartSubtotal();
  const estimatedShipping = directPurchaseItems.length > 0 ? 25.00 : 0;
  const estimatedTaxRate = 0.08; // Example tax rate
  const estimatedTax = cartSubtotal * estimatedTaxRate;
  const orderTotal = cartSubtotal + estimatedShipping + estimatedTax;

  const hasCertifiableItems = cartItems.some(item => item.requiresCertification);

  const currentSummary = isQuote ? null : {
    items: directPurchaseItems.map(item => ({ name: item.name, quantity: item.quantity, price: item.price || 0 })),
    subtotal: cartSubtotal,
    shipping: estimatedShipping,
    tax: estimatedTax,
    total: orderTotal,
    hasCertifiableItems: hasCertifiableItems,
  };


  useEffect(() => {
    const pageTitle = isQuote ? 'Submit Refrigerant Quote Request' : 'Secure Checkout - Refrigerants & Accessories';
    document.title = `${pageTitle} | Aether Industries`;
  }, [isQuote]);

  const handleSubmitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderIdSuffix = Math.random().toString(36).substr(2, 7).toUpperCase();
    const orderId = isQuote ? `QR-${orderIdSuffix}` : `AET-${orderIdSuffix}`;

    if (isQuote) {
      toast({
        title: "Quote Request Submitted!",
        description: "Your quote request has been received. We will contact you shortly.",
      });
      console.log(`Simulating email to eddy3597@gmail.com with quote request details. Quote ID: ${orderId}, Notes: ${quoteNotes}, Contact: ${email}`);
      router.push(`/order-confirmation?type=quote&orderId=${orderId}`);
    } else {
      // Simulate saving order to localStorage for dashboard display
      const newOrderForStorage = {
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        status: paymentMethod === 'wire' ? "Pending Payment (Wire)" : "Processing",
        total: currentSummary?.total || 0,
        items: currentSummary?.items.map(item => ({ name: item.name, qty: item.quantity })) || [{ name: 'Ordered items', qty: 1 }],
      };

      try {
        const existingOrders = JSON.parse(localStorage.getItem('aetherUserOrders') || '[]');
        const updatedOrders = [newOrderForStorage, ...existingOrders.slice(0, 4)]; // Keep last 5 orders
        localStorage.setItem('aetherUserOrders', JSON.stringify(updatedOrders));
      } catch (e) {
        console.error("Error saving order to localStorage:", e);
      }

      if (paymentMethod === 'wire') {
        toast({
          title: "Order Placed!",
          description: "Your order is confirmed. You'll receive an email with bank wire instructions.",
        });
        console.log(`Simulating email to eddy3597@gmail.com with order details (wire transfer). Order ID: ${orderId}, Total: $${currentSummary?.total.toFixed(2)}`);
        router.push(`/order-confirmation?type=order&orderId=${orderId}&paymentStatus=wire_pending`);
      } else { 
        toast({
          title: "Order Placed!",
          description: "Your order has been successfully placed.",
        });
        console.log(`Simulating email to eddy3597@gmail.com with order details (card payment). Order ID: ${orderId}, Total: $${currentSummary?.total.toFixed(2)}`);
        router.push(`/order-confirmation?type=order&orderId=${orderId}`);
      }
    }
    setIsProcessing(false);
    clearCart(); // Clear the cart after order/quote submission
  };


  return (
    <div className="py-8 max-w-4xl mx-auto">
       <Button variant="outline" size="sm" asChild className="mb-6">
            <Link href={isQuote ? "/cart?action=quote" : "/cart"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
        </Button>
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">
        {isQuote ? 'Submit Refrigerant Quote Request' : 'Secure Checkout'}
      </h1>

      {hasCertifiableItems && (
        <Card className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-900/30">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center text-orange-700 dark:text-orange-300">
              <AlertTriangle className="mr-3 h-6 w-6" /> EPA Certification Reminder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-2">
              If your order includes regulated refrigerants, EPA Section 608 certification is required. 
              We may contact you to verify your certification details before processing your order.
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Ensure your contact information below is accurate. For more details, see our <Link href="/disclaimers/refrigerant-certification" className="font-semibold underline hover:opacity-80">Certification Policy</Link>.
            </p>
            {(isQuote || !isQuote) && ( // Show EPA number field for both quotes and orders if certifiable items are present
                 <div className="mt-4">
                    <Label htmlFor="epaNumber" className="text-orange-700 dark:text-orange-300">EPA Certification Number (Optional, for faster processing)</Label>
                    <Input 
                        id="epaNumber" 
                        placeholder="e.g., 123456789" 
                        className="border-orange-400 focus:border-orange-600 focus:ring-orange-500"
                        value={epaNumber}
                        onChange={(e) => setEpaNumber(e.target.value)}
                    />
                </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                {isQuote ? 'Your Contact Information' : 'Shipping Information'}
              </CardTitle>
               {!isQuote && <CardDescription>Where should we send your order?</CardDescription>}
               {isQuote && <CardDescription>Please provide your contact details for the quote.</CardDescription>}
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" placeholder="John M. Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="(123) 456-7890" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="company">Company Name (If applicable)</Label>
                <Input id="company" placeholder="Your Company Inc." value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input id="address" placeholder="1234 Main St" required value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" placeholder="Anytown" required value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="state">State / Province *</Label>
                <Input id="state" placeholder="CA" required value={state} onChange={(e) => setState(e.target.value)}/>
              </div>
              <div>
                <Label htmlFor="zip">ZIP / Postal Code *</Label>
                <Input id="zip" placeholder="90210" required value={zip} onChange={(e) => setZip(e.target.value)}/>
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                 <Select defaultValue="us" required value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {!isQuote && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <Banknote className="mr-2 h-5 w-5 text-primary" /> Payment Method
                </CardTitle>
                <CardDescription>Select how you'd like to pay.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value="card" id="pay-card" />
                    <Label htmlFor="pay-card" className="font-medium flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Credit/Debit Card
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Enter card details for processing by our team.</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value="wire" id="pay-wire" />
                    <Label htmlFor="pay-wire" className="font-medium flex-1 cursor-pointer">
                       <div className="flex items-center gap-2">
                         <Banknote className="h-5 w-5" />
                         Bank Wire Transfer
                       </div>
                       <p className="text-xs text-muted-foreground mt-1">We'll email you bank details to complete the payment.</p>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="space-y-6 pt-4 border-t">
                    <Label className="font-semibold text-base">Enter Card Details:</Label>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="•••• •••• •••• ••••" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                      <div>
                        <Label htmlFor="billingZip">Billing ZIP</Label>
                        <Input id="billingZip" placeholder="90210" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sameAsShipping" defaultChecked />
                      <Label htmlFor="sameAsShipping" className="text-sm font-normal">Billing address is the same as shipping</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {isQuote && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" /> Additional Information for Quote
                </CardTitle>
                 <CardDescription>Please provide specific refrigerant types, quantities, packaging preferences, or any questions for your quote.</CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="quoteNotes">Message / Notes (e.g., "Need 10 cylinders of R-410A, 5 of R-134a. Delivery to commercial site.")</Label>
                <Textarea 
                    id="quoteNotes" 
                    placeholder="Enter details here..." 
                    rows={5} 
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                />
              </CardContent>
            </Card>
          )}

          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : isQuote ? 'Submit Quote Request' : 'Place Order'}
            </Button>
          </div>
        </form>

        {currentSummary && !isQuote && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-primary" /> Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {currentSummary.items.map(item => (
                   <div key={item.name} className="flex justify-between">
                       <span>{item.name} (x{item.quantity})</span>
                       <span>${item.price.toFixed(2)}</span>
                   </div>
                ))}
                <hr/>
                <div className="flex justify-between"><span>Subtotal</span><span>${currentSummary.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>${currentSummary.shipping.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${currentSummary.tax.toFixed(2)}</span></div>
                <hr/>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${currentSummary.total.toFixed(2)}</span></div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                By placing your order, you agree to our Terms of Service and acknowledge our policies on refrigerant sales.
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
