import { useState } from 'react'
import { Button, Modal } from '../../components'
import { APP_DESCRIPTION, APP_EMOJI, APP_NAME } from '../../config/app'
import { useGameStore } from '../../store/gameStore'

interface HomeProps {
  onNewSession: () => void
  onContinue: () => void
}

const rules = [
  'Todos recebem a mesma palavra secreta — menos o(s) impostor(es).',
  'Na roda, cada um dá uma pista curta sobre a palavra, sem entregá-la.',
  'O impostor não sabe a palavra: precisa se disfarçar e tentar descobri-la.',
  'No final, o grupo vota no papo em quem acha que é o impostor.',
  'Revele no app: o grupo vence se acertar o impostor — ou ele escapa e vence.',
]

export function Home({ onNewSession, onContinue }: HomeProps) {
  const hasSession = useGameStore((state) => state.players.length > 0)
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <div className="flex min-h-[calc(100dvh-3rem)] flex-col justify-center gap-10">
      <header className="text-center">
        <span className="block text-6xl" aria-hidden="true">
          {APP_EMOJI}
        </span>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-text-primary">{APP_NAME}</h1>
        <p className="mx-auto mt-4 max-w-xs text-text-secondary">{APP_DESCRIPTION}</p>
      </header>

      <div className="flex flex-col gap-3">
        <Button fullWidth className="py-4 text-lg" onClick={onNewSession}>
          Nova Sessão
        </Button>
        {hasSession && (
          <Button fullWidth variant="secondary" className="py-4 text-lg" onClick={onContinue}>
            Continuar Sessão
          </Button>
        )}
        <Button fullWidth variant="ghost" onClick={() => setRulesOpen(true)}>
          Como jogar
        </Button>
      </div>

      <Modal open={rulesOpen} onClose={() => setRulesOpen(false)} title="Como jogar">
        <ol className="flex list-none flex-col gap-4">
          {rules.map((rule, index) => (
            <li key={rule} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-xs font-bold text-text-secondary">
                {index + 1}
              </span>
              <p className="text-text-primary">{rule}</p>
            </li>
          ))}
        </ol>
        <Button fullWidth className="mt-6" onClick={() => setRulesOpen(false)}>
          Entendi
        </Button>
      </Modal>
    </div>
  )
}
