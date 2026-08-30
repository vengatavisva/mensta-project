import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Globe, RefreshCw } from 'lucide-react'
import { AppShell } from '@/core/shell/AppShell'
import { useAuth } from '@/core/auth/AuthContext'
import { NewsGrid } from '@/features/news/components/NewsCard'
import { NewsDetailModal } from '@/features/news/components/NewsDetailModal'
import { CategorySelector } from '@/features/news/components/CategorySelector'
import { fetchGlobalNews } from '@/features/news/newsService'
import type { NewsArticle } from '@/features/news/types'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'

export default function GlobalNewsPage() {
  const { userProfile } = useAuth()
  const [searchParams] = useSearchParams()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = searchParams.get('category')
    return cat ? [cat] : ['all']
  })
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  const load = useCallback(async (cats: string[], q: string) => {
    setLoading(true)
    setError(null)
    try {
      const category = cats.includes('all') ? undefined : cats[0]
      const result = await fetchGlobalNews({ category, query: q || undefined })
      setArticles(result.articles)
    } catch {
      setError('Could not load global news. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(selectedCategories, searchQuery) }, [])

  const handleCategoryChange = (cats: string[]) => {
    setSelectedCategories(cats)
    load(cats, searchQuery)
  }

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    load(selectedCategories, q)
  }

  return (
    <AppShell title="Global News" searchQuery={searchQuery} onSearchChange={handleSearch}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-blue-600" />
          <h1 className="font-display font-bold text-xl text-ink">Global News</h1>
          <Badge variant="info">Top stories</Badge>
        </div>
        <p className="text-sm text-ink-secondary">
          Curated stories from trusted sources worldwide across your selected categories.
        </p>
      </div>

      {/* Multi-category selector */}
      <div className="mb-6">
        <CategorySelector
          selected={selectedCategories}
          onChange={handleCategoryChange}
          multiSelect
        />
      </div>

      {/* Results header */}
      {!loading && !error && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-ink-muted">
            <span className="font-semibold text-ink">{articles.length}</span> stories
            {selectedCategories[0] !== 'all' && (
              <span> in <span className="font-semibold text-brand-600">{selectedCategories.join(', ')}</span></span>
            )}
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

      {error ? (
        <ErrorState onRetry={() => load(selectedCategories, searchQuery)} description={error} />
      ) : articles.length === 0 && !loading ? (
        <EmptyState
          title="No stories found"
          description="Try a different category or search term."
          action={{ label: 'Browse all', onClick: () => handleCategoryChange(['all']) }}
        />
      ) : (
        <NewsGrid articles={articles} onArticleClick={setSelectedArticle} loading={loading} />
      )}

      <NewsDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </AppShell>
  )
}
