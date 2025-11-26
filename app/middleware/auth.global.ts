export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for login page
  if (to.path === '/login') {
    return
  }

  // On server-side, skip auth check - let client handle it
  // This prevents redirect loop since Firebase Auth is client-side only
  if (import.meta.server) {
    return
  }

  const { isAuthenticated } = useAuth()
  const { hasBusinessSetup, initializeApp, isInitialized } = useStore()

  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Skip business check for onboarding page
  if (to.path === '/onboarding') {
    return
  }

  // Initialize app (load business & transactions from Firestore)
  if (!isInitialized.value) {
    await initializeApp()
  }

  // Redirect to onboarding if no business is set up
  if (!hasBusinessSetup.value) {
    return navigateTo('/onboarding')
  }
})
