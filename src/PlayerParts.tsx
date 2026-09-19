// Pieces of a Player shared by the phone cards (PlayerCard) and the laptop grid (PlayerGrid).

import { useState } from 'react'
import { AmountDialog } from './AmountDialog'
import type { Apply } from './App'
import { addBuyIn, removePlayer, type Player } from './night/night'

type Props = { player: Player; apply: Apply }

/** Quick-add 50 and 100, and an Add button that asks for any other amount in a dialog. */
export function AddBuyIn({ player, apply }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string>()

  const buyIn = (amount: string) => apply((n) => addBuyIn(n, player.id, amount))

  return (
    <div className="add-buy-in">
      <button type="button" className="primary" onClick={() => setError(buyIn('50'))}>
        +50
      </button>
      <button type="button" onClick={() => setError(buyIn('100'))}>
        +100
      </button>
      <button
        type="button"
        onClick={() => {
          setError(undefined)
          setDialogOpen(true)
        }}
      >
        Add
      </button>
      {error && <p className="error">{error}</p>}
      {dialogOpen && (
        <AmountDialog
          title={`Add Buy-in for ${player.name}`}
          submitLabel="Add"
          onSubmit={buyIn}
          onClose={() => setDialogOpen(false)}
        />
      )}
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
