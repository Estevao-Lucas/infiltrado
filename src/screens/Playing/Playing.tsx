import { useState } from 'react'
import { Button, Card, Modal } from '../../components'
import { useGameStore } from '../../store/gameStore'

interface PlayingProps {
  /** Volta para a tela de regras mantendo os jogadores. */
  onChangeRules: () => void
}

export function Playing({ onChangeRules }: PlayingProps) {
  const players = useGameStore((state) => state.players)
  const round = useGameStore((state) => state.round)
  const revealResult = useGameStore((state) => state.revealResult)

  const [confirmReveal, setConfirmReveal] = useState(false)
  const [confirmNewGame, setConfirmNewGame] = useState(false)

  if (!round) return null

  const starter = players[round.starterIndex]

  return (
    <div className="flex flex-1 flex-col justify-center gap-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Partida iniciada</h1>
        <p className="mt-2 text-text-secondary">Hora de conversar e achar o impostor.</p>
      </header>

      <Card className="p-6 text-center">
        <p className="text-sm font-semibold tracking-widest text-text-secondary uppercase">
          Começa a conversa
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-primary">{starter}</p>
      </Card>

      <div className="flex flex-col gap-3">
        <Button fullWidth className="py-4 text-lg" onClick={() => setConfirmReveal(true)}>
          Revelar impostor e palavra
        </Button>
        <Button fullWidth variant="ghost" onClick={() => setConfirmNewGame(true)}>
          Novo jogo
        </Button>
      </div>

      <Modal open={confirmReveal} onClose={() => setConfirmReveal(false)} title="Revelar tudo?">
        <p className="text-text-secondary">
          Tem certeza que deseja revelar? O impostor e a palavra aparecerão para todos.
        </p>
        <div className="mt-6 flex gap-3">
          <Button fullWidth variant="secondary" onClick={() => setConfirmReveal(false)}>
            Cancelar
          </Button>
          <Button fullWidth onClick={revealResult}>
            Sim, revelar
          </Button>
        </div>
      </Modal>

      <Modal open={confirmNewGame} onClose={() => setConfirmNewGame(false)} title="Novo jogo?">
        <p className="text-text-secondary">
          A rodada atual será descartada. Os jogadores continuam na lista e você volta para as
          regras.
        </p>
        <div className="mt-6 flex gap-3">
          <Button fullWidth variant="secondary" onClick={() => setConfirmNewGame(false)}>
            Cancelar
          </Button>
          <Button fullWidth onClick={onChangeRules}>
            Sim
          </Button>
        </div>
      </Modal>
    </div>
  )
}
