import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/core/shell/AppShell'
import { InstagramPostCard } from '@/features/social/components/InstagramPostCard'
import { fetchInstagramFeed } from '@/features/social/socialService'
import type { SocialPost, FeedType } from '@/features/social/types'
import { Loader2, Instagram, Grid3X3, Film, AlertCircle, UserCircle2, LogOut } from 'lucide-react'

const SERVER_URL = 'http://localhost:3001'
const IG_TOKEN_KEY = 'mensta_ig_token'
const IG_USER_KEY = 'mensta_ig_user'

interface IGProfile {
  id: string
  name: string
  username: string
  profile_picture_url?: string
  followers_count?: number
  media_count?: number
}

interface IGMedia {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url?: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
  like_count?: number
  comments_count?: number
}

export default function InstagramFeedPage() {
  const [activeTab, setActiveTab] = useState<FeedType>('trending')
  const [mockPosts, setMockPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)

  const [igToken, setIgToken] = useState<string | null>(() => {
    return localStorage.getItem(IG_TOKEN_KEY)
  })
  const [igProfile, setIgProfile] = useState<IGProfile | null>(null)
  const [igMedia, setIgMedia] = useState<IGMedia[]>([])
  const [igLoading, setIgLoading] = useState(false)
  const [igError, setIgError] = useState<string | null>(null)
  const [selectedReel, setSelectedReel] = useState<IGMedia | null>(null)

  // Handle token from OAuth callback (stored in URL hash)
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('ig_token=')) {
      const params = new URLSearchParams(hash.slice(1))
      const token = params.get('ig_token')
      const userId = params.get('ig_user')
      if (token) {
        localStorage.setItem(IG_TOKEN_KEY, token)
        if (userId) localStorage.setItem(IG_USER_KEY, userId)
        setIgToken(token)
        // Clean up the URL
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
    // Handle OAuth errors
    const urlParams = new URLSearchParams(window.location.search)
    const igError = urlParams.get('ig_error')
    if (igError) {
      setIgError(decodeURIComponent(igError))
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Fetch real Instagram profile + media when token is available
  const fetchRealData = useCallback(async (token: string) => {
    setIgLoading(true)
    setIgError(null)
    try {
      const userId = localStorage.getItem(IG_USER_KEY) || ''
      // When token is 'dev', server uses its own IG_DEV_TOKEN — don't pass token in URL
      const tokenParam = token === 'dev' ? '' : `&token=${token}`
      const userParam  = userId ? `&user_id=${userId}` : ''

      const [profileRes, mediaRes] = await Promise.all([
        fetch(`${SERVER_URL}/api/instagram/profile?_=1${tokenParam}`),
        fetch(`${SERVER_URL}/api/instagram/media?_=1${tokenParam}${userParam}`),
      ])
      const profile = await profileRes.json()
      const media = await mediaRes.json()
      if (profile.error) throw new Error(profile.error)
      if (media.error) throw new Error(media.error)
      setIgProfile(profile)
      setIgMedia(media.data || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load Instagram data'
      setIgError(msg)
      // Token might be expired — clear it
      if (msg.includes('token') || msg.includes('Session')) {
        handleDisconnect()
      }
    } finally {
      setIgLoading(false)
    }
  }, [])

  useEffect(() => {
    if (igToken) {
      fetchRealData(igToken)
    }
  }, [igToken, fetchRealData])

  // Load mock data for non-connected users
  useEffect(() => {
    if (!igToken) {
      setLoading(true)
      fetchInstagramFeed(activeTab).then(data => {
        setMockPosts(data)
        setLoading(false)
      })
    }
  }, [activeTab, igToken])

  const handleConnectInstagram = () => {
    // Since we are using the dev token fallback on the server, we don't need the OAuth popup
    localStorage.setItem(IG_TOKEN_KEY, 'dev')
    setIgToken('dev')
  }

  const handleDisconnect = () => {
    localStorage.removeItem(IG_TOKEN_KEY)
    localStorage.removeItem(IG_USER_KEY)
    setIgToken(null)
    setIgProfile(null)
    setIgMedia([])
  }

  const formatCount = (n: number | undefined) => {
    if (!n) return '0'
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return String(n)
  }

  // ── Connected State — Real Instagram Feed ─────────────────────────────────
  if (igToken) {
    return (
      <AppShell title="Instagram">
        <div className="max-w-[470px] mx-auto min-h-screen pb-20 lg:pb-8">

          {/* Profile Header */}
          {igProfile && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-2xl border border-surface-200 shadow-sm">
              {igProfile.profile_picture_url ? (
                <img
                  src={igProfile.profile_picture_url}
                  alt={igProfile.name}
                  className="w-14 h-14 rounded-full border-2 border-pink-200 object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center">
                  <UserCircle2 className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink text-base truncate">{igProfile.name}</p>
                <p className="text-sm text-ink-muted">@{igProfile.username}</p>
                <div className="flex gap-4 mt-1 text-xs text-ink-secondary">
                  <span><b>{formatCount(igProfile.media_count)}</b> posts</span>
                  <span><b>{formatCount(igProfile.followers_count)}</b> followers</span>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-red-50 text-ink-secondary hover:text-red-600 text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          )}

          {/* Error State */}
          {igError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-6 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Connection Error</p>
                <p className="text-xs mt-0.5">{igError}</p>
              </div>
            </div>
          )}

          {/* Loading */}
          {igLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
            </div>
          )}

          {/* Real Media Grid */}
          {!igLoading && igMedia.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-4 px-1">
                <Grid3X3 className="w-4 h-4 text-ink-muted" />
                <span className="text-sm font-semibold text-ink">Your Posts & Reels</span>
                <span className="text-xs text-ink-muted ml-auto">{igMedia.length} items</span>
              </div>

              <div className="grid grid-cols-3 gap-0.5 mb-6">
                {igMedia.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedReel(item)}
                    className="relative aspect-square bg-surface-100 group overflow-hidden"
                  >
                    {item.media_type === 'VIDEO' ? (
                      <>
                        <img
                          src={item.thumbnail_url || ''}
                          alt={item.caption || 'Reel'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1.5 right-1.5">
                          <Film className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.media_url || ''}
                        alt={item.caption || 'Post'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-sm font-semibold">
                      <span>❤️ {formatCount(item.like_count)}</span>
                      <span>💬 {formatCount(item.comments_count)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {!igLoading && !igError && igMedia.length === 0 && (
            <div className="text-center py-16 text-ink-muted">
              <Instagram className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No posts found</p>
              <p className="text-sm mt-1">Your Instagram posts will appear here.</p>
            </div>
          )}

          {/* Reel/Post Detail Modal */}
          <AnimatePresence>
            {selectedReel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setSelectedReel(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative max-w-sm w-full max-h-[90vh] bg-black rounded-2xl overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  {selectedReel.media_type === 'VIDEO' ? (
                    <video
                      src={selectedReel.media_url}
                      controls
                      autoPlay
                      loop
                      className="w-full max-h-[70vh] object-contain"
                    />
                  ) : (
                    <img
                      src={selectedReel.media_url}
                      alt={selectedReel.caption || 'Post'}
                      className="w-full max-h-[70vh] object-contain"
                    />
                  )}
                  <div className="p-4 bg-white">
                    <div className="flex items-center gap-3 mb-2 text-sm text-ink-secondary">
                      <span>❤️ {formatCount(selectedReel.like_count)}</span>
                      <span>💬 {formatCount(selectedReel.comments_count)}</span>
                    </div>
                    {selectedReel.caption && (
                      <p className="text-sm text-ink line-clamp-3">{selectedReel.caption}</p>
                    )}
                    <a
                      href={selectedReel.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-xs text-blue-600 hover:underline"
                    >
                      View on Instagram →
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedReel(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center text-lg leading-none"
                  >
                    ×
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppShell>
    )
  }

  // ── Not Connected — Show Connect Screen + Mock Feed ───────────────────────
  return (
    <AppShell title="Instagram">
      <div className="max-w-[470px] mx-auto min-h-screen pb-20 lg:pb-8">

        {/* Connect Banner — only shown when user has explicitly disconnected */}
        {igToken == null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl mb-6 p-6 text-white"
            style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Instagram className="w-8 h-8" />
                <div>
                  <h2 className="font-bold text-lg">Connect Your Instagram</h2>
                  <p className="text-white/80 text-sm">See your real posts & reels inside MENSTA</p>
                </div>
              </div>
              <button
                onClick={handleConnectInstagram}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg"
              >
                <Instagram className="w-4 h-4" />
                Connect Instagram
              </button>
              {igError && (
                <p className="mt-3 text-white/90 text-xs bg-white/20 rounded-lg px-3 py-2">
                  ⚠️ {igError}
                </p>
              )}
            </div>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-white/10" />
          </motion.div>
        )}

        {/* Mock Feed Tabs */}
        <div className="flex gap-2 mb-6">
          {(['trending', 'following'] as FeedType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-ink text-white shadow-md'
                  : 'bg-surface-100 text-ink-secondary hover:bg-surface-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <p className="text-xs text-ink-muted text-center mb-4 opacity-70">
          ✦ Sample content — connect your Instagram to see real posts
        </p>

        {/* Mock Feed */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center pt-20"
            >
              <Loader2 className="w-8 h-8 text-ink-muted animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key={`feed-${activeTab}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              {mockPosts.map(post => (
                <InstagramPostCard key={post.id} post={post} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  )
}
