import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/core/auth/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { ProtectedRoute, PublicRoute } from '@/core/auth/ProtectedRoute'

// Pages
import LandingPage from '@/pages/Landing'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import LocationSetupPage from '@/pages/onboarding/LocationSetupPage'
import PreferencesSetupPage from '@/pages/onboarding/PreferencesSetupPage'
import DashboardPage from '@/pages/Dashboard'
import LocalNewsPage from '@/pages/news/LocalNewsPage'
import GlobalNewsPage from '@/pages/news/GlobalNewsPage'
import TwitterFeedPage from '@/pages/social/TwitterFeedPage'
import InstagramFeedPage from '@/pages/social/InstagramFeedPage'
import SavedPage from '@/pages/Saved'
import ProfilePage from '@/pages/Profile'
import SettingsPage from '@/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={
              <PublicRoute><LoginPage /></PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute><SignupPage /></PublicRoute>
            } />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* ── Onboarding (requires auth, not yet onboarded) ── */}
            <Route path="/onboarding/location" element={
              <ProtectedRoute><LocationSetupPage /></ProtectedRoute>
            } />
            <Route path="/onboarding/preferences" element={
              <ProtectedRoute><PreferencesSetupPage /></ProtectedRoute>
            } />

            {/* ── Authenticated app ── */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireOnboarding><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/news/local" element={
              <ProtectedRoute requireOnboarding><LocalNewsPage /></ProtectedRoute>
            } />
            <Route path="/news/global" element={
              <ProtectedRoute requireOnboarding><GlobalNewsPage /></ProtectedRoute>
            } />
            <Route path="/social/x" element={
              <ProtectedRoute requireOnboarding><TwitterFeedPage /></ProtectedRoute>
            } />
            <Route path="/social/instagram" element={
              <ProtectedRoute requireOnboarding><InstagramFeedPage /></ProtectedRoute>
            } />
            <Route path="/saved" element={
              <ProtectedRoute requireOnboarding><SavedPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute requireOnboarding><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requireOnboarding><SettingsPage /></ProtectedRoute>
            } />

            {/* ── Future module placeholders ── */}
            {/* <Route path="/events/*" element={<ProtectedRoute requireOnboarding><EventsModule /></ProtectedRoute>} /> */}
            {/* <Route path="/finance/*" element={<ProtectedRoute requireOnboarding><FinanceModule /></ProtectedRoute>} /> */}
            {/* <Route path="/sports/*" element={<ProtectedRoute requireOnboarding><SportsModule /></ProtectedRoute>} /> */}

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
