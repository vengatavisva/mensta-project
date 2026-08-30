export interface NewsArticle {
  id: string
  title: string
  description: string
  content?: string
  url: string
  imageUrl: string
  source: {
    name: string
    url?: string
  }
  author?: string
  publishedAt: string
  category: string
  tags?: string[]
  location?: {
    city?: string
    state?: string
    country?: string
  }
  // Derived fields
  type?: 'local' | 'global'
  isBookmarked?: boolean
}

export interface NewsFilters {
  category?: string
  query?: string
  location?: {
    city?: string
    state?: string
    country?: string
  }
  page?: number
  pageSize?: number
}

export interface NewsFeedResult {
  articles: NewsArticle[]
  total: number
  hasMore: boolean
}

export const NEWS_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🌐' },
  { id: 'general', label: 'General', emoji: '📰' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'sports', label: 'Sports', emoji: '🏏' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { id: 'health', label: 'Health', emoji: '🏥' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'politics', label: 'Politics', emoji: '🏛️' },
  { id: 'world', label: 'World', emoji: '🌍' },
  { id: 'economy', label: 'Economy', emoji: '📈' },
  { id: 'ai', label: 'AI', emoji: '🤖' },
  { id: 'space', label: 'Space', emoji: '🚀' },
  { id: 'movies', label: 'Movies', emoji: '🎥' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'environment', label: 'Environment', emoji: '🌿' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'finance', label: 'Finance', emoji: '💰' },
  { id: 'startups', label: 'Startups', emoji: '🚀' },
  { id: 'crime', label: 'Crime', emoji: '⚖️' },
  { id: 'automotive', label: 'Automotive', emoji: '🚗' },
]

export const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
]

export const TAMIL_NADU_CITIES = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
  'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi', 'Dindigul', 'Thanjavur',
  'Kanchipuram', 'Kumbakonam', 'Nagapattinam', 'Ramanathapuram', 'Sivakasi',
  'Karaikudi', 'Namakkal', 'Pollachi', 'Hosur', 'Nagercoil', 'Ooty',
]
