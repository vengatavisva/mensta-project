export type SocialPlatform = 'twitter' | 'instagram'

export interface SocialUser {
  id: string
  handle: string
  name: string
  avatarUrl: string
  isVerified?: boolean
}

export interface SocialPost {
  id: string
  platform: SocialPlatform
  author: SocialUser
  content: string
  media?: {
    type: 'image' | 'video'
    url: string
    aspectRatio?: 'square' | 'portrait' | 'landscape'
  }[]
  metrics: {
    likes: number
    comments: number
    reposts?: number
    views?: number
  }
  postedAt: string
}

export type FeedType = 'trending' | 'following'
