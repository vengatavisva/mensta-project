import { Bookmark } from 'lucide-react'
import { AppShell } from '@/core/shell/AppShell'
import { SavedEmptyState } from '@/components/ui/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function SavedPage() {
  const navigate = useNavigate()
  // In a full implementation, load from Firestore subcollection
  const savedArticles: never[] = []

  return (
    <AppShell title="Saved">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-5 h-5 text-ink-secondary" />
          <h1 className="font-display font-bold text-xl text-ink">Saved Articles</h1>
        </div>
        <p className="text-sm text-ink-secondary">Articles you've bookmarked to read later.</p>
      </div>

      {savedArticles.length === 0 ? (
        <SavedEmptyState onExplore={() => navigate('/news/global')} />
      ) : null}
    </AppShell>
  )
}
