import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/** Bottom-sheet mobile-first com backdrop; fecha por Esc, backdrop ou botão. */
export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fade-in absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sheet-in relative max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-6 pb-8 sm:rounded-2xl sm:border"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-lg text-text-secondary transition hover:bg-surface-elevated hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
