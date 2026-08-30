import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { loginUser } from '@/core/firebase/authHelpers'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { error: toastError, success } = useToast()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const user = await loginUser(data.email, data.password)
      if (!user.emailVerified) {
        navigate('/verify-email', { state: { email: data.email } })
        return
      }
      success('Welcome back!', 'Loading your personalized feed…')
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('invalid-credential') || msg.includes('user-not-found') || msg.includes('wrong-password')) {
        toastError('Invalid credentials', 'Check your email and password.')
      } else if (msg.includes('too-many-requests')) {
        toastError('Too many attempts', 'Please wait a few minutes and try again.')
      } else {
        toastError('Sign in failed', 'Something went wrong. Please try again.')
      }
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your MENSTA account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPass ? 'text' : 'password'}
          placeholder="Your password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          autoComplete="current-password"
          rightElement={
            <button type="button" onClick={() => setShowPass(p => !p)} className="text-ink-muted hover:text-ink transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-ink-secondary mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
