/*
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_CERT || '{}')
    ),
  });
}

export const verifyIdToken = async (token: string) => {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch (err) {
    console.error('Auth verification error:', err);
    return null;
  }
};
*/