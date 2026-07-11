import type { ReactNode } from 'react'

interface ChipProps {
  selected: boolean
  onClick: () => void
  children: ReactNode
}

export function Chip({ selected, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
        selected
          ? 'border-primary bg-primary text-on-primary'
          : 'border-border bg-surface text-text-secondary hover:border-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  )
}
