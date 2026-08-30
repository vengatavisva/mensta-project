import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from './config'
import type { UserProfile, UserLocation, SavedArticleRef } from '../user/types'

const usersCol = 'users'
const savedCol = 'savedArticles'

/** Create a new user document after registration */
export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, usersCol, uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    onboardingCompleted: false,
    emailVerified: false,
  })
}

/** Fetch user profile */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, usersCol, uid))
  if (!snap.exists()) return null
  return { uid, ...snap.data() } as UserProfile
}

/** Update partial user profile */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, usersCol, uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/** Save user location + mark onboarding step complete */
export async function saveUserLocation(uid: string, location: UserLocation): Promise<void> {
  await updateDoc(doc(db, usersCol, uid), {
    location,
    updatedAt: serverTimestamp(),
  })
}

/** Save user category preferences */
export async function saveUserPreferences(uid: string, categories: string[], interests: string[]): Promise<void> {
  await updateDoc(doc(db, usersCol, uid), {
    preferredCategories: categories,
    interests,
    onboardingCompleted: true,
    updatedAt: serverTimestamp(),
  })
}

/** Save an article to user's bookmarks */
export async function saveArticle(uid: string, article: SavedArticleRef): Promise<void> {
  const ref = doc(db, usersCol, uid, savedCol, article.id)
  await setDoc(ref, { ...article, savedAt: serverTimestamp() })
}

/** Remove a saved article */
export async function unsaveArticle(uid: string, articleId: string): Promise<void> {
  const ref = doc(db, usersCol, uid, savedCol, articleId)
  await setDoc(ref, { deletedAt: serverTimestamp() }, { merge: true })
}

/** Check if an article is saved */
export async function isArticleSaved(uid: string, articleId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, usersCol, uid, savedCol, articleId))
  return snap.exists() && !snap.data()?.deletedAt
}
