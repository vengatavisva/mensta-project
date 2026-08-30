# MENSTA — Personalized Discovery Platform

> **Your world. Your interests. One intelligent feed.**

MENSTA is a modern, scalable, production-quality personal platform built with React + TypeScript + Firebase. It's designed as an extensible platform — not a single-purpose app. News is the first module; future modules (events, finance, sports, travel, etc.) can be added without touching existing code.

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <your-repo-url>
cd mensta-project
npm install

# 2. Configure environment
cp .env.example .env
# Fill in your Firebase credentials (see setup below)

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

---

## 🏗️ Architecture

```
mensta-project/
├── src/
│   ├── core/                     # Platform core (not feature-specific)
│   │   ├── auth/
│   │   │   ├── AuthContext.tsx   # Global auth state + useAuth() hook
│   │   │   └── ProtectedRoute.tsx# Route guards (auth + onboarding)
│   │   ├── firebase/
│   │   │   ├── config.ts         # Firebase app initialization
│   │   │   ├── authHelpers.ts    # register, login, logout, etc.
│   │   │   └── firestoreHelpers.ts # User profile, location, saved articles
│   │   ├── user/
│   │   │   └── types.ts          # UserProfile, UserLocation, SavedArticleRef
│   │   └── shell/
│   │       ├── AppShell.tsx      # Page layout wrapper
│   │       └── Navigation.tsx    # Sidebar, Topbar, MobileNav
│   │
│   ├── components/
│   │   └── ui/                   # Generic reusable design system
│   │       ├── Button.tsx        # Button (primary/secondary/ghost/danger/outline)
│   │       ├── Input.tsx         # Input with label/error/icons
│   │       ├── Modal.tsx         # Generic modal with animations
│   │       ├── Toast.tsx         # Global toast notifications (context)
│   │       ├── Skeleton.tsx      # Loading skeletons
│   │       ├── EmptyState.tsx    # Empty & error states
│   │       └── Badge.tsx         # Badge & Avatar components
│   │
│   ├── features/
│   │   └── news/                 # News feature module (self-contained)
│   │       ├── types.ts          # NewsArticle, categories, location data
│   │       ├── newsService.ts    # Provider abstraction (API → Mock fallback)
│   │       ├── providers/
│   │       │   ├── gnewsProvider.ts  # GNews API integration
│   │       │   └── mockProvider.ts   # Rich mock data (works offline)
│   │       └── components/
│   │           ├── NewsCard.tsx       # Card (default/featured/compact variants)
│   │           ├── NewsDetailModal.tsx # Article detail slide-up modal
│   │           └── CategorySelector.tsx # Multi-select category chips
│   │
│   ├── pages/
│   │   ├── Landing.tsx           # Public landing page
│   │   ├── Dashboard.tsx         # App home / module hub
│   │   ├── Profile.tsx           # User profile management
│   │   ├── Settings.tsx          # Account settings
│   │   ├── Saved.tsx             # Saved/bookmarked items
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── VerifyEmailPage.tsx
│   │   ├── onboarding/
│   │   │   ├── LocationSetupPage.tsx  # Country → State → City
│   │   │   └── PreferencesSetupPage.tsx # Category selection
│   │   └── news/
│   │       ├── LocalNewsPage.tsx   # Location-based news
│   │       └── GlobalNewsPage.tsx  # Multi-category global news
│   │
│   ├── App.tsx                   # Router with all routes
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Design system tokens & global styles
│   └── vite-env.d.ts            # Vite/env type declarations
│
├── public/
│   └── favicon.svg
├── .env.example
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18 + TypeScript** | UI framework with type safety |
| **Vite** | Fast dev server and build tool |
| **React Router v6** | Client-side routing |
| **Tailwind CSS v3** | Utility-first styling |
| **Framer Motion** | Animations and page transitions |
| **Lucide React** | Icon library |
| **Firebase Auth** | Email/password auth + email verification |
| **Cloud Firestore** | User profiles, preferences, saved articles |
| **GNews API** | Real news data (optional) |
| **React Hook Form + Zod** | Form validation |
| **date-fns** | Date formatting |

---

## 🔐 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password provider
4. Enable **Cloud Firestore** → Start in production mode
5. Add a web app → copy the config
6. Paste values into your `.env` file:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Firestore Security Rules (recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /savedArticles/{articleId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## 📰 News API Setup (Optional)

The app works fully **without any API key** using rich mock data.

To get real news:
1. Sign up at [GNews.io](https://gnews.io) (free: 100 req/day)
2. Copy your API key
3. Add to `.env`:

```env
VITE_GNEWS_API_KEY=your_gnews_api_key_here
```

The `newsService.ts` abstraction automatically tries the real API first, then falls back to mock data. To swap to a different provider, create a new file in `src/features/news/providers/` and update `newsService.ts`.

---

## 🌐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firestore project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `VITE_GNEWS_API_KEY` | No | GNews API key (falls back to mock) |

---

## 💻 Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Type-check + production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🗺️ Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/signup` | Public | Create account |
| `/verify-email` | Public | Email verification |
| `/onboarding/location` | Auth | Choose location |
| `/onboarding/preferences` | Auth | Choose interests |
| `/dashboard` | Auth + Onboarded | App home |
| `/news/local` | Auth + Onboarded | Local news feed |
| `/news/global` | Auth + Onboarded | Global news feed |
| `/saved` | Auth + Onboarded | Bookmarked articles |
| `/profile` | Auth + Onboarded | User profile |
| `/settings` | Auth + Onboarded | Account settings |

---

## ➕ Adding a New Feature Module

MENSTA is designed for easy module addition. Here's how to add, for example, a **Finance** module:

### 1. Create the feature directory
```
src/features/finance/
  types.ts          # Feature-specific types
  financeService.ts # Data fetching abstraction
  providers/        # API providers + mock
  components/       # Feature-specific UI
```

### 2. Create pages
```
src/pages/finance/
  FinanceDashboard.tsx
  StockDetail.tsx
  PortfolioPage.tsx
```

### 3. Add routes to App.tsx
```tsx
<Route path="/finance/*" element={
  <ProtectedRoute requireOnboarding>
    <FinanceDashboard />
  </ProtectedRoute>
} />
```

### 4. Add to sidebar navigation
In `src/core/shell/Navigation.tsx`, add to `primaryNav`:
```tsx
{ label: 'Finance', href: '/finance', icon: <TrendingUp /> }
```

### 5. Add Firestore schema (if needed)
Extend `src/core/firebase/firestoreHelpers.ts` with finance-specific read/write functions.

That's it — no changes to auth, AppShell, design system, or any other module needed.

---

## 🚀 Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel --prod
# Set environment variables in Vercel dashboard
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
# Set environment variables in Netlify dashboard
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🗄️ Firestore Data Schema

```
users/
  {uid}/
    displayName: string
    email: string
    emailVerified: boolean
    onboardingCompleted: boolean
    location: {
      city: string
      state: string
      country: string
      countryCode: string
    }
    preferredCategories: string[]
    interests: string[]
    createdAt: Timestamp
    updatedAt: Timestamp

    savedArticles/
      {articleId}/
        id: string
        title: string
        description: string
        imageUrl: string
        source: string
        category: string
        url: string
        publishedAt: string
        savedAt: Timestamp
```

---

## 🔒 Security Notes

- All API keys are in `.env` files (never committed to git)
- Firebase Security Rules enforce user-level data isolation
- Email verification required before accessing the app
- Password validation enforced client-side (Zod) and server-side (Firebase)
- No raw passwords stored anywhere — Firebase handles all auth securely
- `credentials: 'include'` not needed (Firebase uses token-based auth)

---

## 📦 Key Dependencies

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.26.1",
  "firebase": "^10.13.1",
  "framer-motion": "^11.3.19",
  "lucide-react": "^0.438.0",
  "react-hook-form": "^7.53.0",
  "@hookform/resolvers": "^3.9.0",
  "zod": "^3.23.8",
  "tailwindcss": "^3.4.10",
  "date-fns": "^3.6.0"
}
```
