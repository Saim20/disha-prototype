// Firebase configuration for Disha MSME App
import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Firebase config - will be set by plugin
let firebaseConfig: FirebaseOptions | null = null

// Set config from plugin (called with runtime config values)
export const setFirebaseConfig = (config: FirebaseOptions) => {
  firebaseConfig = config
}

// Get config
const getFirebaseConfig = (): FirebaseOptions => {
  if (firebaseConfig) {
    return firebaseConfig
  }
  
  // Fallback to process.env (for server-side or if not set)
  return {
    apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
  }
}

// Initialize Firebase (prevent multiple initializations)
let app: FirebaseApp | null = null
let firestore: Firestore | null = null

const initializeFirebase = () => {
  if (getApps().length === 0) {
    const config = getFirebaseConfig()
    app = initializeApp(config)
  } else {
    app = getApps()[0]!
  }
  firestore = getFirestore(app)
  return { app, db: firestore }
}

// Lazy initialization - get Firestore instance (called only when needed)
export const getDb = () => {
  if (!firestore) {
    initializeFirebase()
  }
  return firestore!
}

// For backward compatibility - use as a getter
export const db = new Proxy({} as Firestore, {
  get(target, prop) {
    return (getDb() as any)[prop]
  }
})

// Get Firebase app instance
export const getApp = () => {
  if (!app) {
    initializeFirebase()
  }
  return app!
}

// Initialize Analytics (only in browser)
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(getApp())
  }
  return null
}

// Firestore collection names
export const collections = {
  businesses: 'businesses',
  transactions: 'transactions'
} as const

export default getApp