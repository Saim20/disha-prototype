// Types for the MSME Bookkeeping App

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface Business {
  id: string
  userId: string // Firebase Auth user ID
  name: string
  type: 'sole_proprietorship' | 'partnership' | 'llp' | 'pvt_ltd'
  industry: string
  registrationDate: string
  gstNumber?: string
  panNumber?: string
  createdAt: string
}

export interface Transaction {
  id: string
  businessId: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
  paymentMethod: 'cash' | 'upi' | 'bank_transfer' | 'card' | 'cheque'
  reference?: string
  createdAt: string
}

export interface CreditScore {
  score: number // 0-900
  grade: 'A' | 'B' | 'C' | 'D' | 'E'
  factors: CreditFactor[]
  lastUpdated: string
}

export interface CreditFactor {
  name: string
  score: number // 0-100
  weight: number // percentage
  description: string
  trend: 'up' | 'down' | 'stable'
}

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  transactionCount: number
  avgTransactionValue: number
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  profit: number
}

// Category definitions
export const incomeCategories = [
  'Sales',
  'Services',
  'Commission',
  'Interest',
  'Rental Income',
  'Other Income'
] as const

export const expenseCategories = [
  'Inventory/Stock',
  'Salaries',
  'Rent',
  'Utilities',
  'Marketing',
  'Transportation',
  'Equipment',
  'Office Supplies',
  'Professional Services',
  'Insurance',
  'Taxes',
  'Loan Payment',
  'Other Expense'
] as const

export const businessTypes = [
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llp', label: 'LLP' },
  { value: 'pvt_ltd', label: 'Private Limited' }
] as const

export const industries = [
  'Retail',
  'Manufacturing',
  'Services',
  'Food & Beverage',
  'Healthcare',
  'Education',
  'Technology',
  'Construction',
  'Agriculture',
  'Transportation',
  'Other'
] as const

export const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card' },
  { value: 'cheque', label: 'Cheque' }
] as const
