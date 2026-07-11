import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { APP_STORAGE_KEY } from '../config/app'
import { categories } from '../data'
import { drawRound } from '../utils/draw'
import type { GameSettings, GameState } from '../types/game'

export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 15

function defaultSettings(): GameSettings {
  return {
    imposterCount: 1,
    hintsEnabled: true,
    hintMode: 'same',
    selectedCategoryIds: categories.map((c) => c.id),
  }
}

function initialState(): GameState {
  return {
    phase: 'setup',
    players: [],
    settings: defaultSettings(),
    round: null,
    usedWords: [],
  }
}

interface GameStore extends GameState {
  addPlayer: (name: string) => void
  removePlayer: (index: number) => void
  updatePlayer: (index: number, name: string) => void
  setSettings: (settings: Partial<GameSettings>) => void
  /** Sorteia a rodada e vai para a fase reveal. */
  startRound: () => void
  /** Avança o passa-o-celular para o próximo jogador. */
  nextReveal: () => void
  goToPlaying: () => void
  revealResult: () => void
  /** Nova rodada com os mesmos jogadores/settings, nova palavra. */
  newRound: () => void
  /** Volta tudo ao estado inicial. */
  resetSession: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
      const draw = () => {
        const { players, settings, usedWords } = get()
        if (players.length < MIN_PLAYERS) {
          throw new Error(`Mínimo de ${MIN_PLAYERS} jogadores para iniciar`)
        }
        const result = drawRound({
          categories,
          settings,
          playerCount: players.length,
          usedWords,
        })
        set({ phase: 'reveal', round: result.round, usedWords: result.usedWords })
      }

      return {
        ...initialState(),

        addPlayer: (name) => {
          const trimmed = name.trim()
          const { players } = get()
          if (!trimmed || players.length >= MAX_PLAYERS) return
          set({ players: [...players, trimmed] })
        },

        removePlayer: (index) =>
          set(({ players }) => ({ players: players.filter((_, i) => i !== index) })),

        updatePlayer: (index, name) => {
          const trimmed = name.trim()
          if (!trimmed) return
          set(({ players }) => ({ players: players.map((p, i) => (i === index ? trimmed : p)) }))
        },

        setSettings: (settings) =>
          set((state) => ({ settings: { ...state.settings, ...settings } })),

        startRound: draw,

        nextReveal: () =>
          set(({ round }) =>
            round ? { round: { ...round, currentRevealIndex: round.currentRevealIndex + 1 } } : {},
          ),

        goToPlaying: () => set({ phase: 'playing' }),

        revealResult: () => set({ phase: 'result' }),

        newRound: draw,

        resetSession: () => set(initialState()),
      }
    },
    { name: APP_STORAGE_KEY, version: 1 },
  ),
)
