import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Prevents re-initialization on hot reload or multi-instance
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

export interface Product { id: string; name: string; /* … your fields */ }

export async function getProductById(id: string): Promise<Product|null> {
  const snap = await db.collection("products").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as Omit<Product, "id">) };
}