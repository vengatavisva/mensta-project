import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, RefreshCw, CheckCircle } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/core/auth/AuthContext'
import { resendVerificationEmail } from '@/core/firebase/authHelpers'
import { updateUserProfile } from '@/core/firebase/firestoreHelpers'

const OTP_DISPLAY_NOTE = `We've sent a verification link to your email. Click it to verify your account.`

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { firebaseUser, refreshProfile } = useAuth()
  const { success, error: toastError, info } = useToast()

  const email = (location.state as { email?: string })?.email ?? firebaseUser?.email ?? ''
  const [checking, setChecking] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Poll for email verification
  useEffect(() => {
    if (!firebaseUser) return
    const poll = setInterval(async () => {
      await firebaseUser.reload()
      if (firebaseUser.emailVerified) {
        clearInterval(poll)
        if (firebaseUser.uid) {
          await updateUserProfile(firebaseUser.uid, { emailVerified: true })
        }
        await refreshProfile()
        success('Email verified!', 'Setting up your account…')
        navigate('/onboarding/location')
      }
    }, 3000)
    return () => clearInterval(poll)
  }, [firebaseUser, navigate, refreshProfile, success])

  const handleCheckNow = async () => {
    setChecking(true)
    try {
      await firebaseUser?.reload()
      if (firebaseUser?.emailVerified) {
        if (firebaseUser.uid) {
          await updateUserProfile(firebaseUser.uid, { emailVerified: true })
        }
        await refreshProfile()
        success('Email verified!')
        navigate('/onboarding/location')
      } else {
        info('Not yet verified', 'Check your inbox and click the verification link.')
      }
    } finally {
      setChecking(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerificationEmail()
      success('Email sent!', 'Check your inbox again.')
      setCountdown(60)
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { clearInterval(timerRef.current!); return 0 }
          return c - 1
        })
      }, 1000)
    } catch (err) {
      toastError('Failed to resend', 'Please try again in a moment.')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      title="Check your email"
      subtitle={OTP_DISPLAY_NOTE}
    >
      <div className="space-y-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="w-20 h-20 rounded-2xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center mx-auto"
        >
          <Mail className="w-10 h-10 text-brand-500" />
        </motion.div>

        {email && (
          <div className="px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl">
            <p className="text-xs text-ink-muted mb-1">Verification email sent to</p>
            <p className="text-sm font-bold text-ink truncate">{email}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleCheckNow}
            loading={checking}
            fullWidth
            leftIcon={<CheckCircle className="w-4 h-4" />}
          >
            I've verified my email
          </Button>

          <Button
            onClick={handleResend}
            loading={resending}
            disabled={countdown > 0}
            variant="outline"
            fullWidth
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend verification email'}
          </Button>
        </div>

        <div className="text-xs text-ink-muted leading-relaxed space-y-1">
          <p>Didn't receive it? Check your spam folder.</p>
          <p>The link expires in <strong>24 hours</strong>.</p>
        </div>
      </div>
    </AuthLayout>
  )
}
