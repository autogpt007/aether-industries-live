// src/lib/firebase-admin.js
import admin from 'firebase-admin';

// Check if the app is already initialized
if (!admin.apps.length) {
  try {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    let serviceAccountParsed = null;

    if (!serviceAccountBase64) {
      console.error('CRITICAL_ERROR: FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is NOT SET. Firebase Admin SDK cannot be initialized. Any functionality requiring admin privileges will fail.');
      // Depending on requirements, you might throw an error here to stop the server.
      // For now, we'll let it proceed but log a very clear error.
    } else {
      try {
        const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
        serviceAccountParsed = JSON.parse(serviceAccountJson);
      } catch (parseError) {
        console.error('CRITICAL_ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64. Check if it is a valid Base64 encoded JSON string. Firebase Admin SDK cannot be initialized.', parseError);
        serviceAccountParsed = null; // Ensure it's null if parsing fails
      }
    }

    if (serviceAccountParsed) {
      // Validate essential fields in the service account
      if (!serviceAccountParsed.project_id) {
        console.error("CRITICAL_ERROR: Firebase Admin SDK Initialization Error: Parsed service account is missing 'project_id'.");
        serviceAccountParsed = null; // Invalidate if critical field is missing
      } else if (!serviceAccountParsed.client_email) {
        console.error("CRITICAL_ERROR: Firebase Admin SDK Initialization Error: Parsed service account is missing 'client_email'.");
        serviceAccountParsed = null;
      } else if (!serviceAccountParsed.private_key) {
        console.error("CRITICAL_ERROR: Firebase Admin SDK Initialization Error: Parsed service account is missing 'private_key'.");
        serviceAccountParsed = null;
      }

      if (serviceAccountParsed) { // Check again after validation
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountParsed)
          // Add other admin config here if needed, e.g., databaseURL
          // databaseURL: `https://${serviceAccountParsed.project_id}.firebaseio.com` (if using RTDB)
        });
        console.log("Firebase Admin SDK initialized successfully.");
      } else {
        console.error('CRITICAL_ERROR: Firebase Admin SDK not initialized due to invalid or incomplete service account data after parsing/validation.');
      }
    } else if (serviceAccountBase64) { // This case means parsing failed but the var was set
      console.error('CRITICAL_ERROR: Firebase Admin SDK not initialized because FIREBASE_SERVICE_ACCOUNT_BASE64 was provided but could not be parsed or validated.');
    }
    // If serviceAccountBase64 was not set at all, the first console.error already covered it.

  } catch (initError) {
    console.error('CRITICAL_ERROR: Uncaught exception during Firebase Admin Initialization:', initError);
  }
} else {
  console.log("Firebase Admin SDK already initialized.");
}

export default admin;
