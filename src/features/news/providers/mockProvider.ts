import type { NewsArticle, NewsFilters, NewsFeedResult } from '../types'
import { MOCK_LOCAL_NEWS, MOCK_GLOBAL_NEWS } from './mockData'

function filterArticles(articles: NewsArticle[], filters: NewsFilters): NewsArticle[] {
  let result = [...articles]

  if (filters.category && filters.category !== 'all') {
    result = result.filter(a => a.category === filters.category)
  }

  if (filters.query) {
    const q = filters.query.toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.source.name.toLowerCase().includes(q)
    )
  }

  return result
}

export async function getLocalNewsMock(filters: NewsFilters = {}): Promise<NewsFeedResult> {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 600))
  const articles = filterArticles(MOCK_LOCAL_NEWS, filters)
  return { articles: articles.slice(0, 20), total: articles.length, hasMore: false }
}

export async function getGlobalNewsMock(filters: NewsFilters = {}): Promise<NewsFeedResult> {
  await new Promise(r => setTimeout(r, 600))
  const articles = filterArticles(MOCK_GLOBAL_NEWS, filters)
  return { articles: articles.slice(0, 20), total: articles.length, hasMore: false }
}
