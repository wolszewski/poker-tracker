import type { Apply } from './App'
import { BuyInItem } from './BuyInItem'
import { CashOut } from './CashOut'
import { formatAmount, isFinished, totalBuyIn, type Night, type Player } from './night/night'
import { AddBuyInForm, PlayerStatus, RemovePlayerButton } from './PlayerParts'

type Props = { night: Night; player: Player; apply: Apply }

export function PlayerCard({ night, player, apply }: Props) {
  const finished = isFinished(night, player.id)

  return (
    <li className={`card ${finished ? 'finished' : ''}`}>
      <header className="card-header">
        <h2>{player.name}</h2>
        <PlayerStatus finished={finished} />
        <RemovePlayerButton player={player} apply={apply} />
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

      <AddBuyInForm player={player} apply={apply} />

      <CashOut night={night} player={player} apply={apply} />
    </li>
  )
}
