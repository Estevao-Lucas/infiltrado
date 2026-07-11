import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Card } from '../../components'
import { MAX_PLAYERS, MIN_PLAYERS, useGameStore } from '../../store/gameStore'

interface PlayersSetupProps {
  onBack: () => void
  onContinue: () => void
}

export function PlayersSetup({ onBack, onContinue }: PlayersSetupProps) {
  const players = useGameStore((state) => state.players)
  const addPlayer = useGameStore((state) => state.addPlayer)
  const removePlayer = useGameStore((state) => state.removePlayer)
  const updatePlayer = useGameStore((state) => state.updatePlayer)

  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')

  const validate = (rawName: string, excludeIndex?: number): string | null => {
    const trimmed = rawName.trim()
    if (!trimmed) return 'Digite um nome'
    const isDuplicate = players.some(
      (player, i) => i !== excludeIndex && player.toLowerCase() === trimmed.toLowerCase(),
    )
    if (isDuplicate) return 'Esse nome já está na lista'
    if (excludeIndex === undefined && players.length >= MAX_PLAYERS) {
      return `Máximo de ${MAX_PLAYERS} jogadores`
    }
    return null
  }

  const handleAdd = (event: FormEvent) => {
    event.preventDefault()
    const validationError = validate(name)
    if (validationError) {
      setError(validationError)
      return
    }
    addPlayer(name)
    setName('')
    setError(null)
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditingName(players[index])
  }

  const commitEditing = () => {
    if (editingIndex === null) return
    if (!validate(editingName, editingIndex)) {
      updatePlayer(editingIndex, editingName)
    }
    setEditingIndex(null)
  }

  const inputClasses =
    'min-h-11 w-full rounded-2xl border-2 border-slate-700 bg-slate-800 px-4 font-semibold text-slate-100 placeholder:text-slate-500 focus:border-yellow-400 focus:outline-none'

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} aria-label="Voltar para a tela inicial">
          ←
        </Button>
        <h1 className="text-2xl font-black">👥 Jogadores</h1>
        <span className="ml-auto rounded-full bg-slate-800 px-3 py-1 text-sm font-bold text-slate-300">
          {players.length}/{MAX_PLAYERS}
        </span>
      </header>

      <form onSubmit={handleAdd} className="flex gap-2">
        <label htmlFor="player-name" className="sr-only">
          Nome do jogador
        </label>
        <input
          id="player-name"
          className={inputClasses}
          placeholder="Nome do jogador"
          value={name}
          maxLength={20}
          onChange={(event) => {
            setName(event.target.value)
            setError(null)
          }}
        />
        <Button type="submit" aria-label="Adicionar jogador" className="shrink-0 text-xl">
          +
        </Button>
      </form>
      {error && (
        <p role="alert" className="-mt-3 px-1 text-sm font-semibold text-red-400">
          {error}
        </p>
      )}

      {players.length === 0 ? (
        <Card className="py-10 text-center text-slate-400">
          <span className="block text-4xl" aria-hidden="true">
            🫥
          </span>
          <p className="mt-2 font-semibold">Ninguém por aqui ainda…</p>
          <p className="text-sm">Adicione pelo menos {MIN_PLAYERS} jogadores.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {players.map((player, index) => (
            <li key={`${player}-${index}`}>
              <Card className="flex items-center gap-3 p-3">
                <span className="text-xl" aria-hidden="true">
                  🙋
                </span>
                {editingIndex === index ? (
                  <input
                    className={inputClasses}
                    value={editingName}
                    maxLength={20}
                    autoFocus
                    onChange={(event) => setEditingName(event.target.value)}
                    onBlur={commitEditing}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') commitEditing()
                      if (event.key === 'Escape') setEditingIndex(null)
                    }}
                    aria-label={`Editar nome de ${player}`}
                  />
                ) : (
                  <button
                    type="button"
                    className="min-h-11 flex-1 truncate rounded-xl text-left font-bold focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:outline-none"
                    onClick={() => startEditing(index)}
                    aria-label={`Editar ${player}`}
                  >
                    {player}
                  </button>
                )}
                <Button
                  variant="danger"
                  className="shrink-0"
                  onClick={() => removePlayer(index)}
                  aria-label={`Remover ${player}`}
                >
                  ✕
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-2">
        {players.length < MIN_PLAYERS && (
          <p className="text-center text-sm font-semibold text-slate-400">
            Mínimo de {MIN_PLAYERS} jogadores para continuar
          </p>
        )}
        <Button
          fullWidth
          className="py-4 text-lg"
          disabled={players.length < MIN_PLAYERS}
          onClick={onContinue}
        >
          Continuar ➡️
        </Button>
      </div>
    </div>
  )
}
