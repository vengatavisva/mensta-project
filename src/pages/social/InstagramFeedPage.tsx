import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/core/shell/AppShell'
import { InstagramPostCard } from '@/features/social/components/InstagramPostCard'
import { fetchInstagramFeed } from '@/features/social/socialService'
import type { SocialPost, FeedType } from '@/features/social/types'
import { Loader2 } from 'lucide-react'

export default function InstagramFeedPage() {
  const [activeTab, setActiveTab] = useState<FeedType>('trending')
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchInstagramFeed(activeTab).then(data => {
      if (mounted) {
        setPosts(data)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [activeTab])

  return (
    <AppShell title="Instagram">
      <div className="max-w-[470px] mx-auto min-h-screen pt-4 pb-20 lg:pb-8">
        {/* Header Tabs (Stories-style switcher for IG) */}
        <div className="flex gap-2 mb-6 px-4 lg:px-0">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'trending' 
                ? 'bg-ink text-white shadow-md' 
                : 'bg-surface-100 text-ink-secondary hover:bg-surface-200'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'following' 
                ? 'bg-ink text-white shadow-md' 
                : 'bg-surface-100 text-ink-secondary hover:bg-surface-200'
            }`}
          >
            Following
          </button>
        </div>

        {/* Feed */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pt-20"
              >
                <Loader2 className="w-8 h-8 text-ink-muted animate-spin" />
              </motion.div>
            ) : (
              <motion.div 
                key={`feed-${activeTab}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {posts.map((post) => (
                  <InstagramPostCard key={post.id} post={post} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  )
}
