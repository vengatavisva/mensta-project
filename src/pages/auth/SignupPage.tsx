import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { registerUser } from '@/core/firebase/authHelpers'
import { createUserProfile } from '@/core/firebase/firestoreHelpers'

const schema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Include an uppercase letter')
    .regex(/[0-9]/, 'Include a number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special char', met: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.met).length
  const colors = ['', 'bg-brand-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= score ? colors[score] : 'bg-surface-200'} transition-all`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {checks.map(c => (
            <span key={c.label} className={`text-xs ${c.met ? 'text-emerald-600 font-medium' : 'text-ink-muted'}`}>
              {c.met ? '✓' : '○'} {c.label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-bold ${score >= 4 ? 'text-emerald-600' : score >= 3 ? 'text-yellow-600' : 'text-brand-600'}`}>
          {labels[score]}
        </span>
      </div>
    </div>
  )
}

export default function SignupPage() {
  const navigate = useNavigate()
  const { error: toastError, success } = useToast()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const password = watch('password', '')

  const onSubmit = async (data: FormData) => {
    try {
      const user = await registerUser(data.email, data.password)
      await createUserProfile(user.uid, {
        displayName: data.displayName,
        email: data.email,
        emailVerified: false,
        onboardingCompleted: false,
      })
      success('Account created!', 'Check your email for a verification link.')
      navigate('/verify-email', { state: { email: data.email } })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('email-already-in-use')) {
        toastError('Email in use', 'An account with this email already exists.')
      } else {
        toastError('Sign up failed', 'Something went wrong. Please try again.')
      }
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join MENSTA and start your personalized discovery journey"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Your name"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.displayName?.message}
          autoComplete="name"
          {...register('displayName')}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Create a strong password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            autoComplete="new-password"
            rightElement={
              <button type="button" onClick={() => setShowPass(p => !p)} className="text-ink-muted hover:text-ink transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            {...register('password')}
          />
          <PasswordStrength password={password} />
        </div>

        <Input
          label="Confirm password"
          type={showPass ? 'text' : 'password'}
          placeholder="Repeat your password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="mt-2">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-ink-secondary mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-ink-muted mt-4 leading-relaxed">
        By creating an account you agree to our{' '}
        <span className="text-brand-600">Terms of Service</span>{' '}
        and{' '}
        <span className="text-brand-600">Privacy Policy</span>.
      </p>
    </AuthLayout>
  )
}
