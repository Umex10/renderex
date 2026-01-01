// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


/**
 * Firebase configuration object.
 * Contains public API keys and identifiers loaded from environment variables.
 * These keys are safe to expose on the client side.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


/**
 * Initializes the Firebase Client SDK.
 * 
 * This logic ensures that the Firebase app is only initialized once.
 * It checks `getApps().length` to prevent "Firebase App named '[DEFAULT]' already exists" errors,
 * which is common in Next.js due to hot reloading and server-side rendering.
 * 
 * This instance is intended for **Client-Side** usage (Components, Hooks).
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()


/**
 * Firebase Authentication instance.
 * Used for handling user sign-in, sign-out, and auth state changes on the client.
 */
const auth = getAuth(app);

/**
 * Firestore Database instance.
 * Used for reading and writing data to Firestore from the client side.
 */
const db = getFirestore(app)

export {app, auth, db}