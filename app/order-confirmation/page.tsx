
'use client'; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Mail } from 'lucide-react';
import React, { useEffect } from 'react';
import { useSearchParams as useNextSearchParams } from 'next/navigation';


export default function OrderConfirmationPage() {
  const searchParams = useNextSearchParams();
  const type = searchParams.get('type') || 'order';
  const isQuote = type === 'quote';
  const paymentStatus = searchParams.get('paymentStatus');
  const isWirePending = paymentStatus === 'wire_pending';
  const orderId = searchParams.get('orderId') || (isQuote ? 'QR-DEMO123' : 'AET-DEMO456');

  useEffect(() => {
    const pageTitle = isQuote ? 'Quote Request Received' : (isWirePending ? 'Order Awaiting Payment' : 'Order Confirmed');
    document.title = `${pageTitle} | Aether Industries`;

    // Simulate sending email
    const details = `Type: ${type}, Order ID: ${orderId}${isWirePending ? ', Status: Awaiting Wire Payment' : ''}`;
    console.log(`Simulating email delivery to eddy3597@gmail.com. Confirmation Details: ${details}`);

  }, [isQuote, isWirePending, orderId, type]);


  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      {isQuote ? (
        <FileText className="h-20 w-20 text-primary mx-auto mb-6" />
      ) : isWirePending ? (
        <Mail className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
      ) : (
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
      )}

      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-4">
        {isQuote ? 'Quote Request Received!' : 
         isWirePending ? 'Order Placed - Awaiting Bank Wire Payment' : 
         'Thank You For Your Order!'}
      </h1>

      <p className="text-lg text-muted-foreground mb-2">
        {isQuote 
          ? "Your quote request has been successfully submitted." 
          : isWirePending 
          ? "Your order is confirmed. Please check your email for bank wire payment instructions."
          : "Your order has been successfully placed and is being processed."}
      </p>
      <p className="text-lg text-muted-foreground mb-1">
        {isQuote 
          ? `Your Quote Request ID is: ` 
          : `Your Order Confirmation Number is: `}
        <span className="font-semibold text-primary">{orderId}</span>
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        (A confirmation has also been notionally sent to eddy3597@gmail.com)
      </p>

      <div className="bg-card p-6 rounded-lg shadow mb-8 text-left">
        <h2 className="font-headline text-xl font-semibold mb-3">What Happens Next?</h2>
        {isQuote ? (
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>You will receive an email confirmation with your request details shortly.</li>
            <li>Our sales team will review your request and prepare a customized quote.</li>
            <li>We aim to respond within 1-2 business days. Please check your spam folder if you don't hear from us.</li>
            <li>If you have any urgent questions, please contact us with your Quote ID.</li>
          </ul>
        ) : isWirePending ? (
           <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>An email with detailed bank wire instructions has been sent to your registered email address.</li>
            <li>Please complete the payment within 3-5 business days to avoid order cancellation.</li>
            <li>Your order will be processed and shipped once payment is confirmed.</li>
            <li>Contact support if you haven't received the email or have questions.</li>
          </ul>
        ) : (
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>You will receive an email confirmation with your order details and receipt.</li>
            <li>We will notify you again once your order has shipped, along with tracking information.</li>
            <li>Most orders are processed within 2-3 business days.</li>
            <li>You can check your order status by logging into your account (if applicable) or contacting support.</li>
          </ul>
        )}
      </div>

      <div className="space-x-4">
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
