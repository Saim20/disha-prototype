<template>
  <div 
    class="bg-gradient-to-br from-primary-500/30 via-primary-600/20 to-zinc-900 rounded-2xl p-5 border border-primary-500/30 relative overflow-hidden"
    @click="navigateToDetails"
  >
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
    
    <div class="relative">
      <div class="flex items-start justify-between mb-4">
        <div>
          <p class="text-sm text-zinc-400 mb-1">Credit Score</p>
          <div class="flex items-baseline gap-2">
            <span 
              class="text-4xl font-bold"
              :class="getScoreColor(creditScore.score)"
            >
              {{ creditScore.score }}
            </span>
            <span class="text-zinc-500 text-sm">/ 900</span>
          </div>
        </div>
        
        <div 
          class="px-3 py-1.5 rounded-full text-sm font-semibold"
          :class="getGradeBgClass(creditScore.grade)"
        >
          {{ creditScore.grade }} - {{ getGradeDescription(creditScore.grade) }}
        </div>
      </div>
      
      <!-- Score Bar -->
      <div class="h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
        <div 
          class="h-full rounded-full transition-all duration-1000"
          :class="getScoreBgColor(creditScore.score)"
          :style="{ width: `${(creditScore.score / 900) * 100}%` }"
        ></div>
      </div>
      
      <!-- Factors Preview -->
      <div class="grid grid-cols-2 gap-2">
        <div 
          v-for="factor in creditScore.factors.slice(0, 2)" 
          :key="factor.name"
          class="flex items-center gap-2 text-xs"
        >
          <UIcon 
            :name="getTrendIcon(factor.trend)" 
            :class="getTrendColor(factor.trend)"
            class="size-3"
          />
          <span class="text-zinc-400 truncate">{{ factor.name }}</span>
          <span class="text-zinc-300 font-medium">{{ factor.score }}%</span>
        </div>
      </div>
      
      <div class="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/50">
        <span class="text-xs text-zinc-500">
          Updated {{ formatDate(creditScore.lastUpdated) }}
        </span>
        <div class="flex items-center gap-1 text-xs text-primary-400">
          <span>View Details</span>
          <UIcon name="i-heroicons-chevron-right" class="size-3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { creditScore, getScoreColor, getScoreBgColor, getGradeDescription } = useCreditScore()

const navigateToDetails = () => {
  router.push('/credit-score')
}

const getGradeBgClass = (grade: string) => {
  switch (grade) {
    case 'A': return 'bg-emerald-500/20 text-emerald-400'
    case 'B': return 'bg-green-500/20 text-green-400'
    case 'C': return 'bg-yellow-500/20 text-yellow-400'
    case 'D': return 'bg-orange-500/20 text-orange-400'
    case 'E': return 'bg-red-500/20 text-red-400'
    default: return 'bg-zinc-500/20 text-zinc-400'
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return 'i-heroicons-arrow-trending-up'
    case 'down': return 'i-heroicons-arrow-trending-down'
    default: return 'i-heroicons-minus'
  }
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up': return 'text-emerald-400'
    case 'down': return 'text-red-400'
    default: return 'text-zinc-400'
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
</script>
