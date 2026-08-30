import { motion } from 'framer-motion'
import { Sidebar, Topbar, MobileNav } from './Navigation'

interface AppShellProps {
  children: React.ReactNode
  title?: string
  searchQuery?: string
  onSearchChange?: (q: string) => void
}

export function AppShell({ children, title, searchQuery, onSearchChange }: AppShellProps) {
  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          title={title}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
