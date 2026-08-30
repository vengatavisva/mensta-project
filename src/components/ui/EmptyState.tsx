import { motion } from 'framer-motion'
import { Newspaper, Bookmark, Search, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-5 text-brand-400">
        {icon ?? <Newspaper className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
      {description && <p className="text-sm text-ink-secondary max-w-xs leading-relaxed">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-5" size="sm">
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  offline?: boolean
}

export function ErrorState({ title, description, onRetry, offline }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-5 text-brand-500">
        {offline ? <WifiOff className="w-8 h-8" /> : <RefreshCw className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">{title ?? 'Something went wrong'}</h3>
      <p className="text-sm text-ink-secondary max-w-xs leading-relaxed">
        {description ?? 'We couldn\'t load the content. Please try again.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-5" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
          Try again
        </Button>
      )}
    </motion.div>
  )
}

export function SavedEmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <EmptyState
      icon={<Bookmark className="w-8 h-8" />}
      title="No saved articles yet"
      description="Bookmark articles you want to read later. They'll appear here."
      action={{ label: 'Explore news', onClick: onExplore }}
    />
  )
}

export function SearchEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8" />}
      title={`No results for "${query}"`}
      description="Try different keywords or browse by category."
    />
  )
}
