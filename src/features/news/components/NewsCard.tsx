import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, ExternalLink, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { NewsArticle } from '../types'
import { Badge } from '@/components/ui/Badge'

interface NewsCardProps {
  article: NewsArticle
  onClick: (article: NewsArticle) => void
  onBookmark?: (article: NewsArticle) => void
  variant?: 'default' | 'featured' | 'compact'
  index?: number
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80&auto=format',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80&auto=format',
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=80&auto=format',
]

function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return 'recently'
  }
}

export function NewsCard({ article, onClick, onBookmark, variant = 'default', index = 0 }: NewsCardProps) {
  const [imgError, setImgError] = useState(false)
  const [bookmarked, setBookmarked] = useState(article.isBookmarked ?? false)

  const imgSrc = imgError || !article.imageUrl
    ? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
    : article.imageUrl

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setBookmarked(b => !b)
    onBookmark?.(article)
  }

  if (variant === 'featured') {
    return (
      <motion.article
        onClick={() => onClick(article)}
        whileHover={{ y: -2 }}
        className="relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group"
        role="button"
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(article)}
      >
        <div className="aspect-[16/9] overflow-hidden bg-surface-100">
          <img
            src={imgSrc}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="brand">{article.category}</Badge>
            {article.type === 'local' && <Badge variant="success" dot>Local</Badge>}
          </div>
          <h2 className="font-display font-bold text-lg text-ink line-clamp-2 group-hover:text-brand-700 transition-colors mb-2 leading-snug">
            {article.title}
          </h2>
          <p className="text-sm text-ink-secondary line-clamp-2 mb-4">{article.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-700">
                {article.source.name[0]}
              </div>
              <span className="text-xs font-semibold text-ink-secondary">{article.source.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-ink-muted">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(article.publishedAt)}
            </div>
          </div>
        </div>
        <button
          onClick={handleBookmark}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
        >
          {bookmarked
            ? <BookmarkCheck className="w-4 h-4 text-brand-600" />
            : <Bookmark className="w-4 h-4 text-ink-secondary" />
          }
        </button>
      </motion.article>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.article
        onClick={() => onClick(article)}
        whileHover={{ x: 2 }}
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 cursor-pointer group transition-colors"
        role="button"
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(article)}
      >
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-100">
          <img
            src={imgSrc}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-brand-600 mb-1 truncate">{article.source.name}</p>
          <h3 className="text-sm font-semibold text-ink line-clamp-2 group-hover:text-brand-700 transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-ink-muted mt-1">{timeAgo(article.publishedAt)}</p>
        </div>
      </motion.article>
    )
  }

  // Default card
  return (
    <motion.article
      onClick={() => onClick(article)}
      whileHover={{ y: -2 }}
      className="bg-white border border-surface-200 hover:border-brand-200 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer group news-card"
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(article)}
    >
      <div className="flex gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">{article.source.name}</span>
            {article.type === 'local' && <Badge variant="success" dot>Local</Badge>}
          </div>
          <h3 className="text-sm font-bold text-ink line-clamp-2 group-hover:text-brand-700 transition-colors leading-snug mb-1.5">
            {article.title}
          </h3>
          <p className="text-xs text-ink-secondary line-clamp-2 mb-3">{article.description}</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-ink-muted">
              <Clock className="w-3 h-3" />
              {timeAgo(article.publishedAt)}
            </div>
            <Badge variant="muted">{article.category}</Badge>
          </div>
        </div>
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-100">
            <img
              src={imgSrc}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <button
            onClick={handleBookmark}
            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-white border border-surface-200 flex items-center justify-center shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            {bookmarked
              ? <BookmarkCheck className="w-3.5 h-3.5 text-brand-600" />
              : <Bookmark className="w-3.5 h-3.5 text-ink-secondary" />
            }
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function NewsGrid({ articles, onArticleClick, onBookmark, loading = false }: {
  articles: NewsArticle[]
  onArticleClick: (a: NewsArticle) => void
  onBookmark?: (a: NewsArticle) => void
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-surface-200 rounded-2xl p-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-4/5 rounded" />
              </div>
              <div className="skeleton w-24 h-24 rounded-xl shrink-0" />
            </div>
            <div className="skeleton h-3 w-24 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {articles.map((article, i) => (
        <motion.div
          key={article.id}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
          }}
        >
          <NewsCard
            article={article}
            onClick={onArticleClick}
            onBookmark={onBookmark}
            index={i}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
