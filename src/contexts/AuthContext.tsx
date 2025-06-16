
'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth } from '@/lib/firebase';

interface CustomClaims {
  admin?: boolean;
  super_admin?: boolean;
  [key: string]: any; // Allow other claims
}

interface AuthContextType {
  user: User | null;
  customClaims: CustomClaims | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshClaims: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<CustomClaims | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchClaims = useCallback(async (currentUser: User | null) => {
    if (currentUser) {
      try {
        const idTokenResult = await currentUser.getIdTokenResult(true); // Force refresh
        setCustomClaims(idTokenResult.claims as CustomClaims);
      } catch (error) {
        console.error("Error fetching custom claims:", error);
        setCustomClaims(null);
      }
    } else {
      setCustomClaims(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await fetchClaims(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchClaims]);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setCustomClaims(null); // Clear claims on logout
      router.push('/'); 
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshClaims = useCallback(async () => {
    if (user) {
      setLoading(true);
      await fetchClaims(user);
      setLoading(false);
    }
  }, [user, fetchClaims]);

  return (
    <AuthContext.Provider value={{ user, customClaims, loading, logout, refreshClaims }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

    