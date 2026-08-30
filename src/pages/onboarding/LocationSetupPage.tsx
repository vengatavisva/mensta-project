import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/core/auth/AuthContext'
import { saveUserLocation } from '@/core/firebase/firestoreHelpers'
import { INDIA_STATES, TAMIL_NADU_CITIES } from '@/features/news/types'

// Simplified location data
const COUNTRIES = [
  { code: 'IN', name: 'India', states: INDIA_STATES },
  { code: 'US', name: 'United States', states: [] },
  { code: 'GB', name: 'United Kingdom', states: [] },
  { code: 'AU', name: 'Australia', states: [] },
  { code: 'CA', name: 'Canada', states: [] },
  { code: 'SG', name: 'Singapore', states: [] },
  { code: 'AE', name: 'UAE', states: [] },
]

const STATE_CITIES: Record<string, string[]> = {
  'Tamil Nadu': TAMIL_NADU_CITIES,
  'Maharashtra': ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Thane', 'Solapur'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi', 'Davangere'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
}

export default function LocationSetupPage() {
  const navigate = useNavigate()
  const { firebaseUser, refreshProfile } = useAuth()
  const { success, error: toastError } = useToast()

  const [step, setStep] = useState<'country' | 'state' | 'city'>('country')
  const [country, setCountry] = useState<{ code: string; name: string; states: string[] } | null>(null)
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const selectedCountry = COUNTRIES.find(c => c.code === country?.code)
  const states = selectedCountry?.states ?? []
  const cities = (state && STATE_CITIES[state]) ? STATE_CITIES[state] : []

  const filteredItems = (items: string[]) =>
    search ? items.filter(i => i.toLowerCase().includes(search.toLowerCase())) : items

  const handleSave = async () => {
    if (!firebaseUser || !country) return
    setSaving(true)
    try {
      await saveUserLocation(firebaseUser.uid, {
        city: city || state || country.name,
        state,
        country: country.name,
        countryCode: country.code,
      })
      await refreshProfile()
      success('Location saved!', 'Setting up your preferences…')
      navigate('/onboarding/preferences')
    } catch {
      toastError('Failed to save', 'Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const stepLabels = ['Country', 'State', 'City']
  const currentStepIdx = step === 'country' ? 0 : step === 'state' ? 1 : 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/20 to-surface-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-7 h-7 text-brand-600" />
        </div>
        <h1 className="font-display font-bold text-2xl text-ink mb-2">Where are you based?</h1>
        <p className="text-sm text-ink-secondary max-w-sm mx-auto">
          We'll show you the most relevant local news from your area.
        </p>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                i === currentStepIdx ? 'bg-brand-600 text-white' :
                i < currentStepIdx ? 'bg-emerald-100 text-emerald-700' :
                'bg-surface-100 text-ink-muted'
              }`}>
                {i < currentStepIdx ? '✓' : i + 1} {label}
              </div>
              {i < stepLabels.length - 1 && <ChevronRight className="w-3 h-3 text-ink-muted" />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-md">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${step}…`}
                className="w-full h-11 pl-10 pr-4 bg-white border border-surface-200 rounded-xl text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Selection card */}
            <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-card max-h-80 overflow-y-auto">
              {step === 'country' && filteredItems(COUNTRIES.map(c => c.name)).map(name => {
                const c = COUNTRIES.find(x => x.name === name)!
                return (
                  <button
                    key={c.code}
                    onClick={() => { setCountry(c); setSearch(''); setStep(c.states.length ? 'state' : 'city') }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-brand-50 hover:text-brand-700 text-left transition-colors border-b border-surface-50 last:border-0 text-sm font-medium text-ink"
                  >
                    <span className="text-xl">{c.code === 'IN' ? '🇮🇳' : c.code === 'US' ? '🇺🇸' : c.code === 'GB' ? '🇬🇧' : c.code === 'AU' ? '🇦🇺' : c.code === 'CA' ? '🇨🇦' : c.code === 'SG' ? '🇸🇬' : '🌏'}</span>
                    {c.name}
                  </button>
                )
              })}

              {step === 'state' && filteredItems(states).map(s => (
                <button
                  key={s}
                  onClick={() => { setState(s); setSearch(''); setStep('city') }}
                  className="w-full flex items-center px-4 py-3.5 hover:bg-brand-50 hover:text-brand-700 text-left transition-colors border-b border-surface-50 last:border-0 text-sm font-medium text-ink"
                >
                  {s}
                </button>
              ))}

              {step === 'city' && (
                <>
                  {filteredItems(cities).map(c => (
                    <button
                      key={c}
                      onClick={() => setCity(c)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-brand-50 hover:text-brand-700 text-left transition-colors border-b border-surface-50 last:border-0 text-sm font-medium ${city === c ? 'text-brand-700 bg-brand-50' : 'text-ink'}`}
                    >
                      {c}
                      {city === c && <span className="text-brand-600 text-xs font-bold">✓</span>}
                    </button>
                  ))}
                  {cities.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-ink-muted">
                      <p>Type your city name below</p>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Enter your city…"
                        className="mt-3 w-full h-10 px-3 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Selection summary */}
            {(country || state || city) && (
              <div className="mt-4 flex items-center gap-2 text-sm text-ink-secondary flex-wrap">
                {country && <span className="font-medium text-ink">{country.name}</span>}
                {state && <><ChevronRight className="w-3.5 h-3.5 shrink-0" /><span className="font-medium text-ink">{state}</span></>}
                {city && <><ChevronRight className="w-3.5 h-3.5 shrink-0" /><span className="font-semibold text-brand-700">{city}</span></>}
              </div>
            )}

            {/* Back button */}
            {step !== 'country' && (
              <button
                onClick={() => {
                  if (step === 'city') { setCity(''); setStep('state') }
                  else { setState(''); setCountry(null); setStep('country') }
                  setSearch('')
                }}
                className="mt-3 text-sm text-ink-secondary hover:text-ink font-medium transition-colors"
              >
                ← Back
              </button>
            )}
          </motion.div>

          {/* Save button */}
          {country && (
            <div className="mt-6 pb-8">
              <Button
                onClick={handleSave}
                loading={saving}
                fullWidth
                size="lg"
                disabled={!country}
              >
                {city ? `Set location to ${city}` : state ? `Set location to ${state}` : `Set location to ${country.name}`}
              </Button>
              <p className="text-center text-xs text-ink-muted mt-3">
                You can change this anytime from your profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
