<template>
  <div class="px-4 py-6">
    <!-- User Account Section -->
    <div class="flex items-center gap-4 mb-6 bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
      <img 
        v-if="user?.photoURL" 
        :src="user.photoURL" 
        :alt="user.displayName || 'User'"
        class="size-12 rounded-full"
      />
      <div v-else class="size-12 rounded-full bg-primary-500/20 flex items-center justify-center">
        <UIcon name="i-heroicons-user" class="size-6 text-primary-400" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-white font-medium truncate">{{ user?.displayName || 'User' }}</p>
        <p class="text-sm text-zinc-400 truncate">{{ user?.email }}</p>
      </div>
      <UButton 
        icon="i-heroicons-arrow-right-start-on-rectangle" 
        variant="ghost"
        color="error"
        size="sm"
        @click="handleSignOut"
      />
    </div>

    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <div class="size-16 rounded-2xl bg-primary-500/20 flex items-center justify-center">
        <UIcon name="i-heroicons-building-storefront" class="size-8 text-primary-400" />
      </div>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-white">{{ business?.name || 'Your Business' }}</h1>
        <p class="text-sm text-zinc-400">{{ getBusinessTypeLabel(business?.type) }}</p>
      </div>
      <UButton 
        icon="i-heroicons-pencil" 
        variant="ghost"
        size="sm"
        @click="isEditModalOpen = true"
      />
    </div>

    <!-- Business Info Cards -->
    <div class="space-y-4 mb-6">
      <div class="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
        <h2 class="text-sm font-medium text-zinc-400 mb-3">Business Details</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-zinc-500 text-sm">Industry</span>
            <span class="text-white text-sm">{{ business?.industry || 'Not set' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-zinc-500 text-sm">Registration Date</span>
            <span class="text-white text-sm">{{ formatDate(business?.registrationDate) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-zinc-500 text-sm">Business Age</span>
            <span class="text-white text-sm">{{ getBusinessAge(business?.registrationDate) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
        <h2 class="text-sm font-medium text-zinc-400 mb-3">Tax Information</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-zinc-500 text-sm">GST Number</span>
            <span class="text-white text-sm font-mono">{{ business?.gstNumber || 'Not set' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-zinc-500 text-sm">PAN Number</span>
            <span class="text-white text-sm font-mono">{{ business?.panNumber || 'Not set' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Credit Score Summary -->
    <div class="bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-2xl p-5 border border-primary-500/30 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-zinc-400 mb-1">Your Credit Score</p>
          <p class="text-3xl font-bold" :class="getScoreColor(creditScore.score)">
            {{ creditScore.score }}
            <span class="text-lg text-zinc-500">/ 900</span>
          </p>
        </div>
        <NuxtLink 
          to="/credit-score"
          class="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
        >
          <span>View Details</span>
          <UIcon name="i-heroicons-arrow-right" class="size-4" />
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800 mb-6">
      <h2 class="text-sm font-medium text-zinc-400 mb-3">Account Statistics</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-2xl font-bold text-white">{{ stats.transactionCount }}</p>
          <p class="text-xs text-zinc-500">Total Transactions</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-white">₹{{ formatNumber(stats.avgTransactionValue) }}</p>
          <p class="text-xs text-zinc-500">Avg. Transaction</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-3">
      <UButton 
        block 
        variant="outline"
        icon="i-heroicons-arrow-down-tray"
      >
        Export Data
      </UButton>
      <UButton 
        block 
        variant="outline"
        icon="i-heroicons-share"
      >
        Share Credit Report
      </UButton>
      <UButton 
        block 
        variant="outline"
        color="error"
        icon="i-heroicons-arrow-right-start-on-rectangle"
        @click="handleSignOut"
      >
        Sign Out
      </UButton>
    </div>

    <!-- Edit Modal -->
    <UModal v-model:open="isEditModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <template #content>
        <div class="p-5">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-white">Edit Business Profile</h2>
            <UButton 
              icon="i-heroicons-x-mark" 
              variant="ghost" 
              color="neutral"
              size="sm"
              @click="isEditModalOpen = false"
            />
          </div>

          <form @submit.prevent="handleSave" class="space-y-4">
            <UFormField label="Business Name" required>
              <UInput v-model="editForm.name" placeholder="Enter business name" size="lg" />
            </UFormField>

            <UFormField label="Business Type" required>
              <USelect 
                v-model="editForm.type" 
                :items="businessTypeOptions"
                placeholder="Select type"
                size="lg"
              />
            </UFormField>

            <UFormField label="Industry" required>
              <USelect 
                v-model="editForm.industry" 
                :items="industryOptions"
                placeholder="Select industry"
                size="lg"
              />
            </UFormField>

            <UFormField label="GST Number">
              <UInput v-model="editForm.gstNumber" placeholder="27XXXXX1234X1ZX" size="lg" />
            </UFormField>

            <UFormField label="PAN Number">
              <UInput v-model="editForm.panNumber" placeholder="XXXXX1234X" size="lg" />
            </UFormField>

            <UButton type="submit" block size="lg" class="mt-6">
              Save Changes
            </UButton>
          </form>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { businessTypes, industries } from '~/types'

const router = useRouter()
const { user, signOut } = useAuth()
const { business, getDashboardStats, updateBusiness, resetApp } = useStore()
const { creditScore, getScoreColor } = useCreditScore()
const toast = useToast()

const stats = getDashboardStats
const isEditModalOpen = ref(false)

const editForm = reactive({
  name: '',
  type: '' as string,
  industry: '',
  gstNumber: '',
  panNumber: ''
})

const businessTypeOptions = businessTypes.map(t => ({ label: t.label, value: t.value }))
const industryOptions = industries.map(i => ({ label: i, value: i }))

// Initialize form when modal opens
watch(isEditModalOpen, (open) => {
  if (open && business.value) {
    editForm.name = business.value.name
    editForm.type = business.value.type
    editForm.industry = business.value.industry
    editForm.gstNumber = business.value.gstNumber || ''
    editForm.panNumber = business.value.panNumber || ''
  }
})

const getBusinessTypeLabel = (type?: string) => {
  const found = businessTypes.find(t => t.value === type)
  return found?.label || 'Business'
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Not set'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getBusinessAge = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  const years = (Date.now() - new Date(dateStr).getTime()) / (365 * 24 * 60 * 60 * 1000)
  if (years < 1) {
    const months = Math.floor(years * 12)
    return `${months} month${months !== 1 ? 's' : ''}`
  }
  return `${Math.floor(years)} year${Math.floor(years) !== 1 ? 's' : ''}`
}

const formatNumber = (num: number) => {
  return Math.round(num).toLocaleString('en-IN')
}

const handleSave = async () => {
  const success = await updateBusiness({
    name: editForm.name,
    type: editForm.type as any,
    industry: editForm.industry,
    gstNumber: editForm.gstNumber || undefined,
    panNumber: editForm.panNumber || undefined
  })
  
  if (success) {
    toast.add({
      title: 'Profile updated',
      color: 'success'
    })
    isEditModalOpen.value = false
  } else {
    toast.add({
      title: 'Update failed',
      description: 'Please try again',
      color: 'error'
    })
  }
}

const handleSignOut = async () => {
  if (confirm('Are you sure you want to sign out?')) {
    try {
      resetApp()
      await signOut()
      router.replace('/login')
    } catch (error) {
      toast.add({
        title: 'Sign out failed',
        description: 'Please try again',
        color: 'error'
      })
    }
  }
}
</script>
