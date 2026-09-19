import { useState } from 'react'
import type { Apply } from './App'
import { deleteBuyIn, editBuyIn, formatAmount, type BuyIn } from './night/night'

type Props = { buyIn: BuyIn; apply: Apply; as?: 'li' | 'td' }

/** One Buy-in, shown as a chip that opens an editor. Renders as a list item in cards, or a table cell in the grid. */
export function BuyInItem({ buyIn, apply, as: Item = 'li' }: Props) {
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string>()

  if (!editing) {
    return (
      <Item className="buy-in">
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
      </Item>
    )
  }

  return (
    <Item className="buy-in buy-in-editor">
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
    </Item>
  )
}
