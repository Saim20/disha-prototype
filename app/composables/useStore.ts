import type { Business, Transaction, DashboardStats, MonthlyData } from '~/types'

export const useStore = () => {
  const { userId } = useAuth()
  const { 
    getBusiness, 
    getBusinessByUserId,
    createBusiness, 
    updateBusinessInDb, 
    getTransactions, 
    addTransactionToDb, 
    deleteTransactionFromDb,
    subscribeToTransactions 
  } = useFirebase()

  const transactions = useState<Transaction[]>('transactions', () => [])
  const business = useState<Business | null>('business', () => null)
  const isLoading = useState('isLoading', () => false)
  const isInitialized = useState('isInitialized', () => false)
  const unsubscribe = useState<(() => void) | null>('unsubscribe', () => null)

  // Initialize app - load business and transactions for current user
  const initializeApp = async () => {
    if (isInitialized.value) return
    if (!userId.value) {
      isLoading.value = false
      return
    }
    
    isLoading.value = true
    
    // Find business by user ID
    const loadedBusiness = await getBusinessByUserId(userId.value)
    
    if (loadedBusiness) {
      business.value = loadedBusiness
      
      // Load transactions
      const loadedTransactions = await getTransactions(loadedBusiness.id)
      transactions.value = loadedTransactions
      
      // Subscribe to real-time updates
      if (unsubscribe.value) {
        unsubscribe.value()
      }
      unsubscribe.value = subscribeToTransactions(loadedBusiness.id, (newTransactions) => {
        transactions.value = newTransactions
      })
    }
    
    isLoading.value = false
    isInitialized.value = true
  }

  // Create new business (onboarding)
  const setupBusiness = async (businessData: Omit<Business, 'id' | 'createdAt' | 'userId'>) => {
    if (!userId.value) {
      console.error('No authenticated user')
      return null
    }
    
    isLoading.value = true
    
    const newBusiness = await createBusiness({
      ...businessData,
      userId: userId.value
    })
    
    if (newBusiness) {
      business.value = newBusiness
      transactions.value = []
      
      // Subscribe to real-time updates
      if (unsubscribe.value) {
        unsubscribe.value()
      }
      unsubscribe.value = subscribeToTransactions(newBusiness.id, (newTransactions) => {
        transactions.value = newTransactions
      })
    }
    
    isLoading.value = false
    return newBusiness
  }

  // Add transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'businessId' | 'createdAt'>) => {
    if (!business.value) return null
    
    const newTransaction = await addTransactionToDb({
      ...transaction,
      businessId: business.value.id
    })
    
    return newTransaction
  }

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    const success = await deleteTransactionFromDb(id)
    if (success) {
      transactions.value = transactions.value.filter(t => t.id !== id)
    }
    return success
  }

  // Update business profile
  const updateBusiness = async (data: Partial<Business>) => {
    if (!business.value) return false
    
    const success = await updateBusinessInDb(business.value.id, data)
    
    if (success) {
      business.value = { ...business.value, ...data }
    }
    
    return success
  }

  // Reset app (logout/clear data)
  const resetApp = () => {
    if (unsubscribe.value) {
      unsubscribe.value()
    }
    business.value = null
    transactions.value = []
    isInitialized.value = false
  }

  // Check if business is set up
  const hasBusinessSetup = computed(() => business.value !== null)

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

  return {
    transactions,
    business,
    isLoading,
    isInitialized,
    hasBusinessSetup,
    initializeApp,
    setupBusiness,
    addTransaction,
    deleteTransaction,
    updateBusiness,
    resetApp,
    getDashboardStats,
    getMonthlyData,
    recentTransactions
  }
}
