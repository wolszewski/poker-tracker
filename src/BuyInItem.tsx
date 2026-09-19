import { useState } from 'react'
import type { Apply } from './App'
import { deleteBuyIn, editBuyIn, formatAmount, type BuyIn } from './night/night'

export function BuyInItem({ buyIn, apply }: { buyIn: BuyIn; apply: Apply }) {
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string>()

  if (!editing) {
    return (
      <li>
        <button
          type="button"
          className="chip"
          aria-label={`Change Buy-in of ${formatAmount(buyIn.amount)}`}
          onClick={() => {
            setAmount(formatAmount(buyIn.amount))
            setError(undefined)
            setEditing(true)
          }}
        >
          {formatAmount(buyIn.amount)}
        </button>
      </li>
    )
  }

  return (
    <li className="buy-in-editor">
      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault()
          const failure = apply((night) => editBuyIn(night, buyIn.id, amount))
          setError(failure)
          if (!failure) setEditing(false)
        }}
      >
        <input
          aria-label="Buy-in amount"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          autoFocus
        />
        <button type="submit" className="small primary">
          Save
        </button>
        <button type="button" className="small danger" onClick={() => apply((night) => deleteBuyIn(night, buyIn.id))}>
          Delete
        </button>
        <button type="button" className="small" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </li>
  )
}
