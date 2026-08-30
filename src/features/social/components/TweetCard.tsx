import { motion } from 'framer-motion'
import { MessageCircle, Repeat2, Heart, BarChart2, Share, BadgeCheck, MoreHorizontal } from 'lucide-react'
import type { SocialPost } from '../types'
import { formatDistanceToNow } from 'date-fns'

interface TweetCardProps {
  post: SocialPost
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function TweetCard({ post }: TweetCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })
    .replace('about ', '')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' ago', '')

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-surface-200 p-4 hover:bg-surface-50 cursor-pointer transition-colors"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <img 
            src={post.author.avatarUrl} 
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 truncate text-sm">
              <span className="font-bold text-ink truncate">{post.author.name}</span>
              {post.author.isVerified && (
                <BadgeCheck className="w-4 h-4 text-[#1D9BF0] shrink-0 fill-current" />
              )}
              <span className="text-ink-muted truncate">{post.author.handle}</span>
              <span className="text-ink-muted">·</span>
              <span className="text-ink-muted whitespace-nowrap">{timeAgo}</span>
            </div>
            <button className="text-ink-muted hover:text-[#1D9BF0] hover:bg-[#1D9BF0]/10 p-1.5 rounded-full transition-colors shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Text */}
          <p className="text-[15px] text-ink leading-normal mb-3 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-surface-200">
              <img 
                src={post.media[0].url} 
                alt="Tweet media" 
                className={`w-full object-cover ${post.media[0].aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement!.style.minHeight = '0'
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between text-ink-muted max-w-md -ml-2">
            <button className="group flex items-center gap-1.5 hover:text-[#1D9BF0] transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">{formatNumber(post.metrics.comments)}</span>
            </button>

            <button className="group flex items-center gap-1.5 hover:text-[#00BA7C] transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#00BA7C]/10 transition-colors">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{formatNumber(post.metrics.reposts || 0)}</span>
            </button>

            <button className="group flex items-center gap-1.5 hover:text-[#F91880] transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#F91880]/10 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs">{formatNumber(post.metrics.likes)}</span>
            </button>

            <button className="group flex items-center gap-1.5 hover:text-[#1D9BF0] transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10 transition-colors">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{formatNumber(post.metrics.views || 0)}</span>
            </button>

            <div className="flex items-center">
              <button className="group p-2 rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="group p-2 rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] transition-colors">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// Ensure Bookmark is imported for the action bar
import { Bookmark } from 'lucide-react'
