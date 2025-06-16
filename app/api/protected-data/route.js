import { NextResponse } from 'next/server';
// Corrected import: Use default import for firebase-admin
import admin from '@/lib/firebase-admin';
// import { getAuth } from 'firebase-admin/auth'; // No longer needed as admin.auth() is used

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing or malformed Authorization header." }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) {
        return NextResponse.json({ error: "Unauthorized: Token not provided." }, { status: 401 });
    }
    
    // Ensure admin SDK is initialized before trying to use admin.auth()
    if (!admin.apps.length) {
        console.error("CRITICAL_ERROR in API route: Firebase Admin SDK is not initialized. This typically means the FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is missing or invalid in your deployment environment.");
        return NextResponse.json({ error: "Internal server error: Admin SDK not configured." }, { status: 500 });
    }

    // Use the imported 'admin' object and its auth() method
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    return NextResponse.json({ message: `Hello ${uid}, protected data access granted.` });
  } catch (err) {
    console.error("Error verifying token in /api/protected-data:", err);
    
    if (err.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: "Token expired. Please re-authenticate." }, { status: 401 });
    }
    if (err.code === 'auth/argument-error') {
        return NextResponse.json({ error: "Invalid token format." }, { status: 401 });
    }
    // Check if the error is due to admin SDK not being initialized (this might be redundant if the check above catches it)
    if (err.message && (err.message.includes("Firebase app has not been initialized") || err.message.includes("getDefaultApp") || err.message.includes("app not initialized"))) {
        console.error("CRITICAL_ERROR in API route catch block: Firebase Admin SDK not properly initialized. This is likely due to missing or incorrect FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.");
        return NextResponse.json({ error: "Internal server error: Admin SDK configuration issue." }, { status: 500 });
    }
    
    return NextResponse.json({ error: "Unauthorized: Could not verify token." }, { status: 401 });
  }
}
