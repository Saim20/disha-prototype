<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-white">Transactions</h1>
        <p class="text-sm text-zinc-400">{{ transactions.length }} total transactions</p>
      </div>
      <UButton 
        icon="i-heroicons-plus" 
        size="sm"
        @click="isAddModalOpen = true"
      >
        Add
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
      <UButton 
        v-for="filter in filters" 
        :key="filter.value"
        :variant="activeFilter === filter.value ? 'solid' : 'outline'"
        :color="activeFilter === filter.value ? 'primary' : 'neutral'"
        size="sm"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </UButton>
    </div>

    <!-- Search -->
    <UInput 
      v-model="searchQuery"
      placeholder="Search transactions..."
      icon="i-heroicons-magnifying-glass"
      size="lg"
      class="mb-4"
    />

    <!-- Transactions List -->
    <div class="space-y-3">
      <template v-if="filteredTransactions.length > 0">
        <div v-for="(group, date) in groupedTransactions" :key="date">
          <p class="text-xs text-zinc-500 uppercase tracking-wide mb-2 px-1">{{ formatGroupDate(date) }}</p>
          <div class="space-y-2">
            <TransactionItem 
              v-for="transaction in group" 
              :key="transaction.id" 
              :transaction="transaction"
              @click="openTransactionDetails(transaction)"
            />
          </div>
        </div>
      </template>
      
      <div v-else class="text-center py-12">
        <UIcon name="i-heroicons-inbox" class="size-16 mx-auto mb-4 text-zinc-700" />
        <p class="text-zinc-500 mb-2">No transactions found</p>
        <p class="text-sm text-zinc-600">
          {{ searchQuery ? 'Try a different search term' : 'Add your first transaction to get started' }}
        </p>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <AddTransactionModal v-model:open="isAddModalOpen" />

    <!-- Transaction Details Modal -->
    <UModal v-model:open="isDetailsModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <template #content>
        <div v-if="selectedTransaction" class="p-5">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-white">Transaction Details</h2>
            <UButton 
              icon="i-heroicons-x-mark" 
              variant="ghost" 
              color="neutral"
              size="sm"
              @click="isDetailsModalOpen = false"
            />
          </div>

          <div 
            class="size-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            :class="selectedTransaction.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'"
          >
            <UIcon 
              :name="selectedTransaction.type === 'income' ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" 
              class="size-8"
              :class="selectedTransaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'"
            />
          </div>

          <p 
            class="text-3xl font-bold text-center mb-1"
            :class="selectedTransaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'"
          >
            {{ selectedTransaction.type === 'income' ? '+' : '-' }}₹{{ selectedTransaction.amount.toLocaleString('en-IN') }}
          </p>
          <p class="text-zinc-400 text-center mb-6">{{ selectedTransaction.description }}</p>

          <div class="space-y-4 bg-zinc-900/50 rounded-xl p-4">
            <div class="flex justify-between">
              <span class="text-zinc-500">Category</span>
              <span class="text-white">{{ selectedTransaction.category }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-500">Date</span>
              <span class="text-white">{{ formatFullDate(selectedTransaction.date) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-500">Payment Method</span>
              <span class="text-white capitalize">{{ selectedTransaction.paymentMethod.replace('_', ' ') }}</span>
            </div>
            <div v-if="selectedTransaction.reference" class="flex justify-between">
              <span class="text-zinc-500">Reference</span>
              <span class="text-white">{{ selectedTransaction.reference }}</span>
            </div>
          </div>

          <UButton 
            block 
            variant="outline" 
            color="red" 
            class="mt-6"
            icon="i-heroicons-trash"
            @click="handleDelete"
          >
            Delete Transaction
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/types'

const { transactions, deleteTransaction } = useStore()
const toast = useToast()

const isAddModalOpen = ref(false)
const isDetailsModalOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)
const activeFilter = ref('all')
const searchQuery = ref('')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expenses', value: 'expense' }
]

const filteredTransactions = computed(() => {
  let result = [...transactions.value]
  
  // Filter by type
  if (activeFilter.value !== 'all') {
    result = result.filter(t => t.type === activeFilter.value)
  }
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    )
  }
  
  // Sort by date
  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const groupedTransactions = computed(() => {
  const groups: Record<string, Transaction[]> = {}
  
  filteredTransactions.value.forEach(t => {
    if (!groups[t.date]) {
      groups[t.date] = []
    }
    groups[t.date].push(t)
  })
  
  return groups
})

const formatGroupDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  
  return date.toLocaleDateString('en-IN', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  })
}

const formatFullDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const openTransactionDetails = (transaction: Transaction) => {
  selectedTransaction.value = transaction
  isDetailsModalOpen.value = true
}

const handleDelete = () => {
  if (selectedTransaction.value) {
    deleteTransaction(selectedTransaction.value.id)
    toast.add({
      title: 'Transaction deleted',
      color: 'green'
    })
    isDetailsModalOpen.value = false
    selectedTransaction.value = null
  }
}
</script>
