import type { CreditScore, CreditFactor, Transaction, Business } from '~/types'
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'

// Firebase config (same as client)
const firebaseConfig = {
  apiKey: "AIzaSyDWSHzR_bzRnxKuptpk4zSLTOE9HYbzdvM",
  authDomain: "disha-84d17.firebaseapp.com",
  projectId: "disha-84d17",
  storageBucket: "disha-84d17.firebasestorage.app",
  messagingSenderId: "288529284328",
  appId: "1:288529284328:web:169e63781408d7a880dd5d"
}

// Initialize Firebase for server
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]!
}
const db = getFirestore(app)

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
  
  try {
    // Fetch business from Firebase
    const businessDoc = await getDoc(doc(db, 'businesses', businessId))
    
    if (!businessDoc.exists()) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Business not found'
      })
    }
    
    const business = { id: businessDoc.id, ...businessDoc.data() } as Business
    
    // Fetch transactions from Firebase
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('businessId', '==', businessId)
    )
    const transactionsSnapshot = await getDocs(transactionsQuery)
    const transactions: Transaction[] = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[]
    
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
          totalIncome: transactions.filter((t: Transaction) => t.type === 'income').reduce((s: number, t: Transaction) => s + t.amount, 0),
          totalExpenses: transactions.filter((t: Transaction) => t.type === 'expense').reduce((s: number, t: Transaction) => s + t.amount, 0)
        }
      },
      meta: {
        apiVersion: '1.0',
        generatedAt: new Date().toISOString()
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch credit score'
    })
  }
})
