// Firebase configuration for Disha MSME App
import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Get config from runtime config (environment variables)
const getFirebaseConfig = (): FirebaseOptions => {
  // For client-side, use runtime config
  if (import.meta.client && typeof useRuntimeConfig === 'function') {
    const runtimeConfig = useRuntimeConfig()
    return {
      apiKey: runtimeConfig.public.firebaseApiKey as string,
      authDomain: runtimeConfig.public.firebaseAuthDomain as string,
      projectId: runtimeConfig.public.firebaseProjectId as string,
      storageBucket: runtimeConfig.public.firebaseStorageBucket as string,
      messagingSenderId: runtimeConfig.public.firebaseMessagingSenderId as string,
      appId: runtimeConfig.public.firebaseAppId as string,
      measurementId: runtimeConfig.public.firebaseMeasurementId as string
    }
  }
  
  // Fallback for server-side (uses process.env)
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

// Lazy initialization - get Firestore instance
export const db = (() => {
  if (!firestore) {
    initializeFirebase()
  }
  return firestore!
})()

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