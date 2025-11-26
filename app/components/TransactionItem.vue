<template>
  <div 
    class="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
    @click="$emit('click', transaction)"
  >
    <div 
      class="size-10 rounded-xl flex items-center justify-center shrink-0"
      :class="transaction.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'"
    >
      <UIcon 
        :name="getCategoryIcon(transaction.category)" 
        class="size-5"
        :class="transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'"
      />
    </div>
    
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-white truncate">{{ transaction.description }}</p>
      <p class="text-xs text-zinc-500">{{ transaction.category }} • {{ formatDate(transaction.date) }}</p>
    </div>
    
    <div class="text-right shrink-0">
      <p 
        class="text-sm font-semibold"
        :class="transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'"
      >
        {{ transaction.type === 'income' ? '+' : '-' }}₹{{ formatNumber(transaction.amount) }}
      </p>
      <p class="text-xs text-zinc-500 capitalize">{{ transaction.paymentMethod.replace('_', ' ') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/types'

defineProps<{
  transaction: Transaction
}>()

defineEmits<{
  click: [transaction: Transaction]
}>()

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'Sales': 'i-heroicons-shopping-bag',
    'Services': 'i-heroicons-briefcase',
    'Commission': 'i-heroicons-currency-rupee',
    'Interest': 'i-heroicons-chart-bar',
    'Rental Income': 'i-heroicons-home',
    'Other Income': 'i-heroicons-plus-circle',
    'Inventory/Stock': 'i-heroicons-cube',
    'Salaries': 'i-heroicons-users',
    'Rent': 'i-heroicons-building-office',
    'Utilities': 'i-heroicons-bolt',
    'Marketing': 'i-heroicons-megaphone',
    'Transportation': 'i-heroicons-truck',
    'Equipment': 'i-heroicons-wrench-screwdriver',
    'Office Supplies': 'i-heroicons-clipboard-document-list',
    'Professional Services': 'i-heroicons-academic-cap',
    'Insurance': 'i-heroicons-shield-check',
    'Taxes': 'i-heroicons-document-text',
    'Loan Payment': 'i-heroicons-banknotes',
    'Other Expense': 'i-heroicons-minus-circle'
  }
  return icons[category] || 'i-heroicons-banknotes'
}

const formatNumber = (num: number) => {
  return num.toLocaleString('en-IN')
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
</script>
