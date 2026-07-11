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
      <div className="hold-area relative" {...bind}>
        {revealed ? (
          isImposter ? (
            <Card className="flex min-h-[58dvh] flex-col items-center p-8 text-center">
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <p className="text-sm font-semibold tracking-widest text-text-secondary uppercase">
                  Segredo
                </p>
                <p className="text-3xl font-bold tracking-tight text-danger uppercase">
                  Você é o impostor
                </p>
                {category && (
                  <p className="text-text-secondary">
                    Categoria:{' '}
                    <span className="font-semibold text-text-primary">{category.name}</span>
                  </p>
                )}
                {hint && (
                  <p className="rounded-xl border border-border bg-surface-elevated px-4 py-2 font-semibold text-text-primary">
                    Dica: {hint}
                  </p>
                )}
                <p className="text-sm text-text-secondary">Disfarce-se e descubra a palavra.</p>
              </div>
              <p className="mt-auto pt-6 text-sm font-bold tracking-widest text-text-secondary uppercase">
                Solte para esconder
              </p>
            </Card>
          ) : (
            <Card className="flex min-h-[58dvh] flex-col items-center bg-surface-elevated p-8 text-center">
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <p className="text-sm font-semibold tracking-widest text-text-secondary uppercase">
                  A palavra é
                </p>
                <p className="text-4xl font-bold tracking-tight break-words text-text-primary">
                  {round.word}
                </p>
                {category && <p className="text-text-secondary">{category.name}</p>}
              </div>
              <p className="mt-auto pt-6 text-sm font-bold tracking-widest text-text-secondary uppercase">
                Solte para esconder
              </p>
            </Card>
          )
        ) : (
          <Card className="flex min-h-[58dvh] flex-col items-center p-8 text-center">
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <p className="text-3xl font-bold tracking-tight break-words text-text-primary">
                {player}
              </p>
              <p className="text-text-secondary">Não conte a palavra para os outros jogadores.</p>
            </div>
            <p className="mt-auto animate-pulse pt-6 text-sm font-bold tracking-widest text-primary-hover uppercase">
              Segure aqui para revelar
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
        <p className="mb-6 text-center text-text-secondary">
          Passe o celular para <span className="font-semibold text-text-primary">{player}</span>
          <span className="mt-1 block text-sm">
            Jogador {index + 1} de {players.length}
          </span>
        </p>
        <RevealCard
          player={player}
          round={round}
          playerIndex={index}
          advanceLabel={isLast ? 'Iniciar Partida' : 'Próximo Jogador'}
          onAdvance={isLast ? goToPlaying : nextReveal}
        />
      </div>
    </div>
  )
}
