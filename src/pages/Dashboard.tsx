import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Globe, ArrowRight, TrendingUp, Newspaper, Star } from 'lucide-react'
import { AppShell } from '@/core/shell/AppShell'
import { useAuth } from '@/core/auth/AuthContext'
import { NewsCard } from '@/features/news/components/NewsCard'
import { NewsDetailModal } from '@/features/news/components/NewsDetailModal'
import { fetchLocalNews, fetchGlobalNews } from '@/features/news/newsService'
import type { NewsArticle } from '@/features/news/types'
import { NEWS_CATEGORIES } from '@/features/news/types'
import { NewsGridSkeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { userProfile, firebaseUser } = useAuth()
  const [localArticles, setLocalArticles] = useState<NewsArticle[]>([])
  const [globalArticles, setGlobalArticles] = useState<NewsArticle[]>([])
  const [loadingLocal, setLoadingLocal] = useState(true)
  const [loadingGlobal, setLoadingGlobal] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  const displayName = userProfile?.displayName ?? firebaseUser?.displayName ?? 'there'
  const location = userProfile?.location
  const firstName = displayName.split(' ')[0]
  const categories = userProfile?.preferredCategories ?? []

  useEffect(() => {
    const loc = location
      ? { city: location.city, state: location.state, country: location.country }
      : undefined

    fetchLocalNews({ location: loc })
      .then(r => setLocalArticles(r.articles.slice(0, 4)))
      .finally(() => setLoadingLocal(false))

    const cat = categories[0] !== 'all' ? categories[0] : undefined
    fetchGlobalNews({ category: cat })
      .then(r => setGlobalArticles(r.articles.slice(0, 4)))
      .finally(() => setLoadingGlobal(false))
  }, [])

  const stats = [
    { label: 'Your location', value: location ? `${location.city}, ${location.state}` : 'Not set', icon: <MapPin className="w-4 h-4" />, href: '/profile', color: 'text-brand-600' },
    { label: 'Interests', value: `${categories.length} topics`, icon: <Star className="w-4 h-4" />, href: '/profile', color: 'text-amber-600' },
    { label: 'Global sources', value: 'Live feed', icon: <Globe className="w-4 h-4" />, href: '/news/global', color: 'text-blue-600' },
  ]

  return (
    <AppShell title="Dashboard">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-1">
          {greeting()}, <span className="text-brand-600">{firstName}</span> 👋
        </h1>
        <p className="text-ink-secondary text-sm">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={s.href} className="block bg-white border border-surface-200 rounded-2xl p-4 hover:shadow-card hover:border-brand-100 transition-all group">
              <div className={`mb-2 ${s.color}`}>{s.icon}</div>
              <p className="font-display font-bold text-sm text-ink truncate">{s.value}</p>
              <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Category quick links */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display font-bold text-base text-ink mb-3">Your interests</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.slice(0, 8).map(cat => {
              const c = NEWS_CATEGORIES.find(n => n.id === cat)
              return (
                <Link
                  key={cat}
                  to={`/news/global?category=${cat}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-surface-200 rounded-xl text-sm font-medium text-ink-secondary hover:border-brand-200 hover:text-brand-700 hover:bg-brand-50 transition-all whitespace-nowrap shrink-0"
                >
                  <span>{c?.emoji}</span>
                  {c?.label ?? cat}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Local news preview */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600" />
            <h2 className="font-display font-bold text-base text-ink">
              {location ? `${location.city} News` : 'Local News'}
            </h2>
            <Badge variant="success" dot>Live</Badge>
          </div>
          <Link to="/news/local" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingLocal ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white border border-surface-200 rounded-2xl p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-16 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                  </div>
                  <div className="skeleton w-24 h-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {localArticles.map((a, i) => (
              <NewsCard key={a.id} article={a} onClick={setSelectedArticle} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Global news preview */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <h2 className="font-display font-bold text-base text-ink">Global Stories</h2>
            <Badge variant="info">Top picks</Badge>
          </div>
          <Link to="/news/global" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingGlobal ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white border border-surface-200 rounded-2xl p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-16 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                  </div>
                  <div className="skeleton w-24 h-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {globalArticles.map((a, i) => (
              <NewsCard key={a.id} article={a} onClick={setSelectedArticle} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Module cards — future features */}
      <section>
        <h2 className="font-display font-bold text-base text-ink mb-4">Coming soon</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Events', emoji: '🎭', desc: 'Local events near you' },
            { label: 'Finance', emoji: '📊', desc: 'Markets & portfolio' },
            { label: 'Sports', emoji: '🏟️', desc: 'Live scores & updates' },
            { label: 'Jobs', emoji: '💼', desc: 'Opportunities in your area' },
          ].map(m => (
            <div key={m.label} className="bg-white border border-surface-200 border-dashed rounded-2xl p-4 text-center opacity-60">
              <div className="text-2xl mb-2">{m.emoji}</div>
              <p className="text-sm font-semibold text-ink">{m.label}</p>
              <p className="text-xs text-ink-muted mt-1">{m.desc}</p>
              <div className="mt-2 text-xs font-medium text-brand-400">Soon</div>
            </div>
          ))}
        </div>
      </section>

      <NewsDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </AppShell>
  )
}
