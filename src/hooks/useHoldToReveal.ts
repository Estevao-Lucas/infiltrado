import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useDrag } from '@use-gesture/react'

interface UseHoldToRevealOptions {
  /** Atraso antes de revelar — evita revelar num toque acidental. */
  revealDelayMs?: number
  /** Tempo revelado necessário para contar como um hold completo. */
  minHoldMs?: number
}

/**
 * Hold-to-reveal em cima do @use-gesture/react.
 * A palavra NUNCA fica visível sem o dedo pressionado: fim ou cancelamento
 * do gesto (ligação, notificação, dedo escorregando) esconde imediatamente.
 *
 * iOS: pointer events sofrem pointercancel espúrio no WebKit (micro-scroll,
 * gestos do sistema). A lib usa touch events no touch (`pointer.touch`) com
 * listeners não-passivos + preventDefault — a combinação que segura o hold.
 */
export function useHoldToReveal({
  revealDelayMs = 300,
  minHoldMs = 600,
}: UseHoldToRevealOptions = {}) {
  const [revealed, setRevealed] = useState(false)
  const [held, setHeld] = useState(false)
  const revealTimer = useRef<number | null>(null)
  const completeTimer = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current)
    if (completeTimer.current !== null) window.clearTimeout(completeTimer.current)
    revealTimer.current = null
    completeTimer.current = null
  }, [])

  const release = useCallback(() => {
    clearTimers()
    setRevealed(false)
  }, [clearTimers])

  // Componente desmontado no meio de um hold: não deixar timers vivos
  useEffect(() => release, [release])

  const start = useCallback(() => {
    clearTimers()
    revealTimer.current = window.setTimeout(() => {
      setRevealed(true)
      completeTimer.current = window.setTimeout(() => setHeld(true), minHoldMs)
    }, revealDelayMs)
  }, [clearTimers, minHoldMs, revealDelayMs])

  const bindGesture = useDrag(
    ({ first, last, event }) => {
      // Bloqueia scroll/gestos do navegador enquanto o dedo está no card
      if (event.cancelable) event.preventDefault()
      if (first) start()
      if (last) release()
    },
    {
      // Touch events no iOS (pointer events disparam pointercancel espúrio)
      pointer: { touch: true },
      // preventDefault só funciona com listener não-passivo
      eventOptions: { passive: false },
      filterTaps: false,
    },
  )

  return {
    revealed,
    held,
    /** Props para espalhar no elemento pressionável. */
    bind: {
      ...bindGesture(),
      onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
      style: {
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      } as CSSProperties,
    },
  }
}
