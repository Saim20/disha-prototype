export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for onboarding page
  if (to.path === '/onboarding') {
    return
  }

  // Only run on client side
  if (import.meta.server) {
    return
  }

  const { initializeApp, hasBusinessSetup, isLoading, isInitialized } = useStore()
  
  // Initialize app if not already done
  if (!isInitialized.value) {
    await initializeApp()
  }

  // Wait for loading to complete
  while (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  // Redirect to onboarding if no business is set up
  if (!hasBusinessSetup.value) {
    return navigateTo('/onboarding')
  }
})
