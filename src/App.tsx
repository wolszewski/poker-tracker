import { useState } from 'react'
import { AddPlayerForm } from './AddPlayerForm'
import { emptyNight, type Change, type Night } from './night/night'
import { PlayerCard } from './PlayerCard'
import { TotalsBar } from './TotalsBar'

/** Applies a change from the Night module, returning its error, if any, for the form that made it. */
export type Apply = (change: (night: Night) => Change) => string | undefined

export default function App() {
  const [night, setNight] = useState(emptyNight)

  const apply: Apply = (change) => {
    const result = change(night)
    if (!result.ok) return result.error
    setNight(result.night)
  }

  return (
    <main className="app">
      <h1>Poker Night</h1>
      <AddPlayerForm night={night} apply={apply} />
      {night.players.length === 0 && <p className="hint">No Players yet.</p>}
      <ul className="players">
        {night.players.map((player) => (
          <PlayerCard key={player.id} night={night} player={player} apply={apply} />
        ))}
      </ul>
      <TotalsBar night={night} />
    </main>
  )
}
