import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { APP_STORAGE_KEY } from '../config/app'
import type { GamePhase } from '../types'

// Placeholder: estado real do jogo (jogadores, categoria, palavra, votos)
// entra nas próximas fases.
interface GameState {
  phase: GamePhase
  setPhase: (phase: GamePhase) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      phase: 'setup',
      setPhase: (phase) => set({ phase }),
    }),
    { name: APP_STORAGE_KEY },
  ),
)
