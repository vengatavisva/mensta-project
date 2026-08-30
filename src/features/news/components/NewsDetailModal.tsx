import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Clock, BookmarkCheck, Bookmark, Share2 } from 'lucide-react'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import type { NewsArticle } from '../types'
import { Badge } from '@/components/ui/Badge'

interface NewsDetailModalProps {
  article: NewsArticle | null
  onClose: () => void
  onBookmark?: (article: NewsArticle) => void
}

const FALLBACK = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80&auto=format'

export function NewsDetailModal({ article, onClose, onBookmark }: NewsDetailModalProps) {
  const [imgError, setImgError] = useState(false)
  const [bookmarked, setBookmarked] = useState(article?.isBookmarked ?? false)
  const [shared, setShared] = useState(false)

  const handleBookmark = () => {
    if (!article) return
    setBookmarked(b => !b)
    onBookmark?.(article)
  }

  const handleShare = async () => {
    if (!article) return
    try {
      await navigator.share({ title: article.title, url: article.url })
    } catch {
      await navigator.clipboard.writeText(article.url)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <AnimatePresence>
      {article && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-modal max-h-[92vh] overflow-hidden flex flex-col"
          >
            {/* Hero image */}
            <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-surface-100">
              <img
                src={imgError ? FALLBACK : article.imageUrl || FALLBACK}
                alt={article.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Actions on image */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleBookmark}
                  className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                >
                  {bookmarked
                    ? <BookmarkCheck className="w-4 h-4 text-brand-600" />
                    : <Bookmark className="w-4 h-4 text-ink-secondary" />
                  }
                </button>
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                >
                  {shared
                    ? <span className="text-xs font-bold text-emerald-600">✓</span>
                    : <Share2 className="w-4 h-4 text-ink-secondary" />
                  }
                </button>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                >
                  <X className="w-4 h-4 text-ink" />
                </button>
              </div>

              {/* Category badge on image */}
              <div className="absolute bottom-4 left-4">
                <Badge variant="brand">{article.category}</Badge>
                {article.type === 'local' && <Badge variant="success" dot className="ml-2">Local</Badge>}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Source + time */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 shrink-0">
                    {article.source.name[0]}
                  </div>
                  <span className="text-sm font-semibold text-ink">{article.source.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-ink-muted ml-auto shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </div>
              </div>

              {/* Title */}
              <h2 className="font-display font-bold text-xl sm:text-2xl text-ink leading-snug mb-4 text-balance">
                {article.title}
              </h2>

              {/* Description / Summary */}
              <p className="text-base text-ink-secondary leading-relaxed mb-6">
                {article.description}
              </p>

              {/* Content preview */}
              {article.content && article.content !== article.description && (
                <p className="text-sm text-ink-secondary leading-relaxed mb-6 border-l-2 border-brand-200 pl-4">
                  {article.content.split('[+')[0]}
                </p>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="muted">#{tag}</Badge>
                  ))}
                </div>
              )}

              {/* Read full article */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 gradient-brand text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                onClick={e => article.url === '#' && e.preventDefault()}
              >
                <ExternalLink className="w-4 h-4" />
                Read full article
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
