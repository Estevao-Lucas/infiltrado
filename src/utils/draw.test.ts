import { describe, expect, it } from 'vitest'
import type { Category, GameSettings } from '../types/game'
import { clampImposterCount, drawRound, USED_WORDS_LIMIT } from './draw'

/** LCG determinístico para testes reproduzíveis. */
function lcg(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

function makeCategory(id: string, words: string[], hints: string[] = ['h1', 'h2']): Category {
  return {
    id,
    name: id,
    emoji: '🎲',
    words: words.map((word) => ({ word, hints: [...hints] })),
  }
}

function makeSettings(overrides: Partial<GameSettings> = {}): GameSettings {
  return {
    imposterCount: 1,
    hintsEnabled: true,
    hintMode: 'same',
    selectedCategoryIds: ['a'],
    ...overrides,
  }
}

const baseInput = {
  categories: [makeCategory('a', ['w1', 'w2', 'w3']), makeCategory('b', ['x1', 'x2'])],
  playerCount: 6,
  usedWords: [] as string[],
}

describe('drawRound', () => {
  it('sorteia categoria apenas entre as selecionadas', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const { round } = drawRound({
        ...baseInput,
        settings: makeSettings({ selectedCategoryIds: ['b'] }),
        rng: lcg(seed),
      })
      expect(round.categoryId).toBe('b')
      expect(['x1', 'x2']).toContain(round.word)
    }
  })

  it('lança erro sem categorias selecionadas', () => {
    expect(() =>
      drawRound({ ...baseInput, settings: makeSettings({ selectedCategoryIds: [] }) }),
    ).toThrow()
  })

  it('exclui palavras já usadas', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const { round } = drawRound({
        ...baseInput,
        settings: makeSettings(),
        usedWords: ['w1', 'w3'],
        rng: lcg(seed),
      })
      expect(round.word).toBe('w2')
    }
  })

  it('limpa o histórico da categoria quando ela esgota', () => {
    const { round, usedWords } = drawRound({
      ...baseInput,
      settings: makeSettings(),
      usedWords: ['w1', 'w2', 'w3', 'x1'],
      rng: lcg(7),
    })
    expect(['w1', 'w2', 'w3']).toContain(round.word)
    // Histórico de outras categorias é preservado
    expect(usedWords).toContain('x1')
    // Histórico da categoria esgotada foi limpo; só a palavra nova entra
    expect(usedWords.filter((w) => ['w1', 'w2', 'w3'].includes(w))).toEqual([round.word])
  })

  it('adiciona a palavra sorteada ao histórico com limite de 30', () => {
    const manyWords = Array.from({ length: 40 }, (_, i) => `m${i}`)
    const { usedWords } = drawRound({
      categories: [makeCategory('a', manyWords)],
      settings: makeSettings(),
      playerCount: 5,
      usedWords: manyWords.slice(0, 35),
      rng: lcg(3),
    })
    expect(usedWords.length).toBeLessThanOrEqual(USED_WORDS_LIMIT)
    expect(usedWords[usedWords.length - 1]).toMatch(/^m/)
  })

  it('sorteia impostores sem repetição e dentro do intervalo', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const { round } = drawRound({
        ...baseInput,
        playerCount: 9,
        settings: makeSettings({ imposterCount: 3 }),
        rng: lcg(seed),
      })
      expect(round.imposterIndexes).toHaveLength(3)
      expect(new Set(round.imposterIndexes).size).toBe(3)
      for (const i of round.imposterIndexes) {
        expect(i).toBeGreaterThanOrEqual(0)
        expect(i).toBeLessThan(9)
      }
    }
  })

  it('limita imposterCount a floor(players/3)', () => {
    const { round } = drawRound({
      ...baseInput,
      playerCount: 6,
      settings: makeSettings({ imposterCount: 5 }),
      rng: lcg(11),
    })
    expect(round.imposterIndexes).toHaveLength(2)
  })

  it('hintsEnabled=false gera imposterHints vazio', () => {
    const { round } = drawRound({
      ...baseInput,
      settings: makeSettings({ hintsEnabled: false }),
      rng: lcg(5),
    })
    expect(round.imposterHints).toEqual({})
  })

  it("hintMode='same' dá hints[0] a todos os impostores", () => {
    const { round } = drawRound({
      categories: [makeCategory('a', ['w1'], ['primeira', 'segunda', 'terceira'])],
      settings: makeSettings({ imposterCount: 3, hintMode: 'same' }),
      playerCount: 9,
      usedWords: [],
      rng: lcg(13),
    })
    for (const i of round.imposterIndexes) {
      expect(round.imposterHints[i]).toBe('primeira')
    }
  })

  it("hintMode='different' distribui dicas distintas", () => {
    const { round } = drawRound({
      categories: [makeCategory('a', ['w1'], ['d1', 'd2', 'd3'])],
      settings: makeSettings({ imposterCount: 3, hintMode: 'different' }),
      playerCount: 9,
      usedWords: [],
      rng: lcg(17),
    })
    const hints = round.imposterIndexes.map((i) => round.imposterHints[i])
    expect(new Set(hints).size).toBe(3)
    for (const h of hints) {
      expect(['d1', 'd2', 'd3']).toContain(h)
    }
  })

  it("hintMode='different' repete ciclicamente com mais impostores que dicas", () => {
    const { round } = drawRound({
      categories: [makeCategory('a', ['w1'], ['d1', 'd2'])],
      settings: makeSettings({ imposterCount: 3, hintMode: 'different' }),
      playerCount: 9,
      usedWords: [],
      rng: lcg(19),
    })
    const hints = round.imposterIndexes.map((i) => round.imposterHints[i])
    expect(hints).toHaveLength(3)
    expect(new Set(hints).size).toBe(2)
  })

  it('starterIndex e currentRevealIndex válidos', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const { round } = drawRound({ ...baseInput, settings: makeSettings(), rng: lcg(seed) })
      expect(round.starterIndex).toBeGreaterThanOrEqual(0)
      expect(round.starterIndex).toBeLessThan(baseInput.playerCount)
      expect(round.currentRevealIndex).toBe(0)
    }
  })
})

describe('clampImposterCount', () => {
  it('mínimo 1 mesmo com poucos jogadores', () => {
    expect(clampImposterCount(1, 3)).toBe(1)
    expect(clampImposterCount(0, 3)).toBe(1)
  })

  it('máximo floor(players/3)', () => {
    expect(clampImposterCount(10, 15)).toBe(5)
    expect(clampImposterCount(2, 7)).toBe(2)
  })
})
