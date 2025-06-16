
// app/products/actions.ts
'use server';

import { seedDatabase } from '@/lib/firebaseServices';

// This function now lives in its own server-only file.
// It can be safely called from Client Components.
export async function seedDatabaseAction(): Promise<{success: boolean, count: number, error?: string}> {
  console.log("Server Action 'seedDatabaseAction' triggered from app/products/actions.ts.");
  const result = await seedDatabase(); // This now returns the structure defined in firebaseServices
  return result;
}
