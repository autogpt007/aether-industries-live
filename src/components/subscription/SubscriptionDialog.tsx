
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
}

export function SubscriptionDialog({ open, onOpenChange, initialEmail }: SubscriptionDialogProps) {
  const [email, setEmail] = useState(initialEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail, open]);
  
  useEffect(() => {
    if (!open) {
      setTimeout(() => { 
        setIsSubmitted(false);
        setError('');
      }, 300);
    }
  }, [open]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`Simulating email subscription for ${email}. Notification would be sent to eddy3597@gmail.com.`);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-accent shadow-xl">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center text-primary">
                <Mail className="mr-3 h-6 w-6" />
                Subscribe to Our Newsletter
              </DialogTitle>
              <DialogDescription className="pt-1">
                Stay informed about the latest Aether Industries news, Freon™ product updates, and exclusive HVAC/R industry insights.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-2">
              <div className="space-y-2">
                <Label htmlFor="email-subscribe" className="font-medium">
                  Email Address
                </Label>
                <Input
                  id="email-subscribe"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-accent"
                  disabled={isSubmitting}
                />
                {error && <p className="text-sm text-destructive pt-1">{error}</p>}
              </div>
              <DialogFooter className="sm:justify-start gap-2 pt-2">
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </>
                  )}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-headline text-2xl font-semibold text-primary">Subscription Successful!</h3>
            <p className="text-muted-foreground">
              Thank you for subscribing, {email}! You'll now receive updates from Aether Industries.
              (A notification has also been notionally sent to eddy3597@gmail.com).
            </p>
            <DialogClose asChild>
              <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
