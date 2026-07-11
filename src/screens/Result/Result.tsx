import { useState } from 'react'
import { Button, Card, Modal } from '../../components'
import { categories } from '../../data'
import { useGameStore } from '../../store/gameStore'

interface ResultProps {
  onChangeRules: () => void
  onEndSession: () => void
}

export function Result({ onChangeRules, onEndSession }: ResultProps) {
  const players = useGameStore((state) => state.players)
  const round = useGameStore((state) => state.round)
  const newRound = useGameStore((state) => state.newRound)
  const resetSession = useGameStore((state) => state.resetSession)

  const [confirmEnd, setConfirmEnd] = useState(false)

  if (!round) return null

  const imposters = round.imposterIndexes.map((index) => players[index])
  const category = categories.find((c) => c.id === round.categoryId)

  const endSession = () => {
    resetSession()
    onEndSession()
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-4">
      <Card className="p-6 text-center">
        <p className="text-sm font-semibold tracking-widest text-text-secondary uppercase">
          {imposters.length > 1 ? 'Impostores' : 'Impostor'}
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight break-words text-danger">
          {imposters.join(', ')}
        </p>
      </Card>

      <Card className="p-6 text-center">
        <p className="text-sm font-semibold tracking-widest text-text-secondary uppercase">
          Palavra
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight break-words text-primary">
          {round.word}
        </p>
        {category && <p className="mt-2 text-text-secondary">{category.name}</p>}
      </Card>

      <div className="mt-2 flex flex-col gap-3">
        <Button fullWidth className="py-4 text-lg" onClick={newRound}>
          Nova Rodada
        </Button>
        <Button fullWidth variant="secondary" onClick={onChangeRules}>
          Mudar Regras
        </Button>
        <Button fullWidth variant="ghost" onClick={() => setConfirmEnd(true)}>
          Encerrar Sessão
        </Button>
      </div>

      <Modal open={confirmEnd} onClose={() => setConfirmEnd(false)} title="Encerrar sessão?">
        <p className="text-text-secondary">
          Jogadores, regras e histórico de palavras serão apagados. Tem certeza?
        </p>
        <div className="mt-6 flex gap-3">
          <Button fullWidth variant="secondary" onClick={() => setConfirmEnd(false)}>
            Cancelar
          </Button>
          <Button fullWidth variant="danger" onClick={endSession}>
            Sim, encerrar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
