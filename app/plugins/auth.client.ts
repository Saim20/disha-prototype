import { setFirebaseConfig } from '~/config/firebase'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Set Firebase config from runtime config
  const runtimeConfig = useRuntimeConfig()
  
  if (!runtimeConfig.public.firebaseApiKey) {
    console.error('Firebase API key is missing! Check your .env file and restart the dev server.')
    return
  }
  
  setFirebaseConfig({
    apiKey: runtimeConfig.public.firebaseApiKey as string,
    authDomain: runtimeConfig.public.firebaseAuthDomain as string,
    projectId: runtimeConfig.public.firebaseProjectId as string,
    storageBucket: runtimeConfig.public.firebaseStorageBucket as string,
    messagingSenderId: runtimeConfig.public.firebaseMessagingSenderId as string,
    appId: runtimeConfig.public.firebaseAppId as string,
    measurementId: runtimeConfig.public.firebaseMeasurementId as string
  })

  // Now initialize auth using the composable within Nuxt context
  const { initAuth, isAuthLoading } = useAuth()
  
  // Initialize auth listener
  initAuth()
  
  // Wait for auth to resolve before continuing
  await new Promise<void>((resolve) => {
    if (!isAuthLoading.value) {
      resolve()
      return
    }
    
    const unwatch = watch(isAuthLoading, (loading) => {
      if (!loading) {
        unwatch()
        resolve()
      }
    })
    
    // Timeout after 5 seconds
    setTimeout(() => {
      unwatch()
      resolve()
    }, 5000)
  })
})
