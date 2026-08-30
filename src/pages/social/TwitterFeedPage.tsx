import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/core/shell/AppShell'
import { TweetCard } from '@/features/social/components/TweetCard'
import { fetchTwitterFeed } from '@/features/social/socialService'
import type { SocialPost, FeedType } from '@/features/social/types'
import { Loader2 } from 'lucide-react'

export default function TwitterFeedPage() {
  const [activeTab, setActiveTab] = useState<FeedType>('trending')
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchTwitterFeed(activeTab).then(data => {
      if (mounted) {
        setPosts(data)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [activeTab])

  return (
    <AppShell title="Trending (X)">
      <div className="max-w-2xl mx-auto border-x border-surface-200 min-h-screen bg-white">
        {/* Header Tabs */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-surface-200 flex">
          <button
            onClick={() => setActiveTab('trending')}
            className="flex-1 h-14 relative flex items-center justify-center hover:bg-surface-50 transition-colors"
          >
            <span className={`text-sm font-bold ${activeTab === 'trending' ? 'text-ink' : 'text-ink-muted'}`}>
              For you
            </span>
            {activeTab === 'trending' && (
              <motion.div layoutId="x-tab" className="absolute bottom-0 w-14 h-1 bg-[#1D9BF0] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className="flex-1 h-14 relative flex items-center justify-center hover:bg-surface-50 transition-colors"
          >
            <span className={`text-sm font-bold ${activeTab === 'following' ? 'text-ink' : 'text-ink-muted'}`}>
              Following
            </span>
            {activeTab === 'following' && (
              <motion.div layoutId="x-tab" className="absolute bottom-0 w-16 h-1 bg-[#1D9BF0] rounded-full" />
            )}
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
                className="absolute inset-0 flex items-center justify-center"
              >
                <Loader2 className="w-8 h-8 text-[#1D9BF0] animate-spin" />
              </motion.div>
            ) : (
              <motion.div 
                key={`feed-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {posts.map((post) => (
                  <TweetCard key={post.id} post={post} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  )
}
