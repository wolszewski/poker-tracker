import { useState } from 'react'
import type { Apply } from './App'
import { BuyInItem } from './BuyInItem'
import { CashOut } from './CashOut'
import { addBuyIn, formatAmount, isFinished, removePlayer, totalBuyIn, type Night, type Player } from './night/night'

type Props = { night: Night; player: Player; apply: Apply }

export function PlayerCard({ night, player, apply }: Props) {
  const [customAmount, setCustomAmount] = useState('')
  const [error, setError] = useState<string>()
  const finished = isFinished(night, player.id)

  const buyIn = (amount: string) => {
    const failure = apply((n) => addBuyIn(n, player.id, amount))
    setError(failure)
    return !failure
  }

  return (
    <li className={`card ${finished ? 'finished' : ''}`}>
      <header className="card-header">
        <h2>{player.name}</h2>
        <span className={`status ${finished ? 'done' : ''}`}>{finished ? 'Finished' : 'Playing'}</span>
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
      </header>

      <div className="section">
        <span className="label">Buy-ins</span>
        {player.buyIns.length === 0 ? (
          <p className="hint">None yet.</p>
        ) : (
          <ul className="buy-ins">
            {player.buyIns.map((b) => (
              <BuyInItem key={b.id} buyIn={b} apply={apply} />
            ))}
          </ul>
        )}
        <p className="total">
          Total buy-in <strong>{formatAmount(totalBuyIn(night, player.id))}</strong>
        </p>
      </div>

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
          placeholder="Other amount"
          inputMode="decimal"
          value={customAmount}
          onChange={(event) => setCustomAmount(event.target.value)}
        />
        <button type="submit">Add Buy-in</button>
      </form>
      {error && <p className="error">{error}</p>}

      <CashOut night={night} player={player} apply={apply} />
    </li>
  )
}
