import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User,
} from 'firebase/auth'
import { auth } from './config'

/** Create account + send verification email */
export async function registerUser(email: string, password: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await sendEmailVerification(cred.user)
  return cred.user
}

/** Sign in with email/password */
export async function loginUser(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

/** Sign out current user */
export async function logoutUser(): Promise<void> {
  await signOut(auth)
}

/** Resend email verification */
export async function resendVerificationEmail(): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error('No user signed in')
  await sendEmailVerification(user)
}

/** Change password (requires recent login) */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('No user signed in')
  const cred = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, cred)
  await updatePassword(user, newPassword)
}

export { auth }
