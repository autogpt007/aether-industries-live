
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Aether Industries for inquiries, support, or quotes.',
};

export default function ContactPage() {
  return (
    <div className="py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">Contact Aether Industries</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're here to help. Reach out to us for product inquiries, support, or to request a quote.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form Client Component */}
        <ContactForm />

        {/* Contact Details */}
        <div className="space-y-8">
          <h2 className="font-headline text-2xl font-semibold mb-6">Our Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 text-accent p-3 bg-accent/10 rounded-full mt-1">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Corporate Office</h3>
                <p className="text-muted-foreground">123 Industrial Way, Tech City, TX 75001, USA</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
               <div className="flex-shrink-0 text-accent p-3 bg-accent/10 rounded-full mt-1">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Email Us</h3>
                <a href="mailto:support@aetherindustries.com" className="text-muted-foreground hover:text-primary transition-colors">
                  support@aetherindustries.com
                </a>
                <br />
                 <a href="mailto:sales@aetherindustries.com" className="text-muted-foreground hover:text-primary transition-colors">
                  sales@aetherindustries.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 text-accent p-3 bg-accent/10 rounded-full mt-1">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Call Us</h3>
                <a href="tel:+18005550123" className="text-muted-foreground hover:text-primary transition-colors">
                  (800) 555-0123
                </a>
              </div>
            </div>
             <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 text-accent p-3 bg-accent/10 rounded-full mt-1">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Operating Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM (CST)</p>
                <p className="text-muted-foreground">Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          {/* Placeholder for Map */}
          <div className="mt-8">
             <h3 className="font-headline text-xl font-semibold mb-3">Our Location</h3>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Embedded Map Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
