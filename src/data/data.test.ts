import { describe, expect, it } from 'vitest'
import { categories } from './index'

describe('banco de palavras', () => {
  it('tem 17 categorias com ids únicos', () => {
    expect(categories).toHaveLength(17)
    expect(new Set(categories.map((c) => c.id)).size).toBe(17)
  })

  it.each(categories.map((c) => [c.id, c] as const))('%s é válida', (_id, category) => {
    expect(category.name).toBeTruthy()
    expect(category.emoji).toBeTruthy()
    expect(category.words).toHaveLength(50)

    const words = category.words.map((w) => w.word)
    expect(new Set(words).size, 'palavras duplicadas na categoria').toBe(50)

    for (const entry of category.words) {
      expect(entry.word.trim()).toBe(entry.word)
      expect(entry.word.length).toBeGreaterThan(0)
      // Mínimo 2 dicas distintas por palavra
      expect(entry.hints.length, `"${entry.word}" precisa de 2+ dicas`).toBeGreaterThanOrEqual(2)
      expect(new Set(entry.hints).size, `"${entry.word}" tem dicas repetidas`).toBe(
        entry.hints.length,
      )
      for (const hint of entry.hints) {
        // Dicas curtas (1-3 palavras) e que não entregam a palavra
        expect(
          hint.split(' ').length,
          `dica longa em "${entry.word}": ${hint}`,
        ).toBeLessThanOrEqual(4)
        expect(
          hint.toLowerCase().includes(entry.word.toLowerCase()),
          `dica entrega a palavra "${entry.word}": ${hint}`,
        ).toBe(false)
      }
    }
  })
})
