/**
 * newsService.ts — Provider Abstraction Layer
 *
 * The UI only imports from here. Swap providers by changing these functions.
 * Priority: Real API (if key exists) → Mock data
 */

import type { NewsFilters, NewsFeedResult } from './types'
import { getLocalNewsMock, getGlobalNewsMock } from './providers/mockProvider'
import { getLocalNewsNewsAPI, getGlobalNewsNewsAPI } from './providers/newsapiProvider'

const hasNewsKey = Boolean(import.meta.env.VITE_NEWS_API_KEY)

export async function fetchLocalNews(filters: NewsFilters = {}): Promise<NewsFeedResult> {
  if (hasNewsKey) {
    try {
      return await getLocalNewsNewsAPI(filters)
    } catch (err) {
      console.warn('[NewsService] NewsAPI failed, falling back to mock:', err)
    }
  }
  return getLocalNewsMock(filters)
}

export async function fetchGlobalNews(filters: NewsFilters = {}): Promise<NewsFeedResult> {
  if (hasNewsKey) {
    try {
      return await getGlobalNewsNewsAPI(filters)
    } catch (err) {
      console.warn('[NewsService] NewsAPI failed, falling back to mock:', err)
    }
  }
  return getGlobalNewsMock(filters)
}
