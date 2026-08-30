import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../firebase/config'
import { getUserProfile, createUserProfile } from '../firebase/firestoreHelpers'
import type { UserProfile } from '../user/types'

interface AuthContextValue {
  firebaseUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  userProfile: null,
  loading: true,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (user: User) => {
    try {
      let profile = await getUserProfile(user.uid)
      if (!profile) {
        // Auto-create profile on first sign-in
        await createUserProfile(user.uid, {
          displayName: user.displayName ?? user.email?.split('@')[0] ?? 'User',
          email: user.email ?? '',
          emailVerified: user.emailVerified,
          onboardingCompleted: false,
        })
        profile = await getUserProfile(user.uid)
      }
      // Sync email verified status
      if (profile && profile.emailVerified !== user.emailVerified) {
        profile.emailVerified = user.emailVerified
      }
      setUserProfile(profile)
    } catch (err) {
      console.error('Failed to load user profile:', err)
    }
  }

  const refreshProfile = async () => {
    if (firebaseUser) {
      await firebaseUser.reload()
      await loadProfile(firebaseUser)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (user) {
        await loadProfile(user)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ firebaseUser, userProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
