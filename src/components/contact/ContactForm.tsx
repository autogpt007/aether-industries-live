
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import React from 'react';

export function ContactForm() {
  // TODO: Implement form submission logic (e.g., using a server action)
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Handle form submission
    alert('Form submitted (placeholder)!');
  }

  return (
    <div className="bg-card p-8 rounded-lg shadow-lg">
      <h2 className="font-headline text-2xl font-semibold mb-6">Send Us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" placeholder="John Doe" required />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="john.doe@example.com" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input id="phone" type="tel" placeholder="(123) 456-7890" />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" type="text" placeholder="Inquiry about R-XYZ" required />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Your message here..." rows={5} required />
        </div>
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          Send Message
        </Button>
      </form>
    </div>
  );
}
