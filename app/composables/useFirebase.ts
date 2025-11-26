import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe
} from 'firebase/firestore'
import { db, collections } from '~/config/firebase'
import type { Business, Transaction } from '~/types'

// Business operations
export const useFirebase = () => {
  
  // Get business by ID
  const getBusiness = async (businessId: string): Promise<Business | null> => {
    try {
      const docRef = doc(db, collections.businesses, businessId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Business
      }
      return null
    } catch (error) {
      console.error('Error getting business:', error)
      return null
    }
  }

  // Create new business
  const createBusiness = async (business: Omit<Business, 'id' | 'createdAt'>): Promise<Business | null> => {
    try {
      const businessData = {
        ...business,
        createdAt: new Date().toISOString()
      }
      
      const docRef = await addDoc(collection(db, collections.businesses), businessData)
      return { id: docRef.id, ...businessData } as Business
    } catch (error) {
      console.error('Error creating business:', error)
      return null
    }
  }

  // Update business
  const updateBusinessInDb = async (businessId: string, data: Partial<Business>): Promise<boolean> => {
    try {
      const docRef = doc(db, collections.businesses, businessId)
      await updateDoc(docRef, data)
      return true
    } catch (error) {
      console.error('Error updating business:', error)
      return false
    }
  }

  // Get all transactions for a business
  const getTransactions = async (businessId: string): Promise<Transaction[]> => {
    try {
      const q = query(
        collection(db, collections.transactions),
        where('businessId', '==', businessId),
        orderBy('date', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[]
    } catch (error) {
      console.error('Error getting transactions:', error)
      return []
    }
  }

  // Add transaction
  const addTransactionToDb = async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction | null> => {
    try {
      const transactionData = {
        ...transaction,
        createdAt: new Date().toISOString()
      }
      
      const docRef = await addDoc(collection(db, collections.transactions), transactionData)
      return { id: docRef.id, ...transactionData } as Transaction
    } catch (error) {
      console.error('Error adding transaction:', error)
      return null
    }
  }

  // Delete transaction
  const deleteTransactionFromDb = async (transactionId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, collections.transactions, transactionId))
      return true
    } catch (error) {
      console.error('Error deleting transaction:', error)
      return false
    }
  }

  // Subscribe to transactions (real-time updates)
  const subscribeToTransactions = (
    businessId: string, 
    callback: (transactions: Transaction[]) => void
  ): Unsubscribe => {
    const q = query(
      collection(db, collections.transactions),
      where('businessId', '==', businessId),
      orderBy('date', 'desc')
    )

    return onSnapshot(q, (querySnapshot) => {
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[]
      callback(transactions)
    })
  }

  return {
    getBusiness,
    createBusiness,
    updateBusinessInDb,
    getTransactions,
    addTransactionToDb,
    deleteTransactionFromDb,
    subscribeToTransactions
  }
}
