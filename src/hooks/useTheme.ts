import { useCallback, useEffect, useRef, useState } from 'react'
import { APP_THEME_COLORS, THEME_STORAGE_KEY } from '../config/app'

export type ThemePreference = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

function getStoredPreference(): ThemePreference {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system'
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.dataset.theme = resolved
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', APP_THEME_COLORS[resolved])
}

/** Habilita a transição de cores só durante a troca — nunca no load. */
function applyThemeWithTransition(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.add('theme-transition')
  applyTheme(resolved)
  window.setTimeout(() => root.classList.remove('theme-transition'), 200)
}

/**
 * Preferência de tema com suporte a 'system' (segue prefers-color-scheme
 * em tempo real). O primeiro paint já vem correto via script inline no
 * index.html; este hook assume a partir da hidratação.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(getStoredPreference)
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    preference === 'system' ? systemTheme() : preference,
  )
  const isFirstApply = useRef(true)

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, preference)
    setResolved(preference === 'system' ? systemTheme() : preference)
  }, [preference])

  useEffect(() => {
    if (isFirstApply.current) {
      // Load inicial: data-theme já veio do script inline; reaplica sem transição
      isFirstApply.current = false
      applyTheme(resolved)
      return
    }
    applyThemeWithTransition(resolved)
  }, [resolved])

  // Preferência 'system': reage à mudança do SO em tempo real
  useEffect(() => {
    if (preference !== 'system') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setResolved(systemTheme())
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [preference])

  const cycle = useCallback(() => {
    setPreference((current) =>
      current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark',
    )
  }, [])

  return { preference, resolved, cycle }
}
