export interface WordEntry {
  word: string
  /** Mínimo 2 dicas distintas por palavra. */
  hints: string[]
}

export interface Category {
  /** Slug: "comida", "cinema"... */
  id: string
  name: string
  emoji: string
  words: WordEntry[]
}

export interface GameSettings {
  /** 1..floor(players/3), mínimo 1. */
  imposterCount: number
  hintsEnabled: boolean
  /** Dica igual ou diferente entre impostores. */
  hintMode: 'same' | 'different'
  /** 1+ categorias. */
  selectedCategoryIds: string[]
}

export interface Round {
  categoryId: string
  word: string
  /** Impostores NÃO se conhecem. */
  imposterIndexes: number[]
  /** Índice do jogador -> dica dele. */
  imposterHints: Record<number, string>
  currentRevealIndex: number
  starterIndex: number
}

export type GamePhase = 'setup' | 'reveal' | 'playing' | 'result'

export interface GameState {
  phase: GamePhase
  /** 3..15 jogadores. */
  players: string[]
  settings: GameSettings
  round: Round | null
  /** Histórico anti-repetição (últimas 30 palavras). */
  usedWords: string[]
}
