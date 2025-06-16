
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions"; // Ensure Functions is imported

const firebaseConfig = {
  apiKey: "AIzaSyAXg1P5560lPziKypumT-r1cUSYT_VOgpI",
  authDomain: "aether-industries.firebaseapp.com",
  projectId: "aether-industries",
  storageBucket: "aether-industries.firebasestorage.app", // Corrected bucket name
  messagingSenderId: "422642382049",
  appId: "1:422642382049:web:41b26ad7411f9caf5df3a0"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app); // Initialize Firebase Functions

export { app, auth, db, storage, functions, httpsCallable }; // Export functions

    