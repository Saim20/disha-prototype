<template>
  <div class="px-4 py-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">{{ greeting }}</h1>
        <p class="text-sm text-zinc-400">{{ business?.name || 'Your Business' }}</p>
      </div>
      <div class="size-10 rounded-full bg-primary-500/20 flex items-center justify-center">
        <UIcon name="i-heroicons-building-storefront" class="size-5 text-primary-400" />
      </div>
    </div>

    <!-- Credit Score Card -->
    <CreditScoreCard />

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
        <div class="flex items-center gap-2 mb-2">
          <div class="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <UIcon name="i-heroicons-arrow-trending-up" class="size-4 text-emerald-400" />
          </div>
          <span class="text-xs text-zinc-400">Income</span>
        </div>
        <p class="text-lg font-bold text-white">৳{{ formatNumber(stats.totalIncome) }}</p>
      </div>
      
      <div class="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
        <div class="flex items-center gap-2 mb-2">
          <div class="size-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <UIcon name="i-heroicons-arrow-trending-down" class="size-4 text-red-400" />
          </div>
          <span class="text-xs text-zinc-400">Expenses</span>
        </div>
        <p class="text-lg font-bold text-white">৳{{ formatNumber(stats.totalExpenses) }}</p>
      </div>
    </div>

    <!-- Profit Card -->
    <div class="bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-2xl p-5 border border-primary-500/30">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-zinc-400 mb-1">Net Profit</p>
          <p class="text-2xl font-bold" :class="stats.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'">
            {{ stats.netProfit >= 0 ? '+' : '' }}৳{{ formatNumber(stats.netProfit) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-zinc-400 mb-1">Margin</p>
          <p class="text-lg font-semibold text-white">{{ stats.profitMargin.toFixed(1) }}%</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex gap-3">
      <UButton 
        block 
        size="lg" 
        class="flex-1"
        icon="i-heroicons-plus"
        @click="openAddTransaction('income')"
      >
        Add Income
      </UButton>
      <UButton 
        block 
        size="lg" 
        variant="outline"
        class="flex-1"
        icon="i-heroicons-minus"
        @click="openAddTransaction('expense')"
      >
        Add Expense
      </UButton>
    </div>

    <!-- Recent Transactions -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Recent Transactions</h2>
        <NuxtLink to="/transactions" class="text-sm text-primary-400 hover:text-primary-300">
          View All
        </NuxtLink>
      </div>
      
      <div class="space-y-3">
        <TransactionItem 
          v-for="transaction in recentTransactions" 
          :key="transaction.id" 
          :transaction="transaction"
        />
        
        <div v-if="recentTransactions.length === 0" class="text-center py-8 text-zinc-500">
          <UIcon name="i-heroicons-inbox" class="size-12 mx-auto mb-2 opacity-50" />
          <p>No transactions yet</p>
        </div>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <AddTransactionModal 
      v-model:open="isAddModalOpen"
      :initial-type="initialTransactionType"
    />
  </div>
</template>

<script setup lang="ts">
const { business, getDashboardStats, recentTransactions } = useStore()

const stats = getDashboardStats
const isAddModalOpen = ref(false)
const initialTransactionType = ref<'income' | 'expense'>('income')

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
})

const formatNumber = (num: number) => {
  return Math.abs(num).toLocaleString('en-BD')
}

const openAddTransaction = (type: 'income' | 'expense') => {
  initialTransactionType.value = type
  isAddModalOpen.value = true
}
</script>
