
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MinusCircle, PlusCircle, Trash2, ShoppingCart, FileText, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect } from 'react'; // Added useEffect import


export default function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateItemQuantity, 
    getCartSubtotal,
    clearCart 
  } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Shopping Cart - Refrigerants & Accessories | Aether Industries';
  }, []);

  const directPurchaseItems = cartItems.filter(item => !item.isQuoteItem);
  const quoteRequestItems = cartItems.filter(item => item.isQuoteItem);

  const subtotal = getCartSubtotal();
  const estimatedTax = subtotal * 0.08; // Example tax rate
  const estimatedShipping = directPurchaseItems.length > 0 ? 25.00 : 0; 
  const total = subtotal + estimatedTax + estimatedShipping;

  const hasCertifiableItems = cartItems.some(item => item.requiresCertification);

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Item Removed",
      description: `${productName} has been removed from your cart.`,
      variant: "default",
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateItemQuantity(productId, newQuantity);
  };

  return (
    <div className="py-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">
        {directPurchaseItems.length > 0 && quoteRequestItems.length > 0 ? 'Shopping Cart & Quote Request' : 
         directPurchaseItems.length > 0 ? 'Shopping Cart' : 
         quoteRequestItems.length > 0 ? 'Quote Request Summary' : 'Your Cart is Empty'}
      </h1>

      {cartItems.length === 0 && (
        <div className="text-center py-12 bg-card rounded-lg shadow">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <p className="text-xl text-muted-foreground mb-6">Your cart is currently empty.</p>
          <Button asChild size="lg">
            <Link href="/products">Browse Refrigerants & Accessories</Link>
          </Button>
        </div>
      )}

      {hasCertifiableItems && cartItems.length > 0 && (
        <Card className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-900/30">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center text-orange-700 dark:text-orange-300">
              <AlertTriangle className="mr-3 h-6 w-6" /> Important: EPA Certification May Be Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              One or more items in your cart (e.g., regulated refrigerants) require EPA Section 608 certification for purchase. You may be asked to provide proof of certification during checkout or before your order can be fulfilled.
              Please review our <Link href="/disclaimers/refrigerant-certification" className="font-semibold underline hover:opacity-80">Certification Policy</Link>.
            </p>
          </CardContent>
        </Card>
      )}


      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {directPurchaseItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                  <ShoppingCart className="mr-3 h-6 w-6 text-primary" /> Items for Purchase
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {directPurchaseItems.map(item => (
                  <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-4 py-4">
                    <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded-md object-cover border" data-ai-hint={item.dataAiHint} />
                    <div className="flex-grow">
                      <Link href={`/products/${item.slug}`} className="font-semibold hover:text-primary">{item.name}</Link>
                      <p className="text-sm text-muted-foreground">${item.price?.toFixed(2)} each</p>
                       {item.requiresCertification && <p className="text-xs text-orange-600 dark:text-orange-400">EPA Certification Required</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <MinusCircle className="h-5 w-5" />
                      </Button>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value, 10) || 1)}
                        className="w-16 h-8 text-center" 
                        min="1"
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="font-semibold w-24 text-right">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => handleRemoveItem(item.productId, item.name)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {quoteRequestItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-primary" /> Items for Quote
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {quoteRequestItems.map(item => (
                  <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-4 py-4">
                    <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded-md object-cover border" data-ai-hint={item.dataAiHint} />
                    <div className="flex-grow">
                      <Link href={`/products/${item.slug}`} className="font-semibold hover:text-primary">{item.name}</Link>
                      <p className="text-sm text-muted-foreground">Price available upon request</p>
                       {item.requiresCertification && <p className="text-xs text-orange-600 dark:text-orange-400">EPA Certification Required</p>}
                    </div>
                     <p className="text-sm text-muted-foreground w-24 text-right">Qty: {item.quantity}</p>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => handleRemoveItem(item.productId, item.name)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="lg:col-span-1 space-y-6">
            {directPurchaseItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Estimated Shipping</span><span>${estimatedShipping.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Estimated Tax (8%)</span><span>${estimatedTax.toFixed(2)}</span></div>
                  <hr/>
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
            {quoteRequestItems.length > 0 && (
               <Card className={directPurchaseItems.length > 0 ? "mt-6" : ""}>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Quote Request</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">The items listed for quote will be reviewed by our sales team. We will contact you shortly with pricing and availability. Please ensure your contact information is accurate on the next page.</p>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href="/checkout?action=quote">Submit Quote Request</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
             <div className="text-center">
                <Button variant="link" asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="link" onClick={() => { clearCart(); toast({title: "Cart Cleared", description: "Your shopping cart has been emptied."})}} className="text-destructive hover:text-destructive/80">
                    Clear Cart
                </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

