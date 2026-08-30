import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, MapPin, Star, Edit3, Check, X } from 'lucide-react'
import { AppShell } from '@/core/shell/AppShell'
import { useAuth } from '@/core/auth/AuthContext'
import { Avatar } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { NEWS_CATEGORIES } from '@/features/news/types'
import { updateUserProfile, saveUserPreferences } from '@/core/firebase/firestoreHelpers'
import { useToast } from '@/components/ui/Toast'

export default function ProfilePage() {
  const { userProfile, firebaseUser, refreshProfile } = useAuth()
  const { success, error: toastError } = useToast()
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(userProfile?.displayName ?? '')
  const [savingName, setSavingName] = useState(false)
  const [editingInterests, setEditingInterests] = useState(false)
  const [selectedCats, setSelectedCats] = useState<string[]>(userProfile?.preferredCategories ?? [])
  const [savingInterests, setSavingInterests] = useState(false)

  const displayName = userProfile?.displayName ?? firebaseUser?.displayName ?? 'User'
  const email = userProfile?.email ?? firebaseUser?.email ?? ''
  const location = userProfile?.location
  const categories = userProfile?.preferredCategories ?? []

  const handleSaveName = async () => {
    if (!firebaseUser || !newName.trim()) return
    setSavingName(true)
    try {
      await updateUserProfile(firebaseUser.uid, { displayName: newName.trim() })
      await refreshProfile()
      success('Name updated!')
      setEditingName(false)
    } catch {
      toastError('Failed to update name')
    } finally {
      setSavingName(false)
    }
  }

  const toggleCat = (id: string) => {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const handleSaveInterests = async () => {
    if (!firebaseUser) return
    setSavingInterests(true)
    try {
      await saveUserPreferences(firebaseUser.uid, selectedCats, selectedCats)
      await refreshProfile()
      success('Interests updated!')
      setEditingInterests(false)
    } catch {
      toastError('Failed to save interests')
    } finally {
      setSavingInterests(false)
    }
  }

  return (
    <AppShell title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Avatar + name */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-surface-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <Avatar name={displayName} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {editingName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="h-9"
                      autoFocus
                    />
                    <button onClick={handleSaveName} disabled={savingName} className="text-emerald-600 hover:text-emerald-700 p-1">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={() => setEditingName(false)} className="text-ink-muted hover:text-ink p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="font-display font-bold text-xl text-ink">{displayName}</h1>
                    <button onClick={() => { setEditingName(true); setNewName(displayName) }} className="text-ink-muted hover:text-brand-600 transition-colors p-1">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-ink-secondary">
                <Mail className="w-3.5 h-3.5" />
                {email}
              </div>
              {firebaseUser?.emailVerified && (
                <Badge variant="success" className="mt-2">Verified</Badge>
              )}
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-ink-muted">Location</p>
                <p className="text-sm font-medium text-ink">
                  {location ? `${location.city}, ${location.state}, ${location.country}` : 'Not set'}
                </p>
              </div>
              <a href="/settings" className="text-xs font-semibold text-brand-600 hover:text-brand-700">Edit</a>
            </div>
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-surface-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <h2 className="font-display font-bold text-base text-ink">My Interests</h2>
            </div>
            {!editingInterests ? (
              <Button size="sm" variant="ghost" leftIcon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => setEditingInterests(true)}>
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSaveInterests} loading={savingInterests}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditingInterests(false); setSelectedCats(categories) }}>Cancel</Button>
              </div>
            )}
          </div>

          {editingInterests ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NEWS_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                const active = selectedCats.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCat(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                      active ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-surface-200 bg-white text-ink-secondary hover:border-brand-200'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                    {active && <span className="ml-auto text-brand-500 text-xs">✓</span>}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.length > 0 ? categories.map(cat => {
                const c = NEWS_CATEGORIES.find(n => n.id === cat)
                return c ? (
                  <Badge key={cat} variant="brand">{c.emoji} {c.label}</Badge>
                ) : null
              }) : (
                <p className="text-sm text-ink-muted">No interests set. Click Edit to add some.</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  )
}
