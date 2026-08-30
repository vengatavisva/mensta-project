import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Newspaper, Globe, Bookmark, User, Settings,
  LogOut, MapPin, Bell, ChevronDown, Menu, X, Zap,
  Twitter, Instagram
} from 'lucide-react'
import { useAuth } from '@/core/auth/AuthContext'
import { logoutUser } from '@/core/firebase/authHelpers'
import { Avatar } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

const primaryNav: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
  { label: 'Local News', href: '/news/local', icon: <MapPin className="w-5 h-5" /> },
  { label: 'Global News', href: '/news/global', icon: <Globe className="w-5 h-5" /> },
  { label: 'Saved', href: '/saved', icon: <Bookmark className="w-5 h-5" /> },
]

const socialNav: NavItem[] = [
  { label: 'Trending (X)', href: '/social/x', icon: <Twitter className="w-5 h-5" /> },
  { label: 'Instagram', href: '/social/instagram', icon: <Instagram className="w-5 h-5" /> },
]

const secondaryNav: NavItem[] = [
  { label: 'Profile', href: '/profile', icon: <User className="w-5 h-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
]

function NavLink({ item, collapsed = false }: { item: NavItem; collapsed?: boolean }) {
  const location = useLocation()
  const isActive = location.pathname === item.href ||
    (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

  return (
    <Link
      to={item.href}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
        isActive
          ? 'bg-brand-50 text-brand-700'
          : 'text-ink-secondary hover:bg-surface-100 hover:text-ink'
      }`}
    >

      <span className={`shrink-0 transition-colors ${isActive ? 'text-brand-600' : 'text-ink-muted group-hover:text-ink-secondary'}`}>
        {item.icon}
      </span>
      {!collapsed && <span className="truncate">{item.label}</span>}
      {item.badge && !collapsed && (
        <span className="ml-auto min-w-5 h-5 flex items-center justify-center bg-brand-600 text-white text-xs font-bold rounded-full px-1.5">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const { firebaseUser, userProfile } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutUser()
      success('Signed out', 'See you next time!')
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  const displayName = userProfile?.displayName ?? firebaseUser?.displayName ?? 'User'
  const email = userProfile?.email ?? firebaseUser?.email ?? ''

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 bg-white border-r border-surface-200 h-screen sticky top-0 py-6 px-3 justify-between overflow-y-auto scrollbar-none">
      {/* Logo */}
      <div>
        <Link to="/dashboard" className="flex items-center gap-2 px-3 mb-8 group">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg text-ink tracking-tight">MENSTA</span>
            <p className="text-[10px] text-ink-muted -mt-0.5 font-medium">Personalized Discovery</p>
          </div>
        </Link>

        {/* Primary Nav */}
        <nav className="space-y-1">
          {primaryNav.map(item => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="my-4 border-t border-surface-100" />

        {/* Social Nav */}
        <div className="px-3 mb-2">
          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Social</p>
        </div>
        <nav className="space-y-1 mb-4">
          {socialNav.map(item => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="my-4 border-t border-surface-100" />

        {/* Secondary Nav */}
        <nav className="space-y-1">
          {secondaryNav.map(item => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* User card */}
      <div className="mt-4 p-3 rounded-2xl bg-surface-50 border border-surface-200">
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar name={displayName} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
            <p className="text-xs text-ink-muted truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-ink-secondary hover:text-brand-600 hover:bg-brand-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const location = useLocation()
  const mobileItems = [
    { label: 'Home', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'Local', href: '/news/local', icon: <MapPin className="w-5 h-5" /> },
    { label: 'Global', href: '/news/global', icon: <Globe className="w-5 h-5" /> },
    { label: 'X', href: '/social/x', icon: <Twitter className="w-5 h-5" /> },
    { label: 'Insta', href: '/social/instagram', icon: <Instagram className="w-5 h-5" /> },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-surface-200 shadow-nav pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileItems.map(item => {
          const isActive = location.pathname === item.href ||
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                isActive ? 'text-brand-600' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

interface TopbarProps {
  searchQuery?: string
  onSearchChange?: (q: string) => void
  title?: string
}

export function Topbar({ searchQuery = '', onSearchChange, title }: TopbarProps) {
  const { firebaseUser, userProfile } = useAuth()
  const navigate = useNavigate()
  const { success } = useToast()
  const [profileOpen, setProfileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const displayName = userProfile?.displayName ?? firebaseUser?.displayName ?? 'User'
  const location = userProfile?.location

  const handleLogout = async () => {
    setLoggingOut(true)
    setProfileOpen(false)
    try {
      await logoutUser()
      success('Signed out', 'See you next time!')
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-surface-200 px-4 sm:px-6 h-16 flex items-center gap-4">
      {/* Mobile logo */}
      <Link to="/dashboard" className="lg:hidden flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-display font-extrabold text-base text-ink">MENSTA</span>
      </Link>

      {title && (
        <h1 className="hidden lg:block text-lg font-bold text-ink">{title}</h1>
      )}

      {/* Search */}
      {onSearchChange && (
        <div className="flex-1 max-w-md relative">
          <input
            type="search"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search stories, topics…"
            className="w-full h-9 pl-9 pr-4 bg-surface-100 border border-transparent rounded-xl text-sm text-ink placeholder-ink-muted focus:outline-none focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2 shrink-0">
        {/* Location pill */}
        {location && (
          <Link
            to="/profile"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-100 hover:bg-brand-50 rounded-full text-xs font-medium text-ink-secondary hover:text-brand-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-500" />
            {location.city}, {location.state}
          </Link>
        )}

        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-100 text-ink-secondary hover:text-ink transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full border-2 border-white" />
        </button>

        {/* Avatar / profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(p => !p)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface-100 transition-colors"
          >
            <Avatar name={displayName} size="sm" />
            <ChevronDown className={`w-4 h-4 text-ink-muted hidden sm:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white border border-surface-200 rounded-2xl shadow-card-hover z-20 overflow-hidden"
                >
                  <div className="p-4 border-b border-surface-100">
                    <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
                    <p className="text-xs text-ink-muted truncate">{userProfile?.email ?? ''}</p>
                  </div>
                  <div className="p-2">
                    {[
                      { label: 'Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
                      { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
                    ].map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-ink-secondary hover:bg-surface-100 hover:text-ink transition-colors"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-brand-600 hover:bg-brand-50 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
