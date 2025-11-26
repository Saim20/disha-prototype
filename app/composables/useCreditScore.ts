import type { CreditScore, CreditFactor } from '~/types'

export const useCreditScore = () => {
  const { transactions, business, getDashboardStats } = useStore()
  
  // Calculate credit score based on various factors
  const calculateCreditScore = computed((): CreditScore => {
    const stats = getDashboardStats.value
    const txns = transactions.value
    
    // Factor 1: Payment Consistency (25%)
    // Measures regularity of income transactions
    const incomeTransactions = txns.filter(t => t.type === 'income')
    const consistencyScore = calculateConsistencyScore(incomeTransactions)
    
    // Factor 2: Profitability (25%)
    // Measures profit margin
    const profitabilityScore = calculateProfitabilityScore(stats.profitMargin)
    
    // Factor 3: Cash Flow Health (25%)
    // Measures positive cash flow periods
    const cashFlowScore = calculateCashFlowScore(stats.netProfit, stats.totalIncome)
    
    // Factor 4: Business Stability (25%)
    // Measures business age and transaction frequency
    const stabilityScore = calculateStabilityScore(
      business.value?.registrationDate,
      txns.length
    )
    
    const factors: CreditFactor[] = [
      {
        name: 'Payment Consistency',
        score: consistencyScore,
        weight: 25,
        description: 'Regular income patterns',
        trend: consistencyScore >= 70 ? 'up' : consistencyScore >= 50 ? 'stable' : 'down'
      },
      {
        name: 'Profitability',
        score: profitabilityScore,
        weight: 25,
        description: 'Profit margin health',
        trend: profitabilityScore >= 70 ? 'up' : profitabilityScore >= 50 ? 'stable' : 'down'
      },
      {
        name: 'Cash Flow Health',
        score: cashFlowScore,
        weight: 25,
        description: 'Positive cash flow',
        trend: cashFlowScore >= 70 ? 'up' : cashFlowScore >= 50 ? 'stable' : 'down'
      },
      {
        name: 'Business Stability',
        score: stabilityScore,
        weight: 25,
        description: 'Business age & activity',
        trend: stabilityScore >= 70 ? 'up' : stabilityScore >= 50 ? 'stable' : 'down'
      }
    ]
    
    // Calculate weighted score (0-100) then scale to 0-900
    const weightedScore = factors.reduce((sum, f) => sum + (f.score * f.weight / 100), 0)
    const finalScore = Math.round(weightedScore * 9) // Scale to 0-900
    
    return {
      score: Math.min(900, Math.max(0, finalScore)),
      grade: getGrade(finalScore),
      factors,
      lastUpdated: new Date().toISOString()
    }
  })
  
  // Helper functions
  function calculateConsistencyScore(incomeTransactions: typeof transactions.value): number {
    if (incomeTransactions.length === 0) return 20
    if (incomeTransactions.length < 3) return 40
    if (incomeTransactions.length < 5) return 60
    if (incomeTransactions.length < 10) return 75
    return 85
  }
  
  function calculateProfitabilityScore(profitMargin: number): number {
    if (profitMargin <= 0) return 20
    if (profitMargin < 10) return 40
    if (profitMargin < 20) return 60
    if (profitMargin < 30) return 75
    if (profitMargin < 50) return 85
    return 95
  }
  
  function calculateCashFlowScore(netProfit: number, totalIncome: number): number {
    if (totalIncome === 0) return 30
    if (netProfit < 0) return 25
    const ratio = netProfit / totalIncome
    if (ratio < 0.1) return 45
    if (ratio < 0.2) return 60
    if (ratio < 0.3) return 75
    if (ratio < 0.5) return 85
    return 90
  }
  
  function calculateStabilityScore(registrationDate?: string, transactionCount?: number): number {
    let score = 50
    
    if (registrationDate) {
      const years = (Date.now() - new Date(registrationDate).getTime()) / (365 * 24 * 60 * 60 * 1000)
      if (years >= 5) score += 25
      else if (years >= 3) score += 20
      else if (years >= 1) score += 10
      else score += 5
    }
    
    if (transactionCount) {
      if (transactionCount >= 50) score += 25
      else if (transactionCount >= 20) score += 20
      else if (transactionCount >= 10) score += 15
      else if (transactionCount >= 5) score += 10
      else score += 5
    }
    
    return Math.min(100, score)
  }
  
  function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'E' {
    if (score >= 750) return 'A'
    if (score >= 650) return 'B'
    if (score >= 550) return 'C'
    if (score >= 400) return 'D'
    return 'E'
  }
  
  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 750) return 'text-emerald-400'
    if (score >= 650) return 'text-green-400'
    if (score >= 550) return 'text-yellow-400'
    if (score >= 400) return 'text-orange-400'
    return 'text-red-400'
  }
  
  const getScoreBgColor = (score: number): string => {
    if (score >= 750) return 'bg-emerald-500'
    if (score >= 650) return 'bg-green-500'
    if (score >= 550) return 'bg-yellow-500'
    if (score >= 400) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getGradeDescription = (grade: string): string => {
    switch (grade) {
      case 'A': return 'Excellent'
      case 'B': return 'Good'
      case 'C': return 'Fair'
      case 'D': return 'Poor'
      case 'E': return 'Very Poor'
      default: return 'N/A'
    }
  }
  
  return {
    creditScore: calculateCreditScore,
    getScoreColor,
    getScoreBgColor,
    getGradeDescription
  }
}
