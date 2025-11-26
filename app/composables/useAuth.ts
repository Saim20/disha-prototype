import { 
  getAuth, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { getApp } from '~/config/firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth_user', () => null)
  const isAuthLoading = useState('auth_loading', () => true)
  const isAuthInitialized = useState('auth_initialized', () => false)

  // Get Firebase Auth instance
  const getAuthInstance = () => {
    return getAuth(getApp())
  }

  // Initialize auth state listener
  const initAuth = () => {
    if (isAuthInitialized.value) return

    const auth = getAuthInstance()
    
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        user.value = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        }
      } else {
        user.value = null
      }
      isAuthLoading.value = false
      isAuthInitialized.value = true
    })
  }

  // Sign in with Google
  const signInWithGoogle = async (): Promise<AuthUser | null> => {
    try {
      const auth = getAuthInstance()
      const provider = new GoogleAuthProvider()
      
      // Add scopes if needed
      provider.addScope('email')
      provider.addScope('profile')
      
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user
      
      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      }
      
      return user.value
    } catch (error: any) {
      console.error('Google sign-in error:', error)
      
      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled')
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked. Please allow pop-ups and try again.')
      } else {
        throw new Error('Failed to sign in with Google')
      }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const auth = getAuthInstance()
      await firebaseSignOut(auth)
      user.value = null
    } catch (error) {
      console.error('Sign out error:', error)
      throw new Error('Failed to sign out')
    }
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => user.value !== null)

  // Get current user ID
  const userId = computed(() => user.value?.uid || null)

  return {
    user,
    isAuthLoading,
    isAuthInitialized,
    isAuthenticated,
    userId,
    initAuth,
    signInWithGoogle,
    signOut
  }
}
