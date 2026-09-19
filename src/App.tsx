import { useState } from 'react'
import { emptyNight } from './night/night'
import { TotalsBar } from './TotalsBar'

export default function App() {
  const [night] = useState(emptyNight)

  return (
    <main className="app">
      <h1>Poker Night</h1>
      {night.players.length === 0 && <p className="hint">No Players yet.</p>}
      <TotalsBar night={night} />
    </main>
  )
}
