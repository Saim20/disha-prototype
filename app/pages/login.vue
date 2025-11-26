<template>
  <div class="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
    <!-- Logo and Branding -->
    <div class="text-center mb-12">
      <div class="size-24 rounded-3xl bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
        <UIcon name="i-heroicons-building-storefront" class="size-12 text-primary-400" />
      </div>
      <h1 class="text-3xl font-bold text-white mb-3">Disha</h1>
      <p class="text-zinc-400 text-lg">MSME Bookkeeping Made Simple</p>
    </div>

    <!-- Features List -->
    <div class="w-full max-w-sm mb-12 space-y-4">
      <div class="flex items-center gap-4 text-zinc-300">
        <div class="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <UIcon name="i-heroicons-banknotes" class="size-5 text-emerald-400" />
        </div>
        <span class="text-sm">Track all your income & expenses</span>
      </div>
      <div class="flex items-center gap-4 text-zinc-300">
        <div class="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <UIcon name="i-heroicons-chart-pie" class="size-5 text-blue-400" />
        </div>
        <span class="text-sm">Generate profit & loss reports</span>
      </div>
      <div class="flex items-center gap-4 text-zinc-300">
        <div class="size-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <UIcon name="i-heroicons-star" class="size-5 text-amber-400" />
        </div>
        <span class="text-sm">Build your business credit score</span>
      </div>
    </div>

    <!-- Sign In Button -->
    <div class="w-full max-w-sm space-y-4">
      <UButton
        size="xl"
        class="w-full justify-center gap-3"
        :loading="isLoading"
        @click="handleGoogleSignIn"
      >
        <UIcon name="i-simple-icons-google" class="size-5" />
        Continue with Google
      </UButton>

      <p class="text-center text-xs text-zinc-500">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>

    <!-- Error Toast will be shown by useToast -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const toast = useToast()
const { signInWithGoogle, isAuthenticated } = useAuth()
const { hasBusinessSetup, initializeApp } = useStore()

const isLoading = ref(false)

// Redirect if already authenticated
onMounted(async () => {
  if (isAuthenticated.value) {
    await initializeApp()
    if (hasBusinessSetup.value) {
      router.replace('/')
    } else {
      router.replace('/onboarding')
    }
  }
})

const handleGoogleSignIn = async () => {
  isLoading.value = true
  
  try {
    const user = await signInWithGoogle()
    
    if (user) {
      toast.add({
        title: 'Welcome!',
        description: `Signed in as ${user.displayName || user.email}`,
        color: 'success'
      })
      
      // Initialize app and check for existing business
      await initializeApp()
      
      if (hasBusinessSetup.value) {
        router.replace('/')
      } else {
        router.replace('/onboarding')
      }
    }
  } catch (error: any) {
    toast.add({
      title: 'Sign in failed',
      description: error.message || 'Please try again',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
