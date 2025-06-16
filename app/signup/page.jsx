
'use client'

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AetherLogo } from "@/components/ui/AetherLogo";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard"); // Redirect if already logged in
    }
  }, [user, loading, router]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsSigningUp(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Successful signup will trigger onAuthStateChanged in AuthContext
      // which will update user state and handle redirect via useEffect.
      // Forcing redirect here just in case.
      router.push("/dashboard"); 
    } catch (err) {
      setError(err.message || "Failed to create an account. Please try again.");
      setIsSigningUp(false);
    }
  };

  if (loading || (!loading && user)) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading...</p></div>; // Or a spinner
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-15rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <Link href="/" className="inline-block mb-4">
            <AetherLogo className="h-12 w-12 mx-auto text-primary" />
          </Link>
          <CardTitle className="font-headline text-3xl">Create Your Account</CardTitle>
          <CardDescription>Join Aether Industries to manage your refrigerant needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSigningUp}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSigningUp}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSigningUp}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSigningUp}>
              {isSigningUp ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
