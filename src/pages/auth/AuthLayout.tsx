import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-surface-50 flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-extrabold text-xl text-ink">MENSTA</span>
        </Link>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-2">{title}</h1>
            {subtitle && <p className="text-sm text-ink-secondary leading-relaxed">{subtitle}</p>}
          </div>

          <div className="auth-card p-8">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
