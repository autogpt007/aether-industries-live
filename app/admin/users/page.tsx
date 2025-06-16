// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert, UserCog, ArrowLeft, AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { functions as firebaseFunctions } from '@/lib/firebase'; // Use the central Firebase functions instance

// Mock user data (can be replaced or augmented with actual user fetching later)
const mockAdminUsers = [
  { id: 'user1', email: 'john.doe@example.com', name: 'John Doe', role: 'Customer', joinedDate: '2024-05-10', isVerified: true, claims: {} },
  { id: 'user2', email: 'jane.smith@example.com', name: 'Jane Smith', role: 'Customer', joinedDate: '2024-06-01', isVerified: true, claims: {} },
  { id: 'user3', email: 'admin@aetherindustries.com', name: 'Admin User', role: 'Admin', joinedDate: '2024-01-15', isVerified: true, claims: { admin: true } },
  { id: 'user4', email: 'eddy3597@gmail.com', name: 'Eddy (Dev Super Admin)', role: 'Super Admin', joinedDate: '2024-01-01', isVerified: true, claims: { super_admin: true, admin: true } },
];


export default function ManageUsersPage() {
    const { user, customClaims, loading: authLoading } = useAuth();
    const [targetEmail, setTargetEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState<'admin' | 'super_admin'>('admin');
    const [isProcessingRole, setIsProcessingRole] = useState(false);
    const { toast } = useToast();
    const [isSuperAdminClient, setIsSuperAdminClient] = useState(false);

    useEffect(() => {
        document.title = 'Manage Users | Aether Industries Admin';
        if (!authLoading && customClaims) {
          setIsSuperAdminClient(customClaims.super_admin === true);
        } else if (!authLoading && user && user.email === 'eddy3597@gmail.com') {
          // Dev fallback
          setIsSuperAdminClient(true);
          console.warn("DEV ONLY: Super admin UI enabled for eddy3597@gmail.com based on email match.");
        }
    }, [customClaims, authLoading, user]);


    const handleGrantRole = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!targetEmail.trim()) {
            toast({ title: "Error", description: "Please enter a target user's email address.", variant: "destructive"});
            return;
        }
        if (!isSuperAdminClient) {
            toast({ title: "Permission Denied", description: "You do not have permission to perform this action.", variant: "destructive" });
            return;
        }

        setIsProcessingRole(true);
        try {
            const addAdminRoleFunction = httpsCallable(firebaseFunctions, 'addAdminRole');
            const result: any = await addAdminRoleFunction({ email: targetEmail, role: selectedRole });
            toast({
                title: 'Role Update Successful',
                description: result.data.message || `${targetEmail} has been made a ${selectedRole}.`,
            });
            setTargetEmail('');
            // Consider re-fetching user list or claims if displayed here
        } catch (error: any) {
            console.error("Error granting role:", error);
            toast({ title: "Role Update Failed", description: error.message || "An unexpected error occurred.", variant: "destructive"});
        } finally {
            setIsProcessingRole(false);
        }
    };
    
    if (authLoading) {
        return <div className="py-8 text-center">Loading user data...</div>;
    }

    return (
        <div className="py-8 space-y-6">
             <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
                <Users className="mr-3 h-8 w-8 text-primary" /> Manage Users
                </h1>
                <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
                </Button>
            </div>

            {isSuperAdminClient ? (
                <Card className="border-accent">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center text-accent">
                            <ShieldAlert className="mr-2 h-5 w-5" /> Assign Admin Roles (Super Admin)
                        </CardTitle>
                        <CardDescription>
                            Enter the email address of the user and select the role to assign. The target user must already have a Firebase Authentication account.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleGrantRole}>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="targetEmail">User Email Address</Label>
                                <Input
                                    id="targetEmail"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={targetEmail}
                                    onChange={(e) => setTargetEmail(e.target.value)}
                                    required
                                    disabled={isProcessingRole}
                                />
                            </div>
                            <div>
                                <Label htmlFor="roleSelect">Role to Assign</Label>
                                <Select
                                    value={selectedRole}
                                    onValueChange={(value: 'admin' | 'super_admin') => setSelectedRole(value)}
                                    disabled={isProcessingRole}
                                >
                                    <SelectTrigger id="roleSelect" className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isProcessingRole} className="bg-accent text-accent-foreground hover:bg-accent/90">
                                {isProcessingRole ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                ) : (
                                    'Assign Role'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            ) : (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        You do not have super administrator privileges to manage user roles. This feature is restricted.
                    </AlertDescription>
                </Alert>
            )}

            {/* Display existing users (mock data for now) */}
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-xl">User Accounts</CardTitle>
                <CardDescription>
                    List of registered users. (Currently mock data. Full user listing requires backend integration).
                </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Table or list of users would go here */}
                    <p className="text-sm text-muted-foreground">User listing and individual user management (e.g., revoking roles, deleting users) will be implemented in a future update. For now, Super Admins can grant roles above.</p>
                </CardContent>
                <CardFooter>
                <p className="text-xs text-muted-foreground">
                    User role management via this interface requires Super Admin privileges and interacts with a Firebase Cloud Function.
                </p>
                </CardFooter>
            </Card>
        </div>
    );
}

    
