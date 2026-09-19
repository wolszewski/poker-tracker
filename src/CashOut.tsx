import { useState } from 'react'
import type { Apply } from './App'
import { clearCashOut, formatAmount, formatSigned, netResult, setCashOut, type Night, type Player } from './night/night'

type Props = { night: Night; player: Player; apply: Apply }

export function CashOut({ night, player, apply }: Props) {
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string>()
  const net = netResult(night, player.id)

  if (player.cashOut != null && net !== undefined && !editing) {
    return (
      <div className="cash-out">
        <p className="result">
          Cash-out <strong>{formatAmount(player.cashOut)}</strong>
          <span className={`net ${net > 0 ? 'win' : net < 0 ? 'loss' : ''}`}>
            Net result <strong>{formatSigned(net)}</strong>
          </span>
        </p>
        <div className="actions">
          <button
            type="button"
            className="small"
            onClick={() => {
              setAmount(formatAmount(player.cashOut!))
              setError(undefined)
              setEditing(true)
            }}
          >
            Change Cash-out
          </button>
          <button type="button" className="small" onClick={() => apply((n) => clearCashOut(n, player.id))}>
            Back to playing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cash-out">
      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault()
          const failure = apply((n) => setCashOut(n, player.id, amount))
          setError(failure)
          if (!failure) {
            setEditing(false)
            setAmount('')
          }
        }}
      >
        <input
          aria-label={`Cash-out for ${player.name}`}
          placeholder="Cash-out"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <button type="submit">{editing ? 'Save' : 'Cash out'}</button>
        {editing && (
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
