import type { CreditScore, CreditFactor, Transaction, Business } from '~/types'

// Demo data - In production, this would come from Firebase
const demoTransactions: Transaction[] = [
  {
    id: '1',
    businessId: 'demo',
    type: 'income',
    category: 'Sales',
    amount: 45000,
    description: 'Product sales - Batch #234',
    date: '2025-11-25',
    paymentMethod: 'upi',
    createdAt: '2025-11-25T10:30:00Z'
  },
  {
    id: '2',
    businessId: 'demo',
    type: 'expense',
    category: 'Inventory/Stock',
    amount: 18000,
    description: 'Raw materials purchase',
    date: '2025-11-24',
    paymentMethod: 'bank_transfer',
    createdAt: '2025-11-24T14:20:00Z'
  },
  {
    id: '3',
    businessId: 'demo',
    type: 'income',
    category: 'Services',
    amount: 25000,
    description: 'Consulting fee - ABC Corp',
    date: '2025-11-23',
    paymentMethod: 'bank_transfer',
    createdAt: '2025-11-23T09:15:00Z'
  },
  {
    id: '4',
    businessId: 'demo',
    type: 'expense',
    category: 'Salaries',
    amount: 35000,
    description: 'Staff salaries - November',
    date: '2025-11-22',
    paymentMethod: 'bank_transfer',
    createdAt: '2025-11-22T11:00:00Z'
  },
  {
    id: '5',
    businessId: 'demo',
    type: 'income',
    category: 'Sales',
    amount: 62000,
    description: 'Bulk order - XYZ Ltd',
    date: '2025-11-20',
    paymentMethod: 'cheque',
    createdAt: '2025-11-20T16:45:00Z'
  },
  {
    id: '6',
    businessId: 'demo',
    type: 'expense',
    category: 'Utilities',
    amount: 4500,
    description: 'Electricity bill',
    date: '2025-11-19',
    paymentMethod: 'upi',
    createdAt: '2025-11-19T10:00:00Z'
  },
  {
    id: '7',
    businessId: 'demo',
    type: 'expense',
    category: 'Rent',
    amount: 15000,
    description: 'Shop rent - November',
    date: '2025-11-05',
    paymentMethod: 'bank_transfer',
    createdAt: '2025-11-05T09:00:00Z'
  },
  {
    id: '8',
    businessId: 'demo',
    type: 'income',
    category: 'Sales',
    amount: 38000,
    description: 'Retail sales - Week 1',
    date: '2025-11-07',
    paymentMethod: 'cash',
    createdAt: '2025-11-07T18:30:00Z'
  },
  {
    id: '9',
    businessId: 'demo',
    type: 'expense',
    category: 'Marketing',
    amount: 8000,
    description: 'Facebook ads campaign',
    date: '2025-11-10',
    paymentMethod: 'card',
    createdAt: '2025-11-10T14:00:00Z'
  },
  {
    id: '10',
    businessId: 'demo',
    type: 'income',
    category: 'Commission',
    amount: 12000,
    description: 'Referral commission',
    date: '2025-11-15',
    paymentMethod: 'upi',
    createdAt: '2025-11-15T11:20:00Z'
  }
]

const demoBusiness: Business = {
  id: 'demo',
  name: 'Krishna Enterprises',
  type: 'sole_proprietorship',
  industry: 'Retail',
  registrationDate: '2022-04-15',
  gstNumber: '27AABCU9603R1ZM',
  panNumber: 'AABCU9603R',
  createdAt: '2022-04-15T00:00:00Z'
}

// Credit score calculation functions
function calculateConsistencyScore(incomeTransactions: Transaction[]): number {
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

function getGradeDescription(grade: string): string {
  switch (grade) {
    case 'A': return 'Excellent'
    case 'B': return 'Good'
    case 'C': return 'Fair'
    case 'D': return 'Poor'
    case 'E': return 'Very Poor'
    default: return 'N/A'
  }
}

function calculateCreditScore(transactions: Transaction[], business: Business): CreditScore {
  const incomeTransactions = transactions.filter(t => t.type === 'income')
  const expenseTransactions = transactions.filter(t => t.type === 'expense')
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalIncome - totalExpenses
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0
  
  // Factor 1: Payment Consistency (25%)
  const consistencyScore = calculateConsistencyScore(incomeTransactions)
  
  // Factor 2: Profitability (25%)
  const profitabilityScore = calculateProfitabilityScore(profitMargin)
  
  // Factor 3: Cash Flow Health (25%)
  const cashFlowScore = calculateCashFlowScore(netProfit, totalIncome)
  
  // Factor 4: Business Stability (25%)
  const stabilityScore = calculateStabilityScore(business.registrationDate, transactions.length)
  
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
  const grade = getGrade(finalScore)
  
  return {
    score: Math.min(900, Math.max(0, finalScore)),
    grade,
    factors,
    lastUpdated: new Date().toISOString()
  }
}

export default defineEventHandler(async (event) => {
  const businessId = getRouterParam(event, 'businessId')
  
  if (!businessId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Business ID is required'
    })
  }
  
  // In production, fetch from Firebase using businessId
  // For prototype, use demo data
  const business = demoBusiness
  const transactions = demoTransactions
  
  if (businessId !== 'demo' && businessId !== business.id) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Business not found'
    })
  }
  
  const creditScore = calculateCreditScore(transactions, business)
  
  // API Response for banks and financial services
  return {
    success: true,
    data: {
      businessId: business.id,
      businessName: business.name,
      businessType: business.type,
      industry: business.industry,
      registrationDate: business.registrationDate,
      creditScore: {
        score: creditScore.score,
        maxScore: 900,
        grade: creditScore.grade,
        gradeDescription: getGradeDescription(creditScore.grade),
        factors: creditScore.factors.map(f => ({
          name: f.name,
          score: f.score,
          maxScore: 100,
          weight: f.weight,
          trend: f.trend
        })),
        lastUpdated: creditScore.lastUpdated
      },
      summary: {
        totalTransactions: transactions.length,
        totalIncome: transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        totalExpenses: transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      }
    },
    meta: {
      apiVersion: '1.0',
      generatedAt: new Date().toISOString()
    }
  }
})
