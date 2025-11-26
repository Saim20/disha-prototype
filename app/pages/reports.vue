<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-bold text-white">Reports</h1>
      <p class="text-sm text-zinc-400">Financial summary and insights</p>
    </div>

    <!-- Period Selector -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      <UButton 
        v-for="period in periods" 
        :key="period.value"
        :variant="activePeriod === period.value ? 'solid' : 'outline'"
        :color="activePeriod === period.value ? 'primary' : 'neutral'"
        size="sm"
        @click="activePeriod = period.value"
      >
        {{ period.label }}
      </UButton>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
        <p class="text-xs text-zinc-500 mb-1">Total Income</p>
        <p class="text-xl font-bold text-emerald-400">₹{{ formatNumber(periodStats.income) }}</p>
      </div>
      <div class="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
        <p class="text-xs text-zinc-500 mb-1">Total Expenses</p>
        <p class="text-xl font-bold text-red-400">₹{{ formatNumber(periodStats.expenses) }}</p>
      </div>
    </div>

    <!-- Profit/Loss Card -->
    <div 
      class="rounded-2xl p-5 border mb-6"
      :class="periodStats.profit >= 0 
        ? 'bg-emerald-500/10 border-emerald-500/20' 
        : 'bg-red-500/10 border-red-500/20'"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-zinc-400 mb-1">{{ periodStats.profit >= 0 ? 'Net Profit' : 'Net Loss' }}</p>
          <p 
            class="text-3xl font-bold"
            :class="periodStats.profit >= 0 ? 'text-emerald-400' : 'text-red-400'"
          >
            {{ periodStats.profit >= 0 ? '+' : '' }}₹{{ formatNumber(periodStats.profit) }}
          </p>
        </div>
        <div 
          class="size-14 rounded-full flex items-center justify-center"
          :class="periodStats.profit >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'"
        >
          <UIcon 
            :name="periodStats.profit >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" 
            class="size-7"
            :class="periodStats.profit >= 0 ? 'text-emerald-400' : 'text-red-400'"
          />
        </div>
      </div>
      <div class="mt-4 pt-4 border-t" :class="periodStats.profit >= 0 ? 'border-emerald-500/20' : 'border-red-500/20'">
        <div class="flex justify-between text-sm">
          <span class="text-zinc-400">Profit Margin</span>
          <span class="font-medium" :class="periodStats.profit >= 0 ? 'text-emerald-400' : 'text-red-400'">
            {{ periodStats.margin.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Category Breakdown -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-white mb-4">Expense Breakdown</h2>
      <div class="space-y-3">
        <div 
          v-for="category in expensesByCategory" 
          :key="category.name"
          class="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-white">{{ category.name }}</span>
            <span class="text-sm font-medium text-zinc-300">₹{{ formatNumber(category.amount) }}</span>
          </div>
          <div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary-500 rounded-full transition-all duration-500"
              :style="{ width: `${category.percentage}%` }"
            ></div>
          </div>
          <p class="text-xs text-zinc-500 mt-1">{{ category.percentage.toFixed(1) }}% of expenses</p>
        </div>
        
        <div v-if="expensesByCategory.length === 0" class="text-center py-8 text-zinc-500">
          <UIcon name="i-heroicons-chart-pie" class="size-12 mx-auto mb-2 opacity-50" />
          <p>No expenses in this period</p>
        </div>
      </div>
    </div>

    <!-- Income Sources -->
    <div>
      <h2 class="text-lg font-semibold text-white mb-4">Income Sources</h2>
      <div class="space-y-3">
        <div 
          v-for="category in incomeByCategory" 
          :key="category.name"
          class="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-white">{{ category.name }}</span>
            <span class="text-sm font-medium text-emerald-400">₹{{ formatNumber(category.amount) }}</span>
          </div>
          <div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              class="h-full bg-emerald-500 rounded-full transition-all duration-500"
              :style="{ width: `${category.percentage}%` }"
            ></div>
          </div>
          <p class="text-xs text-zinc-500 mt-1">{{ category.percentage.toFixed(1) }}% of income</p>
        </div>
        
        <div v-if="incomeByCategory.length === 0" class="text-center py-8 text-zinc-500">
          <UIcon name="i-heroicons-chart-pie" class="size-12 mx-auto mb-2 opacity-50" />
          <p>No income in this period</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { transactions } = useStore()

const activePeriod = ref('month')

const periods = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: '3 Months', value: 'quarter' },
  { label: 'Year', value: 'year' },
  { label: 'All', value: 'all' }
]

const filteredTransactions = computed(() => {
  const now = new Date()
  let startDate: Date
  
  switch (activePeriod.value) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'quarter':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      return transactions.value
  }
  
  return transactions.value.filter(t => new Date(t.date) >= startDate)
})

const periodStats = computed(() => {
  const income = filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const expenses = filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const profit = income - expenses
  const margin = income > 0 ? (profit / income) * 100 : 0
  
  return { income, expenses, profit, margin }
})

const expensesByCategory = computed(() => {
  const categories: Record<string, number> = {}
  const total = periodStats.value.expenses
  
  filteredTransactions.value
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount
    })
  
  return Object.entries(categories)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
})

const incomeByCategory = computed(() => {
  const categories: Record<string, number> = {}
  const total = periodStats.value.income
  
  filteredTransactions.value
    .filter(t => t.type === 'income')
    .forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount
    })
  
  return Object.entries(categories)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
})

const formatNumber = (num: number) => {
  return Math.abs(num).toLocaleString('en-IN')
}
</script>
