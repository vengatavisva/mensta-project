import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, RefreshCw } from 'lucide-react'
import { AppShell } from '@/core/shell/AppShell'
import { useAuth } from '@/core/auth/AuthContext'
import { NewsGrid } from '@/features/news/components/NewsCard'
import { NewsDetailModal } from '@/features/news/components/NewsDetailModal'
import { fetchLocalNews } from '@/features/news/newsService'
import type { NewsArticle } from '@/features/news/types'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'

export default function LocalNewsPage() {
  const { userProfile } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all'])
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  const location = userProfile?.location
  const locationLabel = location
    ? `${location.city}${location.state ? `, ${location.state}` : ''}`
    : 'Your area'

  const load = useCallback(async (cat: string[], q: string) => {
    setLoading(true)
    setError(null)
    try {
      const category = cat.includes('all') ? undefined : cat[0]
      const loc = location ? { city: location.city, state: location.state, country: location.country } : undefined
      const result = await fetchLocalNews({ category, query: q || undefined, location: loc })
      setArticles(result.articles)
    } catch (err) {
      setError('Could not load local news. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [location])

  useEffect(() => { load(selectedCategories, searchQuery) }, [])

  const handleCategoryChange = (cats: string[]) => {
    setSelectedCategories(cats)
    load(cats, searchQuery)
  }

  return (
    <AppShell
      title="Local News"
      searchQuery={searchQuery}
      onSearchChange={q => { setSearchQuery(q); load(selectedCategories, q) }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-brand-600" />
          <h1 className="font-display font-bold text-xl text-ink">Local News</h1>
          <Badge variant="success" dot>Live</Badge>
        </div>
        <p className="text-sm text-ink-secondary">
          Stories from <span className="font-semibold text-ink">{locationLabel}</span> — updated every hour
        </p>
      </div>


      {/* Results summary */}
      {!loading && !error && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-ink-muted">
            <span className="font-semibold text-ink">{articles.length}</span> stories
          </p>
          <button
            onClick={() => load(selectedCategories, searchQuery)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      )}

      {/* Content */}
      {error ? (
        <ErrorState onRetry={() => load(selectedCategories, searchQuery)} description={error} />
      ) : articles.length === 0 && !loading ? (
        <EmptyState
          title="No stories found"
          description={`No local news found for ${locationLabel}. Try a different category or update your location.`}
          action={{ label: 'Update location', onClick: () => window.location.href = '/profile' }}
        />
      ) : (
        <NewsGrid
          articles={articles}
          onArticleClick={setSelectedArticle}
          loading={loading}
        />
      )}

      <NewsDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </AppShell>
  )
}
