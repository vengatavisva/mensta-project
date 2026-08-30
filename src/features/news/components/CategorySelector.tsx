import { motion } from 'framer-motion'
import { NEWS_CATEGORIES } from '../types'

interface CategorySelectorProps {
  selected: string[]
  onChange: (categories: string[]) => void
  multiSelect?: boolean
  showAll?: boolean
}

export function CategorySelector({ selected, onChange, multiSelect = true, showAll = true }: CategorySelectorProps) {
  const categories = showAll ? NEWS_CATEGORIES : NEWS_CATEGORIES.filter(c => c.id !== 'all')

  const toggle = (id: string) => {
    if (!multiSelect) {
      onChange([id])
      return
    }
    if (id === 'all') {
      onChange(['all'])
      return
    }
    const withoutAll = selected.filter(s => s !== 'all')
    if (selected.includes(id)) {
      const next = withoutAll.filter(s => s !== id)
      onChange(next.length ? next : ['all'])
    } else {
      onChange([...withoutAll, id])
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
      {categories.map(cat => {
        const isActive = selected.includes(cat.id) || (cat.id === 'all' && selected.length === 0)
        return (
          <motion.button
            key={cat.id}
            onClick={() => toggle(cat.id)}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 border ${
              isActive
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-white text-ink-secondary border-surface-200 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </motion.button>
        )
      })}
    </div>
  )
}

interface CategoryChipProps {
  category: string
  active?: boolean
  onClick?: () => void
}

export function CategoryChip({ category, active, onClick }: CategoryChipProps) {
  const cat = NEWS_CATEGORIES.find(c => c.id === category)
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
        active
          ? 'bg-brand-600 text-white border-brand-600'
          : 'bg-surface-100 text-ink-secondary border-transparent hover:border-brand-200 hover:text-brand-600'
      }`}
    >
      {cat?.emoji} {cat?.label ?? category}
    </button>
  )
}
