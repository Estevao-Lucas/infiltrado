import { useState } from 'react'
import { Home } from './screens/Home'
import { PlayersSetup } from './screens/PlayersSetup'
import { Playing } from './screens/Playing'
import { Result } from './screens/Result'
import { Reveal } from './screens/Reveal'
import { Rules } from './screens/Rules'
import { useGameStore } from './store/gameStore'

/** Sub-telas da fase setup; 'game' delega para a phase do store. */
type Screen = 'home' | 'players' | 'rules' | 'game'

function App() {
  const phase = useGameStore((state) => state.phase)
  const [screen, setScreen] = useState<Screen>('home')

  let content
  if (screen === 'game' && phase !== 'setup') {
    content = phase === 'reveal' ? <Reveal /> : phase === 'playing' ? <Playing /> : <Result />
  } else if (screen === 'players') {
    content = (
      <PlayersSetup onBack={() => setScreen('home')} onContinue={() => setScreen('rules')} />
    )
  } else if (screen === 'rules') {
    content = <Rules onBack={() => setScreen('players')} onStart={() => setScreen('game')} />
  } else {
    content = (
      <Home
        onNewSession={() => setScreen('players')}
        onContinue={() => setScreen(phase === 'setup' ? 'players' : 'game')}
      />
    )
  }

  const screenKey = screen === 'game' ? `game-${phase}` : screen

  return (
    <main className="min-h-dvh overflow-x-hidden bg-slate-900 text-slate-100">
      <div
        key={screenKey}
        className="screen-in mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-6"
      >
        {content}
      </div>
    </main>
  )
}

export default App
