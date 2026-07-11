import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'

interface UseHoldToRevealOptions {
  /** Atraso antes de revelar — evita revelar num toque acidental. */
  revealDelayMs?: number
  /** Tempo revelado necessário para contar como um hold completo. */
  minHoldMs?: number
}

interface UseHoldToRevealResult {
  /** Conteúdo visível AGORA (dedo pressionado além do delay). */
  revealed: boolean
  /** Já houve ao menos um hold completo (habilita avançar). */
  held: boolean
  /** Props para espalhar no elemento pressionável. */
  bind: {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
    onPointerUp: () => void
    onPointerCancel: () => void
    onPointerLeave: () => void
    onContextMenu: (event: ReactPointerEvent<HTMLElement> | React.MouseEvent) => void
    style: CSSProperties
  }
}

/**
 * Hold-to-reveal com Pointer Events unificados (mouse/touch/pen).
 * A palavra NUNCA fica visível sem o dedo pressionado: qualquer
 * pointerup/pointercancel/pointerleave (ligação, notificação, dedo
 * escorregando) esconde imediatamente.
 */
export function useHoldToReveal({
  revealDelayMs = 300,
  minHoldMs = 600,
}: UseHoldToRevealOptions = {}): UseHoldToRevealResult {
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

  // Componente desmontado no meio de um hold: não deixar timers vivos
  useEffect(() => clearTimers, [clearTimers])

  const release = useCallback(() => {
    clearTimers()
    setRevealed(false)
  }, [clearTimers])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      // Captura o ponteiro: o pointerup chega mesmo se o dedo sair do card
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // pointerId inválido (eventos sintéticos) — hold funciona mesmo assim
      }
      clearTimers()
      revealTimer.current = window.setTimeout(() => {
        setRevealed(true)
        completeTimer.current = window.setTimeout(() => setHeld(true), minHoldMs)
      }, revealDelayMs)
    },
    [clearTimers, minHoldMs, revealDelayMs],
  )

  return {
    revealed,
    held,
    bind: {
      onPointerDown,
      onPointerUp: release,
      onPointerCancel: release,
      onPointerLeave: release,
      onContextMenu: (event) => event.preventDefault(),
      style: {
        // Bloqueia scroll/zoom da página durante o hold
        touchAction: 'none',
        // Bloqueia seleção de texto e o menu de long-press do iOS
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      },
    },
  }
}
