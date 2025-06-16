
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Edit3, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Assuming you have this
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState(''); // Email typically not editable directly through client
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Edit Profile | Aether Industries Dashboard';
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      // In a real app, fetch companyName and phoneNumber from your user profile data in Firestore
      setCompanyName('HVAC Pro Inc.'); // Placeholder
      setPhoneNumber('(555) 123-4567'); // Placeholder
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // TODO: Implement actual profile update logic
    // This would involve:
    // 1. Updating Firebase Auth profile (displayName)
    //    await updateProfile(user, { displayName });
    // 2. Updating user profile data in Firestore (companyName, phoneNumber)
    //    const userDocRef = doc(db, 'users', user.uid);
    //    await updateDoc(userDocRef, { companyName, phoneNumber, displayName });
    console.log("Profile update submitted:", { displayName, companyName, phoneNumber });

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsLoading(false);
  };

  if (authLoading) {
    return <div className="py-8 text-center">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">Please log in to view and edit your profile.</p>
        <Button asChild><Link href="/login">Go to Login</Link></Button>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Edit Profile</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><User className="mr-2 h-5 w-5 text-primary"/>Your Information</CardTitle>
          <CardDescription>Update your personal and company details.</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="displayName">Full Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your full name" disabled={isLoading}/>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} disabled placeholder="your.email@example.com" title="Email cannot be changed here."/>
                <p className="text-xs text-muted-foreground mt-1">Email addresses cannot be changed directly. Contact support if needed.</p>
              </div>
              <div>
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Company Inc." disabled={isLoading}/>
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="(123) 456-7890" disabled={isLoading}/>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <><Edit3 className="mr-2 h-4 w-4 animate-pulse"/> Updating...</> : <><Save className="mr-2 h-4 w-4"/> Save Changes</>}
            </Button>
          </CardFooter>
        </form>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Account Security</CardTitle>
          <CardDescription>Manage your password and account security settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="outline" disabled>Change Password (Coming Soon)</Button>
             {/* Placeholder for other security settings like 2FA */}
        </CardContent>
      </Card>
    </div>
  );
}
