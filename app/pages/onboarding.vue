<template>
  <div class="min-h-screen bg-zinc-950 flex flex-col">
    <!-- Header -->
    <div class="px-6 pt-12 pb-8 text-center">
      <div class="size-20 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
        <UIcon name="i-heroicons-building-storefront" class="size-10 text-primary-400" />
      </div>
      <h1 class="text-2xl font-bold text-white mb-2">Welcome to Disha</h1>
      <p class="text-zinc-400">Let's set up your business profile to get started</p>
    </div>

    <!-- Progress Steps -->
    <div class="px-6 mb-8">
      <div class="flex items-center justify-center gap-2">
        <div 
          v-for="i in totalSteps" 
          :key="i"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="[
            i <= currentStep ? 'bg-primary-500' : 'bg-zinc-800',
            i === currentStep ? 'w-8' : 'w-4'
          ]"
        />
      </div>
      <p class="text-center text-xs text-zinc-500 mt-3">Step {{ currentStep }} of {{ totalSteps }}</p>
    </div>

    <!-- Form Content -->
    <div class="flex-1 px-6 pb-8">
      <!-- Step 1: Business Name -->
      <div v-if="currentStep === 1" class="space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-white mb-2">What's your business name?</h2>
          <p class="text-sm text-zinc-400">This will be displayed on your dashboard and reports</p>
        </div>
        
        <UFormField>
          <UInput 
            v-model="form.name" 
            placeholder="e.g., Krishna Enterprises"
            size="xl"
            autofocus
          />
        </UFormField>
      </div>

      <!-- Step 2: Business Type -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-white mb-2">What type of business?</h2>
          <p class="text-sm text-zinc-400">Select your business structure</p>
        </div>
        
        <div class="space-y-3">
          <button
            v-for="option in businessTypeOptions"
            :key="option.value"
            class="w-full p-4 rounded-xl border text-left transition-all"
            :class="form.type === option.value 
              ? 'bg-primary-500/20 border-primary-500/50 text-white' 
              : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'"
            @click="form.type = option.value"
          >
            <span class="font-medium">{{ option.label }}</span>
          </button>
        </div>
      </div>

      <!-- Step 3: Industry -->
      <div v-if="currentStep === 3" class="space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-white mb-2">What industry are you in?</h2>
          <p class="text-sm text-zinc-400">This helps us customize your experience</p>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="industry in industryOptions"
            :key="industry"
            class="p-4 rounded-xl border text-center transition-all"
            :class="form.industry === industry 
              ? 'bg-primary-500/20 border-primary-500/50 text-white' 
              : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'"
            @click="form.industry = industry"
          >
            <span class="text-sm font-medium">{{ industry }}</span>
          </button>
        </div>
      </div>

      <!-- Step 4: Registration Date -->
      <div v-if="currentStep === 4" class="space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-white mb-2">When did your business start?</h2>
          <p class="text-sm text-zinc-400">This affects your credit score calculation</p>
        </div>
        
        <UFormField label="Registration/Start Date">
          <UInput 
            v-model="form.registrationDate" 
            type="date"
            size="xl"
          />
        </UFormField>
      </div>

      <!-- Step 5: Tax Information (Optional) -->
      <div v-if="currentStep === 5" class="space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-white mb-2">Tax Information</h2>
          <p class="text-sm text-zinc-400">Optional but recommended for complete profile</p>
        </div>
        
        <UFormField label="GST Number (Optional)">
          <UInput 
            v-model="form.gstNumber" 
            placeholder="e.g., 27AABCU9603R1ZM"
            size="lg"
          />
        </UFormField>

        <UFormField label="PAN Number (Optional)">
          <UInput 
            v-model="form.panNumber" 
            placeholder="e.g., AABCU9603R"
            size="lg"
          />
        </UFormField>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="px-6 pb-8 safe-area-inset-bottom">
      <div class="flex gap-3">
        <UButton 
          v-if="currentStep > 1"
          variant="outline"
          size="lg"
          class="flex-1"
          @click="previousStep"
        >
          Back
        </UButton>
        
        <UButton 
          size="lg"
          class="flex-1"
          :loading="isSubmitting"
          :disabled="!canProceed"
          @click="nextStep"
        >
          {{ currentStep === totalSteps ? 'Complete Setup' : 'Continue' }}
        </UButton>
      </div>
      
      <button 
        v-if="currentStep === 5"
        class="w-full mt-4 text-sm text-zinc-500 hover:text-zinc-400"
        @click="skipAndComplete"
      >
        Skip and complete setup
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { businessTypes, industries } from '~/types'

definePageMeta({
  layout: false
})

const router = useRouter()
const { setupBusiness, hasBusinessSetup } = useStore()
const toast = useToast()

// Redirect if already set up
onMounted(() => {
  if (hasBusinessSetup.value) {
    router.replace('/')
  }
})

const currentStep = ref(1)
const totalSteps = 5
const isSubmitting = ref(false)

const form = reactive({
  name: '',
  type: '' as string,
  industry: '',
  registrationDate: '',
  gstNumber: '',
  panNumber: ''
})

const businessTypeOptions = businessTypes.map(t => ({ value: t.value, label: t.label }))
const industryOptions = [...industries]

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return form.name.trim().length >= 2
    case 2: return form.type !== ''
    case 3: return form.industry !== ''
    case 4: return form.registrationDate !== ''
    case 5: return true // Optional step
    default: return false
  }
})

const nextStep = async () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    await completeSetup()
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const skipAndComplete = async () => {
  await completeSetup()
}

const completeSetup = async () => {
  isSubmitting.value = true
  
  try {
    const business = await setupBusiness({
      name: form.name.trim(),
      type: form.type as 'sole_proprietorship' | 'partnership' | 'llp' | 'pvt_ltd',
      industry: form.industry,
      registrationDate: form.registrationDate,
      gstNumber: form.gstNumber.trim() || undefined,
      panNumber: form.panNumber.trim() || undefined
    })
    
    if (business) {
      toast.add({
        title: 'Welcome to Disha!',
        description: 'Your business has been set up successfully',
        color: 'green'
      })
      router.replace('/')
    } else {
      throw new Error('Failed to create business')
    }
  } catch (error) {
    toast.add({
      title: 'Setup failed',
      description: 'Please try again',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
