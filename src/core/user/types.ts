export interface UserLocation {
  city: string
  state: string
  country: string
  countryCode: string
}

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  location?: UserLocation
  preferredCategories?: string[]
  interests?: string[]
  onboardingCompleted: boolean
  emailVerified: boolean
  createdAt?: unknown
  updatedAt?: unknown
}

export interface SavedArticleRef {
  id: string
  title: string
  description: string
  imageUrl: string
  source: string
  category: string
  url: string
  publishedAt: string
  savedAt?: unknown
}
