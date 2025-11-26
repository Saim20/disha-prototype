<template>
  <div class="px-4 py-6">
    <!-- Back Button -->
    <NuxtLink 
      to="/" 
      class="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6"
    >
      <UIcon name="i-heroicons-arrow-left" class="size-4" />
      Back to Dashboard
    </NuxtLink>

    <!-- Score Display -->
    <div class="text-center mb-8">
      <div class="relative inline-block">
        <svg class="size-48 transform -rotate-90" viewBox="0 0 200 200">
          <!-- Background circle -->
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            stroke-width="12"
            class="text-zinc-800"
          />
          <!-- Score arc -->
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            stroke-width="12"
            stroke-linecap="round"
            :stroke-dasharray="`${(creditScore.score / 900) * 565} 565`"
            :class="getScoreColor(creditScore.score)"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            class="text-5xl font-bold"
            :class="getScoreColor(creditScore.score)"
          >
            {{ creditScore.score }}
          </span>
          <span class="text-zinc-500 text-sm">out of 900</span>
        </div>
      </div>
      
      <div 
        class="inline-block px-4 py-2 rounded-full text-sm font-semibold mt-4"
        :class="getGradeBgClass(creditScore.grade)"
      >
        Grade {{ creditScore.grade }} - {{ getGradeDescription(creditScore.grade) }}
      </div>
    </div>

    <!-- Score Interpretation -->
    <div class="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800 mb-6">
      <h2 class="text-lg font-semibold text-white mb-3">What this means</h2>
      <p class="text-sm text-zinc-400 leading-relaxed">
        {{ getScoreInterpretation(creditScore.score) }}
      </p>
    </div>

    <!-- Factors -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-white mb-4">Score Factors</h2>
      <div class="space-y-4">
        <div 
          v-for="factor in creditScore.factors" 
          :key="factor.name"
          class="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <div 
                class="size-8 rounded-lg flex items-center justify-center"
                :class="getFactorBgColor(factor.score)"
              >
                <UIcon :name="getFactorIcon(factor.name)" class="size-4 text-white" />
              </div>
              <div>
                <p class="text-sm font-medium text-white">{{ factor.name }}</p>
                <p class="text-xs text-zinc-500">{{ factor.weight }}% weight</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UIcon 
                :name="getTrendIcon(factor.trend)" 
                :class="getTrendColor(factor.trend)"
                class="size-4"
              />
              <span class="text-lg font-semibold" :class="getFactorScoreColor(factor.score)">
                {{ factor.score }}%
              </span>
            </div>
          </div>
          
          <div class="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
            <div 
              class="h-full rounded-full transition-all duration-500"
              :class="getFactorBarColor(factor.score)"
              :style="{ width: `${factor.score}%` }"
            ></div>
          </div>
          
          <p class="text-xs text-zinc-500">{{ factor.description }}</p>
        </div>
      </div>
    </div>

    <!-- Tips -->
    <div class="bg-primary-500/10 rounded-2xl p-5 border border-primary-500/20">
      <h2 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <UIcon name="i-heroicons-light-bulb" class="size-5 text-primary-400" />
        Tips to Improve
      </h2>
      <ul class="space-y-2">
        <li v-for="tip in improvementTips" :key="tip" class="flex items-start gap-2 text-sm text-zinc-300">
          <UIcon name="i-heroicons-check-circle" class="size-4 text-primary-400 mt-0.5 shrink-0" />
          <span>{{ tip }}</span>
        </li>
      </ul>
    </div>

    <!-- API Info -->
    <div class="mt-6 bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800">
      <h2 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <UIcon name="i-heroicons-code-bracket" class="size-5 text-zinc-400" />
        For Lenders & Banks
      </h2>
      <p class="text-sm text-zinc-400 mb-3">
        Access this credit score via our API for lending decisions.
      </p>
      <div class="bg-zinc-800/50 rounded-lg p-3 font-mono text-xs text-zinc-300 overflow-x-auto">
        GET /api/credit-score/{{ business?.id || 'demo' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { business } = useStore()
const { creditScore, getScoreColor, getGradeDescription } = useCreditScore()

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

const getFactorIcon = (name: string) => {
  const icons: Record<string, string> = {
    'Payment Consistency': 'i-heroicons-calendar',
    'Profitability': 'i-heroicons-currency-rupee',
    'Cash Flow Health': 'i-heroicons-arrow-path',
    'Business Stability': 'i-heroicons-building-storefront'
  }
  return icons[name] || 'i-heroicons-chart-bar'
}

const getFactorBgColor = (score: number) => {
  if (score >= 70) return 'bg-emerald-500'
  if (score >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getFactorScoreColor = (score: number) => {
  if (score >= 70) return 'text-emerald-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

const getFactorBarColor = (score: number) => {
  if (score >= 70) return 'bg-emerald-500'
  if (score >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getScoreInterpretation = (score: number) => {
  if (score >= 750) {
    return 'Excellent! Your business shows strong financial health with consistent income, good profit margins, and stable operations. You\'re likely to qualify for the best loan terms.'
  }
  if (score >= 650) {
    return 'Good standing. Your business demonstrates reliable financial patterns. Most lenders would consider your application favorably with competitive rates.'
  }
  if (score >= 550) {
    return 'Fair score. Your business has some areas for improvement but maintains reasonable financial health. You may qualify for loans with standard terms.'
  }
  if (score >= 400) {
    return 'Below average. There are concerns about your business\'s financial stability. Consider improving your cash flow and consistency before applying for credit.'
  }
  return 'Needs improvement. Your business shows signs of financial stress. Focus on increasing income, reducing expenses, and maintaining consistent transactions.'
}

const improvementTips = computed(() => {
  const tips: string[] = []
  const factors = creditScore.value.factors
  
  const consistency = factors.find(f => f.name === 'Payment Consistency')
  if (consistency && consistency.score < 70) {
    tips.push('Record transactions regularly to show consistent business activity')
  }
  
  const profitability = factors.find(f => f.name === 'Profitability')
  if (profitability && profitability.score < 70) {
    tips.push('Focus on increasing profit margins by optimizing expenses')
  }
  
  const cashFlow = factors.find(f => f.name === 'Cash Flow Health')
  if (cashFlow && cashFlow.score < 70) {
    tips.push('Maintain positive cash flow by managing receivables efficiently')
  }
  
  const stability = factors.find(f => f.name === 'Business Stability')
  if (stability && stability.score < 70) {
    tips.push('Continue building your business history with consistent operations')
  }
  
  tips.push('Keep all your transactions recorded for accurate scoring')
  tips.push('Maintain separate business and personal finances')
  
  return tips.slice(0, 4)
})
</script>
