import { APP_NAME, APP_EMOJI, APP_DESCRIPTION } from './config/app'

// Placeholder — o roteamento por `phase` (setup | reveal | playing | result)
// via gameStore entra nas próximas fases.
function App() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center text-slate-100">
      <span className="text-6xl">{APP_EMOJI}</span>
      <h1 className="text-4xl font-bold">{APP_NAME}</h1>
      <p className="max-w-sm text-slate-400">{APP_DESCRIPTION}</p>
    </main>
  )
}

export default App
