import { Button, Card } from '../../components'
import { categories } from '../../data'
import { useHoldToReveal } from '../../hooks/useHoldToReveal'
import { useGameStore } from '../../store/gameStore'
import type { Round } from '../../types/game'

interface RevealCardProps {
  player: string
  round: Round
  playerIndex: number
  advanceLabel: string
  onAdvance: () => void
}

/**
 * Remontado por key a cada jogador: estado do hold sempre zera
 * entre uma mão e outra.
 */
function RevealCard({ player, round, playerIndex, advanceLabel, onAdvance }: RevealCardProps) {
  const { revealed, held, bind } = useHoldToReveal()

  const isImposter = round.imposterIndexes.includes(playerIndex)
  const hint = round.imposterHints[playerIndex]
  const category = categories.find((c) => c.id === round.categoryId)

  return (
    <>
      <div className="relative select-none" {...bind}>
        {revealed ? (
          isImposter ? (
            <Card className="flex min-h-80 flex-col items-center justify-center gap-3 border-4 border-red-500 bg-red-950 p-8 text-center">
              <span className="text-6xl" aria-hidden="true">
                🕵️
              </span>
              <p className="text-3xl font-black text-red-400 uppercase">Você é o impostor!</p>
              {category && (
                <p className="font-semibold text-red-200/70">
                  Categoria: {category.emoji} {category.name}
                </p>
              )}
              {hint && (
                <p className="rounded-xl bg-red-500/15 px-4 py-2 font-bold text-red-200">
                  💡 Dica: {hint}
                </p>
              )}
              <p className="text-sm text-red-200/60">Disfarce-se e descubra a palavra…</p>
            </Card>
          ) : (
            <Card className="flex min-h-80 flex-col items-center justify-center gap-3 bg-white p-8 text-center text-slate-900">
              <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
                A palavra é
              </p>
              <p className="text-4xl font-black break-words">{round.word}</p>
              {category && (
                <p className="font-semibold text-slate-500">
                  {category.emoji} {category.name}
                </p>
              )}
            </Card>
          )
        ) : (
          <Card className="flex min-h-80 flex-col items-center justify-center gap-4 bg-yellow-400 p-8 text-center text-slate-900">
            <span className="text-5xl" aria-hidden="true">
              🙈
            </span>
            <p className="text-3xl font-black break-words">{player}</p>
            <p className="font-semibold text-slate-700">
              Não conte a palavra para os outros jogadores 🤫
            </p>
            <p className="mt-2 animate-pulse text-lg font-black tracking-wide uppercase">
              👇 Segure para revelar
            </p>
          </Card>
        )}
      </div>

      <div className="mt-6 min-h-14">
        {held && !revealed && (
          <Button fullWidth className="fade-in py-4 text-lg" onClick={onAdvance}>
            {advanceLabel}
          </Button>
        )}
      </div>
    </>
  )
}

export function Reveal() {
  const players = useGameStore((state) => state.players)
  const round = useGameStore((state) => state.round)
  const nextReveal = useGameStore((state) => state.nextReveal)
  const goToPlaying = useGameStore((state) => state.goToPlaying)

  if (!round) return null

  const index = round.currentRevealIndex
  const player = players[index]
  const isLast = index >= players.length - 1

  return (
    <div className="flex flex-1 flex-col justify-center">
      <div key={index} className="screen-in">
        <p className="mb-4 text-center font-bold text-slate-400">
          🤝 Passe o celular para <span className="text-yellow-400">{player}</span>
          <span className="mt-1 block text-sm font-semibold text-slate-500">
            Jogador {index + 1} de {players.length}
          </span>
        </p>
        <RevealCard
          player={player}
          round={round}
          playerIndex={index}
          advanceLabel={isLast ? '🎮 Iniciar Partida' : '➡️ Próximo Jogador'}
          onAdvance={isLast ? goToPlaying : nextReveal}
        />
      </div>
    </div>
  )
}
