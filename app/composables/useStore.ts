import type { Business, Transaction, DashboardStats, MonthlyData } from '~/types'

// Demo data for the prototype
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

export const useStore = () => {
  const transactions = useState<Transaction[]>('transactions', () => [...demoTransactions])
  const business = useState<Business | null>('business', () => demoBusiness)
  const isLoading = useState('isLoading', () => false)

  // Add transaction
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'businessId' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      businessId: business.value?.id || 'demo',
      createdAt: new Date().toISOString()
    }
    transactions.value = [newTransaction, ...transactions.value]
    return newTransaction
  }

  // Delete transaction
  const deleteTransaction = (id: string) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  // Get dashboard stats
  const getDashboardStats = computed((): DashboardStats => {
    const income = transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const netProfit = income - expenses
    const profitMargin = income > 0 ? (netProfit / income) * 100 : 0
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netProfit,
      profitMargin,
      transactionCount: transactions.value.length,
      avgTransactionValue: transactions.value.length > 0 
        ? (income + expenses) / transactions.value.length 
        : 0
    }
  })

  // Get monthly data for charts
  const getMonthlyData = computed((): MonthlyData[] => {
    const months: { [key: string]: MonthlyData } = {}
    
    transactions.value.forEach(t => {
      const monthKey = t.date.substring(0, 7) // YYYY-MM
      if (!months[monthKey]) {
        months[monthKey] = { month: monthKey, income: 0, expenses: 0, profit: 0 }
      }
      if (t.type === 'income') {
        months[monthKey].income += t.amount
      } else {
        months[monthKey].expenses += t.amount
      }
      months[monthKey].profit = months[monthKey].income - months[monthKey].expenses
    })
    
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month))
  })

  // Get recent transactions
  const recentTransactions = computed(() => {
    return [...transactions.value]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  })

  // Update business profile
  const updateBusiness = (data: Partial<Business>) => {
    if (business.value) {
      business.value = { ...business.value, ...data }
    }
  }

  return {
    transactions,
    business,
    isLoading,
    addTransaction,
    deleteTransaction,
    getDashboardStats,
    getMonthlyData,
    recentTransactions,
    updateBusiness
  }
}
