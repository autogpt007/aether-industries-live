
'use client';

import Link from 'next/link';
import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { useState, useEffect } from 'react';
import { Menu, X, Home, PackageSearch, Info, Newspaper, MessageSquare, ShoppingCart, Wrench, HelpCircle, UserCircle, LogOut, LogIn, UserPlus, LayoutDashboard, Settings, LifeBuoy } from 'lucide-react'; // Removed BadgeAlert as it wasn't used
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AetherLogo } from '@/components/ui/AetherLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Products', icon: PackageSearch },
  { href: '/services', label: 'Services', icon: Wrench },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/blog', label: 'Blog', icon: Newspaper },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/contact', label: 'Contact', icon: MessageSquare },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, loading, logout } = useAuth();
  const { cartItems, getItemCount, getCartSubtotal } = useCart();
  const [localCartItemCount, setLocalCartItemCount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setLocalCartItemCount(getItemCount());
    }
  }, [getItemCount, isMounted, cartItems]);


  const commonLinkClasses = "text-sm font-medium transition-colors";
  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            commonLinkClasses,
            mobile ? "flex items-center gap-3 p-3 hover:bg-accent rounded-md text-card-foreground hover:text-accent-foreground text-base" : "p-2 text-foreground hover:text-primary",
          )}
          onClick={() => mobile && setIsMobileMenuOpen(false)}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
    user: { email?: string | null; displayName?: string | null };
  }

  const UserAvatar = React.forwardRef<
    React.ElementRef<typeof Avatar>,
    UserAvatarProps
  >(({ user, className, ...props }, ref) => {
    const getInitials = (name?: string | null, email?: string | null) => {
      if (name) {
        const parts = name.split(' ');
        if (parts.length > 1) {
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
      }
      if (email) {
        return email.charAt(0).toUpperCase();
      }
      return <UserCircle className="h-5 w-5" />;
    };
    const fallback = getInitials(user?.displayName, user?.email);
    return (
      <Avatar ref={ref} className={cn("h-8 w-8", className)} {...props}>
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    );
  });
  UserAvatar.displayName = "UserAvatar";


  const AuthNavLinks = ({ mobile = false }: { mobile?: boolean }) => {
    if (!isMounted || loading) {
      return (
        <div className={cn("flex items-center", mobile ? "flex-col w-full px-3 space-y-2" : "ml-2 space-x-2")}>
          <Skeleton className={cn("h-9", mobile ? "w-full" : "w-24")} />
          {!mobile && <Skeleton className={cn("h-9", mobile ? "w-full" : "w-20")} />}
        </div>
      );
    }

    if (user) {
      return (
        <>
          {mobile ? (
            <>
              <Button variant="ghost" size="sm" asChild className="w-full justify-start p-3 text-base text-card-foreground hover:text-accent-foreground">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <LayoutDashboard className="mr-1.5 h-5 w-5" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={async () => { await logout(); setIsMobileMenuOpen(false); }} className="w-full justify-start p-3 text-base text-card-foreground hover:text-accent-foreground">
                <LogOut className="mr-1.5 h-5 w-5" />
                Logout
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 rounded-full">
                   <UserAvatar user={user} />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium leading-none">{user.displayName || "My Account"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact?subject=Support%20Request">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      );
    }

    return (
      <div className={cn("flex items-center", mobile ? "flex-col w-full space-y-2" : "ml-2 space-x-1")}>
        <Button variant={mobile ? "ghost" : "outline"} size="sm" asChild className={cn(mobile ? "w-full justify-start p-3 text-base text-card-foreground hover:text-accent-foreground" : "border-primary/70 text-primary hover:bg-primary/10")}>
          <Link href="/login" onClick={() => mobile && setIsMobileMenuOpen(false)}>
            <LogIn className="mr-1.5 h-5 w-5" />
            Login
          </Link>
        </Button>
        <Button variant={mobile ? "default" : "default"} size="sm" asChild className={cn(mobile ? "w-full justify-start p-3 text-base bg-primary text-primary-foreground hover:bg-primary/90" : "bg-accent text-accent-foreground hover:bg-accent/90")}>
          <Link href="/signup" onClick={() => mobile && setIsMobileMenuOpen(false)}>
            <UserPlus className="mr-1.5 h-5 w-5" />
            Sign Up
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <AetherLogo className="h-8 w-8" />
          <span className="font-headline text-xl font-bold">Aether Industries</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <NavLinks />
        </nav>

        <div className="flex items-center">
          <div className="hidden md:flex items-center">
            <AuthNavLinks />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 relative text-primary hover:bg-primary/10">
                <ShoppingCart className="h-5 w-5" />
                {isMounted && localCartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                    {localCartItemCount}
                  </span>
                )}
                <span className="sr-only">View Cart</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96 p-4 bg-card shadow-xl border-border">
              <DropdownMenuLabel className="text-lg font-semibold font-headline">Your Cart</DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2 bg-border" />
              {cartItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Your cart is empty.</p>
              ) : (
                <>
                  <ScrollArea className="max-h-64 pr-2">
                    <div className="space-y-3">
                      {cartItems.map(item => (
                        <div key={item.productId} className="flex items-start gap-3">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-md border border-border object-cover aspect-square flex-shrink-0"
                            data-ai-hint={item.dataAiHint}
                          />
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium truncate" title={item.name}>{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} &times; ${item.price?.toFixed(2) || 'N/A'}
                            </p>
                          </div>
                          <p className="text-sm font-semibold ml-auto flex-shrink-0">
                            ${(item.price !== null && item.price !== undefined ? item.price * item.quantity : 0).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <DropdownMenuSeparator className="my-2 bg-border" />
                  <div className="flex justify-between items-center font-semibold text-md py-1">
                    <span>Subtotal:</span>
                    <span>${getCartSubtotal().toFixed(2)}</span>
                  </div>
                </>
              )}
              <DropdownMenuSeparator className="my-2 bg-border" />
              <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                <Button asChild className="w-full justify-center bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent text-sm h-10">
                  <Link href="/cart">View Cart & Checkout</Link>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="p-0 mt-1.5 focus:bg-transparent">
                 <Button variant="outline" asChild className="w-full justify-center focus-visible:ring-ring text-sm h-10">
                   <Link href="/products">Continue Shopping</Link>
                 </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden ml-1">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-card p-0 flex flex-col">
                 <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    <AetherLogo className="h-7 w-7" />
                    <span className="font-headline text-lg font-bold">Aether Industries</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col space-y-1 p-4 flex-grow">
                  <NavLinks mobile />
                </nav>
                <div className="p-4 border-t mt-auto space-y-2">
                  <AuthNavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
