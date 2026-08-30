import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react'
import type { SocialPost } from '../types'
import { formatDistanceToNow } from 'date-fns'

interface InstagramPostCardProps {
  post: SocialPost
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function InstagramPostCard({ post }: InstagramPostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)

  const timeAgo = formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })
    .replace('about ', '')

  const handleDoubleTap = () => {
    if (!isLiked) setIsLiked(true)
    setShowHeartAnimation(true)
    setTimeout(() => setShowHeartAnimation(false), 1000)
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-surface-200 pb-4 mb-4 lg:border lg:rounded-xl lg:mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-[-2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full" />
            <img 
              src={post.author.avatarUrl} 
              alt={post.author.name}
              className="relative w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-ink text-sm">{post.author.handle.replace('@', '')}</span>
            <span className="text-xs text-ink-muted">{post.author.name}</span>
          </div>
        </div>
        <button className="text-ink-muted hover:text-ink transition-colors p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media with Double Tap */}
      <div 
        className={`relative bg-surface-100 ${post.media?.[0]?.aspectRatio === 'square' ? 'aspect-square' : 'aspect-[4/5]'} w-full overflow-hidden`}
        onDoubleClick={handleDoubleTap}
      >
        {post.media && (
          <img 
            src={post.media[0].url} 
            alt="Post content" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.parentElement!.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
            }}
          />
        )}
        
        {/* Like Animation Overlay */}
        <AnimatePresence>
          {showHeartAnimation && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-2xl"
            >
              <Heart className="w-24 h-24 text-white fill-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-colors ${isLiked ? 'text-red-500' : 'text-ink hover:text-ink-secondary'}`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="text-ink hover:text-ink-secondary transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-ink hover:text-ink-secondary transition-colors">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="text-ink hover:text-ink-secondary transition-colors">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes */}
        <div className="font-bold text-ink text-sm mb-1.5">
          {formatNumber(post.metrics.likes + (isLiked ? 1 : 0))} likes
        </div>

        {/* Caption */}
        <div className="text-sm text-ink mb-1.5">
          <span className="font-bold mr-2">{post.author.handle.replace('@', '')}</span>
          <span>{post.content}</span>
        </div>

        {/* Comments count */}
        {post.metrics.comments > 0 && (
          <button className="text-sm text-ink-muted mb-1 hover:text-ink transition-colors">
            View all {formatNumber(post.metrics.comments)} comments
          </button>
        )}

        {/* Timestamp */}
        <div className="text-[10px] text-ink-muted uppercase tracking-wide">
          {timeAgo}
        </div>
      </div>
    </motion.article>
  )
}
