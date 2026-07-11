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
      className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-bold transition active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:outline-none ${
        selected
          ? 'border-yellow-400 bg-yellow-400 text-slate-900'
          : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
      }`}
    >
      {children}
    </button>
  )
}
