
'use client'

import { auth } from "@/lib/firebase"; // This might not be needed if using AuthContext
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation"; // For redirecting

// This component might be deprecated in favor of a logout function in AuthContext
// and a button directly in Header.tsx.
// For now, let's keep it but make sure it redirects.

export default function LogoutButton({ onLogout }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // auth should be the firebase auth instance
      // alert("Logged out successfully!"); // Replaced by onLogout or direct redirect
      if (onLogout) {
        onLogout();
      }
      router.push('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle error appropriately
    }
  };

  // The actual button rendering is now mostly handled in Header.tsx
  // This component can be simplified or removed if Header.tsx handles the button itself.
  // If kept, it should be a simple button that calls handleLogout.
  return (
    <button
      onClick={handleLogout}
      className="btn-primary" // This class might not exist or might need to be updated
    >
      Log Out (Standalone)
    </button>
  );
}
