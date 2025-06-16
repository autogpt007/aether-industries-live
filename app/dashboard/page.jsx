
'use client'

import { useEffect, useState } from "react"; 
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, User, ShieldCheck, Edit3, LogOut, FileText, Tag, AlertTriangle, ExternalLink, Building, Settings2, MessageSquare, ShoppingCart as CartIcon, Newspaper, Users as UsersIcon } from 'lucide-react';
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const initialMockOrders = [
  { id: "AE10234-mock", date: "2024-07-15", status: "Shipped", total: 245.99, items: [{ name: 'Freon™ R-410A (25lb) - Mock', qty: 1 }, { name: 'Manifold Gauge - Mock', qty: 1}] },
  { id: "AE10230-mock", date: "2024-07-10", status: "Delivered", total: 120.00, items: [{ name: 'Freon™ R-134a (30lb) - Mock', qty: 1 }] },
];

export default function Dashboard() {
  const router = useRouter();
  const { user, customClaims, loading, logout } = useAuth();
  
  const [orders, setOrders] = useState(initialMockOrders); 
  const [loadingOrders, setLoadingOrders] = useState(true); 
  const [userProfile, setUserProfile] = useState(null); 
  // EPA Cert state is used for regular users, admins won't typically interact with this for themselves.
  const [epaCertification, setEpaCertification] = useState({ status: "Not Verified", number: null }); 

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && !loading) {
        // Set user profile details - relevant for both users and admins
        setUserProfile({ 
            name: user.displayName || user.email.split('@')[0],
            memberSince: user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A',
            companyName: 'Self-Employed / HVAC Pro Inc.', // Placeholder, could be fetched
        });
    }
  }, [user, customClaims, loading, router]);

  // Fetch user-specific data like orders and EPA status
  useEffect(() => {
    const fetchUserData = () => {
      setLoadingOrders(true);
      try {
        const storedOrdersString = localStorage.getItem('aetherUserOrders');
        const storedOrders = storedOrdersString ? JSON.parse(storedOrdersString) : [];
        
        const combined = [...storedOrders, ...initialMockOrders];
        const uniqueOrdersMap = new Map();
        combined.forEach(order => {
          if (order && order.id) {
            uniqueOrdersMap.set(order.id, order);
          }
        });
        setOrders(Array.from(uniqueOrdersMap.values()));

      } catch (e) {
        console.error("Error loading orders from localStorage:", e);
        setOrders(initialMockOrders); 
      }
      setLoadingOrders(false);
      // Mock EPA cert status based on email for dev, replace with actual fetch
      if (user?.email?.includes('verifiedepa')) {
        setEpaCertification({ status: "Verified", number: "EPA123XYZ" });
      }
    };

    if (user && !loading) { // Only fetch if user is loaded
      // Check if user is an admin. If so, don't fetch customer-specific data like orders for display.
      const isCurrentUserAdmin = customClaims?.admin === true || customClaims?.super_admin === true ||
                                user?.email === 'admin@aetherindustries.com' || user?.email === 'eddy3597@gmail.com';
      if (!isCurrentUserAdmin) {
        fetchUserData();
      } else {
        setLoadingOrders(false); // For admins, no orders to load in this view
      }
    }
  }, [user, loading, customClaims]); // Rerun if customClaims change too


  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="space-y-6 w-full max-w-4xl p-4 md:p-8">
            <Skeleton className="h-12 w-1/2 mb-6" />
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Direct checks for admin/super admin status for rendering decisions
  const isUserAdmin = customClaims?.admin === true || customClaims?.super_admin === true ||
                      user?.email === 'admin@aetherindustries.com' || user?.email === 'eddy3597@gmail.com';
  const isUserSuperAdmin = customClaims?.super_admin === true || user?.email === 'eddy3597@gmail.com';


  return (
    <div className="space-y-8 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Welcome, {userProfile?.name || user.email}!</h1>
        <p className="text-muted-foreground">
          {isUserAdmin ? "Manage site content, products, users, and orders." : "Manage your orders, account details, and access exclusive resources."}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer-specific panels - only show if NOT an admin */}
          {!isUserAdmin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-primary" /> Recent Orders</CardTitle>
                  <CardDescription>View the status of your recent purchases.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                  ) : orders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 5).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Shipped' ? 'secondary' : 'outline' } 
                                     className={
                                       order.status === 'Delivered' ? 'bg-green-500 hover:bg-green-600 text-white' : 
                                       order.status === 'Shipped' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 
                                       order.status === 'Processing' || order.status === 'Pending Payment (Wire)' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                                       '' 
                                      }>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">${order.total ? order.total.toFixed(2) : 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/orders/${order.id}`}><ExternalLink className="h-4 w-4" /></Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No recent orders found. <Button variant="link" asChild><Link href="/products">Start Shopping</Link></Button></p>
                  )}
                </CardContent>
                {orders.length > 0 && ( 
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild><Link href="/dashboard/orders">View All Orders</Link></Button>
                  </CardFooter>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>EPA Certification</CardTitle>
                  <CardDescription>Manage your EPA Section 608 certification status for refrigerant purchases.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {epaCertification.status === "Verified" ? (
                    <>
                      <p className="flex items-center text-green-600"><ShieldCheck className="mr-2 h-5 w-5" /> Status: Verified</p>
                      <p>Certification Number: <span className="font-medium">{epaCertification.number || "EPA123456789"}</span></p>
                      <Button variant="outline" size="sm" asChild><Link href="/dashboard/epa-certification"><Edit3 className="mr-1 h-4 w-4" /> Update Certification</Link></Button>
                    </>
                  ) : (
                     <>
                      <p className="flex items-center text-orange-600"><AlertTriangle className="mr-2 h-5 w-5" />Status: {epaCertification.status}</p>
                      <p className="text-sm text-muted-foreground">EPA certification is required to purchase many refrigerants. Please provide your certification details for seamless ordering.</p>
                      <Button asChild><Link href="/dashboard/epa-certification"><FileText className="mr-1 h-4 w-4"/> Submit/Update Certification</Link></Button>
                     </>
                  )}
                  <p className="text-xs text-muted-foreground pt-2">
                    Learn more about <Link href="/disclaimers/refrigerant-certification" className="underline hover:text-primary">EPA requirements</Link>.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
           {/* Admin Panel is always in this column if user is admin */}
           {isUserAdmin && (
            <Card className="border-accent shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center text-accent"><Settings2 className="mr-2 h-5 w-5"/>Admin Panel</CardTitle>
                <CardDescription>Manage products, users, orders, and site content. {isUserSuperAdmin && "(Super Admin Privileges Active)"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" asChild className="justify-start text-left p-4 h-auto hover:border-accent hover:text-accent">
                      <Link href="/admin/products" className="flex items-center w-full">
                        <Package className="mr-3 h-5 w-5 flex-shrink-0"/>
                        <div>
                            <span className="font-semibold">Manage Products</span>
                            <p className="text-xs text-muted-foreground">Add, edit, and update inventory.</p>
                        </div>
                      </Link>
                    </Button>
                     <Button variant="outline" asChild className="justify-start text-left p-4 h-auto hover:border-accent hover:text-accent">
                      <Link href="/admin/blog" className="flex items-center w-full">
                        <Newspaper className="mr-3 h-5 w-5 flex-shrink-0"/>
                         <div>
                            <span className="font-semibold">Manage Blog</span>
                            <p className="text-xs text-muted-foreground">Create and publish articles.</p>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="justify-start text-left p-4 h-auto hover:border-accent hover:text-accent">
                      <Link href="/admin/users" className="flex items-center w-full">
                        <UsersIcon className="mr-3 h-5 w-5 flex-shrink-0"/>
                         <div>
                            <span className="font-semibold">Manage Users</span>
                            <p className="text-xs text-muted-foreground">View users and manage roles.</p>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="justify-start text-left p-4 h-auto hover:border-accent hover:text-accent">
                      <Link href="/admin/orders" className="flex items-center w-full">
                        <ShoppingBag className="mr-3 h-5 w-5 flex-shrink-0"/>
                         <div>
                            <span className="font-semibold">View All Orders</span>
                            <p className="text-xs text-muted-foreground">Track and manage customer orders.</p>
                        </div>
                      </Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><User className="mr-2 h-5 w-5 text-primary"/>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Name:</strong> {userProfile?.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Company:</strong> {userProfile?.companyName || "Not set"}</p>
              <p><strong>Member Since:</strong> {userProfile?.memberSince}</p>
              <p><strong>User ID:</strong> <span className="text-xs">{user.uid}</span></p>
              {user.emailVerified === false && (
                <p className="text-orange-600 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Email not verified.</p>
              )}
              {isUserAdmin && <Badge variant="secondary" className="mt-2 bg-red-100 text-red-700">{isUserSuperAdmin ? 'Super Admin' : 'Admin'}</Badge>}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" asChild><Link href="/dashboard/profile"><Edit3 className="mr-1 h-4 w-4"/>Edit Profile</Link></Button>
              {!isUserAdmin && <Button variant="outline" className="w-full" asChild><Link href="/dashboard/addresses"><Building className="mr-1 h-4 w-4"/>Manage Addresses</Link></Button> }
              <Button variant="destructive" onClick={logout} className="w-full"><LogOut className="mr-1 h-4 w-4"/>Logout</Button>
            </CardFooter>
          </Card>
          
          {/* Customer-specific Quick Links - only show if NOT an admin */}
          {!isUserAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="secondary" className="w-full justify-start" asChild><Link href="/products"><Tag className="mr-2 h-4 w-4"/>Shop All Products</Link></Button>
                <Button variant="secondary" className="w-full justify-start" asChild><Link href="/cart"><CartIcon className="mr-2 h-4 w-4"/>View Your Cart</Link></Button>
                <Button variant="secondary" className="w-full justify-start" asChild><Link href="/contact"><MessageSquare className="mr-2 h-4 w-4"/>Contact Support</Link></Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
    

    