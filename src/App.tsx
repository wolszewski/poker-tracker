import { useEffect, useState } from 'react'
import { AddPlayerForm } from './AddPlayerForm'
import { CopySummary } from './CopySummary'
import { emptyNight, loadNight, saveNight, type Change, type Night } from './night/night'
import { PlayerCard } from './PlayerCard'
import { PlayerGrid } from './PlayerGrid'
import { SettlementPanel } from './SettlementPanel'
import { readSaved, writeSaved } from './storage'
import { TotalsBar } from './TotalsBar'
import { useMediaQuery } from './useMediaQuery'

/** Applies a change from the Night module, returning its error, if any, for the form that made it. */
export type Apply = (change: (night: Night) => Change) => string | undefined

/** Above this width the Players show as a grid; below it, as cards. Keep in step with the media query in index.css. */
const LAPTOP = '(min-width: 69rem)'

export default function App() {
  const [night, setNight] = useState(() => loadNight(readSaved()))
  const laptop = useMediaQuery(LAPTOP)

  useEffect(() => writeSaved(saveNight(night)), [night])

  const apply: Apply = (change) => {
    const result = change(night)
    if (!result.ok) return result.error
    setNight(result.night)
  }

  return (
    <main className="app">
      <h1>Poker Night</h1>
      <AddPlayerForm night={night} apply={apply} />
      {night.players.length === 0 ? (
        <p className="hint">No Players yet.</p>
      ) : laptop ? (
        <PlayerGrid night={night} apply={apply} />
      ) : (
        <ul className="players">
          {night.players.map((player) => (
            <PlayerCard key={player.id} night={night} player={player} apply={apply} />
          ))}
        </ul>
      )}
      <SettlementPanel night={night} />
      <TotalsBar night={night} />

      <div className="night-actions">
        <CopySummary night={night} />
        <button
          type="button"
          className="danger"
          onClick={() => {
            if (window.confirm('Start a New Night? This clears every Player, Buy-in and Cash-out.')) {
              setNight(emptyNight())
            }
          }}
        >
          New Night
        </button>
      </div>
    </main>
  )
}
