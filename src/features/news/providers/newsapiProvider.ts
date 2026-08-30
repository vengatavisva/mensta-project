import type { NewsArticle, NewsFilters, NewsFeedResult } from '../types'

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY
const NEWS_API_BASE = 'https://newsapi.org/v2'

function normalizeNewsApiArticle(raw: Record<string, unknown>, category: string): NewsArticle {
  const source = raw.source as Record<string, unknown> | undefined
  const url = (raw.url as string) ?? '#'
  return {
    id: `newsapi-${Math.random().toString(36).slice(2)}`, // NewsAPI doesn't provide an ID, so we generate a random one
    title: (raw.title as string) ?? 'No Title',
    description: (raw.description as string) ?? '',
    content: raw.content as string | undefined,
    url: url,
    imageUrl: (raw.urlToImage as string) ?? '',
    source: {
      name: (source?.name as string) ?? 'Unknown Source',
      url: undefined, // NewsAPI doesn't provide source URL directly in the article object
    },
    publishedAt: (raw.publishedAt as string) ?? new Date().toISOString(),
    category,
    type: 'global',
  }
}

export async function getGlobalNewsNewsAPI(filters: NewsFilters = {}): Promise<NewsFeedResult> {
  if (!NEWS_API_KEY) throw new Error('NewsAPI key not configured')

  const params = new URLSearchParams({
    apiKey: NEWS_API_KEY,
    language: 'en',
    pageSize: '20',
  })

  // For global news, top-headlines is best.
  // We can default to 'us' or just no country to get global English news,
  // but if category is provided, top-headlines is ideal.
  let endpoint = `${NEWS_API_BASE}/top-headlines`
  
  if (filters.query) {
    // If there is a specific search query, /everything is usually better in NewsAPI
    endpoint = `${NEWS_API_BASE}/everything`
    params.set('q', filters.query)
    params.set('sortBy', 'publishedAt')
  } else {
    // Top headlines requires either a country, category, or q.
    // If we only have 'all' category, we fetch general top headlines for US/Global.
    if (filters.category && filters.category !== 'all') {
      params.set('category', filters.category)
    }
    // Using 'us' as default global English baseline if no specific country is set.
    // If you want purely global, removing country is fine but requires q or category.
    params.set('country', 'us') 
  }

  const res = await fetch(`${endpoint}?${params}`)
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`)

  const data = await res.json() as { status: string; articles: Record<string, unknown>[]; totalResults?: number }
  if (data.status !== 'ok') throw new Error('NewsAPI returned error status')

  const category = filters.category ?? 'general'
  const articles = (data.articles ?? [])
    // Filter out removed/empty articles that NewsAPI sometimes returns
    .filter(a => a.title && a.title !== '[Removed]')
    .map(a => normalizeNewsApiArticle(a, category))

  return { articles, total: data.totalResults ?? articles.length, hasMore: false }
}

export async function getLocalNewsNewsAPI(filters: NewsFilters = {}): Promise<NewsFeedResult> {
  if (!NEWS_API_KEY) throw new Error('NewsAPI key not configured')

  const loc = filters.location
  // Build a strong local search query
  const locationParts = [loc?.city, loc?.state, loc?.country].filter(Boolean)
  const locationQuery = locationParts.join(' ')
  
  // NewsAPI /everything requires a non-empty 'q' parameter.
  const baseQuery = locationQuery || 'India' // Fallback to a default string if no location is set
  const query = filters.query ? `${baseQuery} ${filters.query}` : baseQuery

  const params = new URLSearchParams({
    apiKey: NEWS_API_KEY,
    q: query,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '20',
  })

  // Use /everything for local news, as /top-headlines is too broad for cities
  const res = await fetch(`${NEWS_API_BASE}/everything?${params}`)
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`)

  const data = await res.json() as { status: string; articles: Record<string, unknown>[]; totalResults?: number }
  if (data.status !== 'ok') throw new Error('NewsAPI returned error status')

  const category = filters.category ?? 'general'
  const articles = (data.articles ?? [])
    .filter(a => a.title && a.title !== '[Removed]')
    .map(a => ({
      ...normalizeNewsApiArticle(a, category),
      type: 'local' as const,
    }))

  return { articles, total: data.totalResults ?? articles.length, hasMore: false }
}
