
'use client';

import Link from 'next/link';
import { AetherLogo } from '@/components/ui/AetherLogo';
import { Facebook, Linkedin, Twitter, Instagram, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubscriptionDialog } from '@/components/subscription/SubscriptionDialog';
import React from 'react';

const exploreLinks = [
  { href: '/products', label: 'Refrigerants & Supplies' },
  { href: '/services', label: 'Our Services' },
  { href: '/about', label: 'About Aether' },
  { href: '/blog', label: 'Industry Insights' },
];

const supportLegalLinksCol1 = [
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
];

const supportLegalLinksCol2 = [
  { href: '/returns-policy', label: 'Returns & Refunds' },
  { href: '/shipping-policy', label: 'Shipping Information' },
  { href: '/disclaimers/refrigerant-certification', label: 'EPA Certification Info' },
  // { href: '/disclaimers', label: 'Product Disclaimers' }, // This link can be added if desired
];


const socialLinks = [
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Linkedin, label: 'LinkedIn' },
  { href: '#', icon: Instagram, label: 'Instagram' },
];

export function Footer() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handleSubscribeClick = () => {
    if (email.trim() !== '') {
      setDialogOpen(true);
    }
  };

  return (
    <footer className="bg-slate-800 text-slate-300 mt-16">
      <div className="container mx-auto px-4 py-16">
        {/* Top section with links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 mb-16">
          {/* Column 1: Company Info & Social */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 mb-2 text-primary-foreground"> {/* Adjusted text color for visibility on dark bg */}
              <AetherLogo className="h-10 w-10 md:h-12 md:w-12" /> {/* Logo colors might need adjustment for dark bg if not SVG */}
              <span className="font-headline text-2xl md:text-3xl font-bold text-slate-100">Aether Industries</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner for genuine Freon™ refrigerants and essential HVAC/R accessories, driving industry excellence and supporting professionals with quality, compliance, and expert technical guidance.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex space-x-2">
                {socialLinks.map(link => (
                  <Link 
                    key={link.label} 
                    href={link.href} 
                    className="text-slate-400 hover:text-slate-100 transition-colors p-2 rounded-full hover:bg-slate-700" 
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <link.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Explore Links */}
          <div>
            <h3 className="font-headline text-xl font-semibold mb-5 text-slate-100">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-slate-100 transition-colors hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Support & Legal Links */}
          <div>
            <h3 className="font-headline text-xl font-semibold mb-5 text-slate-100">Support & Legal</h3>
            <div className="grid grid-cols-2 gap-x-4">
                <ul className="space-y-3">
                {supportLegalLinksCol1.map((link) => (
                    <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-slate-100 transition-colors hover:underline">
                        {link.label}
                    </Link>
                    </li>
                ))}
                </ul>
                <ul className="space-y-3">
                {supportLegalLinksCol2.map((link) => (
                    <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-slate-100 transition-colors hover:underline">
                        {link.label}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="py-12 border-t border-slate-700 mb-2">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-headline text-2xl md:text-3xl font-semibold mb-5 text-slate-100">Stay Updated With Aether</h3>
            <p className="text-slate-400 mb-8">
              Get the latest on new Freon™ products, EPA regulation updates, technical tips, and exclusive offers from Aether Industries directly to your inbox.
            </p>
            <div className="flex w-full max-w-md mx-auto items-center space-x-2">
                <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-accent focus:border-accent h-12 text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    aria-label="Email for newsletter"
                />
                <Button 
                    type="button" 
                    onClick={handleSubscribeClick} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-12 text-base" /* Assuming accent color is primary */
                    aria-label="Subscribe to newsletter"
                >
                    <Send className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Subscribe</span>
                </Button>
            </div>
            <p className="text-xs text-slate-500 pt-4">
              No spam, ever. We respect your privacy. Unsubscribe any time.
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 border-t border-slate-700 pt-8">
          &copy; {new Date().getFullYear()} Aether Industries. All Rights Reserved.
          <br />
          Pioneering Freon™ Refrigerant Solutions and HVAC/R Support for a Cooler Tomorrow.
        </div>
      </div>
      <SubscriptionDialog open={dialogOpen} onOpenChange={setDialogOpen} initialEmail={email} />
    </footer>
  );
}
