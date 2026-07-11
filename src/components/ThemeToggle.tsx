import { useTheme } from '../hooks/useTheme'
import type { ThemePreference } from '../hooks/useTheme'

const labels: Record<ThemePreference, string> = {
  dark: 'Tema escuro',
  light: 'Tema claro',
  system: 'Tema do sistema',
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Cicla dark → light → system. Discreto, canto superior direito. */
export function ThemeToggle() {
  const { preference, cycle } = useTheme()

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${labels[preference]} — alternar tema`}
      title={labels[preference]}
      className="fixed top-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      {preference === 'dark' ? <MoonIcon /> : preference === 'light' ? <SunIcon /> : <SystemIcon />}
    </button>
  )
}
