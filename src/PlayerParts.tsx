// Pieces of a Player shared by the phone cards (PlayerCard) and the laptop grid (PlayerGrid).

import { useState } from 'react'
import type { Apply } from './App'
import { addBuyIn, removePlayer, type Player } from './night/night'

type Props = { player: Player; apply: Apply }

/** Quick-add 50 and 100, and a custom-amount Buy-in, with the error from the last attempt. `compact` shortens the labels for the grid. */
export function AddBuyInForm({ player, apply, compact = false }: Props & { compact?: boolean }) {
  const [customAmount, setCustomAmount] = useState('')
  const [error, setError] = useState<string>()

  const buyIn = (amount: string) => {
    const failure = apply((n) => addBuyIn(n, player.id, amount))
    setError(failure)
    return !failure
  }

  return (
    <div className="add-buy-in">
      <div className="quick-buy-ins">
        <button type="button" className="primary" onClick={() => buyIn('50')}>
          +50
        </button>
        <button type="button" onClick={() => buyIn('100')}>
          +100
        </button>
      </div>
      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (buyIn(customAmount)) setCustomAmount('')
        }}
      >
        <input
          aria-label={`Other Buy-in amount for ${player.name}`}
          placeholder={compact ? 'Buy-in' : 'Other amount'}
          inputMode="decimal"
          value={customAmount}
          onChange={(event) => setCustomAmount(event.target.value)}
        />
        <button type="submit">{compact ? 'Add' : 'Add Buy-in'}</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export function RemovePlayerButton({ player, apply }: Props) {
  return (
    <button
      type="button"
      className="small danger"
      onClick={() => {
        if (window.confirm(`Remove ${player.name} and all their Buy-ins and Cash-out?`)) {
          apply((n) => removePlayer(n, player.id))
        }
      }}
    >
      Remove
    </button>
  )
}

export function PlayerStatus({ finished }: { finished: boolean }) {
  return <span className={`status ${finished ? 'done' : ''}`}>{finished ? 'Finished' : 'Playing'}</span>
}
