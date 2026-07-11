import { useState } from 'react'
import { Button, Card, Modal } from '../../components'
import { APP_DESCRIPTION, APP_EMOJI, APP_NAME } from '../../config/app'
import { useGameStore } from '../../store/gameStore'

interface HomeProps {
  onNewSession: () => void
  onContinue: () => void
}

const rules = [
  { emoji: '🤫', text: 'Todos recebem a mesma palavra secreta — menos o(s) impostor(es).' },
  { emoji: '💬', text: 'Na roda, cada um dá uma pista curta sobre a palavra, sem entregá-la.' },
  {
    emoji: '🎭',
    text: 'O impostor não sabe a palavra: precisa se disfarçar e tentar descobri-la.',
  },
  { emoji: '🗳️', text: 'No final, o grupo vota no papo em quem acha que é o impostor.' },
  {
    emoji: '🏆',
    text: 'Revele no app: o grupo vence se acertar o impostor — ou ele escapa e vence!',
  },
]

export function Home({ onNewSession, onContinue }: HomeProps) {
  const hasSession = useGameStore((state) => state.players.length > 0)
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <div className="flex min-h-[calc(100dvh-3rem)] flex-col justify-center gap-6">
      <Card className="rotate-[-1deg] bg-yellow-400 p-8 text-center text-slate-900 shadow-2xl shadow-yellow-400/25">
        <span className="block text-7xl" aria-hidden="true">
          {APP_EMOJI}
        </span>
        <h1 className="mt-2 text-5xl font-black tracking-tight uppercase">{APP_NAME}</h1>
        <p className="mt-3 text-sm font-semibold text-slate-800">{APP_DESCRIPTION}</p>
      </Card>

      <div className="flex flex-col gap-3">
        <Button fullWidth className="py-4 text-lg" onClick={onNewSession}>
          🎮 Nova Sessão
        </Button>
        {hasSession && (
          <Button fullWidth variant="secondary" className="py-4 text-lg" onClick={onContinue}>
            ▶️ Continuar Sessão
          </Button>
        )}
        <Button fullWidth variant="ghost" onClick={() => setRulesOpen(true)}>
          ❓ Como Jogar
        </Button>
      </div>

      <Modal open={rulesOpen} onClose={() => setRulesOpen(false)} title="❓ Como Jogar">
        <ul className="flex flex-col gap-4">
          {rules.map((rule) => (
            <li key={rule.emoji} className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">
                {rule.emoji}
              </span>
              <p className="text-slate-200">{rule.text}</p>
            </li>
          ))}
        </ul>
        <Button fullWidth className="mt-6" onClick={() => setRulesOpen(false)}>
          Entendi!
        </Button>
      </Modal>
    </div>
  )
}
