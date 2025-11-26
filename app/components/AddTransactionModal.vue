<template>
  <UModal v-model:open="open" :ui="{ width: 'sm:max-w-md' }">
    <template #content>
      <div class="p-5">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">Add Transaction</h2>
          <UButton 
            icon="i-heroicons-x-mark" 
            variant="ghost" 
            color="neutral"
            size="sm"
            @click="open = false"
          />
        </div>

        <!-- Type Toggle -->
        <div class="flex gap-2 mb-5">
          <button
            class="flex-1 py-3 px-4 rounded-xl font-medium transition-all"
            :class="form.type === 'income' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700'"
            @click="form.type = 'income'"
          >
            <UIcon name="i-heroicons-arrow-trending-up" class="size-4 mr-2" />
            Income
          </button>
          <button
            class="flex-1 py-3 px-4 rounded-xl font-medium transition-all"
            :class="form.type === 'expense' 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700'"
            @click="form.type = 'expense'"
          >
            <UIcon name="i-heroicons-arrow-trending-down" class="size-4 mr-2" />
            Expense
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Amount -->
          <UFormField label="Amount (₹)" required>
            <UInput 
              v-model="form.amount" 
              type="number" 
              placeholder="0"
              size="lg"
              :ui="{ base: 'text-xl font-semibold' }"
            />
          </UFormField>

          <!-- Category -->
          <UFormField label="Category" required>
            <USelect 
              v-model="form.category" 
              :items="categoryOptions"
              placeholder="Select category"
              size="lg"
            />
          </UFormField>

          <!-- Description -->
          <UFormField label="Description" required>
            <UInput 
              v-model="form.description" 
              placeholder="Enter description"
              size="lg"
            />
          </UFormField>

          <!-- Date -->
          <UFormField label="Date" required>
            <UInput 
              v-model="form.date" 
              type="date"
              size="lg"
            />
          </UFormField>

          <!-- Payment Method -->
          <UFormField label="Payment Method" required>
            <USelect 
              v-model="form.paymentMethod" 
              :items="paymentMethodOptions"
              placeholder="Select method"
              size="lg"
            />
          </UFormField>

          <!-- Reference (Optional) -->
          <UFormField label="Reference (Optional)">
            <UInput 
              v-model="form.reference" 
              placeholder="Invoice/Receipt number"
              size="lg"
            />
          </UFormField>

          <!-- Submit Button -->
          <UButton 
            type="submit" 
            block 
            size="lg"
            :loading="isSubmitting"
            class="mt-6"
          >
            Add Transaction
          </UButton>
        </form>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { incomeCategories, expenseCategories, paymentMethods } from '~/types'

const props = defineProps<{
  initialType?: 'income' | 'expense'
}>()

const open = defineModel<boolean>('open', { default: false })

const { addTransaction } = useStore()
const toast = useToast()

const form = reactive({
  type: 'income' as 'income' | 'expense',
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'upi' as 'cash' | 'upi' | 'bank_transfer' | 'card' | 'cheque',
  reference: ''
})

const isSubmitting = ref(false)

const categoryOptions = computed(() => {
  const categories = form.type === 'income' ? incomeCategories : expenseCategories
  return categories.map(c => ({ label: c, value: c }))
})

const paymentMethodOptions = paymentMethods.map(p => ({ label: p.label, value: p.value }))

// Watch for initial type changes
watch(() => props.initialType, (newType) => {
  if (newType) {
    form.type = newType
  }
}, { immediate: true })

// Reset category when type changes
watch(() => form.type, () => {
  form.category = ''
})

const handleSubmit = async () => {
  if (!form.amount || !form.category || !form.description || !form.date) {
    toast.add({
      title: 'Missing fields',
      description: 'Please fill in all required fields',
      color: 'red'
    })
    return
  }

  isSubmitting.value = true
  
  try {
    const result = await addTransaction({
      type: form.type,
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description,
      date: form.date,
      paymentMethod: form.paymentMethod,
      reference: form.reference || undefined
    })

    if (result) {
      toast.add({
        title: 'Transaction added',
        description: `${form.type === 'income' ? 'Income' : 'Expense'} of ₹${parseFloat(form.amount).toLocaleString('en-IN')} added successfully`,
        color: 'green'
      })

      // Reset form
      form.amount = ''
      form.category = ''
      form.description = ''
      form.date = new Date().toISOString().split('T')[0]
      form.reference = ''
      
      open.value = false
    } else {
      throw new Error('Failed to add transaction')
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to add transaction',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
