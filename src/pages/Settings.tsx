import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Lock, MapPin, Bell, Shield, LogOut, ChevronRight, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/core/shell/AppShell'
import { useAuth } from '@/core/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { changePassword, logoutUser } from '@/core/firebase/authHelpers'
import { saveUserLocation } from '@/core/firebase/firestoreHelpers'
import { INDIA_STATES, TAMIL_NADU_CITIES } from '@/features/news/types'

export default function SettingsPage() {
  const { firebaseUser, userProfile, refreshProfile } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  // Password change
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [changingPass, setChangingPass] = useState(false)

  // Location
  const [newCity, setNewCity] = useState(userProfile?.location?.city ?? '')
  const [newState, setNewState] = useState(userProfile?.location?.state ?? '')
  const [savingLoc, setSavingLoc] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirmPass) { toastError('Passwords do not match'); return }
    if (newPass.length < 8) { toastError('Password too short', 'At least 8 characters required'); return }
    setChangingPass(true)
    try {
      await changePassword(currentPass, newPass)
      success('Password changed!', 'Your password has been updated.')
      setCurrentPass(''); setNewPass(''); setConfirmPass('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        toastError('Wrong password', 'Your current password is incorrect.')
      } else {
        toastError('Failed to change password', 'Please try again.')
      }
    } finally {
      setChangingPass(false)
    }
  }

  const handleSaveLocation = async () => {
    if (!firebaseUser || !newCity) return
    setSavingLoc(true)
    try {
      await saveUserLocation(firebaseUser.uid, {
        city: newCity,
        state: newState,
        country: userProfile?.location?.country ?? 'India',
        countryCode: userProfile?.location?.countryCode ?? 'IN',
      })
      await refreshProfile()
      success('Location updated!')
    } catch {
      toastError('Failed to update location')
    } finally {
      setSavingLoc(false)
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  const sections = [
    {
      id: 'location',
      icon: <MapPin className="w-5 h-5" />,
      title: 'Location',
      desc: 'Update your news location for local stories',
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={newCity}
              onChange={e => setNewCity(e.target.value)}
              placeholder="e.g. Dindigul"
            />
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">State</label>
              <select
                value={newState}
                onChange={e => setNewState(e.target.value)}
                className="w-full h-11 px-4 bg-white border border-surface-200 rounded-xl text-sm text-ink focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="">Select state</option>
                {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <Button onClick={handleSaveLocation} loading={savingLoc} size="sm" disabled={!newCity}>
            Save location
          </Button>
        </div>
      ),
    },
    {
      id: 'password',
      icon: <Lock className="w-5 h-5" />,
      title: 'Change Password',
      desc: 'Update your account password',
      content: (
        <form onSubmit={handleChangePassword} className="space-y-3">
          <Input label="Current password" type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} />
          <Input label="New password" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
          <Input label="Confirm new password" type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
          <Button type="submit" loading={changingPass} size="sm">Update password</Button>
        </form>
      ),
    },
    {
      id: 'notifications',
      icon: <Bell className="w-5 h-5" />,
      title: 'Notifications',
      desc: 'Control how you receive alerts',
      content: (
        <div className="space-y-3">
          {['Breaking news alerts', 'Daily digest', 'Trending stories'].map(item => (
            <div key={item} className="flex items-center justify-between py-2">
              <span className="text-sm text-ink">{item}</span>
              <div className="w-10 h-6 bg-brand-100 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-brand-600 rounded-full" />
              </div>
            </div>
          ))}
          <p className="text-xs text-ink-muted">Full notification settings coming soon.</p>
        </div>
      ),
    },
  ]

  const [openSection, setOpenSection] = useState<string | null>('location')

  return (
    <AppShell title="Settings">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-ink-secondary" />
            <h1 className="font-display font-bold text-xl text-ink">Settings</h1>
          </div>
          <p className="text-sm text-ink-secondary">Manage your account and preferences.</p>
        </div>

        {sections.map(section => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-surface-200 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center gap-4 p-5 hover:bg-surface-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                {section.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-ink">{section.title}</p>
                <p className="text-xs text-ink-muted">{section.desc}</p>
              </div>
              <ChevronRight className={`w-5 h-5 text-ink-muted transition-transform ${openSection === section.id ? 'rotate-90' : ''}`} />
            </button>
            {openSection === section.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 border-t border-surface-100"
              >
                <div className="pt-4">{section.content}</div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Danger zone */}
        <div className="bg-white border border-surface-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="font-semibold text-sm text-ink">Account Actions</h2>
          </div>
          <Button
            variant="outline"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={handleLogout}
            className="text-brand-600 border-brand-200 hover:bg-brand-50"
          >
            Sign out of all devices
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
