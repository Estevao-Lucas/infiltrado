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
    <div className="flex flex-1 flex-col justify-center gap-6">
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <span className="text-6xl" aria-hidden="true">
          🎬
        </span>
        <h1 className="text-2xl font-black">Partida iniciada!</h1>
        <p className="text-slate-400">Hora de conversar e achar o impostor.</p>
      </Card>

      <Card className="bg-yellow-400 p-6 text-center text-slate-900">
        <p className="text-xl font-black">🗣️ {starter} começa a conversa!</p>
      </Card>

      <div className="flex flex-col gap-3">
        <Button fullWidth className="py-4 text-lg" onClick={() => setConfirmReveal(true)}>
          👁️ Revelar Impostor &amp; Palavra
        </Button>
        <Button fullWidth variant="ghost" onClick={() => setConfirmNewGame(true)}>
          🔁 Novo Jogo
        </Button>
      </div>

      <Modal open={confirmReveal} onClose={() => setConfirmReveal(false)} title="👁️ Revelar tudo?">
        <p className="text-slate-300">
          Tem certeza que deseja revelar? O impostor e a palavra aparecerão para todos.
        </p>
        <div className="mt-6 flex gap-3">
          <Button fullWidth variant="secondary" onClick={() => setConfirmReveal(false)}>
            Cancelar
          </Button>
          <Button fullWidth onClick={revealResult}>
            Sim, revelar!
          </Button>
        </div>
      </Modal>

      <Modal open={confirmNewGame} onClose={() => setConfirmNewGame(false)} title="🔁 Novo jogo?">
        <p className="text-slate-300">
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
