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
import { getDb, collections } from '~/config/firebase'
import type { Business, Transaction } from '~/types'

// Business operations
export const useFirebase = () => {
  
  // Get business by ID
  const getBusiness = async (businessId: string): Promise<Business | null> => {
    try {
      const docRef = doc(getDb(), collections.businesses, businessId)
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

  // Get business by user ID
  const getBusinessByUserId = async (userId: string): Promise<Business | null> => {
    try {
      const q = query(
        collection(getDb(), collections.businesses),
        where('userId', '==', userId)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0]!
        return { id: docSnap.id, ...docSnap.data() } as Business
      }
      return null
    } catch (error) {
      console.error('Error getting business by userId:', error)
      return null
    }
  }

  // Create new business
  const createBusiness = async (business: Omit<Business, 'id' | 'createdAt'>): Promise<Business | null> => {
    try {
      // Remove undefined values to prevent Firestore errors
      const cleanBusiness = Object.fromEntries(
        Object.entries(business).filter(([_, value]) => value !== undefined)
      )
      
      const businessData = {
        ...cleanBusiness,
        createdAt: new Date().toISOString()
      }
      
      const docRef = await addDoc(collection(getDb(), collections.businesses), businessData)
      return { id: docRef.id, ...businessData } as Business
    } catch (error) {
      console.error('Error creating business:', error)
      return null
    }
  }

  // Update business
  const updateBusinessInDb = async (businessId: string, data: Partial<Business>): Promise<boolean> => {
    try {
      // Remove undefined values to prevent Firestore errors
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      )
      
      const docRef = doc(getDb(), collections.businesses, businessId)
      await updateDoc(docRef, cleanData)
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
        collection(getDb(), collections.transactions),
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
      // Remove undefined values to prevent Firestore errors
      const cleanTransaction = Object.fromEntries(
        Object.entries(transaction).filter(([_, value]) => value !== undefined)
      )
      
      const transactionData = {
        ...cleanTransaction,
        createdAt: new Date().toISOString()
      }
      
      const docRef = await addDoc(collection(getDb(), collections.transactions), transactionData)
      return { id: docRef.id, ...transactionData } as Transaction
    } catch (error) {
      console.error('Error adding transaction:', error)
      return null
    }
  }

  // Delete transaction
  const deleteTransactionFromDb = async (transactionId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(getDb(), collections.transactions, transactionId))
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
      collection(getDb(), collections.transactions),
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
    getBusinessByUserId,
    createBusiness,
    updateBusinessInDb,
    getTransactions,
    addTransactionToDb,
    deleteTransactionFromDb,
    subscribeToTransactions
  }
}
