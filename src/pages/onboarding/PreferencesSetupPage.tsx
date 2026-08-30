import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/core/auth/AuthContext'
import { saveUserPreferences } from '@/core/firebase/firestoreHelpers'
import { NEWS_CATEGORIES } from '@/features/news/types'

const MIN_SELECTIONS = 3

export default function PreferencesSetupPage() {
  const navigate = useNavigate()
  const { firebaseUser, refreshProfile } = useAuth()
  const { success, error: toastError } = useToast()
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const categories = NEWS_CATEGORIES.filter(c => c.id !== 'all')

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (!firebaseUser) return
    if (selected.length < MIN_SELECTIONS) {
      toastError('Select more', `Please choose at least ${MIN_SELECTIONS} categories.`)
      return
    }
    setSaving(true)
    try {
      await saveUserPreferences(firebaseUser.uid, selected, selected)
      await refreshProfile()
      success('Preferences saved!', 'Your personalized feed is ready.')
      navigate('/dashboard')
    } catch {
      toastError('Failed to save', 'Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/20 to-surface-50">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center mx-auto mb-4">
          <Star className="w-7 h-7 text-brand-600" />
        </div>
        <h1 className="font-display font-bold text-2xl text-ink mb-2">What interests you?</h1>
        <p className="text-sm text-ink-secondary max-w-sm mx-auto">
          Pick at least {MIN_SELECTIONS} topics to personalize your global news feed.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-100 rounded-full text-sm font-semibold text-brand-700">
          {selected.length} selected {selected.length >= MIN_SELECTIONS && '✓'}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 pb-8 max-w-2xl mx-auto">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
        >
          {categories.map(cat => {
            const isActive = selected.includes(cat.id)
            return (
              <motion.button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                  isActive
                    ? 'border-brand-500 bg-brand-50 shadow-sm'
                    : 'border-surface-200 bg-white hover:border-brand-200 hover:bg-brand-50/30'
                }`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <p className={`text-sm font-semibold ${isActive ? 'text-brand-700' : 'text-ink'}`}>
                    {cat.label}
                  </p>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-brand-500 font-medium"
                    >
                      Selected ✓
                    </motion.span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        <div className="mt-8 space-y-3">
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={selected.length < MIN_SELECTIONS}
            fullWidth
            size="lg"
          >
            {selected.length < MIN_SELECTIONS
              ? `Select ${MIN_SELECTIONS - selected.length} more to continue`
              : 'Launch my feed →'
            }
          </Button>
          <p className="text-center text-xs text-ink-muted">
            You can edit these anytime from your profile settings.
          </p>
        </div>
      </div>
    </div>
  )
}
