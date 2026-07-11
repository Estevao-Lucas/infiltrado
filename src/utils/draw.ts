import type { Category, GameSettings, Round } from '../types/game'

/** Tamanho máximo do histórico anti-repetição. */
export const USED_WORDS_LIMIT = 30

export interface DrawRoundInput {
  categories: Category[]
  settings: GameSettings
  playerCount: number
  usedWords: string[]
  /** Injetável para testes determinísticos. */
  rng?: () => number
}

export interface DrawRoundResult {
  round: Round
  /** Histórico atualizado (inclui a palavra sorteada, limitado a USED_WORDS_LIMIT). */
  usedWords: string[]
}

function randInt(rng: () => number, max: number): number {
  return Math.floor(rng() * max)
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randInt(rng, i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Limita imposterCount ao intervalo válido: 1..floor(players/3), mínimo 1. */
export function clampImposterCount(imposterCount: number, playerCount: number): number {
  return Math.max(1, Math.min(imposterCount, Math.floor(playerCount / 3)))
}

export function drawRound({
  categories,
  settings,
  playerCount,
  usedWords,
  rng = Math.random,
}: DrawRoundInput): DrawRoundResult {
  const selected = categories.filter((c) => settings.selectedCategoryIds.includes(c.id))
  if (selected.length === 0) {
    throw new Error('Nenhuma categoria selecionada para o sorteio')
  }

  // 1. Sorteia categoria entre as selecionadas
  const category = selected[randInt(rng, selected.length)]

  // 2. Sorteia palavra excluindo usedWords; se a categoria esgotou,
  //    limpa do histórico apenas as palavras daquela categoria
  const used = new Set(usedWords)
  let available = category.words.filter((w) => !used.has(w.word))
  let nextUsedWords = usedWords
  if (available.length === 0) {
    const categoryWords = new Set(category.words.map((w) => w.word))
    nextUsedWords = usedWords.filter((w) => !categoryWords.has(w))
    available = [...category.words]
  }
  const entry = available[randInt(rng, available.length)]

  // 3. Sorteia impostores sem repetição
  const imposterCount = clampImposterCount(settings.imposterCount, playerCount)
  const imposterIndexes = shuffle([...Array(playerCount).keys()], rng)
    .slice(0, imposterCount)
    .sort((a, b) => a - b)

  // 4. Distribui dicas
  const imposterHints: Record<number, string> = {}
  if (settings.hintsEnabled && entry.hints.length > 0) {
    if (settings.hintMode === 'same') {
      for (const playerIndex of imposterIndexes) {
        imposterHints[playerIndex] = entry.hints[0]
      }
    } else {
      // Dicas distintas; se houver mais impostores que dicas, repete ciclicamente
      const pool = shuffle(entry.hints, rng)
      imposterIndexes.forEach((playerIndex, i) => {
        imposterHints[playerIndex] = pool[i % pool.length]
      })
    }
  }

  // 5. Sorteia quem começa
  const starterIndex = randInt(rng, playerCount)

  return {
    round: {
      categoryId: category.id,
      word: entry.word,
      imposterIndexes,
      imposterHints,
      currentRevealIndex: 0,
      starterIndex,
    },
    usedWords: [...nextUsedWords, entry.word].slice(-USED_WORDS_LIMIT),
  }
}
