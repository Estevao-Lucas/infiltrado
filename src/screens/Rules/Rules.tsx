import { useEffect } from 'react'
import { Button, Card, Chip, Stepper, Toggle } from '../../components'
import { categories } from '../../data'
import { useGameStore } from '../../store/gameStore'
import { clampImposterCount } from '../../utils/draw'

interface RulesProps {
  onBack: () => void
  onStart: () => void
}

export function Rules({ onBack, onStart }: RulesProps) {
  const players = useGameStore((state) => state.players)
  const settings = useGameStore((state) => state.settings)
  const setSettings = useGameStore((state) => state.setSettings)
  const startRound = useGameStore((state) => state.startRound)

  const maxImposters = clampImposterCount(Number.POSITIVE_INFINITY, players.length)
  const imposterCount = clampImposterCount(settings.imposterCount, players.length)
  const selectedIds = settings.selectedCategoryIds

  // Normaliza settings persistidos que ficaram fora do intervalo válido
  useEffect(() => {
    if (settings.imposterCount !== imposterCount) setSettings({ imposterCount })
    if (imposterCount === 1 && settings.hintMode !== 'same') setSettings({ hintMode: 'same' })
  }, [settings.imposterCount, settings.hintMode, imposterCount, setSettings])

  const toggleCategory = (id: string) => {
    setSettings({
      selectedCategoryIds: selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
    })
  }

  const handleStart = () => {
    startRound()
    onStart()
  }

  const hintModeOptions = [
    { value: 'same', label: 'Mesma dica para todos' },
    { value: 'different', label: 'Dica diferente para cada um' },
  ] as const

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} aria-label="Voltar para jogadores">
          ←
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Regras</h1>
      </header>

      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-text-primary">Impostores</p>
          <p className="text-sm text-text-secondary">
            {maxImposters === 1 ? 'Apenas 1 com esse grupo' : `De 1 a ${maxImposters}`}
          </p>
        </div>
        <Stepper
          value={imposterCount}
          min={1}
          max={maxImposters}
          onChange={(value) => setSettings({ imposterCount: value })}
          label="número de impostores"
          disabled={maxImposters === 1}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <Toggle
          checked={settings.hintsEnabled}
          onChange={(checked) => setSettings({ hintsEnabled: checked })}
          label="Dica para o impostor"
          description="O impostor recebe uma pista sutil da palavra"
        />
        {settings.hintsEnabled && imposterCount > 1 && (
          <div role="radiogroup" aria-label="Modo da dica" className="flex flex-col gap-2">
            {hintModeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={settings.hintMode === option.value}
                onClick={() => setSettings({ hintMode: option.value })}
                className={`min-h-11 rounded-xl border px-4 text-left text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                  settings.hintMode === option.value
                    ? 'border-primary text-text-primary'
                    : 'border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-text-primary">
            Categorias{' '}
            <span className="text-sm font-medium text-text-secondary">
              ({selectedIds.length}/{categories.length})
            </span>
          </p>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              className="min-h-9 px-2 text-xs"
              onClick={() => setSettings({ selectedCategoryIds: categories.map((c) => c.id) })}
            >
              Todas
            </Button>
            <Button
              variant="ghost"
              className="min-h-9 px-2 text-xs"
              onClick={() => setSettings({ selectedCategoryIds: [] })}
            >
              Limpar
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <Chip
              key={category.id}
              selected={selectedIds.includes(category.id)}
              onClick={() => toggleCategory(category.id)}
            >
              <span aria-hidden="true">{category.emoji}</span> {category.name}
            </Chip>
          ))}
        </div>
        {selectedIds.length === 0 && (
          <p className="text-center text-sm font-medium text-danger">
            Selecione pelo menos 1 categoria
          </p>
        )}
      </Card>

      <Button
        fullWidth
        className="py-4 text-lg"
        disabled={selectedIds.length === 0}
        onClick={handleStart}
      >
        Começar
      </Button>
    </div>
  )
}
