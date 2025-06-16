
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAXg1P5560lPziKypumT-r1cUSYT_VOgpI",
  authDomain: "aether-industries.firebaseapp.com",
  projectId: "aether-industries",
  storageBucket: "aether-industries.appspot.com", // ✅ correct domain
  messagingSenderId: "422642382049",
  appId: "1:422642382049:web:41b26ad7411f9caf5df3a0"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }
// Removed problematic self-import and unused addProduct function
